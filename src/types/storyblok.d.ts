import { z } from 'zod'

import { blogPost } from '@/schemas/storyblok'

export type BlogPost = z.infer<typeof blogPost>
