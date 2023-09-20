/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#000d42',
        secondary: '#9bcd41',
      },
    },
  },
  plugins: [],
}
