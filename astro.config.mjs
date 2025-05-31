import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

import mkcert from 'vite-plugin-mkcert'

import netlify from '@astrojs/netlify'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import { storyblok } from '@storyblok/astro'
import UnoCSS from 'unocss/astro'

const storyblokEnv = loadEnv('', process.cwd(), 'STORYBLOK')
console.log(import.meta.env.VITE_ENVIRONMENT)

// https://astro.build/config
export default defineConfig({
  site: 'https://yohli.me',
  integrations: [
    UnoCSS(),
    vue(),
    storyblok({
      accessToken: storyblokEnv.STORYBLOK_TOKEN,
      bridge: import.meta.env.DEV ? true : false,
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
  output: 'server',
  adapter: netlify(),
  vite: {
    plugins: [mkcert()],
  },
})
