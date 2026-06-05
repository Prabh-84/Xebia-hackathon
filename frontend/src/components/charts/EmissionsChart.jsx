import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { theme } from '../../styles/chartTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function EmissionsChart({ data }) {
  if (!data || !data.labels || !data.values) {
    return null;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Monthly CO2e (kg)',
        data: data.values,
        borderColor: theme.historical.borderColor,
        backgroundColor: theme.historical.backgroundColor,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: theme.historical.borderColor,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: getComputedStyle(document.body).getPropertyValue('--text-2').trim() || '#86efac',
          font: { family: "'DM Mono', monospace" }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 26, 18, 0.9)',
        titleColor: '#f0fdf4',
        bodyColor: '#86efac',
        borderColor: 'rgba(34,197,94,0.25)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: theme.grid.color },
        ticks: { color: theme.tick.color, font: theme.tick.font }
      },
      y: {
        grid: { color: theme.grid.color },
        ticks: { color: theme.tick.color, font: theme.tick.font }
      }
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: '20px 24px',
      height: '300px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ color: 'var(--text-1)', fontSize: '16px', marginBottom: '16px' }}>Emissions Overview</h3>
      <div style={{ flex: 1, position: 'relative' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
