import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import './Charts.css';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Charts = ({ events }) => {
  // Calculer les données pour les 7 derniers jours
  const last7DaysData = useMemo(() => {
    const days = [];
    const feedingCounts = [];
    const diaperCounts = [];
    const avgDurations = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const dayEvents = events.filter(event =>
        isWithinInterval(new Date(event.createdAt), { start: dayStart, end: dayEnd })
      );

      const feedingEvents = dayEvents.filter(e => e.type === 'feeding');
      const diaperEvents = dayEvents.filter(e => e.type === 'diaper');

      // Calculer la durée moyenne d'allaitement
      const durations = feedingEvents
        .map(e => parseInt(e.duration || e.customDuration || 0))
        .filter(d => d > 0);
      const avgDuration = durations.length > 0
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length
        : 0;

      days.push(format(date, 'EEE', { locale: fr }));
      feedingCounts.push(feedingEvents.length);
      diaperCounts.push(diaperEvents.length);
      avgDurations.push(Math.round(avgDuration));
    }

    return { days, feedingCounts, diaperCounts, avgDurations };
  }, [events]);

  // Calculer les données pour le graphique de répartition des couches
  const diaperTypeData = useMemo(() => {
    const peeCount = events.filter(e => e.type === 'diaper' && e.diaperType === 'pee').length;
    const poopCount = events.filter(e => e.type === 'diaper' && e.diaperType === 'poop').length;
    const bothCount = events.filter(e => e.type === 'diaper' && e.diaperType === 'both').length;

    return { peeCount, poopCount, bothCount };
  }, [events]);

  // Calculer les données pour le graphique de répartition des seins
  const breastData = useMemo(() => {
    const leftCount = events.filter(e => e.type === 'feeding' && e.breast === 'left').length;
    const rightCount = events.filter(e => e.type === 'feeding' && e.breast === 'right').length;

    return { leftCount, rightCount };
  }, [events]);

  // Configuration du graphique des événements quotidiens
  const dailyEventsData = {
    labels: last7DaysData.days,
    datasets: [
      {
        label: 'Allaitements',
        data: last7DaysData.feedingCounts,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Couches',
        data: last7DaysData.diaperCounts,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Configuration du graphique des durées moyennes
  const avgDurationData = {
    labels: last7DaysData.days,
    datasets: [
      {
        label: 'Durée moyenne (min)',
        data: last7DaysData.avgDurations,
        backgroundColor: '#3b82f6',
      },
    ],
  };

  // Configuration du graphique de répartition des couches
  const diaperDistributionData = {
    labels: ['Pipi', 'Caca', 'Les deux'],
    datasets: [
      {
        data: [diaperTypeData.peeCount, diaperTypeData.poopCount, diaperTypeData.bothCount],
        backgroundColor: ['#60a5fa', '#f59e0b', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  // Configuration du graphique de répartition des seins
  const breastDistributionData = {
    labels: ['Sein gauche', 'Sein droit'],
    datasets: [
      {
        data: [breastData.leftCount, breastData.rightCount],
        backgroundColor: ['#3b82f6', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-primary)',
          font: {
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'var(--text-secondary)',
          stepSize: 1,
        },
        grid: {
          color: 'var(--border-color)',
        },
      },
      x: {
        ticks: {
          color: 'var(--text-secondary)',
        },
        grid: {
          color: 'var(--border-color)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-primary)',
          font: {
            family: 'Inter, system-ui, sans-serif',
          },
          padding: 15,
        },
      },
    },
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3 className="chart-title">Événements quotidiens (7 derniers jours)</h3>
        <div className="chart-wrapper">
          <Line data={dailyEventsData} options={chartOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Durée moyenne d'allaitement (7 derniers jours)</h3>
        <div className="chart-wrapper">
          <Bar data={avgDurationData} options={chartOptions} />
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card chart-small">
          <h3 className="chart-title">Répartition des couches</h3>
          <div className="chart-wrapper">
            <Doughnut data={diaperDistributionData} options={doughnutOptions} />
          </div>
        </div>

        <div className="chart-card chart-small">
          <h3 className="chart-title">Répartition des seins</h3>
          <div className="chart-wrapper">
            <Doughnut data={breastDistributionData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
