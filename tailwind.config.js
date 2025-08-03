/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f4f1',
          100: '#ede6dd',
          200: '#dccbb8',
          300: '#c7a88d',
          400: '#ae8d72',
          500: '#9b7a5f',
          600: '#8a6b53',
          700: '#736757',
          800: '#5e5449',
          900: '#4d453c',
        },
        secondary: {
          50: '#f6f5f4',
          100: '#ebe9e7',
          200: '#d6d2ce',
          300: '#bbb4ad',
          400: '#9c9389',
          500: '#847a70',
          600: '#736757',
          700: '#5f5549',
          800: '#4f473e',
          900: '#433c35',
        },
        accent: {
          50: '#f5f3f0',
          100: '#e8e3dc',
          200: '#d2c5b6',
          300: '#b8a189',
          400: '#a08464',
          500: '#8f7354',
          600: '#7a6148',
          700: '#624031',
          800: '#52372a',
          900: '#462f25',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
