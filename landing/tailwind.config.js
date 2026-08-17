export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#02040a',
        card: 'rgba(10, 15, 28, 0.8)',
        'text-main': '#ffffff',
        'text-muted': '#9ca3af',
        primary: {
          green: '#10B981',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
