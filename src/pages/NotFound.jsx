import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '400px',
      textAlign: 'center',
    }}>
      <div>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>404 — Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          This page doesn't exist in the Mosaic.
        </p>
        <Link to="/" style={{
          background: 'var(--accent)',
          color: '#fff',
          padding: '8px 24px',
          borderRadius: 'var(--radius)',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
