import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
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

// Transforms are cached per source+params+mtime so sharp runs at most once.
// Disk keeps it across restarts; memory avoids re-reading hot entries.
const CACHE_DIR = process.env.IMAGE_CACHE_DIR ?? path.join(os.tmpdir(), 'portfolio-image-cache')
const MEMORY_CACHE_LIMIT = 128
const memoryCache = new Map<string, Buffer>()

function assetsRoot(): string {
  return path.resolve(getSecret('BLOG_CONTENT_PATH') ?? './content/blog')
}

function cacheKey(parts: string[]): string {
  return crypto.createHash('sha1').update(parts.join('|')).digest('hex')
}

async function readCached(key: string): Promise<Buffer | undefined> {
  const hit = memoryCache.get(key)
  if (hit) return hit
  try {
    const buffer = await fs.readFile(path.join(CACHE_DIR, key))
    remember(key, buffer)
    return buffer
  } catch {
    return undefined
  }
}

function remember(key: string, buffer: Buffer): void {
  if (memoryCache.size >= MEMORY_CACHE_LIMIT) {
    const oldest = memoryCache.keys().next().value
    if (oldest) memoryCache.delete(oldest)
  }
  memoryCache.set(key, buffer)
}

async function writeCached(key: string, buffer: Buffer): Promise<void> {
  remember(key, buffer)
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true })
    await fs.writeFile(path.join(CACHE_DIR, key), buffer)
  } catch {
    // A cache miss just means we transform again next time.
  }
}

export const GET: APIRoute = async ({ params, url }) => {
  const root = assetsRoot()
  const relative = params.path ?? ''
  const target = path.resolve(root, relative)

  const resolvedRoot = root.endsWith(path.sep) ? root : `${root}${path.sep}`
  if (target !== root && !target.startsWith(resolvedRoot)) {
    return new Response('Forbidden', { status: 403 })
  }

  let stat
  try {
    stat = await fs.stat(target)
    if (!stat.isFile()) return new Response('Not found', { status: 404 })
  } catch {
    return new Response('Not found', { status: 404 })
  }

  const extension = path.extname(target).toLowerCase()
  const width = Number.parseInt(url.searchParams.get('w') ?? '', 10)
  const height = Number.parseInt(url.searchParams.get('h') ?? '', 10)
  const requestedFormat = (url.searchParams.get('format') ?? '').toLowerCase()
  const canTransform =
    RASTER_EXTENSIONS.has(extension) && (Number.isFinite(width) || Number.isFinite(height) || requestedFormat)

  if (canTransform) {
    const format = requestedFormat === 'jpg' ? 'jpeg' : requestedFormat
    const outputFormat = (format in OUTPUT_FORMATS ? format : 'webp') as keyof FormatEnum
    const key = cacheKey([relative, String(stat.mtimeMs), String(width), String(height), String(outputFormat)])

    const cached = await readCached(key)
    if (cached) {
      return new Response(new Uint8Array(cached), {
        headers: {
          'Content-Type': OUTPUT_FORMATS[outputFormat] ?? OUTPUT_FORMATS.webp,
          'Content-Length': String(cached.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

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
      const buffer = await image.toFormat(outputFormat).toBuffer()
      await writeCached(key, buffer)
      return new Response(new Uint8Array(buffer), {
        headers: {
          'Content-Type': OUTPUT_FORMATS[outputFormat] ?? OUTPUT_FORMATS.webp,
          'Content-Length': String(buffer.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch {
      return new Response('Not found', { status: 404 })
    }
  }

  const buffer = await fs.readFile(target)
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': MIME_TYPES[extension] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
