/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#11110F',
        surface: {
          DEFAULT: '#191815',
          elevated: '#211F1B',
          card: '#1F1D19',
          hover: '#292621',
          border: '#2C2822'
        },
        pramaan: {
          text: '#EEE7DA',
          muted: '#918A7D',
          copper: '#C8754A',
          amber: '#D5A04B',
          softpink: '#D77A8B',
          softpurple: '#9A7BB8',
          red: '#C75B45'
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
