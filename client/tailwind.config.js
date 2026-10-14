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
        cyber: {
          bg: '#080d19',
          card: '#0f172a',
          surface: '#131e36',
          border: '#1e293b',
          blue: '#0284c7',
          cyan: '#06b6d4',
          accent: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.15)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
