# 📂 Structure du projet Baby Track

## Fichiers créés

```
baby-track/
│
├── 📄 Configuration & Documentation
│   ├── package.json                    # Dépendances et scripts npm
│   ├── vite.config.js                  # Configuration Vite + PWA
│   ├── firebase.json                   # Configuration Firebase Hosting
│   ├── firestore.rules                 # Règles de sécurité Firestore
│   ├── firestore.indexes.json          # Index Firestore
│   ├── .gitignore                      # Fichiers à ignorer par Git
│   ├── .env.example                    # Template variables d'environnement
│   │
│   ├── README.md                       # Documentation complète
│   ├── SETUP.md                        # Guide de configuration
│   ├── QUICK_START.md                  # Guide de démarrage rapide
│   ├── TODO.md                         # Améliorations futures
│   └── PROJECT_STRUCTURE.md            # Ce fichier
│
├── 📁 public/                          # Fichiers statiques
│   ├── firebase-messaging-sw.js        # Service Worker pour notifications
│   └── ICONS_README.md                 # Guide pour créer les icônes PWA
│
├── 📁 src/                             # Code source
│   │
│   ├── 📄 Fichiers principaux
│   │   ├── main.jsx                    # Point d'entrée React
│   │   ├── App.jsx                     # Composant racine
│   │   ├── App.css                     # Styles du composant App
│   │   └── index.css                   # Styles globaux + variables thème
│   │
│   ├── 📁 components/                  # Composants React
│   │   ├── Login.jsx                   # Page de connexion Google
│   │   ├── Login.css
│   │   │
│   │   ├── Dashboard.jsx               # Dashboard principal avec navigation
│   │   ├── Dashboard.css
│   │   │
│   │   ├── Header.jsx                  # En-tête avec navigation et profil
│   │   ├── Header.css
│   │   │
│   │   ├── FeedingTimer.jsx            # Timer de compte à rebours
│   │   ├── FeedingTimer.css            # avec animations
│   │   │
│   │   ├── QuickActions.jsx            # Boutons rapides (allaitement/couche)
│   │   ├── QuickActions.css
│   │   │
│   │   ├── EventModal.jsx              # Modal pour ajouter événements
│   │   ├── EventModal.css              # avec formulaires
│   │   │
│   │   ├── EventHistory.jsx            # Historique des événements
│   │   ├── EventHistory.css            # avec filtres et suppression
│   │   │
│   │   ├── Statistics.jsx              # Page de statistiques
│   │   ├── Statistics.css              # (jour/semaine/total)
│   │   │
│   │   ├── Settings.jsx                # Page de paramètres
│   │   └── Settings.css                # (intervalle, thème, notifs)
│   │
│   ├── 📁 context/                     # Contextes React
│   │   ├── AuthContext.jsx             # Gestion de l'authentification
│   │   └── SettingsContext.jsx         # Gestion des paramètres utilisateur
│   │
│   ├── 📁 firebase/                    # Services Firebase
│   │   ├── config.js                   # Configuration Firebase
│   │   ├── auth.js                     # Services d'authentification
│   │   └── firestore.js                # Services Firestore (CRUD)
│   │
│   └── 📁 hooks/                       # Custom React hooks
│       └── useNotifications.js         # Hook pour notifications push
│
└── 📁 node_modules/                    # Dépendances (généré par npm)

```

## Composants et responsabilités

### 🔐 Authentification
- **Login.jsx** - Interface de connexion avec Google
- **AuthContext.jsx** - Gestion de l'état d'authentification global

### 📊 Dashboard
- **Dashboard.jsx** - Conteneur principal, gère les vues
- **Header.jsx** - Navigation, profil, toggle thème

### ⏰ Tracking Allaitement
- **FeedingTimer.jsx** - Compte à rebours en temps réel
- Affiche le temps restant avant le prochain allaitement
- Animations et alertes visuelles

### 👶 Événements
- **QuickActions.jsx** - Boutons pour ajouter rapidement
- **EventModal.jsx** - Formulaire détaillé avec notes
- **EventHistory.jsx** - Liste avec filtres et suppression

