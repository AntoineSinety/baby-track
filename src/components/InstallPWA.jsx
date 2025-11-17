import React, { useState, useEffect } from 'react';

const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Capturer l'événement beforeinstallprompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setInstallPrompt(null);
  };

  // Ne rien afficher si déjà installé
  if (isInstalled) {
    return null;
  }

  // Ne rien afficher si pas de prompt disponible
  if (!installPrompt) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '16px',
      borderRadius: '12px',
      margin: '16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{ fontSize: '32px' }}>📱</div>
      <div style={{ flex: 1 }}>
        <strong style={{ display: 'block', marginBottom: '4px' }}>
          Installer Baby Track
        </strong>
        <small>
          Installez l'app pour un accès rapide et des notifications push
        </small>
      </div>
      <button
        onClick={handleInstallClick}
        style={{
          background: 'white',
          color: '#667eea',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '14px',
          whiteSpace: 'nowrap'
        }}
      >
        Installer
      </button>
    </div>
  );
};

export default InstallPWA;
