/* POST /api/gallery/likes — increments like count for one image.
 * Whole likes map stored as one JSON value to minimise KV read/write ops. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const slug  = String(body?.slug ?? '').slice(0, 64)
  const delta = Math.sign(parseInt(body?.delta ?? '1', 10)) // ±1 only

  if (!slug) throw createError({ statusCode: 400, message: 'missing slug' })

  const kv: KVNamespace = event.context.cloudflare?.env?.BOOPS_KV
  if (!kv) return { ok: true }

  const raw   = await kv.get('gallery.likes')
  const likes = raw ? JSON.parse(raw) : {} as Record<string, number>
  likes[slug] = Math.max(0, (likes[slug] ?? 0) + delta)
  await kv.put('gallery.likes', JSON.stringify(likes))

  return { ok: true, likes }
})
