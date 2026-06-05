import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Temporary mock functionality
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      padding: '24px'
    }}>
    <div className="glass-card" style={{
        width: '100%',
        maxWidth: '400px',
        borderRadius: 'var(--r-md)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '8px' }}>
            GreenOps
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>Create an account to track emissions.</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-1)', fontSize: '14px', marginBottom: '8px' }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Jane Doe"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-raised)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--text-1)',
                fontFamily: 'var(--font-data)'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-1)', fontSize: '14px', marginBottom: '8px' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-raised)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--text-1)',
                fontFamily: 'var(--font-data)'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-1)', fontSize: '14px', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--bg-raised)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--text-1)',
                fontFamily: 'var(--font-data)'
              }}
            />
          </div>
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '8px',
              backgroundColor: 'var(--green)',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--r-sm)',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '16px'
            }}
          >
            Create Account
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-3)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--green)', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
