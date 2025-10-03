/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        valorant: {
          red: '#FF4655',
          blue: '#389BFF',
          dark: '#0F1419',
          light: '#ECE8E1',
        }
      },
      fontFamily: {
        'valorant': ['Rajdhani', 'sans-serif'],
      }
    },
  },
  plugins: [],
}