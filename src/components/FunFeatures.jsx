import React, { useMemo } from 'react';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { useBaby } from '../context/BabyContext';
import './FunFeatures.css';

const FunFeatures = ({ events }) => {
  const { activeBaby } = useBaby();

  const stats = useMemo(() => {
    if (!activeBaby || !activeBaby.birthDate) {
      return null;
    }

    const feedingEvents = events.filter(e => e.type === 'feeding');
    const diaperEvents = events.filter(e => e.type === 'diaper');

    // Âge du bébé
    const birthDate = new Date(activeBaby.birthDate);
    const now = new Date();
    const ageInDays = differenceInDays(now, birthDate);
    const ageInMonths = differenceInMonths(now, birthDate);

    // Moyennes journalières
    const trackingDays = Math.max(ageInDays, 1);
    const avgDiapersPerDay = (diaperEvents.length / trackingDays).toFixed(1);
    const avgFeedingsPerDay = (feedingEvents.length / trackingDays).toFixed(1);

    // Données de référence selon l'âge
    const getAgeInsights = () => {
      if (ageInDays < 7) {
        return {
          period: 'Nouveau-né (0-7 jours)',
          expectedDiapers: '8-12',
          expectedFeedings: '8-12',
          insights: [
            'Les nouveau-nés ont besoin de manger toutes les 2-3 heures',
            'Au moins 6 couches mouillées par jour est un bon signe d\'hydratation',
            'Les selles peuvent être fréquentes après chaque tétée'
          ]
        };
      } else if (ageInDays < 30) {
        return {
          period: `Nouveau-né (${ageInDays} jours)`,
          expectedDiapers: '6-10',
          expectedFeedings: '8-12',
          insights: [
            'Le rythme des tétées commence à se régulariser',
            '6 à 8 couches mouillées par jour indique une bonne alimentation',
            'Les selles peuvent devenir moins fréquentes après 3-4 semaines'
          ]
        };
      } else if (ageInMonths < 2) {
        return {
          period: '1 mois',
          expectedDiapers: '5-8',
          expectedFeedings: '7-9',
          insights: [
            'Bébé commence à espacer les tétées',
            'Les pleurs diminuent généralement après 6 semaines',
            'Le sommeil peut commencer à s\'organiser par périodes plus longues'
          ]
        };
      } else if (ageInMonths < 3) {
        return {
          period: '2 mois',
          expectedDiapers: '5-8',
          expectedFeedings: '6-8',
          insights: [
            'Les sourires sociaux apparaissent',
            'Bébé peut tenir sa tête quelques instants',
            'Les périodes d\'éveil sont plus longues'
          ]
        };
      } else if (ageInMonths < 6) {
        return {
          period: `${ageInMonths} mois`,
          expectedDiapers: '5-7',
          expectedFeedings: '5-7',
          insights: [
            'Bébé commence à faire ses nuits (5-6h d\'affilée)',
            'Les tétées s\'espacent davantage',
            'Développement moteur : rouler, saisir des objets'
          ]
        };
      } else {
        return {
          period: `${ageInMonths} mois`,
          expectedDiapers: '4-6',
          expectedFeedings: '4-6',
          insights: [
            'Période de diversification alimentaire',
            'Les nuits sont généralement plus calmes',
            'Bébé devient plus autonome'
          ]
        };
      }
    };

    const ageData = getAgeInsights();

    return {
      ageInDays,
      ageInMonths,
      totalDiapers: diaperEvents.length,
      totalFeedings: feedingEvents.length,
      avgDiapersPerDay,
      avgFeedingsPerDay,
      ageData
    };
  }, [events, activeBaby]);

  if (!activeBaby || !activeBaby.birthDate) {
    return (
      <div className="fun-features">
        <div className="fun-empty">
          <div className="fun-empty-icon">👶</div>
          <h3>Date de naissance manquante</h3>
          <p>Ajoutez la date de naissance de votre bébé dans les paramètres pour voir les statistiques.</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="fun-features">
        <div className="fun-empty">
          <div className="fun-empty-icon">📊</div>
          <h3>Aucune donnée encore</h3>
          <p>Commencez à enregistrer des événements pour voir les statistiques.</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const getAgeDisplay = () => {
    if (stats.ageInDays < 30) {
      return `${stats.ageInDays} jour${stats.ageInDays > 1 ? 's' : ''}`;
    } else if (stats.ageInMonths < 1) {
      return `${stats.ageInDays} jours`;
    } else if (stats.ageInMonths === 1) {
      return '1 mois';
    } else {
      return `${stats.ageInMonths} mois`;
    }
  };

  return (
    <div className="fun-features">
      <div className="fun-header">
        <h2>👶 {activeBaby.name}</h2>
        <p className="fun-subtitle">{getAgeDisplay()}</p>
      </div>

      {/* Âge et Progression */}
      <section className="fun-section">
        <h3>📅 Progression</h3>
        <div className="age-progress">
          <div className="progress-item">
            <div className="progress-header">
              <span className="progress-label">Âge</span>
              <span className="progress-value">{getAgeDisplay()}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((stats.ageInDays / 365) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="progress-note">Période : {stats.ageData.period}</div>
          </div>
        </div>
      </section>

      {/* Statistiques principales */}
      <section className="fun-section">
        <h3>📊 Depuis le début</h3>
        <div className="main-stats">
          <div className="main-stat-card">
            <div className="stat-icon-large">👶</div>
            <div className="stat-number">{stats.totalDiapers}</div>
            <div className="stat-title">Couches changées</div>
            <div className="stat-average">
              Moyenne : {stats.avgDiapersPerDay}/jour
            </div>
          </div>

          <div className="main-stat-card">
            <div className="stat-icon-large">🍼</div>
            <div className="stat-number">{stats.totalFeedings}</div>
            <div className="stat-title">Allaitements</div>
            <div className="stat-average">
              Moyenne : {stats.avgFeedingsPerDay}/jour
            </div>
          </div>
        </div>
      </section>

      {/* Informations utiles selon l'âge */}
      <section className="fun-section">
        <h3>💡 Repères pour cet âge</h3>
        <div className="age-insights">
          {stats.ageData.insights.map((insight, index) => (
            <div key={index} className="insight-item">
              <span className="insight-bullet">•</span>
              <span className="insight-text">{insight}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FunFeatures;
