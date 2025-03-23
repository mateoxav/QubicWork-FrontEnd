/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'scroll-x': 'scroll-x 80s ease-in-out infinite',
      },
      keyframes: {
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      boxShadow: {
        'inner-glow': 'inset 40px 0 30px -20px rgba(255,255,255,1), inset -40px 0 30px -20px rgba(255,255,255,1)'
      }
    },
  },
  plugins: [],
};