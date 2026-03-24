import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [config, setConfig] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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

    if (!token) {
      setError('No reset token found. Please use the link from your email.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!config?.authServiceUrl) {
      setError('Auth service URL not configured')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${config.authServiceUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Reset failed (${res.status})`)
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.form}>
          <div style={styles.logo}>🧩</div>
          <h1 style={styles.title}>Invalid Link</h1>
          <div style={styles.error}>No reset token found. Please use the link from your email.</div>
          <p style={styles.footer}>
            <Link to="/login" style={styles.link}>← Back to login</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.logo}>🧩</div>
        <h1 style={styles.title}>Reset Password</h1>
        <p style={styles.subtitle}>Enter your new password</p>

        {error && <div style={styles.error}>{error}</div>}

        {success ? (
          <>
            <div style={styles.success}>
              Password reset successfully! You can now log in with your new password.
            </div>
            <Link to="/login" style={{ ...styles.button, display: 'inline-block', textDecoration: 'none', marginTop: '1rem' }}>
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <div style={styles.field}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                required
                minLength={8}
                autoFocus
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={submitting} style={{
              ...styles.button,
              opacity: submitting ? 0.6 : 1,
            }}>
              {submitting ? 'Resetting...' : 'Reset Password'}
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
