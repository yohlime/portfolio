import { defineConfig } from 'unocss'

import presetIcons from '@unocss/preset-icons'
import presetUno from '@unocss/preset-uno'

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  theme: {
    colors: {
      subtitle: '#868e96',
      button: '#55198b',
      'button-hover': '#8c43ce',
      nav: '#f4f4f4',
      'nav-alt': '#8c43ce',
    },
    fontFamily: {
      agustina: 'Agustina Regular',
      montserrat: 'Montserrat',
    },
  },
  preflights: [
    {
      getCSS() {
        return `
        @font-face {
          font-family: 'Agustina Regular';
          font-style: normal;
          font-weight: normal;
          src: local('Agustina Regular'), url('/fonts/Agustina.woff') format('woff');
          font-display: swap;
        }
        @font-face {
          font-family: 'Montserrat';
          src: local('Montserrat'), url('/fonts/Montserrat-Regular.ttf') format('woff');
          font-display: swap;
        }
       `
      },
    },
  ],
})
