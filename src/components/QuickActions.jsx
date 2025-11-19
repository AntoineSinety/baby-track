import React, { useState } from 'react';
import EventModal from './EventModal';
import './QuickActions.css';

const QuickActions = ({ onAddEvent, lastFeeding }) => {
  const [showModal, setShowModal] = useState(false);
  const [eventType, setEventType] = useState(null);

  const handleQuickAction = (type) => {
    setEventType(type);
    setShowModal(true);
  };

  const handleSubmit = (eventData) => {
    onAddEvent(eventData);
    setShowModal(false);
    setEventType(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setEventType(null);
  };

  return (
    <>
      <div className="quick-actions">
        <h3>Actions rapides</h3>
        <div className="action-buttons">
          <button
            className="action-button feeding"
            onClick={() => handleQuickAction('feeding')}
          >
            <div className="action-icon">🍼</div>
            <div className="action-label">Allaitement</div>
          </button>

          <button
            className="action-button diaper"
            onClick={() => handleQuickAction('diaper')}
          >
            <div className="action-icon">👶</div>
            <div className="action-label">Couche</div>
          </button>
        </div>

        <div className="secondary-actions">
          <button
            className="secondary-action-button bath"
            onClick={() => handleQuickAction('bath')}
          >
            <span className="secondary-icon">🛁</span>
            <span className="secondary-label">Bain</span>
          </button>
        </div>
      </div>

      {showModal && (
        <EventModal
          type={eventType}
          onSubmit={handleSubmit}
          onClose={handleClose}
          lastFeeding={lastFeeding}
        />
      )}
    </>
  );
};

export default QuickActions;
