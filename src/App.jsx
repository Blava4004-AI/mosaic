import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Shell from './Shell'
import Login from './Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

export default function App() {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧩</div>
          <div>Loading Mosaic...</div>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/forgot-password" element={token ? <Navigate to="/" replace /> : <ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/*" element={token ? <Shell /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}
