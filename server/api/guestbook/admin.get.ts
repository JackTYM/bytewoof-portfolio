/* GET /api/guestbook/admin — list pending entries (admin only).
 * Requires header: x-admin-token matching env.GUESTBOOK_ADMIN_TOKEN
 *
 * Set the token with: wrangler pages secret put GUESTBOOK_ADMIN_TOKEN
 */

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env
  const token = env?.GUESTBOOK_ADMIN_TOKEN as string | undefined
  const provided = getHeader(event, 'x-admin-token')

  if (!token || !provided || provided !== token) {
    throw createError({ statusCode: 401, statusMessage: 'unauthorized' })
  }

  const kv: KVNamespace | undefined = env?.BOOPS_KV
  if (!kv) return { pending: [] }

  const list = await kv.list({ prefix: 'gb:pending:' })
  const entries = await Promise.all(
    list.keys.map(async ({ name }) => {
      const raw = await kv.get(name)
      if (!raw) return null
      try { return JSON.parse(raw) } catch { return null }
    })
  )

  return { pending: entries.filter(Boolean) }
})