### 📈 Statistiques
- **Statistics.jsx** - Cartes statistiques
- Données par jour, semaine, total
- Pour allaitements et couches

### ⚙️ Paramètres
- **Settings.jsx** - Profil, intervalle, thème, notifications
- **SettingsContext.jsx** - Persistance des paramètres

### 🔔 Notifications
- **useNotifications.js** - Hook pour gérer les notifications
- **firebase-messaging-sw.js** - Service Worker

### 🎨 Styles
- **index.css** - Variables CSS pour thèmes dark/light
- Chaque composant a son propre fichier CSS
- Design minimaliste sans framework externe

## Services Firebase

### Auth (auth.js)
- `signInWithGoogle()` - Connexion Google
- `logout()` - Déconnexion
- `onAuthChange()` - Observer les changements d'auth

### Firestore (firestore.js)
- `addEvent()` - Ajouter un événement
- `subscribeToEvents()` - Écouter les événements en temps réel
- `getUserSettings()` - Récupérer les paramètres
- `updateUserSettings()` - Mettre à jour les paramètres
- `deleteEvent()` - Supprimer un événement
- `getEventsByTypeAndPeriod()` - Filtrer les événements

## Structure de données Firestore

```
users/
  {userId}/
    settings/
      preferences/
        feedingInterval: number (en heures)
        theme: "dark" | "light"
        notificationsEnabled: boolean

    events/
      {eventId}/
        type: "feeding" | "diaper"
        diaperType: "pee" | "poop" | "both" (optionnel)
        notes: string (optionnel)
        createdAt: string (ISO date)
        timestamp: serverTimestamp
```

## Technologies utilisées

- **React 18** - Framework UI
- **Vite 6** - Build tool ultra-rapide
- **Firebase 11** - Backend as a Service
  - Firebase Auth - Authentification
  - Firestore - Base de données temps réel
  - Firebase Cloud Messaging - Notifications push
- **date-fns 4** - Manipulation des dates
- **vite-plugin-pwa** - Configuration PWA
- **CSS natif** - Pas de framework CSS

## Scripts npm disponibles

```bash
npm run dev      # Serveur de développement (port 5173)
npm run build    # Build de production dans dist/
npm run preview  # Prévisualiser le build de production
```

## Fichiers à configurer

### Obligatoires avant de démarrer
1. **src/firebase/config.js** - Vos identifiants Firebase
2. **public/firebase-messaging-sw.js** - Mêmes identifiants

### Optionnels
1. **.env** - Variables d'environnement (copier de .env.example)
2. **public/pwa-*.png** - Icônes personnalisées pour la PWA

## Règles de sécurité Firestore

Les règles dans `firestore.rules` garantissent que :
- Un utilisateur peut uniquement lire/écrire ses propres données
- Authentification obligatoire pour toute opération
- Isolation complète entre utilisateurs

## PWA - Progressive Web App

L'application est une PWA complète avec :
- ✅ Manifest.json configuré
- ✅ Service Worker pour le cache
- ✅ Fonctionnement hors ligne
- ✅ Installable sur mobile et desktop
- ✅ Notifications push

## Thème sombre/clair

Système de thème complet avec variables CSS :
- Défini dans `index.css`
- Bascule via `SettingsContext`
- Persiste dans Firestore
- S'applique automatiquement

## Points d'attention

### Sécurité
- Les identifiants Firebase DOIVENT être configurés
- Les règles Firestore DOIVENT être déployées
- HTTPS obligatoire pour les notifications

### Performance
- La synchronisation temps réel utilise des listeners Firestore
- Le Service Worker cache les assets statiques
- Les composants sont optimisés pour React 18

### Mobile
- Design mobile-first
- Touch-friendly (boutons de 44px min)
- Responsive sur tous les écrans

## Prochaines étapes

Voir [TODO.md](./TODO.md) pour la liste complète des améliorations possibles.
