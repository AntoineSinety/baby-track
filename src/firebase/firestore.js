import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

// Ajouter un événement (allaitement ou couche)
export const addEvent = async (babyId, eventData, userInfo = {}) => {
  try {
    const eventsRef = collection(db, 'babies', babyId, 'events');
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      addedBy: userInfo, // { userId, displayName }
      timestamp: serverTimestamp(),
      // Utiliser createdAt fourni ou créer une nouvelle date
      createdAt: eventData.createdAt || new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'événement:', error);
    throw error;
  }
};

// Récupérer les événements en temps réel
export const subscribeToEvents = (babyId, callback) => {
  const eventsRef = collection(db, 'babies', babyId, 'events');
  const q = query(eventsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    callback(events);
  });
};

// Récupérer les paramètres utilisateur
export const getUserSettings = async (userId) => {
  try {
    const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      return settingsDoc.data();
    } else {
      // Paramètres par défaut
      const defaultSettings = {
        feedingInterval: 4, // en heures
        theme: 'dark',
        notificationsEnabled: true
      };
      await setDoc(settingsRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    throw error;
  }
};

// Mettre à jour les paramètres utilisateur
export const updateUserSettings = async (userId, settings) => {
  try {
    const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
    await setDoc(settingsRef, settings, { merge: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    throw error;
  }
};

// Mettre à jour un événement
export const updateEvent = async (babyId, eventId, eventData) => {
  try {
    const eventRef = doc(db, 'babies', babyId, 'events', eventId);
    await updateDoc(eventRef, eventData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    throw error;
  }
};

// Supprimer un événement
export const deleteEvent = async (babyId, eventId) => {
  try {
    const eventRef = doc(db, 'babies', babyId, 'events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    throw error;
  }
};

// Récupérer les événements par type et période
export const getEventsByTypeAndPeriod = async (userId, type, startDate, endDate) => {
  try {
    const eventsRef = collection(db, 'users', userId, 'events');
    let q = query(eventsRef, orderBy('createdAt', 'desc'));

    if (type) {
      q = query(q, where('type', '==', type));
    }

    const snapshot = await getDocs(q);
    const events = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const eventDate = new Date(data.createdAt);

      if ((!startDate || eventDate >= startDate) && (!endDate || eventDate <= endDate)) {
        events.push({ id: doc.id, ...data });
      }
    });

    return events;
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw error;
  }
};
