import React, { useState } from 'react';
import { useBaby } from '../context/BabyContext';
import { useAuth } from '../context/AuthContext';
import './InviteLink.css';

const InviteLink = () => {
  const { activeBaby } = useBaby();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!activeBaby) return null;

  // Créer le lien d'invitation avec l'ID du bébé
  const inviteUrl = `${window.location.origin}?invite=${activeBaby.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      // Fallback pour les navigateurs qui ne supportent pas clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = inviteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Rejoindre le suivi de ${activeBaby.name}`,
          text: `Clique sur ce lien pour suivre ${activeBaby.name} avec moi !`,
          url: inviteUrl
        });
      } catch (error) {
        // L'utilisateur a annulé le partage
        if (error.name !== 'AbortError') {
          console.error('Erreur lors du partage:', error);
        }
      }
    } else {
      // Si l'API de partage n'est pas disponible, copier le lien
      handleCopy();
    }
  };

  return (
    <div className="invite-link-container">
      <h3>👥 Partager avec votre partenaire</h3>
      <p className="invite-description">
        Partagez ce lien pour que votre partenaire puisse rejoindre le suivi de {activeBaby.name}
      </p>

      <div className="invite-link-box">
        <input
          type="text"
          value={inviteUrl}
          readOnly
          className="invite-link-input"
          onClick={(e) => e.target.select()}
        />
      </div>

      <div className="invite-actions">
        <button onClick={handleCopy} className="btn-copy">
          {copied ? '✓ Copié !' : '📋 Copier le lien'}
        </button>

        {navigator.share && (
          <button onClick={handleShare} className="btn-share">
            📤 Partager
          </button>
        )}
      </div>

      <div className="invite-info">
        <p className="info-text">
          💡 Votre partenaire doit être connecté avec son compte Google pour accepter l'invitation
        </p>
      </div>

      <div className="current-members">
        <h4>Membres actuels :</h4>
        <ul>
          {activeBaby.members?.map((member, index) => (
            <li key={index}>
              <span className="member-icon">
                {member.role === 'owner' ? '👑' : '👤'}
              </span>
              <span className="member-name">{member.displayName || member.email}</span>
              <span className="member-role">
                {member.role === 'owner' ? 'Propriétaire' : 'Membre'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InviteLink;
