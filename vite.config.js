import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

function injectOfflineAssets() {
  return {
    name: 'inject-offline-assets',
    closeBundle() {
      const distDir = fileURLToPath(new URL('./dist', import.meta.url))
      const serviceWorkerPath = join(distDir, 'sw.js')
      const files = []

      const visit = (directory) => {
        readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
          const absolutePath = join(directory, entry.name)
          if (entry.isDirectory()) {
            visit(absolutePath)
            return
          }

          const publicPath = `/${relative(distDir, absolutePath).replaceAll('\\', '/')}`
          const unusedAsset = /\/horserace\/(?:horse-(?:blue|green|purple|red)-\d|track|finish-gate|.*preview)/.test(publicPath)
          const isCacheable = !unusedAsset && !publicPath.endsWith('/sw.js') && !publicPath.endsWith('.mp4')
          if (isCacheable && statSync(absolutePath).size < 1_500_000) files.push(publicPath)
        })
      }

      visit(distDir)
      const assets = [...new Set(['/', ...files])].sort()
      const version = createHash('sha1').update(assets.join('|')).digest('hex').slice(0, 10)
      const source = readFileSync(serviceWorkerPath, 'utf8')
        .replace('"__CACHE_VERSION__"', `"vors-${version}"`)
        .replace('/* __PRECACHE_ASSETS__ */ APP_SHELL', JSON.stringify(assets, null, 2))

      writeFileSync(serviceWorkerPath, source)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), injectOfflineAssets()],
})
