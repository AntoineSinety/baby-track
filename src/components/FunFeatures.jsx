import React, { useMemo, useState } from 'react';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import './FunFeatures.css';

const FunFeatures = ({ events }) => {
  const [selectedParent, setSelectedParent] = useState('both'); // 'papa', 'mama', 'both'

  const funStats = useMemo(() => {
    const totalDiapers = events.filter(e => e.type === 'diaper').length;
    const totalFeedings = events.filter(e => e.type === 'feeding').length;

    // Calculer les durées totales d'allaitement
    const totalFeedingMinutes = events
      .filter(e => e.type === 'feeding')
      .reduce((sum, e) => sum + parseInt(e.duration || e.customDuration || 0), 0);

    // Compter les couches par type
    const peeCount = events.filter(e => e.type === 'diaper' && e.diaperType === 'pee').length;
    const poopCount = events.filter(e => e.type === 'diaper' && e.diaperType === 'poop').length;
    const bothCount = events.filter(e => e.type === 'diaper' && e.diaperType === 'both').length;

    // Sein préféré
    const leftBreastCount = events.filter(e => e.type === 'feeding' && e.breast === 'left').length;
    const rightBreastCount = events.filter(e => e.type === 'feeding' && e.breast === 'right').length;
    const favoriteBreast = leftBreastCount > rightBreastCount ? 'gauche' :
                          rightBreastCount > leftBreastCount ? 'droit' : 'les deux équitablement';

    // Calculer le temps depuis le premier événement
    const firstEvent = events[events.length - 1];
    const daysSinceStart = firstEvent ? differenceInDays(new Date(), new Date(firstEvent.createdAt)) : 0;

    return {
      totalDiapers,
      totalFeedings,
      totalFeedingMinutes,
      totalFeedingHours: Math.floor(totalFeedingMinutes / 60),
      peeCount,
      poopCount,
      bothCount,
      favoriteBreast,
      leftBreastCount,
      rightBreastCount,
      daysSinceStart,
      avgDiapersPerDay: daysSinceStart > 0 ? (totalDiapers / daysSinceStart).toFixed(1) : 0,
      avgFeedingsPerDay: daysSinceStart > 0 ? (totalFeedings / daysSinceStart).toFixed(1) : 0,
    };
  }, [events]);

  const generateHumorousReport = () => {
    const reports = [
      `🎊 Félicitations ! Vous avez changé ${funStats.totalDiapers} couches. C'est presque un sport olympique !`,
      `🏆 Record personnel : ${funStats.totalFeedingHours}h${funStats.totalFeedingMinutes % 60}min passées en allaitement. Vous méritez une médaille !`,
      `💩 ${funStats.poopCount} cacas enregistrés. La dignité est surestimée de toute façon.`,
      `🍼 Sein ${funStats.favoriteBreast} en tête ! L'autre jalouse peut-être ?`,
      `📊 En moyenne ${funStats.avgDiapersPerDay} couches par jour. Votre stock tient le coup ?`,
      `🎯 ${funStats.peeCount} pipis comptabilisés avec précision militaire !`,
      `⏰ ${funStats.daysSinceStart} jours de survie. Vous êtes un champion !`,
      `🌟 ${funStats.totalFeedings} allaitements réussis. Bébé vous dit merci (à sa façon) !`,
    ];

    // Ajouter des rapports conditionnels
    if (funStats.leftBreastCount === funStats.rightBreastCount && funStats.leftBreastCount > 0) {
      reports.push(`⚖️ Parfait équilibre gauche-droit ! Thanos serait fier.`);
    }

    if (funStats.totalDiapers > 100) {
      reports.push(`🎖️ Club des 100 couches débloqué ! Prochaine étape : 500 !`);
    }

    if (funStats.totalDiapers > 500) {
      reports.push(`👑 Maître des couches ! ${funStats.totalDiapers} couches changées !`);
    }

    if (funStats.totalFeedingHours > 24) {
      reports.push(`🕐 Plus de 24h d'allaitement cumulées ! C'est une journée entière !`);
    }

    if (funStats.bothCount > 20) {
      reports.push(`💥 ${funStats.bothCount} fois le combo pipi+caca. La totale !`);
    }

    return reports;
  };

  const humorousReports = generateHumorousReport();

  // Achievements/Badges
  const achievements = [];
  if (funStats.totalDiapers >= 50) achievements.push({ icon: '🥉', title: 'Bronze', desc: '50 couches' });
  if (funStats.totalDiapers >= 100) achievements.push({ icon: '🥈', title: 'Argent', desc: '100 couches' });
  if (funStats.totalDiapers >= 500) achievements.push({ icon: '🥇', title: 'Or', desc: '500 couches' });
  if (funStats.totalFeedingHours >= 10) achievements.push({ icon: '🍼', title: 'Allaitement Pro', desc: '10h+' });
  if (funStats.totalFeedingHours >= 24) achievements.push({ icon: '⭐', title: 'Allaitement Expert', desc: '24h+' });
  if (funStats.daysSinceStart >= 7) achievements.push({ icon: '📅', title: 'Une semaine', desc: '7 jours' });
  if (funStats.daysSinceStart >= 30) achievements.push({ icon: '📆', title: 'Un mois', desc: '30 jours' });

  return (
    <div className="fun-features">
      {/* Mode Papa/Maman */}
      <section className="fun-section">
        <h3>👪 Mode Parent</h3>
        <div className="parent-mode">
          <button
            className={`parent-button ${selectedParent === 'papa' ? 'active' : ''}`}
            onClick={() => setSelectedParent('papa')}
          >
            👨 Papa
          </button>
          <button
            className={`parent-button ${selectedParent === 'mama' ? 'active' : ''}`}
            onClick={() => setSelectedParent('mama')}
          >
            👩 Maman
          </button>
          <button
            className={`parent-button ${selectedParent === 'both' ? 'active' : ''}`}
            onClick={() => setSelectedParent('both')}
          >
            👪 Les deux
          </button>
        </div>
        <p className="parent-mode-info">
          {selectedParent === 'papa' && "💪 Mode Papa activé ! Les stats sont comptées pour vous."}
          {selectedParent === 'mama' && "💕 Mode Maman activé ! Les stats sont comptées pour vous."}
          {selectedParent === 'both' && "🤝 Mode équipe activé ! On partage la charge !"}
        </p>
      </section>

      {/* Compteurs Fun */}
      <section className="fun-section">
        <h3>🎮 Compteurs Fun</h3>
        <div className="fun-counter-grid">
          <div className="fun-counter">
            <div className="fun-counter-value">{funStats.totalDiapers}</div>
            <div className="fun-counter-label">💩 Couches changées</div>
            <div className="fun-counter-sublabel">
              {funStats.avgDiapersPerDay}/jour en moyenne
            </div>
          </div>

          <div className="fun-counter">
            <div className="fun-counter-value">{funStats.totalFeedingHours}h {funStats.totalFeedingMinutes % 60}m</div>
            <div className="fun-counter-label">🍼 Temps d'allaitement</div>
            <div className="fun-counter-sublabel">
              {funStats.totalFeedings} sessions au total
            </div>
          </div>

          <div className="fun-counter">
            <div className="fun-counter-value">{funStats.daysSinceStart}</div>
            <div className="fun-counter-label">📅 Jours de survie</div>
            <div className="fun-counter-sublabel">
              Vous êtes un héros !
            </div>
          </div>

          <div className="fun-counter">
            <div className="fun-counter-value">
              {funStats.leftBreastCount} / {funStats.rightBreastCount}
            </div>
            <div className="fun-counter-label">⚖️ Gauche / Droit</div>
            <div className="fun-counter-sublabel">
              Préférence : {funStats.favoriteBreast}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="fun-section">
          <h3>🏆 Succès débloqués</h3>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-desc">{achievement.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rapport Humoristique */}
      <section className="fun-section">
        <h3>😄 Rapport Humoristique</h3>
        <div className="humorous-report">
          {humorousReports.map((report, index) => (
            <div key={index} className="report-item">
              {report}
            </div>
          ))}
        </div>
      </section>

      {/* Records */}
      <section className="fun-section">
        <h3>📊 Records Personnels</h3>
        <div className="records-grid">
          <div className="record-card">
            <div className="record-icon">💧</div>
            <div className="record-value">{funStats.peeCount}</div>
            <div className="record-label">Pipis</div>
          </div>
          <div className="record-card">
            <div className="record-icon">💩</div>
            <div className="record-value">{funStats.poopCount}</div>
            <div className="record-label">Cacas</div>
          </div>
          <div className="record-card">
            <div className="record-icon">💥</div>
            <div className="record-value">{funStats.bothCount}</div>
            <div className="record-label">Combo</div>
          </div>
        </div>
      </section>

      {events.length === 0 && (
        <div className="no-fun-data">
          <div className="no-fun-icon">🎮</div>
          <p>Commencez à enregistrer des événements pour débloquer les fonctionnalités fun !</p>
        </div>
      )}
    </div>
  );
};

export default FunFeatures;
