import { useState, useEffect } from 'react'

let cachedModules = null

async function fetchModules() {
  // In dev, modules are baked into the vite config at build time.
  // At runtime, we read them from a generated manifest or the example file.
  // Try /modules.json first (generated at build), then fallback to example
  for (const path of ['/mosaic.modules.json', '/modules.example.json']) {
    try {
      const res = await fetch(path)
      if (res.ok) {
        const data = await res.json()
        return data.modules || []
      }
    } catch {
      // continue
    }
  }
  return null // null means no config found
}

export function useModules() {
  const [modules, setModules] = useState(cachedModules || [])
  const [noConfig, setNoConfig] = useState(false)
  const [loading, setLoading] = useState(!cachedModules)

  useEffect(() => {
    if (cachedModules) return
    fetchModules().then(mods => {
      if (mods === null) {
        setNoConfig(true)
        setModules([])
      } else {
        cachedModules = mods
        setModules(mods.filter(m => m.enabled))
      }
      setLoading(false)
    })
  }, [])

  return { modules, noConfig, loading }
}
