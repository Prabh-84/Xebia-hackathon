import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { theme } from '../../styles/chartTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CostCarbonChart({ data }) {
  if (!data || !data.labels) return null;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Cost (USD)',
        data: data.costs,
        backgroundColor: theme.cost.backgroundColor,
        yAxisID: 'y'
      },
      {
        label: 'CO2e (kg)',
        data: data.carbon,
        backgroundColor: theme.carbon.backgroundColor,
        yAxisID: 'y1'
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
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: theme.grid.color },
        ticks: { color: theme.tick.color, font: theme.tick.font }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
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
      height: '350px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ color: 'var(--text-1)', fontSize: '16px', marginBottom: '16px' }}>Cost vs Carbon by Project</h3>
      <div style={{ flex: 1, position: 'relative' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
