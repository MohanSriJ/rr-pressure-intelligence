/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rr: {
          bg: '#0B1220',
          secondary: '#111C2E',
          card: '#172438',
          cardHover: '#1D2D46',
          border: '#233550',
          red: '#E23C45',
          redHover: '#F04C55',
          gold: '#D6B46C',
          goldLight: '#E8CA8A',
          textPrimary: '#F5F6F8',
          textSecondary: '#A7B1C2',
          textMuted: '#6B7A92',
          success: '#38B889',
          warning: '#E9AE55',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
