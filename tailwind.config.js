/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        dancing: ['Dancing Script', 'cursive'], 
        playfair: ['Playfair Display', 'serif'],
      },
      colors: {
        'dark-gray': '#121212',  
        'soft-black': '#181818', 
        'deep-navy': '#0D1117',  
      },
      screens: {
        'xs': '310px', // Custom screen size for 310px width
      },
      // keyframes: {
      //   slide: {
      //     '0%': { opacity: '0', transform: 'translateX(100%)' },
      //     '25%': { opacity: '1', transform: 'translateX(0)' },
      //     '50%': { opacity: '1', transform: 'translateX(0)' },
      //     '75%': { opacity: '0', transform: 'translateX(-100%)' },
      //     '100%': { opacity: '0', transform: 'translateX(-100%)' },
      //   },
      // },
      // animation: {
      //   slide: 'slide 20s infinite',
      // },
    },
  },
  plugins: [],
}

