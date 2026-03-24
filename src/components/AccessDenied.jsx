import React from 'react'

export default function AccessDenied({ module, userPermission, required }) {
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
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
        <h3 style={{ color: 'var(--danger, #ef4444)', marginBottom: '0.5rem' }}>
          Access Denied
        </h3>
        <p style={{ color: 'var(--text-secondary, #9ca0b8)', marginBottom: '0.75rem' }}>
          You need <strong style={{ color: '#f59e0b' }}>{required}</strong> access to use <strong>{module.name}</strong>
        </p>
        <p style={{ color: 'var(--text-muted, #6b6f88)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Your current permission: <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: userPermission === 'none' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
            color: userPermission === 'none' ? '#ef4444' : '#f59e0b',
          }}>{userPermission}</span>
        </p>
        <p style={{ color: 'var(--text-muted, #6b6f88)', fontSize: '0.8rem' }}>
          Contact your administrator to request access.
        </p>
      </div>
    </div>
  )
}
