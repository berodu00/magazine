/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC', // KZ Blue
          dark: '#004A99',
          light: '#3385D6',
          lightest: '#E6F2FF',
        },
        secondary: {
          darkest: '#1A1A1A',
          dark: '#4A4A4A',
          medium: '#767676',
          light: '#D1D1D1',
          lightest: '#F5F5F5',
        },
        accent: {
          teal: {
            DEFAULT: '#00A896',
            light: '#B3E5E0',
          },
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F0E5C0',
          },
        },
        status: {
          success: '#28A745',
          warning: '#FFC107',
          error: '#DC3545',
          info: '#17A2B8',
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
