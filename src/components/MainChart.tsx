'use client';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface MainChartProps {
  labels: string[]; 
  dataValues: number[];
  metricLabel: string;
  specialDates: string[];
}

export default function MainChart({ labels, dataValues, metricLabel, specialDates }: MainChartProps) {
  
  // Fonction interne de détection des week-ends
  const isWeekend = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay(); 
    return day === 0 || day === 6; // 0 = Dimanche, 6 = Samedi
  };

  const data = {
    labels,
    datasets: [
      {
        label: metricLabel,
        data: dataValues,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        tension: 0.15,
        pointRadius: 5,
        pointHitRadius: 12,
        pointBackgroundColor: labels.map(date => specialDates.includes(date) ? '#ef4444' : '#2563eb'),
        pointBorderColor: labels.map(date => specialDates.includes(date) ? '#ef4444' : '#2563eb'),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const date = context[0].label;
            return isWeekend(date) ? `🗓️ ${date} (WEEK-END)` : `📅 ${date}`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: {
          color: (context: any) => {
            if (context.index === undefined || context.index < 0) return 'rgba(0, 0, 0, 0.04)';
            const dateStr = labels[context.index];
            
            if (specialDates.includes(dateStr)) return 'rgba(239, 68, 68, 0.7)'; // Rouge pour jour spécial (offre)
            if (isWeekend(dateStr)) return 'rgba(148, 163, 184, 0.25)'; // Couleur distinctive de fond pour les week-ends
            
            return 'rgba(0, 0, 0, 0.04)';
          },
          lineWidth: (context: any) => {
            if (context.index === undefined || context.index < 0) return 1;
            const dateStr = labels[context.index];
            
            if (specialDates.includes(dateStr)) return 3;  // Ligne fine et verticale pour marquer le jour spécial
            if (isWeekend(dateStr)) return 8; // Ligne large couvrant graphiquement l'espace du week-end
            
            return 1;
          }
        },
        ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[480px]">
      <Line options={options} data={data} />
    </div>
  );
}