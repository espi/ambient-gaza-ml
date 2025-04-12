const colors = require('tailwindcss/colors')
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      mapBg: '#F6F4F1',
      dark: colors.slate[900],
      darkLight: colors.slate[700],
      gray: colors.slate[400],
      light: colors.slate[200],
      white: colors.slate[50],
      primary: colors.sky[600],
      brand: {
        primary: '#3D5A80',
        secondary: '#81B29A',
        accent: '#E07A5F',
        dark: '#2A3D45',
      },
      success: '#81B29A',
      warning: '#F2CC8F',
      error: '#E07A5F',
    },
    extend: {
      fontSize: {
        base: ['18px', '24px'],
        small: ['16px', '20px'],
      },
      fontFamily: {
        sans: ['var(--font-catamaran)', ...fontFamily.sans],
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ':root': {
          '--tw-color-brand-primary': '#3D5A80',
          '--tw-color-brand-secondary': '#81B29A',
          '--tw-color-brand-accent': '#E07A5F',
          '--tw-color-light': '#e2e8f0',
        },
      })
    },
  ],
}
