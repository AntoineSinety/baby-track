# 👶 Baby Track

Application PWA (Progressive Web App) pour suivre l'allaitement et les changements de couches de votre bébé, avec synchronisation en temps réel entre plusieurs appareils.

## ✨ Fonctionnalités

- 🍼 **Suivi des allaitements** avec timer countdown
- 👶 **Suivi des changements de couches** (pipi, caca, ou les deux)
- ⏰ **Rappels automatiques** pour le prochain allaitement
- 📊 **Statistiques** détaillées (jour, semaine, total)
- 📱 **Synchronisation en temps réel** entre appareils
- 🔔 **Notifications push** pour les rappels
- 🌓 **Thème sombre/clair**
- 📝 **Notes** pour chaque événement
- 📖 **Historique complet** avec filtres
- 🔐 **Authentification sécurisée** avec Google
- 📴 **Fonctionne hors ligne** (PWA)

## 🚀 Installation

### Prérequis

- Node.js 18+ installé
- Compte Firebase (gratuit)

### Étapes d'installation

1. **Installer les dépendances**

```bash
npm install
```

2. **Configurer Firebase**

   a. Créez un projet Firebase sur [https://console.firebase.google.com](https://console.firebase.google.com)

   b. Activez l'authentification Google :
      - Firebase Console → Authentication → Sign-in method
      - Activez "Google"

   c. Créez une base de données Firestore :
      - Firebase Console → Firestore Database → Create database
      - Choisissez "Production mode"

   d. Configurez les règles Firestore (Security rules) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

   e. Activez Firebase Cloud Messaging (optionnel, pour les notifications) :
      - Firebase Console → Project Settings → Cloud Messaging
      - Générez une clé Web push

3. **Configurer les variables d'environnement**

   a. Copiez le fichier `.env.example` en `.env`

   b. Récupérez vos identifiants Firebase :
      - Firebase Console → Project Settings → General
      - Dans "Your apps", sélectionnez votre app web
      - Copiez les valeurs de configuration

   c. Remplissez le fichier `.env` :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

   d. Mettez à jour les fichiers suivants avec votre configuration :
      - `src/firebase/config.js`
      - `public/firebase-messaging-sw.js`

4. **Lancer l'application en mode développement**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

## 📦 Build & Déploiement

### Build de production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

### Déploiement sur Firebase Hosting

1. Installez Firebase CLI :

```bash
npm install -g firebase-tools
```

2. Connectez-vous à Firebase :

```bash
firebase login
```

3. Initialisez Firebase Hosting :

```bash
firebase init hosting
```

4. Déployez :

```bash
npm run build
firebase deploy
```

## 🎨 Personnalisation

### Modifier l'intervalle par défaut

Dans `src/context/SettingsContext.jsx`, ligne 12 :

```javascript
feedingInterval: 4, // Changez cette valeur (en heures)
```

### Modifier le thème par défaut

Dans `src/context/SettingsContext.jsx`, ligne 13 :

```javascript
theme: 'dark', // ou 'light'
```

### Personnaliser les couleurs

Modifiez les variables CSS dans `src/index.css`

## 📱 Installation PWA

### Sur mobile (Android/iOS)

1. Ouvrez l'application dans votre navigateur
2. Appuyez sur le menu du navigateur
3. Sélectionnez "Ajouter à l'écran d'accueil"
4. L'application s'installera comme une app native

### Sur desktop (Chrome/Edge)

1. Ouvrez l'application
2. Cliquez sur l'icône d'installation dans la barre d'adresse
3. Confirmez l'installation

## 🔐 Sécurité

- Les données sont chiffrées en transit (HTTPS)
- Authentification sécurisée via Firebase Auth
- Règles Firestore pour protéger les données utilisateur
- Chaque utilisateur accède uniquement à ses propres données

## 🤝 Synchronisation multi-appareils

1. Connectez-vous avec le même compte Google sur plusieurs appareils
2. Les données se synchroniseront automatiquement en temps réel
3. Les deux parents peuvent utiliser l'app simultanément

## 📊 Structure de données Firestore

```
users/
  {userId}/
    settings/
      preferences/
        - feedingInterval: number
        - theme: string
        - notificationsEnabled: boolean
    events/
      {eventId}/
        - type: 'feeding' | 'diaper'
        - diaperType: 'pee' | 'poop' | 'both' (si type = diaper)
        - notes: string
        - createdAt: string
        - timestamp: serverTimestamp
```

## 🛠️ Technologies utilisées

- **React** - Framework UI
- **Vite** - Build tool
- **Firebase Auth** - Authentification
- **Firestore** - Base de données temps réel
- **Firebase Cloud Messaging** - Notifications push
- **date-fns** - Manipulation des dates
- **PWA** - Progressive Web App

## 📝 Licence

MIT

## 💡 Support

Pour toute question ou problème, créez une issue sur GitHub.
