import { useAuth } from '../hooks/useAuth'

export default function TopBar({ onToggleSidebar, collapsed }) {
  const { user, logout } = useAuth()

  const displayName = user?.name || user?.email || 'User'

  return (
    <header style={{
      height: 'var(--topbar-height)',
      minHeight: 'var(--topbar-height)',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '16px',
    }}>
      <button
        onClick={onToggleSidebar}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '1.2rem',
          padding: '4px 8px',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        ≡
      </button>

      <span style={{
        fontWeight: 600,
        fontSize: '1.1rem',
        color: 'var(--accent)',
        marginRight: 'auto',
      }}>
        🧩 Mosaic
      </span>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          👤 {displayName}
        </span>
        <button
          onClick={logout}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            borderRadius: 'var(--radius)',
            padding: '4px 10px',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          ⏻
        </button>
      </div>
    </header>
  )
}
