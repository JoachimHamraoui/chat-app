/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
    colors: {
      'green': '#2be95ade',
      'white': '#EBEBEB',
      'black': '#222222',
      'grey': '#333',
      'grey-2': '#555'
    },
    screens: {
      'sm': '360px',

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }

      '3xl': '3000px'
    },
    fontFamily: {
      display: ['Sora', 'sans-serif'],
      mont: ['Montserret', 'sans-serif']
    },
  },
  plugins: [],
}

