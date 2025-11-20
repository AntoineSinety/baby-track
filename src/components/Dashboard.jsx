import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useBaby } from '../context/BabyContext';
import { subscribeToEvents, addEvent, updateEvent } from '../firebase/firestore';
import { logout } from '../firebase/auth';
import { useNotifications } from '../hooks/useNotifications';
import Header from './Header';
import MobileNav from './MobileNav';
import DailySummary from './DailySummary';
import FeedingTimer from './FeedingTimer';
import QuickActions from './QuickActions';
import EventHistory from './EventHistory';
import EventTimeline from './EventTimeline';
import Statistics from './Statistics';
import TodoList from './TodoList';
import Settings from './Settings';
import EventModal from './EventModal';
import BabySetup from './BabySetup';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { activeBaby, loading: babyLoading } = useBaby();
  const [events, setEvents] = useState([]);
  const [activeView, setActiveView] = useState('home');
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);

  // Activer les notifications
  useNotifications();

  useEffect(() => {
    if (activeBaby) {
      const unsubscribe = subscribeToEvents(activeBaby.id, (eventsData) => {
        setEvents(eventsData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [activeBaby]);

  const handleAddEvent = async (eventData) => {
    try {
      if (!activeBaby) {
        alert('Aucun bébé sélectionné');
        return;
      }

      // Créer une date personnalisée si customTime est fourni
      let customDate = new Date();
      if (eventData.customTime) {
        const [hours, minutes] = eventData.customTime.split(':');
        customDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }

      // Préparer les données de l'événement
      const eventToSave = {
        ...eventData,
        createdAt: eventData.customTime ? customDate.toISOString() : new Date().toISOString()
      };

      // Retirer customTime des données sauvegardées
      delete eventToSave.customTime;

      // Ajouter l'événement avec les infos de l'utilisateur
      await addEvent(activeBaby.id, eventToSave, {
        userId: user.uid,
        displayName: user.displayName || user.email
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
      alert('Erreur lors de l\'ajout de l\'événement');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      if (!activeBaby) {
        alert('Aucun bébé sélectionné');
        return;
      }

      // Gérer le changement d'heure si customTime est fourni
      let updatedData = { ...eventData };

      if (eventData.customTime) {
        // Utiliser la date existante ou créer une nouvelle
        const baseDate = editingEvent.createdAt ? new Date(editingEvent.createdAt) : new Date();
        const [hours, minutes] = eventData.customTime.split(':');
        baseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        updatedData.createdAt = baseDate.toISOString();
      }

      // Retirer customTime des données sauvegardées
      delete updatedData.customTime;

      await updateEvent(activeBaby.id, editingEvent.id, updatedData);
      setEditingEvent(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      alert('Erreur lors de la mise à jour de l\'événement');
    }
  };

  const handleCloseEditModal = () => {
    setEditingEvent(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getLastFeedingEvent = () => {
    return events.find(event => event.type === 'feeding');
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            <DailySummary events={events} />
            <FeedingTimer
              lastFeeding={getLastFeedingEvent()}
              interval={settings.feedingInterval}
            />
            <QuickActions onAddEvent={handleAddEvent} lastFeeding={getLastFeedingEvent()} />
            <div className="section-title">Timeline du jour</div>
            <EventTimeline
              events={events}
              limit={15}
              onEditEvent={handleEditEvent}
            />
          </>
        );
      case 'history':
        return <EventHistory events={events} showAll onEditEvent={handleEditEvent} />;
      case 'statistics':
        return <Statistics events={events} />;
      case 'todos':
        return <TodoList />;
      case 'settings':
        return <Settings onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  // Afficher le chargement pendant la récupération des bébés
  if (babyLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  // Afficher l'écran de configuration si aucun bébé
  if (!activeBaby) {
    return <BabySetup />;
  }

  // Afficher le chargement des événements
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des événements...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header user={user} activeView={activeView} setActiveView={setActiveView} />
      <main className="dashboard-main">
        {renderView()}
      </main>
      <MobileNav activeView={activeView} setActiveView={setActiveView} />

      {editingEvent && (
        <EventModal
          type={editingEvent.type}
          editEvent={editingEvent}
          onSubmit={handleUpdateEvent}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
