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
      mapBg: '#FBF8F4',
      dark: colors.slate[900],
      darkLight: colors.slate[700],
      gray: colors.slate[400],
      light: colors.slate[200],
      white: colors.slate[50],
      primary: colors.sky[600],
      brand: {
        primary: '#1A5D7A', // Deep blue-green
        secondary: '#7DC383', // Soft green
        accent: '#F7A072', // Warm orange
        dark: '#33312E', // Nearly black
      },
      success: '#27C485',
      warning: '#F1B650',
      error: '#EC2D18',
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
          '--tw-color-brand-primary': '#1A5D7A',
          '--tw-color-brand-secondary': '#7DC383',
          '--tw-color-brand-accent': '#F7A072',
          '--tw-color-light': '#e2e8f0',
        },
      })
    },
  ],
}
