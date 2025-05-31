import { defineConfig, presetIcons, presetWebFonts, presetTypography, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Roboto Flex',
        mono: 'JetBrains Mono:400,700',
        hurricane: 'Hurricane',
        lato: [
          {
            name: 'Lato',
            weights: ['400', '700'],
            italic: true,
          },
          {
            name: 'sans-serif',
            provider: 'none',
          },
        ],
      },
      themeKey: 'font',
    }),
    presetTypography({
      cssExtend: {
        a: {
          color: '#55198b',
        },
        'a:hover, a:visited': {
          color: '#8c43ce',
        },
        '.dark a': {
          color: '#f4f4f4',
        },
        '.dark a:hover,.dark a:visited': {
          color: '#ffffff',
        },
      },
    }),
  ],
  theme: {
    colors: {
      subtitle: '#868e96',
      button: '#55198b',
      'button-hover': '#8c43ce',
      nav: '#f4f4f4',
      'nav-alt': '#8c43ce',
    },
  },
  shortcuts: {
    'social-media-badge': 'rounded-full  hover:bg-black transition duration-300 ease-in ',
  },
})
