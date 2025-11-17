// Service Worker pour Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

// Configuration Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCIo66QQPVKEk6UfYJ6ecBM6rppt9i8BtU",
  authDomain: "baby-track-53ba7.firebaseapp.com",
  projectId: "baby-track-53ba7",
  storageBucket: "baby-track-53ba7.firebasestorage.app",
  messagingSenderId: "329413034582",
  appId: "1:329413034582:web:60e08368d9c5636855b1f7",
  measurementId: "G-2V9JR0J8VW"
});

const messaging = firebase.messaging();

// Gestion des notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('Message reçu en arrière-plan:', payload);

  const notificationTitle = payload.notification.title || 'Baby Track';
  const notificationOptions = {
    body: payload.notification.body || 'Notification',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'baby-track-notification',
    requireInteraction: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
