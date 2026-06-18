/* GET /api/gallery/:slug - proxies an image from R2.
 * Use this only as a fallback. For production, configure a public R2 custom
 * domain at images.byte.dog pointing directly to the bucket (zero Worker cost). */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const safe = slug.replace(/[^a-z0-9._-]/gi, '').slice(0, 128)

  const r2: R2Bucket = event.context.cloudflare?.env?.GALLERY_R2
  if (!r2) throw createError({ statusCode: 503, message: 'R2 not configured' })

  const obj = await r2.get(`gallery/${safe}`)
  if (!obj) throw createError({ statusCode: 404, message: 'not found' })

  setResponseHeader(event, 'Content-Type', obj.httpMetadata?.contentType ?? 'image/webp')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  const buf = await obj.arrayBuffer()
  return new Uint8Array(buf)
})
