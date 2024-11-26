import { z } from 'zod'

const blogPostContent = z.object({
  title: z.string(),
  content: z.object({
    type: z.string(),
    content: z.record(z.any()).array(),
  }),
  description: z.string().optional(),
  featured_image: z
    .object({
      filename: z.string(),
      alt: z.string().nullish(),
      is_external_url: z.boolean().default(false),
    })
    .optional(),
})

export const blogPost = z.object({
  content: blogPostContent,
  full_slug: z.string(),
  published_at: z.string(),
})

export const blogPostList = z.object({
  stories: blogPost.array(),
  cv: z.number(),
  rels: z.string().array(),
  links: z.string().array(),
})
