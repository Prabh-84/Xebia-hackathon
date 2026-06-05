export default function RecommendationCard({ text, status, carbonSaving, costSaving }) {
  const statusColor = status === 'High Impact' ? 'var(--green)' : 'var(--amber)';

  return (
    <div className="glass-card" style={{
      borderRadius: 'var(--r-md)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      <div>
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '600',
          color: statusColor,
          backgroundColor: `${statusColor}20`,
          marginBottom: '12px'
        }}>
          {status}
        </div>
        <p style={{ color: 'var(--text-1)', fontSize: '15px', lineHeight: '1.5' }}>
          {text}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{
          background: 'var(--bg-raised)',
          padding: '4px 10px',
          borderRadius: 'var(--r-sm)',
          fontSize: '13px',
          color: 'var(--text-2)'
        }}>
          ↓ {carbonSaving} kg CO2e
        </div>
        <div style={{
          background: 'var(--bg-raised)',
          padding: '4px 10px',
          borderRadius: 'var(--r-sm)',
          fontSize: '13px',
          color: 'var(--text-2)'
        }}>
          ↓ ₹{costSaving}
        </div>
      </div>
    </div>
  );
}
