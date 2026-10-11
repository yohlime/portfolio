import { describe, expect, it } from 'vitest'

import { blogPostingGraph, PERSON_ID, websiteGraph } from './schema'

describe('websiteGraph', () => {
  it('emits a Person and WebSite node', () => {
    const graph = websiteGraph('a description')
    const nodes = graph['@graph'] as Array<Record<string, unknown>>
    expect(graph['@context']).toBe('https://schema.org')
    expect(nodes.map((node) => node['@type'])).toEqual(['Person', 'WebSite'])
  })

  it('links the Person socials and references it from WebSite', () => {
    const nodes = websiteGraph()['@graph'] as Array<Record<string, unknown>>
    const person = nodes[0]
    const website = nodes[1]
    expect(person['@id']).toBe(PERSON_ID)
    expect(Array.isArray(person.sameAs)).toBe(true)
    expect((person.sameAs as string[]).length).toBeGreaterThan(0)
    expect(website.author).toEqual({ '@id': PERSON_ID })
    expect(website.publisher).toEqual({ '@id': PERSON_ID })
  })
})

describe('blogPostingGraph', () => {
  it('emits a BlogPosting and BreadcrumbList referencing the Person', () => {
    const graph = blogPostingGraph({
      url: 'https://yohli.me/blog/hello',
      title: 'Hello',
      description: 'A post',
      datePublished: '2024-01-28T00:00:00.000Z',
      dateModified: '2024-06-01T00:00:00.000Z',
      tags: ['astro', 'vue'],
    })
    const nodes = graph['@graph'] as Array<Record<string, unknown>>
    expect(nodes.map((node) => node['@type'])).toEqual(['BlogPosting', 'BreadcrumbList'])

    const article = nodes[0]
    expect(article['@id']).toBe('https://yohli.me/blog/hello#article')
    expect(article.author).toEqual({ '@id': PERSON_ID })
    expect(article.keywords).toBe('astro, vue')

    const breadcrumb = nodes[1]
    expect((breadcrumb.itemListElement as unknown[]).length).toBe(3)
  })

  it('omits optional fields when absent', () => {
    const graph = blogPostingGraph({
      url: 'https://yohli.me/blog/x',
      title: 'X',
      datePublished: '2024-01-01T00:00:00.000Z',
      dateModified: '2024-01-01T00:00:00.000Z',
    })
    const article = (graph['@graph'] as Array<Record<string, unknown>>)[0]
    expect(article).not.toHaveProperty('description')
    expect(article).not.toHaveProperty('image')
    expect(article).not.toHaveProperty('keywords')
  })
})
