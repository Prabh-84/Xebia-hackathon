import { getForecast } from '../services/api';
import useFetch from '../hooks/useFetch';
import Skeleton from '../components/ui/Skeleton';
import ForecastChart from '../components/charts/ForecastChart';

export default function Forecast() {
  const { data, loading, error, refetch } = useFetch(getForecast);

  if (loading) {
    return (
      <div style={{ padding: '32px' }}>
        <Skeleton height="40px" />
        <div style={{ marginTop: '24px' }}>
          <Skeleton height="400px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px', color: 'var(--red)' }}>
        <p>Error loading forecast: {error}</p>
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

  const { chartData, projectedAmount, targetMonth } = data || {};

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <p style={{ color: 'var(--text-2)', fontSize: '18px' }}>
        Emissions projected to reach <strong style={{ color: 'var(--amber)' }}>{projectedAmount || 'N/A'} kg</strong> by {targetMonth || 'the end of the year'}
      </p>
      <ForecastChart data={chartData} />
    </div>
  );
}
