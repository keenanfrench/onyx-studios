import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Built into the Project X repo as a static demo: /demos/fluff-co/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: '../../demos/fluff-co', emptyOutDir: true },
})
