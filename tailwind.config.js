const colors = require('tailwindcss/colors')

module.exports = {
   purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  content: ['./src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js',"./pages/**/*.{html,js}","./public/**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        'whitesel': '0 35px 60px -15px rgba(255,255,255,0.3)',
      },
      colors: {
        coolgray: colors.coolGray,
        gray: colors.trueGray,
        truegray: colors.trueGray,
        mejito: '#41ffca',
        lightmejito: '#c3f2ef',
        green: colors.green,
        mejitodark: "#00C853",
        orange: colors.orange
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
