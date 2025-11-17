import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBaby } from '../context/BabyContext';
import { getBaby, addMemberToBaby } from '../firebase/babies';
import './InviteAccept.css';

const InviteAccept = ({ babyId, onAccepted, onCancel }) => {
  const { user } = useAuth();
  const { refreshBabies } = useBaby();
  const [baby, setBaby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState(null);
  const [alreadyMember, setAlreadyMember] = useState(false);

  useEffect(() => {
    const loadBabyInfo = async () => {
      try {
        setLoading(true);
        const babyData = await getBaby(babyId);

        if (!babyData) {
          setError('Ce bébé n\'existe pas ou a été supprimé.');
          return;
        }

        setBaby(babyData);

        // Vérifier si l'utilisateur est déjà membre
        const isMember = babyData.memberIds?.includes(user.uid);
        setAlreadyMember(isMember);

      } catch (err) {
        console.error('Erreur lors du chargement du bébé:', err);
        setError('Impossible de charger les informations du bébé.');
      } finally {
        setLoading(false);
      }
    };

    if (user && babyId) {
      loadBabyInfo();
    }
  }, [babyId, user]);

  const handleAccept = async () => {
    try {
      setAccepting(true);
      setError(null);

      await addMemberToBaby(babyId, {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        role: 'member'
      });

      // Rafraîchir la liste des bébés
      await refreshBabies();

      // Notifier le parent
      if (onAccepted) {
        onAccepted();
      }

    } catch (err) {
      console.error('Erreur lors de l\'acceptation:', err);
      setError('Erreur lors de l\'acceptation de l\'invitation. Réessayez.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="invite-accept-container">
        <div className="loading-spinner"></div>
        <p>Chargement de l'invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="invite-accept-container">
        <div className="invite-error">
          <span className="error-icon">⚠️</span>
          <h2>Erreur</h2>
          <p>{error}</p>
          {onCancel && (
            <button onClick={onCancel} className="btn-cancel">
              Retour
            </button>
          )}
        </div>
      </div>
    );
  }

  if (alreadyMember) {
    return (
      <div className="invite-accept-container">
        <div className="invite-already-member">
          <span className="success-icon">✓</span>
          <h2>Déjà membre</h2>
          <p>Vous faites déjà partie du suivi de <strong>{baby.name}</strong> !</p>
          {onCancel && (
            <button onClick={onCancel} className="btn-primary">
              Continuer
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="invite-accept-container">
      <div className="invite-card">
        <div className="invite-header">
          <span className="baby-icon">👶</span>
          <h2>Invitation à rejoindre</h2>
        </div>

        <div className="baby-info">
          <h3>{baby.name}</h3>
          {baby.birthDate && (
            <p className="birth-date">
              Né(e) le {new Date(baby.birthDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          )}
        </div>

        <div className="invite-message">
          <p>
            Vous êtes invité(e) à suivre l'allaitement et les couches de{' '}
            <strong>{baby.name}</strong> avec les autres membres de la famille.
          </p>
        </div>

        <div className="current-members-preview">
          <p className="members-label">Membres actuels :</p>
          <div className="members-list">
            {baby.members?.slice(0, 3).map((member, index) => (
              <div key={index} className="member-avatar">
                {member.displayName?.charAt(0).toUpperCase() || '?'}
              </div>
            ))}
            {baby.members?.length > 3 && (
              <div className="member-avatar more">
                +{baby.members.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="invite-actions">
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="btn-accept"
          >
            {accepting ? 'Acceptation...' : '✓ Accepter l\'invitation'}
          </button>

          {onCancel && (
            <button onClick={onCancel} className="btn-decline">
              Refuser
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteAccept;
