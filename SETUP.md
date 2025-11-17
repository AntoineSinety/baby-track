# 🚀 Guide de démarrage rapide - Baby Track

## Étape 1 : Configuration Firebase (15 minutes)

### 1.1 Créer un projet Firebase

1. Allez sur [https://console.firebase.google.com](https://console.firebase.google.com)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet (ex: "baby-track")
4. Désactivez Google Analytics (optionnel)
5. Cliquez sur "Créer le projet"

### 1.2 Configurer l'authentification Google

1. Dans Firebase Console, allez dans **Authentication**
2. Cliquez sur **Get started**
3. Allez dans l'onglet **Sign-in method**
4. Cliquez sur **Google**
5. Activez le fournisseur
6. Sélectionnez un email de support
7. Cliquez sur **Save**

### 1.3 Créer la base de données Firestore

1. Dans Firebase Console, allez dans **Firestore Database**
2. Cliquez sur **Create database**
3. Choisissez **Start in production mode**
4. Sélectionnez une région proche de vous (ex: europe-west)
5. Cliquez sur **Enable**

### 1.4 Configurer les règles de sécurité Firestore

1. Dans Firestore Database, allez dans l'onglet **Rules**
2. Copiez-collez les règles suivantes :

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

3. Cliquez sur **Publish**

### 1.5 Récupérer vos identifiants Firebase

1. Dans Firebase Console, cliquez sur l'icône ⚙️ (Settings) → **Project settings**
2. Descendez jusqu'à "Your apps"
3. Cliquez sur l'icône **</>** (Web)
4. Enregistrez votre app (ex: "Baby Track Web")
5. **NE cochez PAS** "Also set up Firebase Hosting"
6. Cliquez sur **Register app**
7. Copiez les valeurs de configuration

## Étape 2 : Configuration du projet (5 minutes)

### 2.1 Créer le fichier .env

1. Copiez le fichier `.env.example` :

```bash
cp .env.example .env
```

2. Ouvrez `.env` et remplissez avec vos valeurs Firebase

### 2.2 Mettre à jour src/firebase/config.js

1. Ouvrez `src/firebase/config.js`
2. Remplacez les valeurs de `firebaseConfig` avec vos propres valeurs :

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID"
};
```

### 2.3 Mettre à jour public/firebase-messaging-sw.js

1. Ouvrez `public/firebase-messaging-sw.js`
2. Remplacez les valeurs dans `firebase.initializeApp()` avec les mêmes valeurs

## Étape 3 : Lancer l'application (1 minute)

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Étape 4 : Première connexion

1. Cliquez sur "Se connecter avec Google"
2. Sélectionnez votre compte Google
3. Autorisez l'application

Vous êtes prêt ! 🎉

## Étape 5 : Tester sur mobile

### Option A : Utiliser ngrok (recommandé pour les tests)

1. Installez ngrok : [https://ngrok.com/download](https://ngrok.com/download)
2. Lancez ngrok :

```bash
ngrok http 5173
```

3. Utilisez l'URL HTTPS fournie sur votre mobile
4. Ajoutez cette URL dans les domaines autorisés de Firebase :
   - Firebase Console → Authentication → Settings → Authorized domains

### Option B : Build et déployer sur Firebase Hosting

```bash
npm run build
firebase login
firebase init hosting
firebase deploy
```

## Problèmes courants

### Erreur "Firebase: Error (auth/unauthorized-domain)"

**Solution :** Ajoutez votre domaine dans Firebase Console → Authentication → Settings → Authorized domains

### Les notifications ne fonctionnent pas

**Solution :**
1. Vérifiez que vous avez accepté les permissions de notification
2. Vérifiez que HTTPS est activé (obligatoire pour les notifications)
3. Vérifiez que `firebase-messaging-sw.js` est bien configuré

### Les données ne se synchronisent pas

**Solution :**
1. Vérifiez les règles Firestore
2. Ouvrez la console du navigateur pour voir les erreurs
3. Vérifiez que vous êtes bien connecté avec le même compte sur les deux appareils

## Support

Si vous rencontrez des problèmes, vérifiez :
- La console du navigateur (F12) pour les erreurs
- La console Firebase pour les logs
- Que toutes les étapes ont été suivies correctement

Bon suivi de bébé ! 👶🍼
