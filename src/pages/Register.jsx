import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [config, setConfig] = useState(null)
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', display_name: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/config.json')
      .then(r => r.json())
      .then(setConfig)
      .catch(() => setConfig({ authServiceUrl: '' }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!config?.authServiceUrl) {
      setError('Auth service URL not configured')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${config.authServiceUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          display_name: form.display_name,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Registration failed (${res.status})`)
      }

      if (data.status === 'pending_approval') {
        setSuccess('Account created! An administrator will review your request.')
      } else {
        setSuccess('Account created! You can now log in.')
      }
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
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register for Mosaic</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {!success && (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Display Name</label>
              <input
                type="text"
                value={form.display_name}
                onChange={e => setForm({ ...form, display_name: e.target.value })}
                style={styles.input}
                placeholder="Your name"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={styles.input}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={styles.input}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                style={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={submitting} style={{
              ...styles.button,
              opacity: submitting ? 0.6 : 1,
            }}>
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </>
        )}

        <p style={styles.footer}>
          <Link to="/login" style={styles.link}>← Back to login</Link>
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
  logo: { fontSize: '3rem', marginBottom: '0.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 },
  subtitle: { color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' },
  field: { marginBottom: '1rem', textAlign: 'left' },
  label: { display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' },
  input: {
    width: '100%', padding: '10px 12px', background: 'var(--bg-primary)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
  },
  button: {
    width: '100%', padding: '10px', background: 'var(--accent)', color: '#fff',
    border: 'none', borderRadius: 'var(--radius)', fontSize: '0.95rem',
    fontWeight: 600, marginTop: '0.5rem', cursor: 'pointer',
  },
  error: {
    background: 'rgba(248, 81, 73, 0.1)', border: '1px solid var(--danger)',
    color: 'var(--danger)', borderRadius: 'var(--radius)', padding: '8px 12px',
    marginBottom: '1rem', fontSize: '0.85rem',
  },
  success: {
    background: 'rgba(63, 185, 80, 0.1)', border: '1px solid var(--success)',
    color: 'var(--success)', borderRadius: 'var(--radius)', padding: '12px',
    marginBottom: '1rem', fontSize: '0.9rem',
  },
  footer: { marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' },
  link: { color: 'var(--accent)', textDecoration: 'none' },
}
