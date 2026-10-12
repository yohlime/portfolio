import { defineMiddleware } from 'astro:middleware'

// The Node adapter does not compress responses, so gzip text payloads here to
// cut bytes over the wire. Hashed static assets in /_astro are served by the
// adapter and skipped.
const COMPRESSIBLE = /^(?:text\/|application\/(?:json|javascript|xml|xhtml\+xml|rss\+xml)|image\/svg\+xml)/i

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next()

  if (response.status === 200) {
    const type = response.headers.get('content-type') ?? ''
    // Let shared caches (CDN/proxy) hold HTML briefly while browsers revalidate.
    if (type.includes('text/html') && !response.headers.has('cache-control')) {
      response.headers.set('cache-control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=86400')
    }
  }

  const accept = context.request.headers.get('accept-encoding') ?? ''
  const type = response.headers.get('content-type') ?? ''
  const canCompress =
    response.body != null &&
    response.status !== 204 &&
    response.status !== 304 &&
    context.request.method !== 'HEAD' &&
    !response.headers.has('content-encoding') &&
    /\bgzip\b/.test(accept) &&
    COMPRESSIBLE.test(type)

  if (!canCompress) return response

  const headers = new Headers(response.headers)
  headers.delete('content-length')
  headers.set('content-encoding', 'gzip')
  headers.set('vary', headers.has('vary') ? `${headers.get('vary')}, accept-encoding` : 'accept-encoding')

  return new Response(response.body!.pipeThrough(new CompressionStream('gzip')), {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
})
