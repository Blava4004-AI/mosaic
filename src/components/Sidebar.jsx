import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar({ modules, collapsed }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      minWidth: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'width 0.2s ease, min-width 0.2s ease',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <SidebarLink to="/" icon="🏠" label="Home" collapsed={collapsed} />
        {modules.map(mod => (
          <SidebarLink
            key={mod.id}
            to={`/module/${mod.id}`}
            icon={mod.icon}
            label={mod.name}
            collapsed={collapsed}
            accentColor={mod.color}
          />
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: '8px 0' }}>
        <SidebarButton icon="🚪" label="Logout" collapsed={collapsed} onClick={handleLogout} />
      </div>
    </nav>
  )
}

function SidebarLink({ to, icon, label, collapsed, accentColor }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: collapsed ? '10px 0' : '10px 16px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: isActive ? 'var(--bg-hover)' : 'transparent',
        borderLeft: isActive ? `3px solid ${accentColor || 'var(--accent)'}` : '3px solid transparent',
        textDecoration: 'none',
        fontSize: '0.9rem',
        transition: 'background 0.15s',
      })}
      end={to === '/'}
    >
      <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
      {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
    </NavLink>
  )
}

function SidebarButton({ icon, label, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: collapsed ? '10px 0' : '10px 16px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        color: 'var(--text-secondary)',
        background: 'transparent',
        border: 'none',
        width: '100%',
        fontSize: '0.9rem',
        cursor: 'pointer',
        borderLeft: '3px solid transparent',
      }}
    >
      <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  )
}
