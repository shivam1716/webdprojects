/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        touch: '#12100E',
        surface: '#1C1916',
        bone: '#EDE6D6',
        muted: '#8C8477',
        gold: '#D9A441',
        copper: '#B8663A',
        fraud: '#E4572E',
        steel: '#7C93A6'
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      }
    }
  },
  plugins: []
}