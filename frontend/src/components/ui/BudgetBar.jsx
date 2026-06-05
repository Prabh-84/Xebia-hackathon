export default function BudgetBar({ current, forecast, budget }) {
  const currentPct = Math.min((current / budget) * 100, 100);
  const forecastPct = Math.min((forecast / budget) * 100, 100) - currentPct;
  
  const totalProjected = current + forecast;
  let status = 'Safe';
  let statusColor = 'var(--green)';

  if (totalProjected > budget) {
    status = 'Exceeded';
    statusColor = 'var(--red)';
  } else if (totalProjected > budget * 0.85) {
    status = 'Warning';
    statusColor = 'var(--amber)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-1)', fontSize: '14px' }}>Budget Usage</span>
        <div style={{
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '600',
          color: statusColor,
          backgroundColor: `${statusColor}20`,
        }}>
          {status}
        </div>
      </div>
      
      <div style={{
        height: '12px',
        backgroundColor: 'var(--bg-raised)',
        borderRadius: '999px',
        overflow: 'hidden',
        display: 'flex'
      }}>
        <div style={{
          width: `${currentPct}%`,
          backgroundColor: 'var(--green)',
          height: '100%'
        }} />
        <div style={{
          width: `${Math.max(0, forecastPct)}%`,
          backgroundColor: 'var(--amber)',
          height: '100%',
          opacity: 0.8
        }} />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-3)', fontSize: '12px' }}>
        <span>Current: ${current}</span>
        <span>Forecast: ${totalProjected}</span>
        <span>Budget: ${budget}</span>
      </div>
    </div>
  );
}
