import fs from 'node:fs/promises'
import path from 'node:path'

import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri'
import { getSecret } from 'astro:env/server'
import { parse as parseYaml } from 'yaml'

import type { LiveLoader } from 'astro/loaders'

const MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown', '.mdx'])
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.bmp', '.tiff', '.tif'])

export interface MarkdownLoaderData {
  title: string
  description?: string
  date: Date
  updated: Date
  slug: string
  draft: boolean
  tags: string[]
  cover?: string
  coverAlt?: string
  [key: string]: unknown
}

let processorPromise: ReturnType<typeof createSatteriMarkdownProcessor> | undefined

function getProcessor() {
  processorPromise ??= createSatteriMarkdownProcessor({
    shikiConfig: { theme: 'catppuccin-macchiato' },
  })
  return processorPromise
}

function contentRoot(): string {
  return path.resolve(getSecret('BLOG_CONTENT_PATH') ?? './content/blog')
}

function assetsRoot(): string {
  return contentRoot()
}

function isInside(root: string, target: string): boolean {
  const rel = path.relative(root, target)
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/')
}

function encodePath(relative: string): string {
  return toPosix(relative).split('/').map(encodeURIComponent).join('/')
}

function decodeEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Map a markdown asset reference to a public `/blog-assets/...` URL, or undefined when unresolvable. */
function resolveAssetUrl(reference: string | undefined, noteDir: string): string | undefined {
  if (!reference) return undefined

  const ref = safeDecode(reference).trim()
  if (!ref) return undefined
  if (/^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.startsWith('//') || ref.startsWith('data:')) {
    return ref
  }

  const clean = ref.split('?')[0].split('#')[0]
  const root = assetsRoot()
  const target = clean.startsWith('/') ? path.resolve(root, clean.slice(1)) : path.resolve(noteDir, clean)

  if (!isInside(root, target)) return undefined

  const relative = path.relative(root, target)
  if (!relative) return undefined
  return `/blog-assets/${encodePath(relative)}`
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const normalized = raw.replace(/^\uFEFF/, '')
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(normalized)
  if (!match) return { data: {}, content: normalized }

  const parsed = parseYaml(match[1])
  return {
    data: parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {},
    content: normalized.slice(match[0].length),
  }
}

function parseDate(value: unknown, fallback: Date): Date {
  if (value == null) return fallback
  const parsed = new Date(String(value))
  return Number.isNaN(parsed.getTime()) ? fallback : parsed
}

function normaliseTags(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,\s]+/) : []
  const tags = raw
    .map((tag) => String(tag).trim().replace(/^#+/, ''))
    .filter((tag) => tag.length > 0)
  return [...new Set(tags)]
}

function isImageReference(reference: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(reference.split('#')[0]).toLowerCase())
}

function encodeReference(reference: string): string {
  return reference.split('/').map((segment) => encodeURIComponent(segment)).join('/')
}

/** Convert Obsidian `![[embed]]` / `[[wikilink]]` syntax into standard markdown. */
function convertWikiLinks(text: string): string {
  return text.replace(/(!?)\[\[([^\]]+)\]\]/g, (match, bang: string, inner: string) => {
    const [targetPart, aliasPart] = inner.split('|')
    const [rawTarget, rawHeading] = targetPart.split('#')
    const target = rawTarget.trim()
    const heading = rawHeading?.trim()
    const alias = aliasPart?.trim()

    // Same-note heading link: [[#Heading]]
    if (!target) {
      if (!heading) return match
      return `[${alias || heading}](#${encodeReference(heading)})`
    }

    const isImage = isImageReference(target)
    const href = isImage ? target : /\.(mdx?|markdown)$/i.test(target) ? target : `${target}.md`
    const encodedHref = `${encodeReference(href)}${heading ? `#${encodeReference(heading)}` : ''}`

    if (bang) {
      if (isImage) {
        const alt = alias && !/^\d+$/.test(alias) ? alias : ''
        return `![${alt}](${encodedHref})`
      }
      // Note transclusion is not supported; degrade to a link.
      return `[${alias || target}](${encodedHref})`
    }

    return `[${alias || target}](${encodedHref})`
  })
}

/** Apply Obsidian link conversion while leaving fenced and inline code untouched. */
function convertWikiSyntax(markdown: string): string {
  let fence: string | null = null

  return markdown
    .split('\n')
    .map((line) => {
      const fenceMarker = /^\s*(```|~~~)/.exec(line)?.[1]
      if (fenceMarker) {
        if (!fence) fence = fenceMarker
        else if (fenceMarker === fence) fence = null
        return line
      }
      if (fence) return line

      return line
        .split(/(`+[^`]*`+)/g)
        .map((segment) => (segment.startsWith('`') ? segment : convertWikiLinks(segment)))
        .join('')
    })
    .join('\n')
}

