import React, { useState } from 'react';
import EventTimeline from './EventTimeline';
import './EventHistory.css';

const EventHistory = ({ events, showAll = false, onEditEvent }) => {
  const [filter, setFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

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
              className={`filter-btn ${filter === 'pumping' ? 'active' : ''}`}
              onClick={() => setFilter('pumping')}
            >
              🍶 Tirage
            </button>
            <button
              className={`filter-btn ${filter === 'diaper' ? 'active' : ''}`}
              onClick={() => setFilter('diaper')}
            >
              👶 Couches
            </button>
            <button
              className={`filter-btn ${filter === 'bath' ? 'active' : ''}`}
              onClick={() => setFilter('bath')}
            >
              🛁 Bains
            </button>
            <button
              className={`filter-btn ${filter === 'care' ? 'active' : ''}`}
              onClick={() => setFilter('care')}
            >
              💊 Soins
            </button>
          </div>
        )}
      </div>

      <EventTimeline
        events={filteredEvents}
        limit={showAll ? null : 5}
        onEditEvent={onEditEvent}
      />
    </div>
  );
};

export default EventHistory;
