import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/autism-sense/',  // Set this to your GitHub Pages repo name
  plugins: [react()],
  build: {
    sourcemap: true,  // Enable source maps for better debugging
  },
  resolve: {
    alias: {
      // Add any necessary aliases here for easier path resolution
    },
  },
})
