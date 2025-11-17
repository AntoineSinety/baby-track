import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { BabyProvider } from './context/BabyContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InviteAccept from './components/InviteAccept';
import './App.css';

const AppContent = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [inviteBabyId, setInviteBabyId] = useState(null);

  useEffect(() => {
    // Appliquer le thème
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    // Vérifier si un lien d'invitation est présent dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const inviteId = urlParams.get('invite');
    if (inviteId) {
      setInviteBabyId(inviteId);
    }
  }, []);

  if (!user) {
    return <Login />;
  }

  // Si on a une invitation en attente, afficher l'écran d'acceptation
  if (inviteBabyId) {
    return (
      <InviteAccept
        babyId={inviteBabyId}
        onAccepted={() => {
          // Nettoyer l'URL et retourner au dashboard
          window.history.replaceState({}, document.title, window.location.pathname);
          setInviteBabyId(null);
        }}
        onCancel={() => {
          // Nettoyer l'URL et retourner au dashboard
          window.history.replaceState({}, document.title, window.location.pathname);
          setInviteBabyId(null);
        }}
      />
    );
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BabyProvider>
          <AppContent />
        </BabyProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
