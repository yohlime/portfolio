import { defineConfig, envField } from 'astro/config'
import { loadEnv } from 'vite'

import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import { storyblok } from '@storyblok/astro'
import UnoCSS from 'unocss/astro'

import node from '@astrojs/node';

const { STORYBLOK_TOKEN } = loadEnv(process.env.NODE_ENV, process.cwd(), '')
const isProd = import.meta.env.PROD;

// https://astro.build/config
export default defineConfig({
  site: 'https://yohli.me',
  integrations: [
    UnoCSS(),
    vue(),
    storyblok({
      accessToken: STORYBLOK_TOKEN,
      bridge: isProd ? true : false,
      components: {
        blogPost: 'components/storyblok/BlogPost',
        blogPostList: 'components/storyblok/BlogPostList',
        page: 'components/storyblok/Page',
        rich_text: 'components/storyblok/RichText',
      },
      apiOptions: {},
    }),
    sitemap(),
  ],
  env: {
    schema: {
      GITHUB_USERNAME: envField.string({ context: "server", access: "public" }),
      GITHUB_TOKEN: envField.string({ context: "server", access: "secret" }),
    }
  },
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
})
