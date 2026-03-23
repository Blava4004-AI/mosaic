import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import fs from 'fs'
import path from 'path'

function loadModules() {
  const modulesPath = path.resolve(__dirname, 'mosaic.modules.json')
  if (!fs.existsSync(modulesPath)) {
    console.warn('[Mosaic] No mosaic.modules.json found — running without remote modules')
    return {}
  }
  try {
    const data = JSON.parse(fs.readFileSync(modulesPath, 'utf-8'))
    const remotes = {}
    for (const mod of data.modules || []) {
      if (mod.enabled && mod.id && mod.remoteEntry) {
        remotes[mod.id] = mod.remoteEntry
      }
    }
    return remotes
  } catch (err) {
    console.error('[Mosaic] Failed to parse mosaic.modules.json:', err.message)
    return {}
  }
}

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mosaic',
      remotes: loadModules(),
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 5180,
    host: '0.0.0.0'
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
