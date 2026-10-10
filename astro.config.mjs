import { defineConfig, envField } from 'astro/config'

import node from '@astrojs/node'
import vue from '@astrojs/vue'
import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  site: 'https://yohli.me',
  integrations: [UnoCSS(), vue()],
  env: {
    schema: {
      GITHUB_USERNAME: envField.string({ context: 'server', access: 'public' }),
      GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      // `access: 'secret'` keeps this out of the build and read at runtime
      // (dev reads .env, the container reads process.env).
      BLOG_CONTENT_PATH: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
})
