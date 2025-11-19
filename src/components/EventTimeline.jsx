import React from 'react';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBaby } from '../context/BabyContext';
import { deleteEvent } from '../firebase/firestore';
import './EventTimeline.css';

const EventTimeline = ({ events, limit, onEditEvent }) => {
  const { activeBaby } = useBaby();
  const displayedEvents = limit ? events.slice(0, limit) : events;

  // Grouper les événements par date
  const groupEventsByDate = (events) => {
    const groups = {};
    events.forEach(event => {
      const eventDate = new Date(event.createdAt);
      const dateKey = format(eventDate, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: eventDate,
          events: []
        };
      }
      groups[dateKey].events.push(event);
    });
    return Object.values(groups);
  };

  const getDateLabel = (date) => {
    if (isToday(date)) return "Aujourd'hui";
    if (isYesterday(date)) return 'Hier';
    return format(date, 'EEEE d MMMM', { locale: fr });
  };

  const getEventCountsByType = (events) => {
    const counts = {};
    events.forEach(event => {
      counts[event.type] = (counts[event.type] || 0) + 1;
    });
    return counts;
  };

  const groupedEvents = groupEventsByDate(displayedEvents);

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
    if (event.type === 'bath') return '🛁';
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
    if (event.type === 'bath') return 'Bain';
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
      {groupedEvents.map((group, groupIndex) => {
        const eventCounts = getEventCountsByType(group.events);
        return (
        <div key={group.date.toISOString()} className="timeline-group">
          <div className="timeline-date-header">
            <div className="timeline-date-label">
              {getDateLabel(group.date)}
              <span className="timeline-date-counts">
                {eventCounts.feeding && <span className="count-item feeding">{eventCounts.feeding} 🍼</span>}
                {eventCounts.diaper && <span className="count-item diaper">{eventCounts.diaper} 👶</span>}
                {eventCounts.bath && <span className="count-item bath">{eventCounts.bath} 🛁</span>}
              </span>
            </div>
            <div className="timeline-date-line"></div>
          </div>

          {group.events.map((event, index) => (
            <div key={event.id} className={`timeline-item ${event.type}`}>
              <div className="timeline-time">
                {format(new Date(event.createdAt), 'HH:mm', { locale: fr })}
              </div>

              <div className="timeline-marker">
                <div className="timeline-dot"></div>
                {(index < group.events.length - 1 || groupIndex < groupedEvents.length - 1) && (
                  <div className="timeline-line"></div>
                )}
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
                      {onEditEvent && (
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
                    <div className="timeline-notes">
                      <div className="timeline-notes-icon">💭</div>
                      {event.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
      })}
    </div>
  );
};

export default EventTimeline;
