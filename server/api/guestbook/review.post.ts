/* POST /api/guestbook/review
 * Body (urlencoded): { id, sig, action: 'approve' | 'reject' }
 * Verifies HMAC signature then approves or rejects the pending entry.
 * Idempotent — double-clicking returns "already handled". */
import type { GuestEntry } from '~/app/content/site'

function html(title: string, body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — byte guestbook</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,sans-serif;background:#1a1a1a;color:#f0dcc4;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:#2a2014;border:2.5px solid #5a4030;border-radius:18px;padding:28px 32px;max-width:420px;width:100%;box-shadow:6px 6px 0 #0a0805;text-align:center}
  h1{font-size:24px;font-weight:800;margin-bottom:10px}
  p{color:#8a7461;line-height:1.6}
</style>
</head><body><div class="card">${body}</div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env as Record<string, string> | undefined
  const secret = env?.GUESTBOOK_SIGNING_SECRET
  const kv: KVNamespace | undefined = event.context.cloudflare?.env?.BOOPS_KV

  const raw = await readRawBody(event, 'utf-8') ?? ''
  const params = new URLSearchParams(raw)
  const id = params.get('id') ?? ''
  const sig = params.get('sig') ?? ''
  const action = params.get('action') ?? ''

  if (!secret || !id || !sig || !await verifyToken(secret, id, sig) || (action !== 'approve' && action !== 'reject')) {
    return html('unauthorized', '<h1>unauthorized</h1><p>invalid or tampered link.</p>', 401)
  }

  if (!kv) {
    return html('unavailable', '<h1>unavailable</h1><p>storage not configured.</p>', 503)
  }

  const pendingKey = id.startsWith('gb:pending:') ? id : `gb:pending:${id}`
  const entryRaw = await kv.get(pendingKey)

  if (!entryRaw) {
    return html('already handled', '<h1>already handled</h1><p>this entry was already approved or rejected.</p>')
  }

  if (action === 'reject') {
    await kv.delete(pendingKey)
    return html('rejected', '<h1>rejected ✕</h1><p>the entry has been deleted.</p>')
  }

  // Approve: prepend to gb:approved (cap 200), delete pending key
  let approved: GuestEntry[] = []
  try {
    const existing = await kv.get('gb:approved')
    if (existing) approved = JSON.parse(existing)
  } catch {}

  const entry = JSON.parse(entryRaw) as GuestEntry
  approved = [entry, ...approved].slice(0, 200)

  await kv.put('gb:approved', JSON.stringify(approved))
  await kv.delete(pendingKey)

  return html('approved', '<h1>approved ✓</h1><p>the entry is now live on the guestbook.</p>')
})
