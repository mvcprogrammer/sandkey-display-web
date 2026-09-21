import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * In production both paths are CloudFront behaviours on the same distribution as this app, so
 * the kiosk makes same-origin requests and there is no CORS anywhere. The dev server stands in
 * for those two behaviours.
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
      '/media': {
        target: 'https://dvvjkgh94f2v6.cloudfront.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/media/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
