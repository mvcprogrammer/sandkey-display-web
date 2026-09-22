import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * In production /api is a CloudFront behaviour on the same distribution as this app, so the
 * kiosk makes same-origin API requests and there is no CORS anywhere. The dev server stands in
 * for that behaviour. Photos are absolute CDN URLs from the API and need no proxy.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5036',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
