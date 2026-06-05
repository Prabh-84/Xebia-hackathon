import { useLocation } from 'react-router-dom';

export default function TopBar() {
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Guest';

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header style={{
      height: '72px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      backgroundColor: 'var(--bg-base)'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '20px',
        color: 'var(--text-1)'
      }}>
        {getPageTitle()}
      </h1>
      <div style={{
        color: 'var(--text-2)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--green-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--green)',
          fontWeight: '700'
        }}>
          {username.charAt(0).toUpperCase()}
        </div>
        {username}
      </div>
    </header>
  );
}
