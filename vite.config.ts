import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// Multi-page build: each nav item is a real HTML file so that the existing,
// Google-indexed URLs (/research.html, /publications.html, /teaching.html) keep
// resolving to a real page after the migration off Wix. Do NOT collapse these
// into a single-page app — that would 404 the old links.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        // Home and Teaching are React pages. research.html / publications.html are
        // static instant-redirect files in public/ (see public/*.html) that forward
        // directly to the Per4ML lab, so they are NOT built as app entry points.
        index: resolve(__dirname, 'index.html'),
        teaching: resolve(__dirname, 'teaching.html'),
      },
    },
  },
});
