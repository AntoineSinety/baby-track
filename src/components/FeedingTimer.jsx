import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, addHours, differenceInSeconds, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './FeedingTimer.css';

const FeedingTimer = ({ lastFeeding, interval }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [nextFeedingTime, setNextFeedingTime] = useState(null);

  useEffect(() => {
    if (!lastFeeding) {
      setTimeRemaining(null);
      setNextFeedingTime(null);
      return;
    }

    const lastFeedingDate = new Date(lastFeeding.createdAt);
    const nextFeeding = addHours(lastFeedingDate, interval);
    setNextFeedingTime(nextFeeding);

    const updateTimer = () => {
      const now = new Date();
      const secondsLeft = differenceInSeconds(nextFeeding, now);
      setTimeRemaining(secondsLeft);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [lastFeeding, interval]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return { hours, minutes, seconds: secs };
  };

  const getStatusMessage = () => {
    if (!lastFeeding) {
      return 'Aucun allaitement enregistré';
    }

    if (timeRemaining === null) return 'Calcul en cours...';

    if (timeRemaining <= 0) {
      return 'Il est temps d\'allaiter !';
    }

    return 'Prochain allaitement dans';
  };

  const getStatusClass = () => {
    if (!timeRemaining) return '';
    if (timeRemaining <= 0) return 'overdue';
    if (timeRemaining <= 300) return 'warning'; // 5 minutes
    return 'normal';
  };

  const getNextBreast = () => {
    if (!lastFeeding || !lastFeeding.breast) return null;
    const emoji = lastFeeding.breast === 'left' ? '➡️' : '⬅️';
    const label = lastFeeding.breast === 'left' ? 'Sein droit' : 'Sein gauche';
    return `${emoji} ${label}`;
  };

  const time = formatTime(timeRemaining || 0);
  const isOverdue = timeRemaining !== null && timeRemaining <= 0;
  const nextBreast = getNextBreast();

  return (
    <div className={`feeding-timer ${getStatusClass()}`}>
      <div className="timer-header">
        <h2>{getStatusMessage()}</h2>
      </div>

      {lastFeeding && timeRemaining !== null && (
        <>
          <div className="timer-display">
            {!isOverdue ? (
              <>
                <div className="time-unit">
                  <div className="time-value">{String(time.hours).padStart(2, '0')}</div>
                  <div className="time-label">heures</div>
                </div>
                <div className="time-separator">:</div>
                <div className="time-unit">
                  <div className="time-value">{String(time.minutes).padStart(2, '0')}</div>
                  <div className="time-label">minutes</div>
                </div>
                <div className="time-separator">:</div>
                <div className="time-unit">
                  <div className="time-value">{String(time.seconds).padStart(2, '0')}</div>
                  <div className="time-label">secondes</div>
                </div>
              </>
            ) : (
              <div className="overdue-icon">⏰</div>
            )}
          </div>

          {nextFeedingTime && !isOverdue && (
            <div className="next-feeding-time">
              <p className="exact-time">
                Prochain allaitement prévu à <strong>{format(nextFeedingTime, 'HH:mm', { locale: fr })}</strong>
                {nextBreast && <span className="next-breast">{nextBreast}</span>}
              </p>
            </div>
          )}
        </>
      )}

      {!lastFeeding && (
        <div className="no-feeding-message">
          <div className="no-feeding-icon">🍼</div>
          <p>Commencez par enregistrer votre premier allaitement</p>
        </div>
      )}
    </div>
  );
};

export default FeedingTimer;
