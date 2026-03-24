import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [config, setConfig] = useState(null)

  useEffect(() => {
    fetch('/config.json')
      .then(r => r.json())
      .then(setConfig)
      .catch(() => setConfig({ authServiceUrl: '' }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!config?.authServiceUrl) {
      setError('Auth service URL not configured')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await login(email, password, config.authServiceUrl)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.logo}>🧩</div>
        <h1 style={styles.title}>{config?.appTitle || 'Mosaic'}</h1>
        <p style={styles.subtitle}>Homelab Shell</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            placeholder="you@example.com"
            autoFocus
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" disabled={submitting} style={{
          ...styles.button,
          opacity: submitting ? 0.6 : 1
        }}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>

        <div style={styles.links}>
          <Link to="/register" style={styles.link}>Create an account</Link>
          <span style={styles.linkDivider}>•</span>
          <Link to="/forgot-password" style={styles.link}>Forgot password?</Link>
        </div>

        <p style={styles.footer}>
          Powered by homelab Auth Service
        </p>
      </form>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'var(--bg-primary)',
  },
  form: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center',
  },
  logo: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
  },
  field: {
    marginBottom: '1rem',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '10px',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius)',
    fontSize: '0.95rem',
    fontWeight: 600,
    marginTop: '0.5rem',
    cursor: 'pointer',
  },
  error: {
    background: 'rgba(248, 81, 73, 0.1)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: 'var(--radius)',
    padding: '8px 12px',
    marginBottom: '1rem',
    fontSize: '0.85rem',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '1rem',
    fontSize: '0.85rem',
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'none',
  },
  linkDivider: {
    color: 'var(--text-muted)',
  },
  footer: {
    marginTop: '1.5rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
}
