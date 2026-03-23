import React, { Suspense, useState, useCallback } from 'react'
import ErrorBoundary from './ErrorBoundary'

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '300px',
      color: 'var(--text-secondary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div>Loading module...</div>
      </div>
    </div>
  )
}

function ModuleError({ module, onRetry }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '300px',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        textAlign: 'center',
        maxWidth: '400px',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>😵</div>
        <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>
          Failed to load {module.name}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          The remote module at <code style={{ color: 'var(--warning)' }}>{module.remoteEntry}</code> could not be reached.
        </p>
        <button
          onClick={onRetry}
          style={{
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '8px 24px',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    </div>
  )
}

// Cache for loaded remote components
const componentCache = {}

function loadRemoteComponent(module) {
  const cacheKey = `${module.id}:${module.component}`
  if (componentCache[cacheKey]) return componentCache[cacheKey]

  const [remoteName, exportName] = module.component.split('/')
  const loader = React.lazy(async () => {
    // Module Federation exposes remotes on window scope after loading remoteEntry
    // With @originjs/vite-plugin-federation, imports work via the remote name
    try {
      const container = await import(/* @vite-ignore */ remoteName + '/' + exportName)
      return container
    } catch {
      // Fallback: try loading the remoteEntry manually
      throw new Error(`Could not load ${module.component} from ${module.remoteEntry}`)
    }
  })

  componentCache[cacheKey] = loader
  return loader
}

export default function ModuleFrame({ module }) {
  const [retryKey, setRetryKey] = useState(0)

  const handleRetry = useCallback(() => {
    // Clear cache for this module
    const cacheKey = `${module.id}:${module.component}`
    delete componentCache[cacheKey]
    setRetryKey(k => k + 1)
  }, [module])

  const RemoteComponent = loadRemoteComponent(module)

  return (
    <ErrorBoundary
      key={retryKey}
      fallback={<ModuleError module={module} onRetry={handleRetry} />}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <RemoteComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
