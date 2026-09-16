import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// User page (https://pouria98sarmasti.github.io/ from the
// pouria98sarmasti.github.io repo) is served from the domain root,
// so base '/' gives absolute asset paths that always resolve.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
});
