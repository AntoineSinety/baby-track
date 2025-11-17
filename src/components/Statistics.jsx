import React, { useMemo } from 'react';
import {
  startOfDay,
  startOfWeek,
  endOfDay,
  endOfWeek,
  isWithinInterval
} from 'date-fns';
import Charts from './Charts';
import './Statistics.css';

const Statistics = ({ events }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const todayEvents = events.filter(event =>
      isWithinInterval(new Date(event.createdAt), { start: todayStart, end: todayEnd })
    );

    const weekEvents = events.filter(event =>
      isWithinInterval(new Date(event.createdAt), { start: weekStart, end: weekEnd })
    );

    return {
      today: {
        feedings: todayEvents.filter(e => e.type === 'feeding').length,
        diapers: todayEvents.filter(e => e.type === 'diaper').length,
        pee: todayEvents.filter(e => e.type === 'diaper' && (e.diaperType === 'pee' || e.diaperType === 'both')).length,
        poop: todayEvents.filter(e => e.type === 'diaper' && (e.diaperType === 'poop' || e.diaperType === 'both')).length,
      },
      week: {
        feedings: weekEvents.filter(e => e.type === 'feeding').length,
        diapers: weekEvents.filter(e => e.type === 'diaper').length,
        pee: weekEvents.filter(e => e.type === 'diaper' && (e.diaperType === 'pee' || e.diaperType === 'both')).length,
        poop: weekEvents.filter(e => e.type === 'diaper' && (e.diaperType === 'poop' || e.diaperType === 'both')).length,
      },
      total: {
        feedings: events.filter(e => e.type === 'feeding').length,
        diapers: events.filter(e => e.type === 'diaper').length,
      }
    };
  }, [events]);

  const StatCard = ({ title, icon, value, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  );

  return (
    <div className="statistics">
      <section className="stat-section">
        <h3>📅 Aujourd'hui</h3>
        <div className="stat-grid">
          <StatCard
            title="Allaitements"
            icon="🍼"
            value={stats.today.feedings}
            color="blue"
          />
          <StatCard
            title="Couches"
            icon="👶"
            value={stats.today.diapers}
            color="green"
          />
          <StatCard
            title="Pipi"
            icon="💧"
            value={stats.today.pee}
            color="cyan"
          />
          <StatCard
            title="Caca"
            icon="💩"
            value={stats.today.poop}
            color="orange"
          />
        </div>
      </section>

      <section className="stat-section">
        <h3>📊 Cette semaine</h3>
        <div className="stat-grid">
          <StatCard
            title="Allaitements"
            icon="🍼"
            value={stats.week.feedings}
            color="blue"
          />
          <StatCard
            title="Couches"
            icon="👶"
            value={stats.week.diapers}
            color="green"
          />
          <StatCard
            title="Pipi"
            icon="💧"
            value={stats.week.pee}
            color="cyan"
          />
          <StatCard
            title="Caca"
            icon="💩"
            value={stats.week.poop}
            color="orange"
          />
        </div>
      </section>

      <section className="stat-section">
        <h3>🎯 Total</h3>
        <div className="stat-grid">
          <StatCard
            title="Allaitements"
            icon="🍼"
            value={stats.total.feedings}
            color="blue"
          />
          <StatCard
            title="Couches"
            icon="👶"
            value={stats.total.diapers}
            color="green"
          />
        </div>
      </section>

      {events.length > 0 && (
        <section className="stat-section">
          <h3>📈 Graphiques</h3>
          <Charts events={events} />
        </section>
      )}

      {events.length === 0 && (
        <div className="no-stats">
          <div className="no-stats-icon">📊</div>
          <p>Commencez à enregistrer des événements pour voir vos statistiques</p>
        </div>
      )}
    </div>
  );
};

export default Statistics;
