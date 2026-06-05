export default function Skeleton({ width = '100%', height = '100px', borderRadius = 'var(--r-md)' }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--bg-card) 25%, var(--bg-raised) 50%, var(--bg-card) 75%)',
        backgroundSize: '200% 100%',
        animation: 'pulse 1.5s infinite linear',
      }}
    />
  );
}
