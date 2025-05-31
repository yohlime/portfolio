/** @type {import("prettier").Config} */
export default {
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
  semi: false,
  vueIndentScriptAndStyle: true,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}

