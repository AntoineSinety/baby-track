import React, { useState, useEffect } from 'react';
import './EventModal.css';

const EventModal = ({ type, onSubmit, onClose, editEvent = null, lastFeeding = null }) => {
  const [formData, setFormData] = useState({
    type: type,
    diaperType: 'pee',
    breast: null,
    duration: null,
    customDuration: '',
    notes: '',
    customTime: ''
  });

  // Charger les données si on est en mode édition, sinon présélectionner le sein alterné
  useEffect(() => {
    if (editEvent) {
      // Extraire l'heure si l'événement existe
      const eventTime = editEvent.createdAt ? new Date(editEvent.createdAt) : new Date();
      const hours = String(eventTime.getHours()).padStart(2, '0');
      const minutes = String(eventTime.getMinutes()).padStart(2, '0');

      setFormData({
        type: editEvent.type,
        diaperType: editEvent.diaperType || 'pee',
        breast: editEvent.breast || null,
        duration: editEvent.duration || null,
        customDuration: editEvent.customDuration || '',
        notes: editEvent.notes || '',
        customTime: `${hours}:${minutes}`
      });
    } else if (type === 'feeding' && lastFeeding && lastFeeding.breast) {
      // Présélectionner le sein opposé au dernier allaitement
      const suggestedBreast = lastFeeding.breast === 'left' ? 'right' : 'left';
      setFormData(prev => ({ ...prev, breast: suggestedBreast }));
    }
  }, [editEvent, type, lastFeeding]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDiaperTypeChange = (diaperType) => {
    setFormData({ ...formData, diaperType });
  };

  const handleDurationChange = (duration) => {
    setFormData({ ...formData, duration, customDuration: '' });
  };

  const handleCustomDurationChange = (value) => {
    setFormData({ ...formData, customDuration: value, duration: null });
  };

  const handleBreastChange = (breast) => {
    setFormData({ ...formData, breast });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {editEvent ? '✏️ Modifier ' : ''}
            {type === 'feeding' && '🍼 Allaitement'}
            {type === 'diaper' && '👶 Changement de couche'}
            {type === 'bath' && '🛁 Bain'}
          </h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {type === 'feeding' && (
            <>
              <div className="form-group">
                <label>Sein</label>
                <div className="breast-options">
                  <button
                    type="button"
                    className={`breast-option ${formData.breast === 'left' ? 'active' : ''}`}
                    onClick={() => handleBreastChange('left')}
                  >
                    ⬅️ Gauche
                  </button>
                  <button
                    type="button"
                    className={`breast-option ${formData.breast === 'right' ? 'active' : ''}`}
                    onClick={() => handleBreastChange('right')}
                  >
                    Droit ➡️
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Durée de l'allaitement (optionnel)</label>
              <div className="duration-options">
                <button
                  type="button"
                  className={`duration-option ${formData.duration === 5 ? 'active' : ''}`}
                  onClick={() => handleDurationChange(5)}
                >
                  5 min
                </button>
                <button
                  type="button"
                  className={`duration-option ${formData.duration === 10 ? 'active' : ''}`}
                  onClick={() => handleDurationChange(10)}
                >
                  10 min
                </button>
                <button
                  type="button"
                  className={`duration-option ${formData.duration === 15 ? 'active' : ''}`}
                  onClick={() => handleDurationChange(15)}
                >
                  15 min
                </button>
                <button
                  type="button"
                  className={`duration-option ${formData.duration === 20 ? 'active' : ''}`}
                  onClick={() => handleDurationChange(20)}
                >
                  20 min
                </button>
              </div>
              <div className="custom-duration">
                <input
                  type="number"
                  placeholder="Autre durée (min)"
                  value={formData.customDuration}
                  onChange={(e) => handleCustomDurationChange(e.target.value)}
                  min="1"
                  max="120"
                  className="custom-duration-input"
                />
              </div>
              </div>
            </>
          )}

          {type === 'diaper' && (
            <div className="form-group">
              <label>Type de couche</label>
              <div className="diaper-options">
                <button
                  type="button"
                  className={`diaper-option ${formData.diaperType === 'pee' ? 'active' : ''}`}
                  onClick={() => handleDiaperTypeChange('pee')}
                >
                  💧 Pipi
                </button>
                <button
                  type="button"
                  className={`diaper-option ${formData.diaperType === 'poop' ? 'active' : ''}`}
                  onClick={() => handleDiaperTypeChange('poop')}
                >
                  💩 Caca
                </button>
                <button
                  type="button"
                  className={`diaper-option ${formData.diaperType === 'both' ? 'active' : ''}`}
                  onClick={() => handleDiaperTypeChange('both')}
                >
                  💧💩 Les deux
                </button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="customTime">Heure (optionnel - par défaut maintenant)</label>
            <input
              type="time"
              id="customTime"
              value={formData.customTime}
              onChange={(e) => setFormData({ ...formData, customTime: e.target.value })}
              className="custom-time-input"
            />
            <div className="time-hint">
              Laissez vide pour utiliser l'heure actuelle
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (optionnel)</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={
                type === 'feeding'
                  ? 'Ex: Bon allaitement, bébé calme...'
                  : type === 'diaper'
                  ? 'Ex: Couche très mouillée, selles normales...'
                  : 'Ex: Bain agréable, température de l\'eau...'
              }
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
