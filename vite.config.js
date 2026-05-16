import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: set base to '/' if using a custom domain (domain.np)
// If hosting at username.github.io/repo-name (no custom domain), change to '/repo-name/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
