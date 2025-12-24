import { z } from 'zod'

export const ghPinnedRepo = z.object({
  name: z.string(),
  description: z.string().nullable(),
  forkCount: z.number(),
  stargazers: z.object({
    totalCount: z.number(),
  }),
  url: z.string(),
  id: z.string(),
  diskUsage: z.number(),
  primaryLanguage: z.object({
    name: z.string(),
    color: z.string(),
  }),
})

export const ghProfile = z.object({
  data: z.object({
    user: z.object({
      name: z.string(),
      bio: z.string(),
      avatarUrl: z.string(),
      location: z.string(),
      pinnedItems: z.object({
        totalCount: z.number(),
        edges: z
          .object({
            node: ghPinnedRepo,
          })
          .array(),
      }),
    }),
  }),
})
