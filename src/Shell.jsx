import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import ModuleFrame from './components/ModuleFrame'
import NotFound from './pages/NotFound'
import { useModules } from './hooks/useModules'

export default function Shell() {
  const { modules, noConfig, loading } = useModules()
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('mosaic_sidebar_collapsed') === 'true'
  })

  const toggleSidebar = () => {
    setCollapsed(prev => {
      localStorage.setItem('mosaic_sidebar_collapsed', String(!prev))
      return !prev
    })
  }

  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar onToggleSidebar={toggleSidebar} collapsed={collapsed} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar modules={modules} collapsed={collapsed} />
        <main style={{
          flex: 1,
          overflow: 'auto',
          background: 'var(--bg-primary)',
          padding: '1.5rem',
        }}>
          <Routes>
            <Route path="/" element={<Dashboard modules={modules} noConfig={noConfig} loading={loading} />} />
            {modules.map(mod => (
              <Route
                key={mod.id}
                path={`/module/${mod.id}`}
                element={<ModuleFrame module={mod} />}
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
