import fs from 'node:fs/promises'
import path from 'node:path'

import { getSecret } from 'astro:env/server'
import sharp, { type FormatEnum } from 'sharp'

import type { APIRoute } from 'astro'

export const prerender = false

const RASTER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tiff', '.tif'])
const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',
}

const OUTPUT_FORMATS: Record<string, string> = {
  webp: 'image/webp',
  avif: 'image/avif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
}

function assetsRoot(): string {
  return path.resolve(getSecret('BLOG_CONTENT_PATH') ?? './content/blog')
}

export const GET: APIRoute = async ({ params, url }) => {
  const root = assetsRoot()
  const relative = params.path ?? ''
  const target = path.resolve(root, relative)

  const resolvedRoot = root.endsWith(path.sep) ? root : `${root}${path.sep}`
  if (target !== root && !target.startsWith(resolvedRoot)) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const stat = await fs.stat(target)
    if (!stat.isFile()) return new Response('Not found', { status: 404 })
  } catch {
    return new Response('Not found', { status: 404 })
  }

  const extension = path.extname(target).toLowerCase()
  const width = Number.parseInt(url.searchParams.get('w') ?? '', 10)
  const height = Number.parseInt(url.searchParams.get('h') ?? '', 10)
  const requestedFormat = (url.searchParams.get('format') ?? '').toLowerCase()
  const canTransform = RASTER_EXTENSIONS.has(extension) && (Number.isFinite(width) || Number.isFinite(height) || requestedFormat)

  if (canTransform) {
    try {
      const image = sharp(target)
      if (Number.isFinite(width) || Number.isFinite(height)) {
        image.resize({
          width: Number.isFinite(width) ? width : undefined,
          height: Number.isFinite(height) ? height : undefined,
          fit: 'cover',
          withoutEnlargement: true,
        })
      }
      const format = requestedFormat === 'jpg' ? 'jpeg' : requestedFormat
      const outputFormat = (format in OUTPUT_FORMATS ? format : 'webp') as keyof FormatEnum
      const buffer = await image.toFormat(outputFormat).toBuffer()
      return new Response(buffer, {
        headers: {
          'Content-Type': OUTPUT_FORMATS[outputFormat] ?? OUTPUT_FORMATS.webp,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch {
      return new Response('Not found', { status: 404 })
    }
  }

  const buffer = await fs.readFile(target)
  return new Response(buffer, {
    headers: {
      'Content-Type': MIME_TYPES[extension] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
