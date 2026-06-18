/* POST /api/guestbook — submit a new guestbook entry (pending approval).
 * Body: { name: string, message: string, doodle?: string (data-URL, ≤80KB) }
 * Stores as gb:pending:<ts>-<rand> in KV with 60-day TTL. */

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { name?: string; message?: string; doodle?: string }

  const name = (body.name ?? '').trim().slice(0, 40) || 'anon'
  const message = (body.message ?? '').trim().slice(0, 280)

  if (!message) {
    throw createError({ statusCode: 400, statusMessage: 'message is required' })
  }

  // Reject oversized doodles (80KB = 81920 base64 chars ≈ 109226 chars with overhead)
  const doodle = typeof body.doodle === 'string' && body.doodle.length <= 110_000
    ? body.doodle
    : undefined

  const kv: KVNamespace | undefined = event.context.cloudflare?.env?.BOOPS_KV
  if (!kv) {
    // In dev without KV, just return ok
    return { ok: true, pending: true }
  }

  const id = `gb:pending:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const entry = { id, name, message, doodle, ts: Date.now() }

  await kv.put(id, JSON.stringify(entry), { expirationTtl: 60 * 24 * 60 * 60 }) // 60 days

  return { ok: true, pending: true }
})
