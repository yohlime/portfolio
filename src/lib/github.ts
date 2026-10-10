import axios from 'axios'

import { ghProfile } from '../schemas/github'
import type { GHProfile } from '../types/github'

const genQueryString = (ghUsername: string) => `
{
  user(login:"${ghUsername}") { 
    name
    bio
    avatarUrl
    location
    pinnedItems(first: 6, types: [REPOSITORY]) {
      totalCount
      edges {
          node {
            ... on Repository {
              name
              description
              forkCount
              stargazers {
                totalCount
              }
              url
              id
              diskUsage
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
}
`

const PROFILE_CACHE_TTL_MS = 60 * 60 * 1000
let profileCache: { profile: GHProfile; expiresAt: number } | undefined

export const fetchProfile = async (ghUsername: string, ghToken: string): Promise<GHProfile | undefined> => {
  if (profileCache && profileCache.expiresAt > Date.now()) {
    return profileCache.profile
  }

  const query = genQueryString(ghUsername)

  try {
    const { data, status } = await axios.post(
      'https://api.github.com/graphql',
      { query },
      {
        headers: {
          Authorization: `Bearer ${ghToken}`,
          'User-Agent': 'Node',
        },
      },
    )

    if (status === 200) {
      const d = ghProfile.safeParse(data)
      if (d.success) {
        profileCache = { profile: d.data.data.user, expiresAt: Date.now() + PROFILE_CACHE_TTL_MS }
        return profileCache.profile
      }
      console.error('[github] profile response failed validation:', d.error.message)
    }
  } catch (error) {
    console.error('[github] failed to fetch profile:', error instanceof Error ? error.message : error)
  }
}
