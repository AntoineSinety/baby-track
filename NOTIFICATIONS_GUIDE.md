# 🔔 Guide des Notifications Push

## 🚀 Configuration du serveur

### Option 1 : Serveur local uniquement

```bash
npm run dev
```
Accessible sur : `http://localhost:5173`

### Option 2 : Exposer sur le réseau local (pour tester sur mobile)

```bash
npm run dev:host
```

Le serveur affichera :
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.X:5173/
```

Tu pourras alors :
- Ouvrir l'app sur ton téléphone via l'IP réseau
- Tester les notifications sur mobile
- Partager avec ta femme sur le même réseau WiFi

## 🧪 Test des Notifications

### Accéder au panneau de test

1. Ouvre l'application
2. Va dans **Paramètres** (⚙️)
3. Scrolle jusqu'à la section **"Test des Notifications"**

### Types de tests disponibles

#### 1. 🔓 Demander la permission

**Première étape obligatoire** :
- Clique sur "Demander la permission"
- Ton navigateur affichera une popup
- Clique sur "Autoriser"

#### 2. 🧪 Notification simple

**Test basique** :
- Vérifie que le système de notifications fonctionne
- Notification qui se ferme automatiquement après 5 secondes

#### 3. ⏰ Notification dans 5s

**Test de notification programmée** :
- Simule une notification différée
- Utile pour tester les rappels futurs

#### 4. 🍼 Rappel d'allaitement

**Simulation réelle** :
- Notification comme celle que tu recevras pour l'allaitement
- Contient : "Il est temps de nourrir bébé !"
- Peut vibrer sur mobile
- Interaction requise (ne se ferme pas toute seule)

#### 5. 💩 Rappel de couche

**Simulation de rappel de changement** :
- Notification pour le changement de couche
- Vibration différente
- Se ferme après un certain temps

## 📱 Notifications sur Mobile Chrome

### ⚠️ Important : Installation PWA requise

Sur **Chrome mobile**, les notifications fonctionnent mieux lorsque l'app est installée comme PWA :

1. **Sur Android Chrome** :
   - Ouvre l'app sur https://antoinesinety.github.io/baby-track/
   - Un bandeau "Installer l'application" apparaîtra automatiquement
   - OU Menu (⋮) → "Ajouter à l'écran d'accueil" / "Installer l'application"
   - L'icône Baby Track apparaîtra sur ton écran d'accueil

2. **Ouvrir depuis la PWA** :
   - Lance l'app depuis l'icône sur ton écran d'accueil
   - Les notifications fonctionneront correctement
   - L'app utilisera le Service Worker pour les notifications

3. **Autoriser les notifications** :
   - Paramètres → Test des Notifications
   - Clique "Demander la permission"
   - Accepte la popup de permission

### Différences Desktop vs Mobile

| Fonctionnalité | Desktop | Mobile Chrome (PWA) |
|----------------|---------|---------------------|
| Notifications Web API | ✅ Direct | ⚠️ Limité |
| Service Worker Notifications | ✅ Supporté | ✅ Recommandé |
| Vibration | ❌ Non | ✅ Oui |
| Installation PWA | 🔵 Optionnel | 🟢 Recommandé |

## 📱 Test sur Mobile

### Méthode 1 : Via le réseau local (développement)

1. **Lance le serveur en mode host** :
   ```bash
   npm run dev:host
   ```

2. **Note l'adresse IP réseau** :
   ```
   Network: http://192.168.1.X:5173/
   ```

3. **Sur ton téléphone** :
   - Connecte-toi au **même WiFi**
   - Ouvre le navigateur
   - Va sur `http://192.168.1.X:5173/`

4. **Teste les notifications** :
   - Va dans Paramètres
   - Autorise les notifications
   - Teste chaque type

### Méthode 2 : Build et Preview

1. **Build l'application** :
   ```bash
   npm run build
   ```

2. **Lance le preview avec host** :
   ```bash
   npm run preview:host
   ```

3. **Accède depuis ton mobile** comme ci-dessus

## 🎯 Que tester ?

### Sur Desktop

