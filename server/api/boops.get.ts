/* GET /api/boops — returns global boop total from KV.
 * Edge-cached for 24h: virtually zero KV reads at scale. */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=60')

  const kv: KVNamespace = event.context.cloudflare?.env?.BOOPS_KV
  if (!kv) return { total: 0 }

  const raw = await kv.get('total')
  return { total: parseInt(raw ?? '0', 10) }
})