/** Restore `<img>` elements that the markdown pipeline stripped, resolving their `src` to served assets. */
function rewriteImages(html: string, noteDir: string): string {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    const marker = tag.match(/__ASTRO_IMAGE_="([^"]*)"/)
    if (!marker) return tag

    let meta: { src?: string; alt?: string; title?: string; width?: unknown; height?: unknown }
    try {
      meta = JSON.parse(decodeEntities(marker[1]))
    } catch {
      return tag
    }

    const url = resolveAssetUrl(meta.src, noteDir)
    if (!url) return tag

    const attributes = [`src="${escapeAttribute(url)}"`]
    if (meta.alt != null) attributes.push(`alt="${escapeAttribute(String(meta.alt))}"`)
    if (meta.title != null) attributes.push(`title="${escapeAttribute(String(meta.title))}"`)
    if (meta.width != null) attributes.push(`width="${escapeAttribute(String(meta.width))}"`)
    if (meta.height != null) attributes.push(`height="${escapeAttribute(String(meta.height))}"`)
    return `<img ${attributes.join(' ')}>`
  })
}

/** Rewrite relative `.md` links between notes to their blog routes. */
function rewriteLinks(html: string, id: string): string {
  return html.replace(/<a\b[^>]*href="([^"]*)"[^>]*>/g, (tag, href: string) => {
    if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return tag

    const [target, fragment] = href.split('#')
    if (!target || !MARKDOWN_EXTENSIONS.has(path.extname(target).toLowerCase())) return tag

    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(id), safeDecode(target)))
    const slug = resolved.replace(/\.(mdx?|markdown)$/i, '')
    if (!slug || slug.startsWith('..')) return tag

    const suffix = fragment ? `#${fragment}` : ''
    return tag.replace(`href="${href}"`, `href="/blog/${encodePath(slug)}${suffix}"`)
  })
}

async function walkMarkdownFiles(dir: string): Promise<string[]> {
  const results: string[] = []

  async function walk(current: string) {
    const entries = await fs.readdir(current, { withFileTypes: true }).catch(() => [])

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) {
        await walk(full)
      } else if (entry.isFile() && MARKDOWN_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        results.push(full)
      }
    }
  }

  await walk(dir)
  return results
}

function toId(absoluteFile: string): string {
  const relative = path.relative(contentRoot(), absoluteFile)
  return toPosix(relative).replace(/\.(mdx?|markdown)$/i, '')
}

async function renderFile(absoluteFile: string) {
  const [raw, stat] = await Promise.all([fs.readFile(absoluteFile, 'utf8'), fs.stat(absoluteFile)])
  const { data: frontmatter, content } = parseFrontmatter(raw)

  const fallbackId = toId(absoluteFile)
  const id = frontmatter.slug ? String(frontmatter.slug).replace(/^\/+/, '') : fallbackId
  const noteDir = path.dirname(absoluteFile)

  const processor = await getProcessor()
  const { code } = await processor.render(convertWikiSyntax(content), { frontmatter })

  const html = rewriteLinks(rewriteImages(code, noteDir), fallbackId)

  const publishedValue = frontmatter.date ?? frontmatter.created ?? frontmatter.published
  const date = parseDate(publishedValue, stat.mtime)
  // When a publish date is set explicitly, default `updated` to it (manual mode)
  // so migrating/backdating posts doesn't produce false "updated" times.
  const updatedFallback = publishedValue != null ? date : stat.mtime
  const modified = parseDate(frontmatter.updated ?? frontmatter.modified ?? frontmatter.lastmod, updatedFallback)
  const updated = modified.getTime() > date.getTime() ? modified : date

  const data: MarkdownLoaderData = {
    ...frontmatter,
    title: String(frontmatter.title ?? id),
    description: frontmatter.description != null ? String(frontmatter.description) : undefined,
    date,
    updated,
    slug: id,
    draft: Boolean(frontmatter.draft),
    tags: normaliseTags(frontmatter.tags),
    cover: resolveAssetUrl(frontmatter.cover != null ? String(frontmatter.cover) : undefined, noteDir),
    coverAlt: frontmatter.coverAlt != null ? String(frontmatter.coverAlt) : undefined,
  }

  return {
    id,
    data,
    rendered: { html },
    cacheHint: { lastModified: stat.mtime },
  }
}

export function markdownLoader(): LiveLoader<MarkdownLoaderData, { id: string }> {
  return {
    name: 'markdown-loader',
    async loadEntry({ filter }) {
      const id = filter.id
      const absoluteFile = path.join(contentRoot(), `${id}`)
      const candidates = MARKDOWN_EXTENSIONS.has(path.extname(absoluteFile).toLowerCase())
        ? [absoluteFile]
        : [...MARKDOWN_EXTENSIONS].map((ext) => `${absoluteFile}${ext}`)

      for (const candidate of candidates) {
        if (!isInside(contentRoot(), candidate)) continue
        try {
          await fs.access(candidate)
          return await renderFile(candidate)
        } catch {
          continue
        }
      }

      // Fallback for entries whose `slug` frontmatter differs from their file path.
      const files = await walkMarkdownFiles(contentRoot())
      for (const file of files) {
        if (toId(file) === id) continue
        const entry = await renderFile(file)
        if (entry.id === id) return entry
      }

      return undefined
    },
    async loadCollection() {
      const files = await walkMarkdownFiles(contentRoot())
      if (files.length === 0) {
        console.warn(`[markdown-loader] No markdown files found in "${contentRoot()}".`)
      }

      const entries = await Promise.all(files.map((file) => renderFile(file)))
      return { entries }
    },
  }
}
