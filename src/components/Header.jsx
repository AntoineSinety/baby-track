import React from 'react';
import { useSettings } from '../context/SettingsContext';
import FeedingTimer from './FeedingTimer';
import './Header.css';

const Header = ({ user, activeView, setActiveView, events }) => {
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
        <h1 className="app-title">
          <span className="app-icon">👶</span>
          Baby Track
        </h1>
        <FeedingTimer events={events} compact />
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
