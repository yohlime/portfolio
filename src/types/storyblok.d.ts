import { z } from 'zod'

import { blogPostStoryblok } from '@/schemas/storyblok'

export type SbBlogPost = z.infer<typeof blogPostStoryblok>
