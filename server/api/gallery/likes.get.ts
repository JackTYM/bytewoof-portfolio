/* GET /api/gallery/likes — returns all gallery like counts.
 * Cached 24h at edge — one KV read per cache miss, not per page load. */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')

  const kv: KVNamespace = event.context.cloudflare?.env?.BOOPS_KV
  if (!kv) return {}

  const raw = await kv.get('gallery.likes')
  return raw ? JSON.parse(raw) : {}
})
