import { getRecommendations } from '../services/api';
import useFetch from '../hooks/useFetch';
import Skeleton from '../components/ui/Skeleton';
import RecommendationCard from '../components/ui/RecommendationCard';

export default function Recommendations() {
  const { data, loading, error, refetch } = useFetch(getRecommendations);

  if (loading) {
    return (
      <div style={{ padding: '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <Skeleton height="180px" />
          <Skeleton height="180px" />
          <Skeleton height="180px" />
          <Skeleton height="180px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '32px', color: 'var(--red)' }}>
        <p>Error loading recommendations: {error}</p>
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

  const items = data || [];

  if (items.length === 0) {
    return (
      <div style={{ padding: '32px', color: 'var(--text-3)', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍃</div>
        <p>You have zero active recommendations right now.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {items.map((item, i) => {
          const text = typeof item === 'string' ? item : item.text;
          // Provide mock values to fill out the UI
          const status = i === 0 ? 'High Impact' : 'Medium Impact';
          const carbonSaving = (i + 1) * 45;
          const costSaving = (i + 1) * 12;

          return (
            <RecommendationCard 
              key={i}
              text={text}
              status={status}
              carbonSaving={carbonSaving}
              costSaving={costSaving}
            />
          );
        })}
      </div>
    </div>
  );
}
