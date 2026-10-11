import { socialMediaLinks } from '../data/portfolio'

const SITE = 'https://yohli.me'

export const PERSON_ID = `${SITE}/#person`
export const WEBSITE_ID = `${SITE}/#website`

type JsonLd = Record<string, unknown>

const socialProfiles = Object.values(socialMediaLinks).filter((value): value is string => Boolean(value))

export const personNode = (): JsonLd => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Emilio Gozo',
  url: `${SITE}/`,
  sameAs: socialProfiles,
})

export const websiteNode = (description?: string): JsonLd => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE}/`,
  name: 'Emilio Gozo',
  ...(description ? { description } : {}),
  inLanguage: 'en',
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
})

/** Homepage graph: the Person and WebSite entities referenced elsewhere by `@id`. */
export const websiteGraph = (description?: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@graph': [personNode(), websiteNode(description)],
})

interface BlogPostingInput {
  url: string
  title: string
  description?: string
  image?: string
  datePublished: string
  dateModified: string
  tags?: string[]
}

/** Post graph: the BlogPosting plus a BreadcrumbList (Home › Blog › Post). */
export const blogPostingGraph = ({
  url,
  title,
  description,
  image,
  datePublished,
  dateModified,
  tags,
}: BlogPostingInput): JsonLd => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: title,
      ...(description ? { description } : {}),
      ...(image ? { image } : {}),
      datePublished,
      dateModified,
      inLanguage: 'en',
      mainEntityOfPage: { '@id': url },
      url,
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
      ...(tags && tags.length > 0 ? { keywords: tags.join(', ') } : {}),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ],
})
