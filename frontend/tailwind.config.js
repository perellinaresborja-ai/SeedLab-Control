/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030712', // Deep tech-blue/black
        card: '#111827',
        border: '#374151',
        primary: {
          green: '#10b981', // Cyber/Tech Green
          cyan: '#06b6d4',  // Cyan/Turquoise
        },
        text: {
          main: '#ffffff',
          muted: '#9ca3af',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
