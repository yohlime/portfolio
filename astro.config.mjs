import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

import netlify from '@astrojs/netlify'
import vue from '@astrojs/vue'
import storyblok from '@storyblok/astro'
import UnoCSS from 'unocss/astro'

const storyblokEnv = loadEnv('', process.cwd(), 'STORYBLOK')

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    vue(),
    storyblok({
      accessToken: storyblokEnv.STORYBLOK_TOKEN,
      components: {
        blogPost: 'components/storyblok/BlogPost',
        blogPostList: 'components/storyblok/BlogPostList',
        page: 'components/storyblok/Page',
        rich_text: 'components/storyblok/RichText',
      },
      apiOptions: {},
    }),
  ],
  output: 'server',
  adapter: netlify(),
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
  },
})
