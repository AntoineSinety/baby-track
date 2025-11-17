import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBaby } from '../context/BabyContext';
import { createBaby } from '../firebase/babies';
import './BabySetup.css';

const BabySetup = () => {
  const { user } = useAuth();
  const { refreshBabies } = useBaby();
  const [formData, setFormData] = useState({
    name: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await createBaby(
        user.uid,
        user.email,
        user.displayName,
        {
          name: formData.name,
          birthDate: formData.birthDate,
          photo: '' // On peut ajouter un upload d'image plus tard
        }
      );

      // Rafraîchir la liste des bébés
      await refreshBabies();
    } catch (error) {
      console.error('Erreur lors de la création du bébé:', error);
      alert('Erreur lors de la création du profil bébé');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="baby-setup-container">
      <div className="baby-setup-card">
        <div className="setup-icon">👶</div>
        <h1>Créer le profil de votre bébé</h1>
        <p className="setup-description">
          Commencez par créer le profil de votre bébé. Vous pourrez ensuite inviter votre conjoint(e) à le partager.
        </p>

        <form onSubmit={handleSubmit} className="baby-setup-form">
          <div className="form-group">
            <label htmlFor="name">Prénom du bébé</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Emma, Lucas..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Date de naissance</label>
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Création...' : 'Créer le profil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BabySetup;
