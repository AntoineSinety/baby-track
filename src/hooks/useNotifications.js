import { useEffect } from 'react';
import { getMessagingInstance } from '../firebase/config';
import { getToken, onMessage } from 'firebase/messaging';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const { settings } = useSettings();

  useEffect(() => {
    if (!user || !settings.notificationsEnabled) return;

    const setupNotifications = async () => {
      try {
        // Vérifier si les notifications sont supportées
        if (!('Notification' in window)) {
          console.log('Les notifications ne sont pas supportées par ce navigateur');
          return;
        }

        // Demander la permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Permission de notification refusée');
          return;
        }

        // Obtenir l'instance de messaging
        const messaging = await getMessagingInstance();
        if (!messaging) {
          console.log('Firebase Messaging non supporté');
          return;
        }

        // Obtenir le token (désactivé temporairement - configurez la clé VAPID dans Firebase Console)
        // const token = await getToken(messaging, {
        //   vapidKey: 'VOTRE_VAPID_KEY' // À remplacer par votre clé VAPID depuis Firebase Console
        // });

        // if (token) {
        //   console.log('Token FCM obtenu:', token);
        //   // Vous pouvez sauvegarder ce token dans Firestore si nécessaire
        // }

        // Écouter les messages en foreground
        onMessage(messaging, (payload) => {
          console.log('Message reçu en foreground:', payload);

          // Afficher une notification locale
          if (payload.notification) {
            new Notification(payload.notification.title, {
              body: payload.notification.body,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              vibrate: [200, 100, 200],
              tag: 'baby-track-notification'
            });
          }
        });
      } catch (error) {
        console.error('Erreur lors de la configuration des notifications:', error);
      }
    };

    setupNotifications();
  }, [user, settings.notificationsEnabled]);
};

// Fonction helper pour planifier une notification locale
export const scheduleLocalNotification = (title, body, delay) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  setTimeout(() => {
    new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      tag: 'baby-track-reminder',
      requireInteraction: true
    });
  }, delay);
};
