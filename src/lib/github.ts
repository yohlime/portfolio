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

export const fetchProfile = async () => {
  const { data, status } = await axios.post(
    'https://api.github.com/graphql',
    { query },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
        'User-Agent': 'Node',
      },
    }
  )

  if (status === 200) return ghProfile.parse(data).data.user
}
