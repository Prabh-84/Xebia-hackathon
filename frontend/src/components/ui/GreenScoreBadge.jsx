export const scoreMap = {
  A: { bg: '#14532d', color: '#4ade80', label: 'Excellent' },
  B: { bg: '#166534', color: '#86efac', label: 'Good'      },
  C: { bg: '#713f12', color: '#fcd34d', label: 'Moderate'  },
  D: { bg: '#7c2d12', color: '#fdba74', label: 'Poor'      },
  F: { bg: '#7f1d1d', color: '#fca5a5', label: 'Critical'  },
};

export default function GreenScoreBadge({ score }) {
  const mapping = scoreMap[score] || scoreMap['C'];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: mapping.bg,
      color: mapping.color,
      padding: '4px 12px',
      borderRadius: '999px',
      fontSize: '14px',
      fontWeight: '600',
      border: `1px solid ${mapping.color}40`
    }}>
      <span>{score}</span>
      <span style={{ opacity: 0.8, fontWeight: '400' }}>{mapping.label}</span>
    </div>
  );
}
