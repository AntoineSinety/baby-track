import React, { useState } from 'react';
import './NotificationTest.css';

const NotificationTest = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [testResult, setTestResult] = useState('');
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);

  // Vérifier si le Service Worker est prêt
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsServiceWorkerReady(true);
      });
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setTestResult('✅ Permission accordée !');
      } else if (result === 'denied') {
        setTestResult('❌ Permission refusée. Sur mobile, vous devez peut-être installer l\'app comme PWA.');
      } else {
        setTestResult('⚠️ Permission non déterminée');
      }
    } catch (error) {
      setTestResult(`❌ Erreur: ${error.message}`);
    }
  };

  const sendTestNotification = async () => {
    if (permission !== 'granted') {
      setTestResult('❌ Vous devez d\'abord autoriser les notifications');
      return;
    }

    try {
      // Utiliser le Service Worker si disponible (meilleur support mobile)
      if (isServiceWorkerReady && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('🍼 Test d\'allaitement', {
          body: 'Ceci est une notification de test !',
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">👶</text></svg>',
          badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🍼</text></svg>',
          tag: 'test-notification',
          requireInteraction: false,
          timestamp: Date.now(),
          data: { url: window.location.href }
        });
        setTestResult('✅ Notification envoyée via Service Worker !');
      } else {
        // Fallback pour desktop
        const notification = new Notification('🍼 Test d\'allaitement', {
          body: 'Ceci est une notification de test !',
          tag: 'test-notification',
          requireInteraction: false,
          timestamp: Date.now()
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        setTestResult('✅ Notification envoyée !');
        setTimeout(() => notification.close(), 5000);
      }
    } catch (error) {
      setTestResult(`❌ Erreur: ${error.message}`);
    }
  };

  const sendFeedingReminder = async () => {
    if (permission !== 'granted') {
      setTestResult('❌ Vous devez d\'abord autoriser les notifications');
      return;
    }

    try {
      if (isServiceWorkerReady && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('⏰ Rappel d\'allaitement', {
          body: 'Il est temps de nourrir bébé ! Dernier allaitement il y a 4 heures.',
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">👶</text></svg>',
          badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🍼</text></svg>',
          tag: 'feeding-reminder',
          requireInteraction: true,
          vibrate: [200, 100, 200],
          timestamp: Date.now(),
          data: { url: window.location.href }
        });
        setTestResult('✅ Rappel d\'allaitement envoyé via Service Worker !');
      } else {
        const notification = new Notification('⏰ Rappel d\'allaitement', {
          body: 'Il est temps de nourrir bébé ! Dernier allaitement il y a 4 heures.',
          tag: 'feeding-reminder',
          requireInteraction: true,
          vibrate: [200, 100, 200],
          timestamp: Date.now()
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        setTestResult('✅ Rappel d\'allaitement envoyé !');
      }
    } catch (error) {
      setTestResult(`❌ Erreur: ${error.message}`);
    }
  };

  const sendDiaperReminder = async () => {
    if (permission !== 'granted') {
      setTestResult('❌ Vous devez d\'abord autoriser les notifications');
      return;
    }

    try {
      if (isServiceWorkerReady && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification('💩 Changement de couche', {
          body: 'N\'oubliez pas de changer la couche de bébé !',
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">👶</text></svg>',
          badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">💩</text></svg>',
          tag: 'diaper-reminder',
          vibrate: [100, 50, 100],
          timestamp: Date.now(),
          data: { url: window.location.href }
        });
        setTestResult('✅ Rappel de couche envoyé via Service Worker !');
      } else {
        const notification = new Notification('💩 Changement de couche', {
          body: 'N\'oubliez pas de changer la couche de bébé !',
          tag: 'diaper-reminder',
          vibrate: [100, 50, 100],
          timestamp: Date.now()
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        setTestResult('✅ Rappel de couche envoyé !');
      }
    } catch (error) {
      setTestResult(`❌ Erreur: ${error.message}`);
    }
  };

  const scheduleDelayedNotification = () => {
    if (permission !== 'granted') {
      setTestResult('❌ Vous devez d\'abord autoriser les notifications');
      return;
    }

    setTestResult('⏳ Notification programmée dans 5 secondes...');

    setTimeout(() => {
      try {
        const notification = new Notification('⏰ Notification programmée', {
          body: 'Cette notification a été programmée il y a 5 secondes !',
          icon: '/pwa-192x192.png',
          tag: 'scheduled-notification'
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        setTestResult('✅ Notification programmée déclenchée !');
      } catch (error) {
        setTestResult(`❌ Erreur: ${error.message}`);
      }
    }, 5000);
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { text: 'Autorisées ✅', color: '#10b981' };
      case 'denied':
        return { text: 'Refusées ❌', color: '#ef4444' };
      default:
        return { text: 'Non demandées ⚠️', color: '#f59e0b' };
    }
  };

  const status = getPermissionStatus();

  return (
    <div className="notification-test">
      <h2>🔔 Test des Notifications</h2>

      <div className="permission-status" style={{ borderColor: status.color }}>
        <div className="status-label">Statut des permissions :</div>
        <div className="status-value" style={{ color: status.color }}>
          {status.text}
        </div>
      </div>

      {permission !== 'granted' && (
        <div className="permission-section">
          <button onClick={requestPermission} className="btn-permission">
            🔓 Demander la permission
          </button>
        </div>
      )}

      {permission === 'granted' && (
        <>
          <div className="test-section">
            <h3>Tests basiques</h3>
            <div className="test-buttons">
              <button onClick={sendTestNotification} className="btn-test">
                🧪 Notification simple
              </button>
              <button onClick={scheduleDelayedNotification} className="btn-test">
                ⏰ Notification dans 5s
              </button>
            </div>
          </div>

          <div className="test-section">
            <h3>Simulations réelles</h3>
            <div className="test-buttons">
              <button onClick={sendFeedingReminder} className="btn-test primary">
                🍼 Rappel d'allaitement
              </button>
              <button onClick={sendDiaperReminder} className="btn-test secondary">
                💩 Rappel de couche
              </button>
            </div>
          </div>
        </>
      )}

      {testResult && (
        <div className="test-result">
          {testResult}
        </div>
      )}

      <div className="info-section">
        <h3>ℹ️ Informations</h3>
        <ul>
          <li>
            <strong>Navigateur supporté :</strong>{' '}
            {('Notification' in window) ? '✅ Oui' : '❌ Non'}
          </li>
          <li>
            <strong>Service Worker :</strong>{' '}
            {('serviceWorker' in navigator) ? (isServiceWorkerReady ? '✅ Prêt' : '⏳ Chargement...') : '❌ Non disponible'}
          </li>
          <li>
            <strong>Permission actuelle :</strong> {permission}
          </li>
          <li>
            <strong>PWA installée :</strong>{' '}
            {window.matchMedia('(display-mode: standalone)').matches ? '✅ Oui' : '❌ Non (ouvrez depuis l\'écran d\'accueil)'}
          </li>
        </ul>
      </div>

      <div className="instructions">
        <h3>📋 Instructions</h3>
        <ol>
          <li>Cliquez sur "Demander la permission" pour autoriser les notifications</li>
          <li>Testez les différents types de notifications</li>
          <li>Vérifiez que vous recevez bien les notifications</li>
          <li>Sur mobile : vérifiez que l'app vibre</li>
        </ol>

        {!window.matchMedia('(display-mode: standalone)').matches && (
          <div className="mobile-tip" style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '12px'
          }}>
            <strong>💡 Sur mobile Chrome :</strong>
            <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li>Ouvrez le menu (⋮)</li>
              <li>Sélectionnez "Ajouter à l'écran d'accueil" ou "Installer l'application"</li>
              <li>Ouvrez l'app depuis l'icône sur votre écran d'accueil</li>
              <li>Les notifications fonctionneront mieux depuis la PWA installée</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTest;
