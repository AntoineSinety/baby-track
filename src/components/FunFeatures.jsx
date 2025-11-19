import React, { useMemo } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import './FunFeatures.css';

const FunFeatures = ({ events }) => {
  const funStats = useMemo(() => {
    const feedingEvents = events.filter(e => e.type === 'feeding');
    const diaperEvents = events.filter(e => e.type === 'diaper');
    const bathEvents = events.filter(e => e.type === 'bath');

    // Durées totales d'allaitement
    const totalFeedingMinutes = feedingEvents.reduce(
      (sum, e) => sum + parseInt(e.duration || e.customDuration || 0), 0
    );

    // Nombre de couches par type
    const peeCount = diaperEvents.filter(e => e.diaperType === 'pee' || e.diaperType === 'both').length;
    const poopCount = diaperEvents.filter(e => e.diaperType === 'poop' || e.diaperType === 'both').length;

    // Sein préféré
    const leftCount = feedingEvents.filter(e => e.breast === 'left').length;
    const rightCount = feedingEvents.filter(e => e.breast === 'right').length;

    // Temps depuis le premier événement
    const firstEvent = events[events.length - 1];
    const daysSinceStart = firstEvent ? differenceInDays(new Date(), new Date(firstEvent.createdAt)) : 0;

    // Calculs "fun"
    const totalDiapers = diaperEvents.length;
    const diaperCost = (totalDiapers * 0.25).toFixed(2); // ~0,25€ par couche
    const milkInLiters = ((totalFeedingMinutes / 30) * 0.15).toFixed(1); // ~150ml toutes les 30min
    const coffeeEquivalent = Math.round((daysSinceStart || 1) * 3); // 3 cafés par jour en moyenne
    const sleepLostHours = Math.round((totalDiapers + feedingEvents.length) * 0.5); // 30min par événement nocturne estimé

    // Trouvaille de l'heure la plus populaire
    const hourCounts = {};
    events.forEach(e => {
      const hour = new Date(e.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const busiestHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

    // Record de rapidité entre deux couches
    let minTimeBetweenDiapers = Infinity;
    for (let i = 0; i < diaperEvents.length - 1; i++) {
      const diff = differenceInMinutes(
        new Date(diaperEvents[i].createdAt),
        new Date(diaperEvents[i + 1].createdAt)
      );
      if (diff < minTimeBetweenDiapers && diff > 0) {
        minTimeBetweenDiapers = diff;
      }
    }

    return {
      // Basiques
      totalDiapers,
      totalFeedings: feedingEvents.length,
      totalBaths: bathEvents.length,
      totalFeedingHours: Math.floor(totalFeedingMinutes / 60),
      totalFeedingMinutes: totalFeedingMinutes % 60,
      peeCount,
      poopCount,
      leftCount,
      rightCount,
      daysSinceStart: daysSinceStart || 1,

      // Fun
      diaperCost,
      milkInLiters,
      coffeeEquivalent,
      sleepLostHours,
      busiestHour: busiestHour ? `${busiestHour[0]}h` : '—',
      recordSpeed: minTimeBetweenDiapers !== Infinity ? minTimeBetweenDiapers : 0,

      // Équivalences
      coffeeCansBought: Math.round(parseFloat(diaperCost) / 3), // prix moyen café
      netflixEpisodes: Math.round(totalFeedingMinutes / 45), // épisode = 45min
      songsListened: Math.round(totalFeedingMinutes / 3), // chanson = 3min
    };
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="fun-features">
        <div className="fun-empty">
          <div className="fun-empty-icon">🎮</div>
          <h3>Rien à voir ici... encore !</h3>
          <p>Commencez à enregistrer des événements pour débloquer les statistiques inutiles mais amusantes !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fun-features">
      {/* En-tête Fun */}
      <div className="fun-header">
        <h2>🎉 Statistiques Complètement Inutiles</h2>
        <p className="fun-subtitle">Parce que tout mérite d'être mesuré, même l'absurde</p>
      </div>

      {/* Méga compteurs */}
      <section className="fun-mega-counters">
        <div className="mega-counter purple">
          <div className="mega-counter-icon">💰</div>
          <div className="mega-counter-value">{funStats.diaperCost}€</div>
          <div className="mega-counter-label">Dépensés en couches</div>
          <div className="mega-counter-sub">Soit {funStats.coffeeCansBought} cafés non bus</div>
        </div>

        <div className="mega-counter pink">
          <div className="mega-counter-icon">🥛</div>
          <div className="mega-counter-value">{funStats.milkInLiters}L</div>
          <div className="mega-counter-label">Lait produit (estimé)</div>
          <div className="mega-counter-sub">Environ {funStats.netflixEpisodes} épisodes Netflix</div>
        </div>

        <div className="mega-counter cyan">
          <div className="mega-counter-icon">☕</div>
          <div className="mega-counter-value">{funStats.coffeeEquivalent}</div>
          <div className="mega-counter-label">Cafés nécessaires</div>
          <div className="mega-counter-sub">Pour tenir jusqu'ici</div>
        </div>

        <div className="mega-counter green">
          <div className="mega-counter-icon">😴</div>
          <div className="mega-counter-value">{funStats.sleepLostHours}h</div>
          <div className="mega-counter-label">Sommeil perdu</div>
          <div className="mega-counter-sub">Estimation très optimiste</div>
        </div>
      </section>

      {/* Records & Faits */}
      <section className="fun-section">
        <h3>🏆 Records & Faits Marquants</h3>
        <div className="fun-facts-grid">
          <div className="fun-fact">
            <div className="fun-fact-icon">⏱️</div>
            <div className="fun-fact-title">Record de rapidité</div>
            <div className="fun-fact-value">
              {funStats.recordSpeed > 0 ? `${funStats.recordSpeed} minutes` : 'Aucun encore'}
            </div>
            <div className="fun-fact-desc">Entre deux couches</div>
          </div>

          <div className="fun-fact">
            <div className="fun-fact-icon">🕐</div>
            <div className="fun-fact-title">Heure de pointe</div>
            <div className="fun-fact-value">{funStats.busiestHour}</div>
            <div className="fun-fact-desc">L'heure la plus chargée</div>
          </div>

          <div className="fun-fact">
            <div className="fun-fact-icon">🎵</div>
            <div className="fun-fact-title">Playlist équivalente</div>
            <div className="fun-fact-value">{funStats.songsListened} chansons</div>
            <div className="fun-fact-desc">Pendant les allaitements</div>
          </div>

          <div className="fun-fact">
            <div className="fun-fact-icon">⚖️</div>
            <div className="fun-fact-title">Battle Gauche vs Droit</div>
            <div className="fun-fact-value">
              {funStats.leftCount === funStats.rightCount
                ? '🤝 Égalité parfaite !'
                : funStats.leftCount > funStats.rightCount
                  ? `⬅️ Gauche mène ${funStats.leftCount}-${funStats.rightCount}`
                  : `➡️ Droit mène ${funStats.rightCount}-${funStats.leftCount}`
              }
            </div>
            <div className="fun-fact-desc">Score actuel</div>
          </div>
        </div>
      </section>

      {/* Comparaisons absurdes */}
      <section className="fun-section">
        <h3>🤯 Mises en Perspective Absurdes</h3>
        <div className="absurd-comparisons">
          <div className="comparison-item">
            <span className="comparison-emoji">🚽</span>
            <span className="comparison-text">
              <strong>{funStats.totalDiapers} couches</strong> = {(funStats.totalDiapers * 0.2).toFixed(0)}kg de déchets
              <span className="comparison-note">Poids d'un bébé de 6 mois environ</span>
            </span>
          </div>

          <div className="comparison-item">
            <span className="comparison-emoji">🍼</span>
            <span className="comparison-text">
              <strong>{funStats.totalFeedingHours}h {funStats.totalFeedingMinutes}min d'allaitement</strong> = {funStats.netflixEpisodes} épisodes de série
              <span className="comparison-note">Ou une saison complète</span>
            </span>
          </div>

          <div className="comparison-item">
            <span className="comparison-emoji">💸</span>
            <span className="comparison-text">
              <strong>{funStats.diaperCost}€ en couches</strong> = {Math.round(parseFloat(funStats.diaperCost) / 10)} restaurants
              <span className="comparison-note">Ou {funStats.coffeeCansBought} cafés en terrasse</span>
            </span>
          </div>

          <div className="comparison-item">
            <span className="comparison-emoji">🏋️</span>
            <span className="comparison-text">
              <strong>{funStats.totalDiapers} changements</strong> = {(funStats.totalDiapers * 3).toFixed(0)} squats
              <span className="comparison-note">Vous êtes un athlète olympique</span>
            </span>
          </div>

          <div className="comparison-item">
            <span className="comparison-emoji">💦</span>
            <span className="comparison-text">
              <strong>{funStats.peeCount} pipis</strong> détectés avec une précision militaire
              <span className="comparison-note">Médaille de reconnaissance imminente</span>
            </span>
          </div>
        </div>
      </section>

      {/* Barre de progression survie */}
      <section className="fun-section">
        <h3>📊 Progression de Survie</h3>
        <div className="survival-stats">
          <div className="survival-item">
            <div className="survival-header">
              <span className="survival-label">Jours de service</span>
              <span className="survival-value">{funStats.daysSinceStart} jours</span>
            </div>
            <div className="survival-bar">
              <div className="survival-fill" style={{ width: `${Math.min((funStats.daysSinceStart / 365) * 100, 100)}%` }}></div>
            </div>
            <div className="survival-note">Objectif : 365 jours (1 an)</div>
          </div>

          <div className="survival-item">
            <div className="survival-header">
              <span className="survival-label">Couches changées</span>
              <span className="survival-value">{funStats.totalDiapers}</span>
            </div>
            <div className="survival-bar">
              <div className="survival-fill pink" style={{ width: `${Math.min((funStats.totalDiapers / 1000) * 100, 100)}%` }}></div>
            </div>
            <div className="survival-note">Objectif : 1000 couches (niveau master)</div>
          </div>

          <div className="survival-item">
            <div className="survival-header">
              <span className="survival-label">Heures d'allaitement</span>
              <span className="survival-value">{funStats.totalFeedingHours}h</span>
            </div>
            <div className="survival-bar">
              <div className="survival-fill cyan" style={{ width: `${Math.min((funStats.totalFeedingHours / 100) * 100, 100)}%` }}></div>
            </div>
            <div className="survival-note">Objectif : 100h (marathonien)</div>
          </div>
        </div>
      </section>

      {/* Message motivant */}
      <div className="fun-motivation">
        <div className="motivation-icon">⭐</div>
        <h3>Vous êtes une légende !</h3>
        <p>
          {funStats.daysSinceStart < 7 && "Première semaine : terrain de découverte. Courage !"}
          {funStats.daysSinceStart >= 7 && funStats.daysSinceStart < 30 && "Vous commencez à comprendre le truc. Respect !"}
          {funStats.daysSinceStart >= 30 && funStats.daysSinceStart < 90 && "Un mois ! Vous êtes officiellement un parent chevronné."}
          {funStats.daysSinceStart >= 90 && "Champion du monde confirmé. Félicitations ! 🏆"}
        </p>
      </div>
    </div>
  );
};

export default FunFeatures;
