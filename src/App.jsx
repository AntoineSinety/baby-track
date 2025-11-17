import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent = () => {
  const { user } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    // Appliquer le thème
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
