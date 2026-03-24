import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [config, setConfig] = useState(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
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

    if (!config?.authServiceUrl) {
      setError('Auth service URL not configured')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${config.authServiceUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Request failed (${res.status})`)
      }

      setSent(true)
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
        <h1 style={styles.title}>Forgot Password</h1>
        <p style={styles.subtitle}>Enter your email to receive a reset link</p>

        {error && <div style={styles.error}>{error}</div>}

        {sent ? (
          <div style={styles.success}>
            If that email exists, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <button type="submit" disabled={submitting} style={{
              ...styles.button,
              opacity: submitting ? 0.6 : 1,
            }}>
              {submitting ? 'Sending...' : 'Send Reset Link'}
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
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg-primary)',
  },
  form: {
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '2.5rem 2rem',
    width: '100%', maxWidth: '380px', textAlign: 'center',
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
