# ✅ Checklist de démarrage - Baby Track

## 📋 Avant de lancer l'application

### Configuration Firebase ✅ FAIT

- [x] Projet Firebase créé (baby-track-53ba7)
- [x] Configuration ajoutée dans `src/firebase/config.js`
- [x] Configuration ajoutée dans `public/firebase-messaging-sw.js`
- [ ] **Authentication Google activée** dans Firebase Console
- [ ] **Firestore Database créée** dans Firebase Console
- [ ] **Règles de sécurité Firestore déployées**

### À faire dans Firebase Console

#### 1. Activer Authentication (5 min)

1. Allez sur [Firebase Console](https://console.firebase.google.com/project/baby-track-53ba7)
2. Cliquez sur **Authentication** dans le menu de gauche
3. Cliquez sur **Get started**
4. Allez dans l'onglet **Sign-in method**
5. Cliquez sur **Google**
6. Basculez le switch sur **Enable**
7. Choisissez un email de support (votre email)
8. Cliquez sur **Save**

#### 2. Créer Firestore Database (3 min)

1. Dans Firebase Console, cliquez sur **Firestore Database**
2. Cliquez sur **Create database**
3. Sélectionnez **Start in production mode**
4. Choisissez une région (ex: `europe-west` pour l'Europe)
5. Cliquez sur **Enable**

#### 3. Configurer les règles Firestore (2 min)

1. Dans Firestore Database, allez dans l'onglet **Rules**
2. Remplacez les règles existantes par :

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

#### 4. (Optionnel) Configurer Cloud Messaging pour notifications

1. Dans Firebase Console, allez dans **Project Settings** (⚙️)
2. Allez dans l'onglet **Cloud Messaging**
3. Dans "Web Push certificates", cliquez sur **Generate key pair**
4. Copiez la clé VAPID générée
5. Collez-la dans `src/hooks/useNotifications.js` ligne 34

---

## 🚀 Lancement de l'application

### Étape 1 : Démarrer le serveur de développement

```bash
npm run dev
```

Attendez le message :
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Étape 2 : Ouvrir dans le navigateur

Ouvrez http://localhost:5173

### Étape 3 : Première connexion

1. Cliquez sur **"Se connecter avec Google"**
2. Sélectionnez votre compte Google
3. Autorisez l'application

---

## ✅ Tests à effectuer

### Test 1 : Authentification
- [ ] La page de connexion s'affiche correctement
- [ ] La connexion avec Google fonctionne
- [ ] Votre nom et photo s'affichent dans l'en-tête

### Test 2 : Ajout d'événements
- [ ] Cliquez sur "Allaitement" → Le modal s'ouvre
- [ ] Ajoutez une note et enregistrez
- [ ] L'événement apparaît dans l'historique
- [ ] Cliquez sur "Couche" → Le modal s'ouvre
- [ ] Sélectionnez un type (pipi/caca/les deux)
- [ ] L'événement apparaît dans l'historique

### Test 3 : Timer de compte à rebours
- [ ] Le timer affiche "Prochain allaitement dans"
- [ ] Le compte à rebours se met à jour chaque seconde
- [ ] Le temps affiché est correct (basé sur l'intervalle)

### Test 4 : Navigation
- [ ] Cliquez sur "Historique" → L'historique complet s'affiche
- [ ] Les filtres fonctionnent (Tous/Allaitement/Couches)
- [ ] Cliquez sur "Statistiques" → Les stats s'affichent
- [ ] Les chiffres sont corrects
- [ ] Cliquez sur "Paramètres" → La page de paramètres s'affiche

### Test 5 : Paramètres
- [ ] Modifiez l'intervalle d'allaitement
- [ ] Cliquez sur "Sauvegarder"
- [ ] Le message de confirmation apparaît
- [ ] Retournez à l'accueil → Le timer utilise le nouvel intervalle

### Test 6 : Thème
- [ ] Cliquez sur le bouton 🌙/☀️
- [ ] Le thème change instantanément
- [ ] Les couleurs sont correctes
- [ ] Rechargez la page → Le thème est conservé

### Test 7 : Suppression
- [ ] Dans l'historique, cliquez sur 🗑️ pour un événement
- [ ] Confirmez la suppression
- [ ] L'événement disparaît immédiatement

### Test 8 : Synchronisation temps réel
- [ ] Ouvrez l'app dans un second onglet/navigateur
- [ ] Connectez-vous avec le même compte
- [ ] Ajoutez un événement dans un onglet
- [ ] Vérifiez qu'il apparaît instantanément dans l'autre

### Test 9 : Déconnexion
- [ ] Allez dans Paramètres
- [ ] Cliquez sur "Déconnexion"
- [ ] Vous revenez à la page de connexion

---

## 📱 Test sur mobile (optionnel)

### Option A : Utiliser ngrok

1. Installez ngrok : https://ngrok.com/download
2. Lancez :
   ```bash
   ngrok http 5173
   ```
3. Utilisez l'URL HTTPS fournie
4. Ajoutez cette URL dans Firebase Console → Authentication → Authorized domains

### Option B : Build et déployer

```bash
npm run build
firebase login
firebase init hosting
firebase deploy
```

---

## 🐛 Résolution de problèmes

### Erreur "Firebase: Error (auth/unauthorized-domain)"

**Cause** : Le domaine n'est pas autorisé dans Firebase

**Solution** :
1. Allez dans Firebase Console → Authentication → Settings
2. Dans "Authorized domains", ajoutez votre domaine
3. Pour localhost : ajoutez `localhost`
4. Pour ngrok : ajoutez votre URL ngrok

### Erreur "Missing or insufficient permissions"

**Cause** : Les règles Firestore ne sont pas configurées

**Solution** :
1. Suivez l'étape 3 "Configurer les règles Firestore" ci-dessus

### L'app ne se charge pas

**Vérifiez** :
- [ ] Firebase est bien configuré dans `src/firebase/config.js`
- [ ] Vous avez une connexion internet
- [ ] La console du navigateur (F12) pour voir les erreurs

### Le timer ne s'affiche pas

**Cause** : Aucun allaitement enregistré

**Solution** : Ajoutez votre premier allaitement !

### Les données ne se synchronisent pas

**Vérifiez** :
- [ ] Vous êtes connecté avec le même compte sur les deux appareils
- [ ] Les règles Firestore sont correctement configurées
- [ ] Vous avez une connexion internet

---

## 📊 Statut de configuration

### ✅ Terminé automatiquement
- [x] Projet initialisé
- [x] Dépendances installées
- [x] Code source créé
- [x] Configuration Firebase dans le code
- [x] Build testé avec succès

### ⏳ À faire manuellement (Firebase Console)
- [ ] Activer Authentication Google
- [ ] Créer Firestore Database
- [ ] Déployer les règles de sécurité
- [ ] (Optionnel) Configurer Cloud Messaging

### 🎯 Optionnel
- [ ] Créer des icônes PWA personnalisées
- [ ] Déployer sur Firebase Hosting
- [ ] Installer sur mobile
- [ ] Tester avec votre partenaire

---

## 🎉 Une fois tous les tests passés

Félicitations ! Votre application est **100% fonctionnelle** !

### Prochaines étapes :
1. Utilisez l'app pour votre bébé
2. Partagez avec votre partenaire (voir SHARE_WITH_PARTNER.md)
3. Consultez TODO.md pour les améliorations futures

---

**Bon suivi de bébé ! 👶🍼**
