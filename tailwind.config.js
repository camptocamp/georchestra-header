/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#85127e',
        secondary: '#1b1f3b',
      },
    },
  },
  variants: {
    display: ['group-hover'],
  },
  plugins: [],
}
