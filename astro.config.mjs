import { defineConfig } from 'astro/config'

import netlify from '@astrojs/netlify'
import vue from '@astrojs/vue'
import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    vue(),
  ],
  output: 'server',
  adapter: netlify(),
})
