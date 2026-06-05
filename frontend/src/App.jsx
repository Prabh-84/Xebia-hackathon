import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import './styles/globals.css';

import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import Recommendations from './pages/Recommendations';
import Projects from './pages/Projects';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopBar />
          <main style={{ flex: 1, overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/projects" element={<Projects />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
