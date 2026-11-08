import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const uiChangelogPath = resolve(__dirname, '../../packages/ui/CHANGELOG.md')

export default defineConfig({
  resolve: {
    conditions: ['source'],
  },
  plugins: [
    react(),
    {
      name: 'virtual-changelogs',
      resolveId(id) {
        if (id === 'virtual:ui-changelog') return '\0virtual:ui-changelog'
      },
      load(id) {
        if (id === '\0virtual:ui-changelog') {
          const content = readFileSync(uiChangelogPath, 'utf-8')
          return `export default ${JSON.stringify(content)}`
        }
      },
    },
  ],
})
