import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves at https://<user>.github.io/<repo>/ — assets must use that prefix.
// CI sets BASE_PATH=/RepoName/; local dev uses '/'.
const base = process.env.BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
