import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import InviteLink from './InviteLink';
import NotificationTest from './NotificationTest';
import InstallPWA from './InstallPWA';
import './Settings.css';

const Settings = ({ onLogout }) => {
  const { user } = useAuth();
  const { settings, updateSettings, toggleTheme } = useSettings();
  const [interval, setInterval] = useState(settings.feedingInterval);
  const [saving, setSaving] = useState(false);

  const handleSaveInterval = async () => {
    if (interval < 1 || interval > 12) {
      alert('L\'intervalle doit être entre 1 et 12 heures');
      return;
    }

    try {
      setSaving(true);
      await updateSettings({ feedingInterval: interval });
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = async () => {
    try {
      const newValue = !settings.notificationsEnabled;

      if (newValue && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Vous devez autoriser les notifications pour activer cette fonctionnalité');
          return;
        }
      }

      await updateSettings({ notificationsEnabled: newValue });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir vider le cache et recharger l\'application ? Cela permettra de récupérer la dernière version.')) {
      return;
    }

    try {
      // Vider tous les caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      }

      // Désinstaller les Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
      }

      // Vider le localStorage et sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // Recharger avec le bon chemin de base
      const basePath = import.meta.env.MODE === 'production' ? '/baby-track/' : '/';
      setTimeout(() => {
        window.location.href = basePath + '?v=' + Date.now();
      }, 500);
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
      alert('Erreur lors du nettoyage du cache');
    }
  };

  return (
    <div className="settings">
      <InstallPWA />

      <div className="settings-section">
        <h3>👤 Profil</h3>
        <div className="profile-info">
          <img
            src={user.photoURL || '/default-avatar.png'}
            alt={user.displayName}
            className="profile-avatar"
          />
          <div className="profile-details">
            <div className="profile-name">{user.displayName}</div>
            <div className="profile-email">{user.email}</div>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Déconnexion
        </button>
      </div>

      <div className="settings-section">
        <h3>⏰ Intervalle d'allaitement</h3>
        <p className="setting-description">
          Définissez l'intervalle de temps (en heures) entre chaque allaitement
        </p>
        <div className="interval-setting">
          <input
            type="number"
            min="1"
            max="12"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="interval-input"
          />
          <span className="interval-unit">heures</span>
        </div>
        <button
          className="save-button"
          onClick={handleSaveInterval}
          disabled={saving || interval === settings.feedingInterval}
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="settings-section">
        <InviteLink />
      </div>

      <div className="settings-section">
        <h3>🎨 Apparence</h3>
        <div className="theme-setting">
          <div className="setting-info">
            <div className="setting-label">Thème</div>
            <div className="setting-value">
              {settings.theme === 'dark' ? 'Sombre' : 'Clair'}
            </div>
          </div>
          <button className="theme-button" onClick={toggleTheme}>
            {settings.theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>🔔 Notifications</h3>
        <div className="notification-setting">
          <div className="setting-info">
            <div className="setting-label">Notifications push</div>
            <div className="setting-description">
              Recevoir des rappels pour les allaitements
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={handleNotificationToggle}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <NotificationTest />
      </div>

      <div className="settings-section">
        <h3>🔄 Mise à jour</h3>
        <div className="cache-setting">
          <div className="setting-info">
            <div className="setting-label">Forcer la mise à jour</div>
            <div className="setting-description">
              Vide le cache et recharge l'application pour récupérer la dernière version
            </div>
          </div>
          <button className="clear-cache-button" onClick={handleClearCache}>
            🗑️ Vider le cache
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>ℹ️ À propos</h3>
        <div className="about-info">
          <p>
            <strong>Baby Track</strong> v2.0.0
          </p>
          <p>Application de suivi d'allaitement et de couches</p>
          <p className="sync-info">
            🔄 Synchronisation en temps réel activée
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
