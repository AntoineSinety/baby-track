import React from 'react';
import { useSettings } from '../context/SettingsContext';
import './Header.css';

const Header = ({ user, activeView, setActiveView }) => {
  const { settings, toggleTheme } = useSettings();

  const navItems = [
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'history', label: 'Historique', icon: '📋' },
    { id: 'statistics', label: 'Statistiques', icon: '📊' },
    { id: 'todos', label: 'To-Do', icon: '📝' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <span className="app-icon">👶</span>
            Baby Track
          </h1>
        </div>

        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Changer de thème"
            title={settings.theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          >
            {settings.theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="user-info">
            <img
              src={user.photoURL || '/default-avatar.png'}
              alt={user.displayName}
              className="user-avatar"
            />
            <span className="user-name">{user.displayName?.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      <nav className="nav-tabs">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-tab ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
