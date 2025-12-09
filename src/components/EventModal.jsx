import React, { useState, useEffect } from 'react';
import './EventModal.css';

const EventModal = ({ type, onSubmit, onClose, editEvent = null, lastFeeding = null }) => {
  const [formData, setFormData] = useState({
    type: type,
    diaperType: 'pee',
    breast: null,
    pumpingBreasts: {
      left: false,
      right: false
    },
    duration: null,
    customDuration: '',
    notes: '',
    customDate: '',
    customTime: '',
    careItems: {
      eyes: false,
      nose: false,
      vitaminD: false
    }
  });

  // Charger les données si on est en mode édition, sinon présélectionner le sein alterné
  useEffect(() => {
    if (editEvent) {
      // Extraire la date et l'heure si l'événement existe
      const eventTime = editEvent.createdAt ? new Date(editEvent.createdAt) : new Date();
      const year = eventTime.getFullYear();
      const month = String(eventTime.getMonth() + 1).padStart(2, '0');
      const day = String(eventTime.getDate()).padStart(2, '0');
      const hours = String(eventTime.getHours()).padStart(2, '0');
      const minutes = String(eventTime.getMinutes()).padStart(2, '0');

      setFormData({
        type: editEvent.type,
        diaperType: editEvent.diaperType || 'pee',
        breast: editEvent.breast || null,
        pumpingBreasts: editEvent.pumpingBreasts || {
          left: false,
          right: false
        },
        duration: editEvent.duration || null,
        customDuration: editEvent.customDuration || '',
        notes: editEvent.notes || '',
        customDate: `${year}-${month}-${day}`,
        customTime: `${hours}:${minutes}`,
        careItems: editEvent.careItems || {
          eyes: false,
          nose: false,
          vitaminD: false
        }
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

  const handleCareItemToggle = (item) => {
    setFormData({
      ...formData,
      careItems: {
        ...formData.careItems,
        [item]: !formData.careItems[item]
      }
    });
  };

  const handlePumpingBreastToggle = (breast) => {
    setFormData({
      ...formData,
      pumpingBreasts: {
        ...formData.pumpingBreasts,
        [breast]: !formData.pumpingBreasts[breast]
      }
    });
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
            {type === 'care' && '💊 Soins du jour'}
            {type === 'pumping' && '🍶 Tirage de lait'}
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
                    <span className="breast-emoji">⬅️</span>
                    <span className="breast-label">Sein Gauche</span>
                  </button>
                  <button
                    type="button"
                    className={`breast-option ${formData.breast === 'right' ? 'active' : ''}`}
                    onClick={() => handleBreastChange('right')}
                  >
                    <span className="breast-emoji">➡️</span>
                    <span className="breast-label">Sein Droit</span>
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

          {type === 'care' && (
            <div className="form-group">
              <label>Soins effectués</label>
              <div className="care-items">
                <button
                  type="button"
                  className={`care-item ${formData.careItems.eyes ? 'active' : ''}`}
                  onClick={() => handleCareItemToggle('eyes')}
                >
                  <span className="care-icon">👁️</span>
                  <span className="care-label">Yeux</span>
                  {formData.careItems.eyes && <span className="care-check">✓</span>}
                </button>
                <button
                  type="button"
                  className={`care-item ${formData.careItems.nose ? 'active' : ''}`}
                  onClick={() => handleCareItemToggle('nose')}
                >
                  <span className="care-icon">👃</span>
                  <span className="care-label">Nez</span>
                  {formData.careItems.nose && <span className="care-check">✓</span>}
                </button>
                <button
                  type="button"
                  className={`care-item ${formData.careItems.vitaminD ? 'active' : ''}`}
                  onClick={() => handleCareItemToggle('vitaminD')}
                >
                  <span className="care-icon">💊</span>
                  <span className="care-label">Vitamine D</span>
                  {formData.careItems.vitaminD && <span className="care-check">✓</span>}
                </button>
              </div>
            </div>
          )}

          {type === 'pumping' && (
            <div className="form-group">
              <label>Sein(s) tiré(s)</label>
              <div className="pumping-breasts">
                <button
                  type="button"
                  className={`pumping-breast ${formData.pumpingBreasts.left ? 'active' : ''}`}
                  onClick={() => handlePumpingBreastToggle('left')}
                >
                  <span className="pumping-icon">⬅️</span>
                  <span className="pumping-label">Sein Gauche</span>
                  {formData.pumpingBreasts.left && <span className="pumping-check">✓</span>}
                </button>
                <button
                  type="button"
                  className={`pumping-breast ${formData.pumpingBreasts.right ? 'active' : ''}`}
                  onClick={() => handlePumpingBreastToggle('right')}
                >
                  <span className="pumping-icon">➡️</span>
                  <span className="pumping-label">Sein Droit</span>
                  {formData.pumpingBreasts.right && <span className="pumping-check">✓</span>}
                </button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="customDate">Date (optionnel - par défaut aujourd'hui)</label>
            <input
              type="date"
              id="customDate"
              value={formData.customDate}
              onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
              className="custom-date-input"
            />
            <div className="time-hint">
              Laissez vide pour utiliser la date d'aujourd'hui
            </div>
          </div>

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
                  : type === 'bath'
                  ? 'Ex: Bain agréable, température de l\'eau...'
                  : type === 'pumping'
                  ? 'Ex: Quantité tirée, durée du tirage...'
                  : 'Ex: Soins effectués, réactions du bébé...'
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
