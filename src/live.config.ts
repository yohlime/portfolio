import { defineLiveCollection } from 'astro:content'
import { z } from 'astro/zod'

import { markdownLoader } from './loaders/markdown'

const blog = defineLiveCollection({
  type: 'live',
  loader: markdownLoader(),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date(),
    slug: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
  }),
})

export const collections = { blog }
