import React from 'react';
import './MobileNav.css';

const MobileNav = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'history', label: 'Historique', icon: '📋' },
    { id: 'statistics', label: 'Stats', icon: '📊' },
    { id: 'fun', label: 'Fun', icon: '🎮' },
    { id: 'settings', label: 'Réglages', icon: '⚙️' }
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`mobile-nav-item ${activeView === item.id ? 'active' : ''}`}
          onClick={() => setActiveView(item.id)}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;
