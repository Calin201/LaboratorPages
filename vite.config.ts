import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base: './' permite rularea corecta atat pe sub-calea GitHub Pages (/LaboratorPages/),
// cat si pe domenii radacina (Vercel, Netlify, Cloudflare Pages).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
});
