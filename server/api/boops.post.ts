/* POST /api/boops — increments global boop counter by `delta`.
 * Client batches boops into a single sendBeacon call, so invocations stay low.
 * KV write rate: 1/2s debounce on client means at most ~1 write per visitor session. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const delta = Math.min(Math.max(parseInt(body?.delta ?? '1', 10), 0), 500) // clamp 0-500

  const kv: KVNamespace = event.context.cloudflare?.env?.BOOPS_KV
  if (!kv) return { total: 0 }

  const raw = await kv.get('total')
  const current = parseInt(raw ?? '0', 10)
  const next = current + delta
  await kv.put('total', String(next))

  return { total: next }
})
