import axios from 'axios'

import { ghProfile } from '../schemas/github'

const query = `
{
  user(login:"${import.meta.env.GITHUB_USERNAME}") { 
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

export const fetchProfile = async (ghToken: string) => {
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
    if (d.success) return d.data.data.user
  }
}
