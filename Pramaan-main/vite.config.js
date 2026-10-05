import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/worldbank': {
        target: 'https://search.worldbank.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/worldbank/, '/api/v2/projects')
      }
    }
  }
})
