import { getProjects } from '../services/api';
import useFetch from '../hooks/useFetch';
import Skeleton from '../components/ui/Skeleton';
import GreenScoreBadge from '../components/ui/GreenScoreBadge';
import CostCarbonChart from '../components/charts/CostCarbonChart';
import BudgetBar from '../components/ui/BudgetBar';

export default function Projects() {
  const { data, loading, error, refetch } = useFetch(getProjects);

  if (loading) {
    return (
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Skeleton height="80px" />
        <Skeleton height="350px" />
        <Skeleton height="400px" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px', color: 'var(--red)' }}>
        <p>Error loading projects: {error}</p>
        <button 
          onClick={refetch}
          style={{
            marginTop: '12px',
            background: 'transparent',
            border: '1px solid var(--red)',
            color: 'var(--red)',
            padding: '8px 16px',
            borderRadius: 'var(--r-sm)',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Use backend data — now an array of project objects
  const projectsList = Array.isArray(data) ? data : (data?.projects || []);
  
  // Aggregate totals from all projects for budget bar and chart
  const totalVmHours = projectsList.reduce((sum, p) => sum + (p.vmHours || 0), 0);
  const totalStorage = projectsList.reduce((sum, p) => sum + (p.storageGB || 0), 0);
  const totalNetwork = projectsList.reduce((sum, p) => sum + (p.networkGB || 0), 0);
  const totalCost = projectsList.reduce((sum, p) => sum + (p.cloudCost || 0), 0);
  const totalCarbon = projectsList.reduce((sum, p) => sum + (p.carbon || 0), 0);

  const budgetInfo = {
    current: Math.round(totalCarbon),
    forecast: Math.round(totalCarbon * 1.1),
    budget: 5000
  };

  const chartData = {
    labels: projectsList.map(p => p.name) .length > 0 
      ? projectsList.map(p => p.name) 
      : ['Compute', 'Storage', 'Network'],
    costs: projectsList.map(p => p.cloudCost || 0),
    carbon: projectsList.map(p => p.carbon || 0)
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {budgetInfo && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: '20px 24px'
        }}>
          <BudgetBar 
            current={budgetInfo.current} 
            forecast={budgetInfo.forecast} 
            budget={budgetInfo.budget} 
          />
        </div>
      )}

      {chartData && (
        <CostCarbonChart data={chartData} />
      )}

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text-1)', fontSize: '16px' }}>Project Details</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-2)' }}>
                <th style={{ padding: '16px 24px', fontWeight: '500' }}>Project Name</th>
                <th style={{ padding: '16px 24px', fontWeight: '500' }}>Provider</th>
                <th style={{ padding: '16px 24px', fontWeight: '500' }}>Region</th>
                <th style={{ padding: '16px 24px', fontWeight: '500' }}>CO2e (kg)</th>
                <th style={{ padding: '16px 24px', fontWeight: '500' }}>Cost</th>
                <th style={{ padding: '16px 24px', fontWeight: '500' }}>Green Score</th>
              </tr>
            </thead>
            <tbody>
              {(projectsList || []).map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-1)' }}>
                  <td style={{ padding: '16px 24px' }}>{p.name}</td>
                  <td style={{ padding: '16px 24px' }}>{p.provider}</td>
                  <td style={{ padding: '16px 24px' }}>{p.region}</td>
                  <td style={{ padding: '16px 24px' }}>{p.carbon}</td>
                  <td style={{ padding: '16px 24px' }}>₹{(p.cloudCost || p.cost || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <GreenScoreBadge score={p.score} />
                  </td>
                </tr>
              ))}
              {(!projectsList || projectsList.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)' }}>
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
