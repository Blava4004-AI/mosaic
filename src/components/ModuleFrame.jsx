import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import AccessDenied from './AccessDenied'

const PERMISSION_LEVELS = { none: 0, read: 1, write: 2, admin: 3 }

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: '300px', color: 'var(--text-secondary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '32px', height: '32px',
          border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div>Loading module...</div>
      </div>
    </div>
  )
}

function ModuleError({ module, error, onRetry }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: '300px',
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '2rem',
        textAlign: 'center', maxWidth: '480px',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>😵</div>
        <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>
          Failed to load {module.name}
        </h3>
        {error && <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1rem' }}>{error}</p>}
        <button onClick={onRetry} style={{
          background: 'var(--accent)', color: '#fff', border: 'none',
          borderRadius: 'var(--radius)', padding: '8px 24px',
          fontSize: '0.9rem', cursor: 'pointer',
        }}>Retry</button>
      </div>
    </div>
  )
}

// Map module IDs to their standalone URLs (direct ports, all HTTPS)
function getModuleUrl(module) {
  const host = window.location.hostname
  const urlMap = {
    'task-tracker': `https://${host}:5178/`,
    'config-service': `https://${host}:5196/`,
    'auth-service': `https://${host}:5191/admin/`,
  }
  return urlMap[module.id] || module.standaloneUrl || null
}

export default function ModuleFrame({ module }) {
  const { user } = useAuth()

  // Permission check
  const userPermission = user?.permissions?.[module.id] || user?.permissions?.['__default__'] || 'none'
  const minRequired = module.minPermission || 'read'

  if ((PERMISSION_LEVELS[userPermission] || 0) < (PERMISSION_LEVELS[minRequired] || 0)) {
    return <AccessDenied module={module} userPermission={userPermission} required={minRequired} />
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const iframeRef = useRef(null)

  const moduleUrl = getModuleUrl(module)

  useEffect(() => {
    setLoading(true)
    setError(null)

    if (!moduleUrl) {
      setError(`No URL configured for module: ${module.id}`)
      setLoading(false)
      return
    }

    // Ping the module URL to check if it's online before loading
    fetch(moduleUrl, { mode: 'no-cors' })
      .then(() => setLoading(false))
      .catch(() => {
        setError(`Module at ${moduleUrl} is not reachable`)
        setLoading(false)
      })
  }, [moduleUrl, retryKey])

  const handleRetry = () => setRetryKey(k => k + 1)

  const handleIframeLoad = () => setLoading(false)
  const handleIframeError = () => {
    setError(`Failed to load ${module.name}`)
    setLoading(false)
  }

  if (error) return <ModuleError module={module} error={error} onRetry={handleRetry} />

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {loading && <LoadingSpinner />}
      {moduleUrl && (
        <iframe
          key={retryKey}
          ref={iframeRef}
          src={moduleUrl}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-primary)',
            display: loading ? 'none' : 'block',
            minHeight: 'calc(100vh - var(--topbar-height) - 3rem)',
          }}
          title={module.name}
          allow="clipboard-read; clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      )}
    </div>
  )
}
