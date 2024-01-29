import { z } from 'zod'

import type { ISbRichtext, SbBlokData } from '@storyblok/astro'

const makeSbStory = <T extends z.ZodTypeAny>(schema: T) => {
  const content = z.intersection(
    schema,
    z.object({ _uid: z.string().uuid(), _editable: z.string(), component: z.string() }) as z.Schema<SbBlokData>
  )
  return z.object({
    id: z.number(),
    uuid: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    full_slug: z.string(),
    default_full_slug: z.string().nullable(),
    content,
    created_at: z.coerce.date().nullable(),
    published_at: z.coerce.date().nullable(),
  })
}

const assetStoryblok = z.object({
  id: z.number().nullable(),
  filename: z.string(),
  name: z.string(),
  alt: z.string().nullable(),
  source: z.string().nullable(),
  copyright: z.string().nullable(),
  title: z.string().nullable(),
  focus: z.string().nullable(),
  meta_data: z.any(),
  is_external_url: z.coerce.boolean(),
})

const baseRichtextStoryblok = z.object({
  type: z.string(),
  attrs: z.any().optional(),
  text: z.string().optional(),
})

type RichtextStoryblok = z.infer<typeof baseRichtextStoryblok> & {
  content?: ISbRichtext[]
  marks?: ISbRichtext[]
}

const richtextStoryblok: z.ZodType<ISbRichtext, z.ZodTypeDef, RichtextStoryblok> = baseRichtextStoryblok.extend({
  content: z.lazy(() => richtextStoryblok.array().optional()),
  marks: z.lazy(() => richtextStoryblok.array().optional()),
})

export const blogPostStoryblok = makeSbStory(
  z.object({
    title: z.string(),
    description: z.string().nullish(),
    featured_image: assetStoryblok,
    content: richtextStoryblok,
  })
)

export const listStoriesRes = z.object({
  stories: blogPostStoryblok.array(),
})

export const getStoryRes = z.object({
  story: blogPostStoryblok,
})
