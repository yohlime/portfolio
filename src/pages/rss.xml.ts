import { getLiveCollection } from 'astro:content'

import type { APIRoute } from 'astro'

export const prerender = false

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function encodeSlug(slug: string): string {
  return slug
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://yohli.me')

  const { entries, error } = await getLiveCollection('blog')
  if (error) {
    console.error('[rss] failed to load posts:', error)
  }

  const posts = (entries ?? [])
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  const items = posts
    .map((entry) => {
      const url = new URL(`/blog/${encodeSlug(entry.data.slug)}`, base).href
      const html = (entry.rendered?.html ?? '').replace(/(src|href)="\//g, `$1="${base.origin}/`)
      const description = entry.data.description ?? ''

      return [
        '<item>',
        `<title>${escapeXml(entry.data.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${entry.data.date.toUTCString()}</pubDate>`,
        description ? `<description>${escapeXml(description)}</description>` : '',
        html ? `<content:encoded>${cdata(html)}</content:encoded>` : '',
        '</item>',
      ]
        .filter(Boolean)
        .join('')
    })
    .join('')

  const feedUrl = new URL('rss.xml', base).href
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Emilio Gozo</title>
    <link>${new URL('/', base).href}</link>
    <description>Blog posts on programming, data science, weather, and self-hosting.</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
