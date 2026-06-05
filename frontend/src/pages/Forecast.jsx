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

  // Support both old array schema and new object schema
  let labels = [];
  let predicted = [];
  let historical = [];
  let projectedAmount = 'N/A';
  let targetMonth = 'the end of the year';
  
  if (Array.isArray(data)) {
    labels = data.map(item => item.month);
    predicted = data.map(item => item.value);
    historical = data.map(item => item.value - 20);
    projectedAmount = predicted[predicted.length - 1] || 'N/A';
    targetMonth = labels[labels.length - 1] || 'the end of the year';
  } else if (data && typeof data === 'object') {
    // New Schema: { currentEmission, predictedEmission, trend, forecastWindow }
    labels = ['Current', `+${data.forecastWindow || 30} Days`];
    predicted = [null, data.predictedEmission];
    historical = [data.currentEmission, null];
    projectedAmount = data.predictedEmission ? data.predictedEmission.toFixed(2) : 'N/A';
    targetMonth = `+${data.forecastWindow || 30} Days (${data.trend || 'stable'} trend)`;
  }
  
  const chartData = {
    labels,
    historical,
    predicted
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <p style={{ color: 'var(--text-2)', fontSize: '18px' }}>
        Emissions projected to reach <strong style={{ color: 'var(--amber)' }}>{projectedAmount} kg</strong> by {targetMonth}
      </p>
      <ForecastChart data={chartData} />
    </div>
  );
}
