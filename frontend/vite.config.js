import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/autism-sense/',  // Set this to your GitHub Pages repo name
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@zoom/videosdk'], // Externalize the Zoom Video SDK
    },
  },
});
