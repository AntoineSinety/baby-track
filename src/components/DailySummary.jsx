import React, { useMemo } from 'react';
import { startOfDay, endOfDay, isWithinInterval, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import './DailySummary.css';

const DailySummary = ({ events }) => {
  const todayStats = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const todayEvents = events.filter(event =>
      isWithinInterval(new Date(event.createdAt), { start: todayStart, end: todayEnd })
    );

    const feedings = todayEvents.filter(e => e.type === 'feeding');
    const diapers = todayEvents.filter(e => e.type === 'diaper');

    const lastFeeding = feedings[0];
    const lastDiaper = diapers[0];

    // Calculer la durée moyenne des allaitements
    const avgDuration = feedings.length > 0
      ? Math.round(
          feedings
            .map(f => f.duration || parseInt(f.customDuration) || 0)
            .filter(d => d > 0)
            .reduce((sum, d) => sum + d, 0) / feedings.filter(f => f.duration || f.customDuration).length
        )
      : 0;

    return {
      feedingsCount: feedings.length,
      diapersCount: diapers.length,
      lastFeeding,
      lastDiaper,
      avgDuration
    };
  }, [events]);

  return (
    <div className="daily-summary">
      <div className="summary-header">
        <h3>📅 Aujourd'hui</h3>
      </div>

      <div className="summary-grid">
        <div className="summary-card feedings">
          <div className="summary-icon">🍼</div>
          <div className="summary-content">
            <div className="summary-count">{todayStats.feedingsCount}</div>
            <div className="summary-label">Allaitements</div>
            {todayStats.avgDuration > 0 && (
              <div className="summary-detail">Moy. {todayStats.avgDuration} min</div>
            )}
          </div>
        </div>

        <div className="summary-card diapers">
          <div className="summary-icon">👶</div>
          <div className="summary-content">
            <div className="summary-count">{todayStats.diapersCount}</div>
            <div className="summary-label">Couches</div>
            {todayStats.lastDiaper && (
              <div className="summary-detail">
                Dernier{' '}
                {formatDistanceToNow(new Date(todayStats.lastDiaper.createdAt), {
                  addSuffix: true,
                  locale: fr
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {todayStats.lastFeeding && (
        <div className="last-feeding-info">
          <span className="info-icon">🍼</span>
          <span className="info-text">
            Dernier allaitement{' '}
            {formatDistanceToNow(new Date(todayStats.lastFeeding.createdAt), {
              addSuffix: true,
              locale: fr
            })}
            {todayStats.lastFeeding.breast && (
              <span className="breast-indicator">
                {' '}• {todayStats.lastFeeding.breast === 'left' ? 'Gauche' : 'Droit'}
              </span>
            )}
          </span>
        </div>
      )}

      {todayStats.feedingsCount === 0 && todayStats.diapersCount === 0 && (
        <div className="no-activity">
          <div className="no-activity-icon">💤</div>
          <p>Aucune activité enregistrée aujourd'hui</p>
        </div>
      )}
    </div>
  );
};

export default DailySummary;
