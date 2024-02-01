import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

import mkcert from 'vite-plugin-mkcert'

import netlify from '@astrojs/netlify'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import storyblok from '@storyblok/astro'
import UnoCSS from 'unocss/astro'

const storyblokEnv = loadEnv('', process.cwd(), 'STORYBLOK')

// https://astro.build/config
export default defineConfig({
  site: 'https://yohli.me',
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    vue(),
    storyblok({
      accessToken: storyblokEnv.STORYBLOK_TOKEN,
      bridge: import.meta.env.VITE_ENVIRONMENT === 'preview' ? true : false,
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
  output: import.meta.env.VITE_ENVIRONMENT === 'preview' ? 'server' : 'static',
  adapter: import.meta.env.VITE_ENVIRONMENT === 'preview' ? netlify() : undefined,
  vite: {
    plugins: [mkcert()],
  },
})
