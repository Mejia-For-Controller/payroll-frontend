const colors = require('tailwindcss/colors')

module.exports = {
   purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        coolgray: colors.coolGray,
        gray: colors.trueGray,
        truegray: colors.trueGray,
        mejito: '#41ffca',
        lightmejito: '#c3f2ef',
        green: colors.green
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
