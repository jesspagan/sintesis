import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { parse } from 'yaml'

function yamlPlugin(): Plugin {
  return {
    name: 'yaml',
    transform(code, id) {
      if (!id.endsWith('.yaml') && !id.endsWith('.yml')) return
      return `export default ${JSON.stringify(parse(code))}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Served from https://jesspagan.github.io/sintesis/ on GitHub Pages.
  base: process.env.GITHUB_ACTIONS ? '/sintesis/' : '/',
  plugins: [react(), yamlPlugin()],
  test: {
    globals: true,
  },
})
