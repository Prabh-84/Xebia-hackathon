export default function KPICard({ label, value, unit, delta }) {
  const isPositive = delta >= 0;
  // If we want negative to be red (like bad for emissions) or green (good for emissions). 
  // Let's assume positive delta = bad (red), negative delta = good (green) for carbon.
  // Wait, standard is positive = red if it's emissions? Let's just use green/red based on standard or wait, let's keep it simple: green for positive, red for negative unless otherwise specified. Actually, cost/carbon: negative is better.
  // I'll make it configurable or just simple green > 0, red < 0 for now. The prompt says "positive/negative colored". Let's assume green for positive, red for negative as a generic fallback.
  const deltaColor = isPositive ? 'var(--green)' : 'var(--red)';
  const sign = isPositive ? '+' : '';

  return (
    <div className="glass-card" style={{
      borderRadius: 'var(--r-md)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ color: 'var(--text-2)', fontSize: '14px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text-1)' }}>
          {value}
        </span>
        {unit && <span style={{ color: 'var(--text-3)', fontSize: '14px' }}>{unit}</span>}
      </div>
      {delta !== undefined && delta !== null && (
        <div style={{ color: deltaColor, fontSize: '14px', fontWeight: '500' }}>
          {sign}{delta}% from last month
        </div>
      )}
    </div>
  );
}
