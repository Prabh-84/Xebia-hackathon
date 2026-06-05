import { getDashboard } from '../services/api';
import useFetch from '../hooks/useFetch';
import KPICard from '../components/ui/KPICard';
import Skeleton from '../components/ui/Skeleton';
import GreenScoreBadge from '../components/ui/GreenScoreBadge';
import EmissionsChart from '../components/charts/EmissionsChart';

export default function Dashboard() {
  const { data, loading, error, refetch } = useFetch(getDashboard);

  if (loading) {
    return (
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          <Skeleton height="120px" />
          <Skeleton height="120px" />
          <Skeleton height="120px" />
          <Skeleton height="120px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '65% 1fr', gap: '24px' }}>
          <Skeleton height="300px" />
          <Skeleton height="300px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px', color: 'var(--red)' }}>
        <p>Error loading dashboard: {error}</p>
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

  // Fallback default data structure just in case backend format changes
  const kpis = data?.kpis || {};
  const emissionsData = data?.emissions || { labels: [], values: [] };
  const greenScoreSummary = data?.greenScoreSummary || { score: 'C', description: 'Moderate efficiency' };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Row 1: 4 KPICards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <KPICard 
          label="Total Carbon" 
          value={kpis.totalCarbon?.value || 0} 
          unit="kg" 
          delta={kpis.totalCarbon?.delta} 
        />
        <KPICard 
          label="Total Cost" 
          value={kpis.totalCost?.value || 0} 
          unit="$" 
          delta={kpis.totalCost?.delta} 
        />
        <KPICard 
          label="Avg Green Score" 
          value={kpis.avgGreenScore?.value || 'N/A'} 
        />
        <KPICard 
          label="Active Projects" 
          value={kpis.activeProjects?.value || 0} 
        />
      </div>

      {/* Row 2: EmissionsChart (65%) + Green Score Panel (35%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '65% 1fr', gap: '24px' }}>
        <EmissionsChart data={emissionsData} />
        
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ color: 'var(--text-1)', fontSize: '16px' }}>Green Score Summary</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ transform: 'scale(1.5)' }}>
              <GreenScoreBadge score={greenScoreSummary.score} />
            </div>
            <p style={{ color: 'var(--text-2)', textAlign: 'center', lineHeight: '1.5' }}>
              {greenScoreSummary.description || 'Keep optimizing your workloads to improve your score.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
