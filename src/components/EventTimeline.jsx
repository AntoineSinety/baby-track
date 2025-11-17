import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBaby } from '../context/BabyContext';
import { deleteEvent } from '../firebase/firestore';
import './EventTimeline.css';

const EventTimeline = ({ events, limit, onEditEvent }) => {
  const { activeBaby } = useBaby();
  const displayedEvents = limit ? events.slice(0, limit) : events;

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

  const getEventTitle = (event) => {
    if (event.type === 'feeding') {
      let title = 'Allaitement';
      if (event.breast === 'left') title += ' gauche';
      if (event.breast === 'right') title += ' droit';
      return title;
    }
    if (event.type === 'diaper') {
      if (event.diaperType === 'pee') return 'Couche - Pipi';
      if (event.diaperType === 'poop') return 'Couche - Caca';
      return 'Couche - Les deux';
    }
    return 'Événement';
  };

  const getEventDetails = (event) => {
    if (event.type === 'feeding' && (event.duration || event.customDuration)) {
      return `Durée : ${event.duration || event.customDuration} min`;
    }
    return null;
  };

  if (displayedEvents.length === 0) {
    return (
      <div className="timeline-empty">
        <div className="timeline-empty-icon">📭</div>
        <p>Aucun événement à afficher</p>
      </div>
    );
  }

  return (
    <div className="event-timeline">
      {displayedEvents.map((event, index) => (
        <div key={event.id} className={`timeline-item ${event.type}`}>
          <div className="timeline-time">
            {format(new Date(event.createdAt), 'HH:mm', { locale: fr })}
          </div>

          <div className="timeline-marker">
            <div className="timeline-dot"></div>
            {index < displayedEvents.length - 1 && <div className="timeline-line"></div>}
          </div>

          <div className="timeline-content">
            <div className="timeline-card">
              <div className="timeline-header">
                <div className="timeline-icon">{getEventIcon(event)}</div>
                <div className="timeline-info">
                  <div className="timeline-title">{getEventTitle(event)}</div>
                  {getEventDetails(event) && (
                    <div className="timeline-details">{getEventDetails(event)}</div>
                  )}
                </div>
                <div className="timeline-actions">
                  {onEditEvent && event.type === 'feeding' && (
                    <button
                      className="timeline-edit"
                      onClick={() => onEditEvent(event)}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    className="timeline-delete"
                    onClick={() => handleDelete(event.id)}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {event.notes && (
                <div className="timeline-notes">{event.notes}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventTimeline;
