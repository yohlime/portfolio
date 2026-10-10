import { getLiveCollection } from 'astro:content'

import type { APIRoute } from 'astro'

export const prerender = false

const STATIC_PATHS = ['/', '/blog/']

function encodeSlug(slug: string): string {
  return slug
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://yohli.me')

  const { entries, error } = await getLiveCollection('blog')
  if (error) {
    console.error('[sitemap] failed to load posts:', error)
  }

  const posts = (entries ?? []).filter((entry) => !entry.data.draft)

  const urls = [
    ...STATIC_PATHS.map((pathname) => `<url><loc>${new URL(pathname, base).href}</loc></url>`),
    ...posts.map((entry) => {
      const loc = new URL(`/blog/${encodeSlug(entry.data.slug)}`, base).href
      const lastmod = entry.data.updated.toISOString()
      return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
    }),
  ].join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
