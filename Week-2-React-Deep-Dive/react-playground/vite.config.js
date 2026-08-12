import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configured base path for hosting directly inside the repository subfolder on GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/1-month-training-resources/Week-2-React-Deep-Dive/react-playground/dist/'
})
