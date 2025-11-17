import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBaby } from '../context/BabyContext';
import { deleteEvent } from '../firebase/firestore';
import './EventHistory.css';

const EventHistory = ({ events, showAll = false, onEditEvent }) => {
  const { activeBaby } = useBaby();
  const [filter, setFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const handleDelete = async (eventId) => {
    if (!activeBaby) return;

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await deleteEvent(activeBaby.id, eventId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'événement');
      }
    }
  };

  const getEventIcon = (event) => {
    if (event.type === 'feeding') return '🍼';
    if (event.type === 'diaper') {
      if (event.diaperType === 'pee') return '💧';
      if (event.diaperType === 'poop') return '💩';
      return '💧💩';
    }
    return '📝';
  };

  const getEventLabel = (event) => {
    if (event.type === 'feeding') {
      let label = 'Allaitement';
      if (event.breast === 'left') label += ' gauche';
      if (event.breast === 'right') label += ' droit';
      return label;
    }
    if (event.type === 'diaper') {
      if (event.diaperType === 'pee') return 'Couche - Pipi';
      if (event.diaperType === 'poop') return 'Couche - Caca';
      return 'Couche - Les deux';
    }
    return 'Événement';
  };

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 5);

  return (
    <div className="event-history">
      <div className="history-header">
        <h3>{showAll ? 'Historique complet' : 'Derniers événements'}</h3>
        {showAll && (
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous
            </button>
            <button
              className={`filter-btn ${filter === 'feeding' ? 'active' : ''}`}
              onClick={() => setFilter('feeding')}
            >
              🍼 Allaitement
            </button>
            <button
              className={`filter-btn ${filter === 'diaper' ? 'active' : ''}`}
              onClick={() => setFilter('diaper')}
            >
              👶 Couches
            </button>
          </div>
        )}
      </div>

      {displayedEvents.length === 0 ? (
        <div className="no-events">
          <div className="no-events-icon">📭</div>
          <p>Aucun événement enregistré</p>
        </div>
      ) : (
        <div className="events-list">
          {displayedEvents.map(event => (
            <div key={event.id} className={`event-item ${event.type}`}>
              <div className="event-icon">{getEventIcon(event)}</div>
              <div className="event-details">
                <div className="event-label">
                  {getEventLabel(event)}
                  {event.type === 'feeding' && (event.duration || event.customDuration) && (
                    <span className="event-duration">
                      {' '}• {event.duration || event.customDuration} min
                    </span>
                  )}
                </div>
                <div className="event-time">
                  {format(new Date(event.createdAt), 'PPp', { locale: fr })}
                </div>
                {event.notes && (
                  <div className="event-notes">{event.notes}</div>
                )}
              </div>
              <div className="event-actions">
                {onEditEvent && event.type === 'feeding' && (
                  <button
                    className="edit-button"
                    onClick={() => onEditEvent(event)}
                    title="Modifier"
                  >
                    ✏️
                  </button>
                )}
                <button
                  className="delete-button"
                  onClick={() => handleDelete(event.id)}
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventHistory;
