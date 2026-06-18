/* POST /api/guestbook - submit a new guestbook entry (pending approval).
 * Body: { name: string, message: string, doodle?: string (data-URL, ≤80KB) }
 * Stores as gb:pending:<ts>-<rand> in KV with 60-day TTL, then notifies
 * the Discord webhook with a signed review link. */

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
    return { ok: true, pending: true }
  }

  const id = `gb:pending:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const entry = { id, name, message, doodle, ts: Date.now() }

  await kv.put(id, JSON.stringify(entry), { expirationTtl: 60 * 24 * 60 * 60 }) // 60 days

  // Discord webhook notification - fire-and-forget, never breaks submission
  const env = event.context.cloudflare?.env as Record<string, string> | undefined
  const signingSecret = env?.GUESTBOOK_SIGNING_SECRET
  const webhookUrl = env?.DISCORD_WEBHOOK_URL

  if (signingSecret && webhookUrl) {
    try {
      const origin = getRequestURL(event).origin
      const sig = await signToken(signingSecret, id)
      const reviewUrl = `${origin}/api/guestbook/review?id=${encodeURIComponent(id)}&sig=${sig}`

      const embed: Record<string, unknown> = {
        title: 'new guestbook entry',
        description: `[Review & approve →](${reviewUrl})`,
        color: 0x3AA0DA,
        fields: [
          { name: 'name', value: name, inline: true },
          { name: 'message', value: message, inline: false },
        ],
      }

      const form = new FormData()

      if (doodle) {
        // Decode the data-URL to a Blob so Discord displays it inline
        const match = doodle.match(/^data:(image\/\w+);base64,(.+)$/)
        if (match) {
          const [, mime, b64] = match
          const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
          form.append('files[0]', new Blob([bytes], { type: mime }), 'doodle.png')
          embed.image = { url: 'attachment://doodle.png' }
        }
      }

      form.append('payload_json', JSON.stringify({ embeds: [embed] }))

      await fetch(webhookUrl, { method: 'POST', body: form })
    } catch { /* never block submission on notification failure */ }
  }

  return { ok: true, pending: true }
})
