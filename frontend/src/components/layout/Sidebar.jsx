import { NavLink } from 'react-router-dom';
import '../../styles/globals.css';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Forecast', path: '/forecast' },
    { name: 'Recommendations', path: '/recommendations' },
    { name: 'Projects', path: '/projects' },
  ];

  return (
    <aside className="sidebar" style={{
      width: '240px',
      height: '100vh',
      backgroundColor: 'var(--bg-raised)',
      borderRight: '1px solid var(--border)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      <div className="sidebar-logo" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--green)',
        paddingLeft: '16px'
      }}>
        GreenOps
      </div>
      
      <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className="sidebar-link"
            style={({ isActive }) => ({
              padding: '12px 16px',
              borderRadius: 'var(--r-sm)',
              color: isActive ? 'var(--text-1)' : 'var(--text-3)',
              backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontWeight: isActive ? '500' : '400'
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
