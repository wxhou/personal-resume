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
          orange: '#FF6B35',
          'orange-light': '#FF8F66',
          'orange-dark': '#E55A2B',
        },
        'surface': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(255, 107, 53, 0.15)',
      }
    },
  },
  plugins: [],
}