- ✅ Notification apparaît en haut à droite
- ✅ Son de notification (si activé)
- ✅ Icône de l'app visible
- ✅ Clic sur la notification focus la fenêtre
- ✅ Notification se ferme correctement

### Sur Mobile

- ✅ Notification apparaît dans la barre de notifications
- ✅ Vibration fonctionne
- ✅ Son de notification
- ✅ Notification persiste si `requireInteraction: true`
- ✅ Cliquer ouvre l'app
- ✅ Badge de l'app (selon le navigateur)

## 🔧 Configuration Vite

Le fichier `vite.config.js` a été modifié :

```javascript
export default defineConfig({
  server: {
    host: true, // Expose sur le réseau local
    port: 5173
  },
  // ...
})
```

Cela permet :
- D'exposer le serveur sur toutes les interfaces réseau
- D'accéder depuis un autre appareil sur le même réseau
- De tester les PWA features sur mobile

## 📋 Commandes disponibles

| Commande | Description | Usage |
|----------|-------------|-------|
| `npm run dev` | Développement local | Desktop seulement |
| `npm run dev:host` | Développement avec host | Desktop + Mobile (même réseau) |
| `npm run build` | Build production | Génère `dist/` |
| `npm run preview` | Preview du build | Test local |
| `npm run preview:host` | Preview avec host | Test mobile |

## 🐛 Résolution de problèmes

### Les notifications ne s'affichent pas

1. **Vérifier les permissions** :
   - Dans les paramètres du navigateur
   - Notification permission = "granted"

2. **Vérifier le navigateur** :
   - Chrome/Edge : ✅ Supporté
   - Firefox : ✅ Supporté
   - Safari : ⚠️ Support limité
   - iOS Safari : ❌ Pas de Web Notifications (utilise PWA)

3. **Vérifier HTTPS** :
   - En dev : `localhost` est OK
   - En production : HTTPS requis

### Notifications ne fonctionnent pas sur mobile

1. **Vérifier que c'est une PWA** :
   - Ajouter à l'écran d'accueil
   - Ouvrir depuis l'icône PWA

2. **iOS** :
   - Web Notifications pas supportées
   - Utiliser les notifications PWA natives

3. **Android** :
   - Chrome : ✅ Fonctionne
   - Samsung Internet : ✅ Fonctionne
   - Firefox : ⚠️ Support limité

### Erreur "Notification is not defined"

- Le navigateur ne supporte pas les notifications
- Ou pas en HTTPS (sauf localhost)

### Les notifications ne vibrent pas

- Vérifier que le mode silencieux est désactivé
- Android : fonctionne
- iOS : vibration pas supportée pour Web Notifications

## 🎨 Personnalisation

### Modifier les notifications

Dans `NotificationTest.jsx`, tu peux personnaliser :

```javascript
const notification = new Notification('Titre', {
  body: 'Message',
  icon: '/pwa-192x192.png',      // Icône
  badge: '/pwa-192x192.png',     // Badge
  tag: 'unique-id',              // ID unique
  requireInteraction: false,     // Reste affichée
  vibrate: [200, 100, 200],     // Pattern de vibration
  timestamp: Date.now(),         // Horodatage
  silent: false,                 // Silencieuse ou non
  renotify: true                 // Re-notifier si même tag
});
```

### Pattern de vibration

```javascript
vibrate: [200, 100, 200]
//        [durée, pause, durée, pause, ...]
```

Exemples :
- Courte : `[100]`
- Double : `[100, 50, 100]`
- Triple : `[100, 50, 100, 50, 100]`
- SOS : `[100, 50, 100, 50, 100, 200, 50, 200, 50, 200, 100, 50, 100, 50, 100]`

## 🚀 Prochaines étapes

1. ✅ Test des notifications (actuellement)
2. ⏳ Implémenter les rappels automatiques
3. ⏳ Calculer le prochain allaitement
4. ⏳ Envoyer une notification à l'heure prévue
5. ⏳ Notifications basées sur Firebase Cloud Messaging (FCM)

## 📝 Composant créé

- **[NotificationTest.jsx](src/components/NotificationTest.jsx)** - Panneau de test complet
- **[NotificationTest.css](src/components/NotificationTest.css)** - Styles

Le composant est automatiquement intégré dans **Paramètres** !
