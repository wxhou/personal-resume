/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          warm: '#785A3C',
          'warm-dark': '#3D2E1E',
          'warm-light': '#B8A08A',
          'warm-pale': '#C4B8A8',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Cormorant Garamond', 'Georgia', 'serif'],
        'ui': ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 16px rgba(120, 90, 60, 0.12)',
      }
    },
  },
  plugins: [],
}
