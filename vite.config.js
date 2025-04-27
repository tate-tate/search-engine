import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/search-engine/', // Set the base path to match the repository name
  plugins: [react()],
});