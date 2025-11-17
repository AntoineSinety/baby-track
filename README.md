# 👶 Baby Track

Application PWA de suivi d'allaitement et de couches pour bébé avec **partage en temps réel** entre parents.

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

Ouvre : **http://localhost:5173**

1. **Connecte-toi** avec Google
2. **Crée le profil du bébé** (nom + date de naissance)
3. **Commence à tracker** ! 🎉

## ✨ Fonctionnalités principales

### Suivi complet
- 🍼 **Allaitement** : durée, sein gauche/droit, heure personnalisée
- 💩 **Couches** : pipi, caca, ou les deux
- ⏰ **Timer de rappel** pour le prochain allaitement
- 📝 **Notes** sur chaque événement
- ✏️ **Modification** des événements passés

### Partage ultra-simple
- 👥 **Lien d'invitation** : partage en 1 clic
- 🔄 **Sync temps réel** entre tous les appareils
- 👤 Voir **qui a ajouté quoi**

### Visualisation
- 📊 **Graphiques** sur 7 jours
- 📅 **Résumé quotidien**
- ⏱️ **Timeline visuelle** avec heures
- 📜 **Historique complet**

### Bonus
- 🎮 **Mode Papa/Maman** avec compteurs fun
- 🏆 **Badges** de réussite
- 📱 **PWA** : installe comme une app
- 🌙 **Mode sombre/clair**
- 🔔 **Notifications push**

## 👥 Partager avec ta femme

1. Va dans **Paramètres** ⚙️
2. Section **"Partager avec votre partenaire"**
3. **Copie le lien** ou clique **Partager**
4. Envoie-le par WhatsApp/SMS
5. Elle clique, se connecte, accepte → ✅ **C'est fait !**

## 📱 Tester sur mobile

```bash
npm run dev:host
```

Affiche :
```
➜  Network: http://192.168.1.X:5173/
```

Sur ton téléphone (même WiFi) : ouvre cette adresse !

## 🔔 Test des notifications

1. **Paramètres** ⚙️ → "Test des Notifications"
2. **Demander la permission**
3. Teste : notification simple, rappel allaitement, rappel couche

## ⚙️ Configuration Firebase

### 1. Créer `.env`

```env
VITE_FIREBASE_API_KEY=ta-clé
VITE_FIREBASE_AUTH_DOMAIN=ton-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ton-projet-id
VITE_FIREBASE_STORAGE_BUCKET=ton-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Déployer les règles Firestore

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

## 🛠️ Commandes

| Commande | Description |
|----------|-------------|
| `npm run dev` | Dev local uniquement |
| `npm run dev:host` | Dev + réseau (mobile) |
| `npm run build` | Build production |
| `npm run preview` | Preview du build |

## 📂 Structure importante

```
src/
├── components/
│   ├── Dashboard.jsx          # Page principale
│   ├── BabySetup.jsx          # Création profil bébé
│   ├── InviteLink.jsx         # Lien de partage
│   ├── InviteAccept.jsx       # Acceptation invitation
│   ├── EventModal.jsx         # Ajout/édition événement
│   └── NotificationTest.jsx   # Test notifications
├── firebase/
│   ├── config.js              # Config Firebase
│   ├── firestore.js           # Fonctions Firestore
│   └── babies.js              # Gestion bébés partagés
└── context/
    ├── AuthContext.jsx
    ├── BabyContext.jsx
    └── SettingsContext.jsx
```

## 🔐 Sécurité Firestore

Les règles permettent :
- ✅ Lecture publique des profils bébés (pour invitations)
- ✅ Auto-ajout comme membre en acceptant
- ✅ Seuls les membres voient/modifient les événements

Structure multi-utilisateurs :
```
/babies/{babyId}
  - name: "Prénom"
  - birthDate: "2025-01-01"
  - memberIds: ["user1", "user2"]
  - members: [
      { userId, email, displayName, role }
    ]
  - /events/{eventId}
      - type: "feeding" | "diaper"
      - addedBy: { userId, displayName }
```

## 🎯 Plus de détails

Pour un guide complet, voir :
- **[NOTIFICATIONS_GUIDE.md](NOTIFICATIONS_GUIDE.md)** - Guide notifications

## 🛠️ Technologies

- React 18.3 + Vite 6
- Firebase 11 (Auth + Firestore)
- Chart.js pour graphiques
- date-fns pour les dates
- Vite PWA

## 📝 Version

**v1.0.0** - Application complète avec partage multi-utilisateurs

---

Made with ❤️ for tracking baby moments
