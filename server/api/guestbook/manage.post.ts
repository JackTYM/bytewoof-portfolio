/* POST /api/guestbook/manage
 * Body (urlencoded): { token, index }
 * Deletes the approved entry at the given array index. */

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as Record<string, string> | undefined
  const adminToken = env?.GUESTBOOK_ADMIN_TOKEN
  const kv: KVNamespace | undefined = event.context.cloudflare?.env?.BOOPS_KV

  const raw = await readRawBody(event, 'utf-8') ?? ''
  const params = new URLSearchParams(raw)
  const token = params.get('token') ?? ''
  const index = parseInt(params.get('index') ?? '', 10)

  if (!adminToken || token !== adminToken.trim()) {
    return new Response('<h1>unauthorized</h1>', { status: 401, headers: { 'Content-Type': 'text/html' } })
  }

  if (!kv || isNaN(index) || index < 0) {
    return new Response('<h1>bad request</h1>', { status: 400, headers: { 'Content-Type': 'text/html' } })
  }

  const existing = await kv.get('gb:approved')
  let approved: unknown[] = []
  try { if (existing) approved = JSON.parse(existing) } catch {}

  if (index >= approved.length) {
    // Already gone — redirect back (idempotent)
    return sendRedirect(event, `/api/guestbook/manage?token=${encodeURIComponent(token)}`, 302)
  }

  approved.splice(index, 1)
  await kv.put('gb:approved', JSON.stringify(approved))

  return sendRedirect(event, `/api/guestbook/manage?token=${encodeURIComponent(token)}`, 302)
})
