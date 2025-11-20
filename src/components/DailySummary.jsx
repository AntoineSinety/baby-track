import React, { useMemo } from 'react';
import { startOfDay, endOfDay, isWithinInterval, formatDistanceToNow, format, differenceInDays } from 'date-fns';
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
    const baths = todayEvents.filter(e => e.type === 'bath');
    const care = todayEvents.filter(e => e.type === 'care');

    // Trouver le dernier bain (pas forcément aujourd'hui)
    const allBaths = events.filter(e => e.type === 'bath');
    const lastBath = allBaths.length > 0 ? allBaths[0] : null;

    // Obtenir le statut des soins d'aujourd'hui
    const todayCareStatus = {
      eyes: false,
      nose: false,
      vitaminD: false
    };

    care.forEach(careEvent => {
      if (careEvent.careItems) {
        if (careEvent.careItems.eyes) todayCareStatus.eyes = true;
        if (careEvent.careItems.nose) todayCareStatus.nose = true;
        if (careEvent.careItems.vitaminD) todayCareStatus.vitaminD = true;
      }
    });

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
      bathsCount: baths.length,
      careCount: care.length,
      careStatus: todayCareStatus,
      lastFeeding,
      lastDiaper,
      lastBath,
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

        <div className="summary-card care">
          <div className="summary-icon">💊</div>
          <div className="summary-content">
            <div className="summary-label">Soins du jour</div>
            <div className="care-status">
              <span className="care-item-status">
                {todayStats.careStatus.eyes ? '✅' : '⬜'} Yeux
              </span>
              <span className="care-item-status">
                {todayStats.careStatus.nose ? '✅' : '⬜'} Nez
              </span>
              <span className="care-item-status">
                {todayStats.careStatus.vitaminD ? '✅' : '⬜'} Vitamine D
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="summary-bottom">
        {todayStats.lastFeeding && (
          <div className="last-feeding-info">
            <span className="info-icon">🍼</span>
            <span className="info-text">
              Dernier allaitement
              {todayStats.lastFeeding.breast && (
                <span className="breast-indicator">
                  {todayStats.lastFeeding.breast === 'left' ? ' ⬅️ Sein gauche' : ' ➡️ Sein droit'}
                </span>
              )}
              {' '}
              {formatDistanceToNow(new Date(todayStats.lastFeeding.createdAt), {
                addSuffix: true,
                locale: fr
              })}
            </span>
          </div>
        )}

        <div className="last-bath-info">
          <span className="bath-icon-small">🛁</span>
          <div className="bath-info-content">
            <span className="bath-info-label">Dernier bain</span>
            {todayStats.lastBath ? (
              <span className="bath-info-text">
                {format(new Date(todayStats.lastBath.createdAt), 'd MMM', { locale: fr })} • {differenceInDays(new Date(), new Date(todayStats.lastBath.createdAt))} jour{differenceInDays(new Date(), new Date(todayStats.lastBath.createdAt)) > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="bath-info-text">Aucun</span>
            )}
          </div>
        </div>
      </div>

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
