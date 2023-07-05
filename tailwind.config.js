/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './*.{html,js}',
    './static/**/*.{html,js}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      darkdescent: '#0f1a28',
      skyblue: '#70BDE6',
    },
    extend: {},
  },
  plugins: [],
}

