import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const PERMISSION_LEVELS = { none: 0, read: 1, write: 2, admin: 3 }

const PERM_BADGE_COLORS = {
  admin: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  write: { bg: 'rgba(99,102,241,0.15)', color: '#6366f1' },
  read: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  none: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
}

function SetupMessage() {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '2rem',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '2rem auto',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧩</div>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Welcome to Mosaic</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        No modules configured yet. Copy <code style={{ color: 'var(--warning)' }}>mosaic.modules.example.json</code> to{' '}
        <code style={{ color: 'var(--warning)' }}>mosaic.modules.json</code> and update it with your remote module URLs,
        then restart Mosaic.
      </p>
      <pre style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '1rem',
        textAlign: 'left',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        overflow: 'auto',
      }}>
{`cp mosaic.modules.example.json mosaic.modules.json
# Edit mosaic.modules.json with your module URLs
# Then restart: npm run dev`}
      </pre>
    </div>
  )
}

function ModuleCard({ module, onClick, userPermission }) {
  const [status, setStatus] = useState('checking')
  const minRequired = module.minPermission || 'read'
  const hasAccess = (PERMISSION_LEVELS[userPermission] || 0) >= (PERMISSION_LEVELS[minRequired] || 0)
  const badgeStyle = PERM_BADGE_COLORS[userPermission] || PERM_BADGE_COLORS.none

  useEffect(() => {
    const controller = new AbortController()
    fetch(module.remoteEntry, { mode: 'no-cors', signal: controller.signal })
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'))
    return () => controller.abort()
  }, [module.remoteEntry])

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      borderTop: `3px solid ${module.color || 'var(--accent)'}`,
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      transition: 'background 0.15s, opacity 0.15s',
      cursor: hasAccess ? 'pointer' : 'default',
      opacity: hasAccess ? 1 : 0.5,
    }}
      onMouseEnter={e => { if (hasAccess) e.currentTarget.style.background = 'var(--bg-hover)' }}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
      onClick={hasAccess ? onClick : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>{module.icon}</span>
        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{module.name}</span>
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 600,
          background: badgeStyle.bg,
          color: badgeStyle.color,
          marginLeft: 'auto',
        }}>
          {userPermission}
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          color: status === 'online' ? 'var(--success)' :
                 status === 'offline' ? 'var(--danger)' : 'var(--text-muted)',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: status === 'online' ? 'var(--success)' :
                        status === 'offline' ? 'var(--danger)' : 'var(--text-muted)',
          }} />
          {status === 'checking' ? 'Checking...' : status === 'online' ? 'Online' : 'Offline'}
        </span>

        {hasAccess ? (
          <button style={{
            background: module.color || 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '6px 16px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Open
          </button>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--danger, #ef4444)' }}>🔒 No Access</span>
        )}
      </div>
    </div>
  )
}

export default function Dashboard({ modules, noConfig, loading }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        Loading modules...
      </div>
    )
  }

  if (noConfig || modules.length === 0) {
    return <SetupMessage />
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Dashboard</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1rem',
      }}>
        {modules.map(mod => {
          const userPermission = user?.permissions?.[mod.id] || user?.permissions?.['__default__'] || 'none'
          return (
            <ModuleCard
              key={mod.id}
              module={mod}
              userPermission={userPermission}
              onClick={() => navigate(`/module/${mod.id}`)}
            />
          )
        })}
      </div>
    </div>
  )
}
