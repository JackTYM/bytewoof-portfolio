/* GET /api/guestbook — returns approved guestbook entries. Edge-cached 1h. */
import type { GuestEntry } from '~/app/content/site'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, stale-while-revalidate=600')

  const kv: KVNamespace | undefined = event.context.cloudflare?.env?.BOOPS_KV
  if (!kv) return []

  const raw = await kv.get('gb:approved')
  if (!raw) return []

  try {
    return JSON.parse(raw) as GuestEntry[]
  } catch {
    return []
  }
})
