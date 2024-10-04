import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/autism-sense/', // Adjust as needed for your app's base path
  plugins: [react()],
});
