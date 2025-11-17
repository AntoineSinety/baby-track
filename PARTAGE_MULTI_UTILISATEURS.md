# Système de Partage Multi-Utilisateurs

## ✅ Ce qui a été implémenté

### 1. Nouveau modèle de données (`src/firebase/babies.js`)
- Collection `babies` pour stocker les profils de bébés
- Chaque bébé contient une liste de `members` (parents)
- Fonctions pour créer, lire, mettre à jour des bébés
- Système d'ajout/retrait de membres
- Vérification des droits d'accès (owner vs editor)

**Structure des données :**
```
babies/{babyId}
  ├─ name: string
  ├─ birthDate: string
  ├─ photo: string
  ├─ createdBy: userId
  ├─ members: [
  │    { userId, email, displayName, role: 'owner'|'editor' }
  │  ]
  └─ events/{eventId}
       ├─ type, duration, notes...
       └─ addedBy: { userId, displayName }
```

### 2. Context React pour gérer le bébé actif (`src/context/BabyContext.jsx`)
- Charge tous les bébés accessibles par l'utilisateur
- Gère le bébé actif (celui qu'on consulte)
- Sauvegarde le dernier bébé actif dans localStorage
- Fonction pour changer de bébé

### 3. Adaptation des fonctions Firestore (`src/firebase/firestore.js`)
- Toutes les fonctions utilisent maintenant `babyId` au lieu de `userId`
- `addEvent(babyId, eventData, userInfo)` - sauvegarde qui a ajouté l'événement
- `subscribeToEvents(babyId, callback)` - écoute les événements du bébé
- `updateEvent(babyId, eventId, eventData)`
- `deleteEvent(babyId, eventId)`

### 4. Nouvelles règles de sécurité Firestore (`firestore.rules`)
- Vérification que l'utilisateur est membre du bébé
- Propriétaire (`owner`) peut tout faire
- Éditeur (`editor`) peut lire/créer/modifier/supprimer les événements
- Les paramètres utilisateur restent privés par utilisateur

## 🚧 Ce qu'il reste à faire

### 1. Mettre à jour App.jsx
Ajouter le BabyProvider autour de l'application :

```jsx
import { BabyProvider } from './context/BabyContext';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BabyProvider>  {/* AJOUTER */}
          <Router>
            {/* ... */}
          </Router>
        </BabyProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
```

### 2. Créer l'interface de sélection/création de bébé
- Composant `BabySetup.jsx` pour la première utilisation
- Formulaire pour créer un nouveau bébé (nom, date de naissance, photo)
- Si aucun bébé n'existe, afficher ce formulaire
- Si des bébés existent, afficher un sélecteur

### 3. Modifier le Dashboard
Adapter pour utiliser `activeBaby` au lieu de `user` :

```jsx
import { useBaby } from '../context/BabyContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { activeBaby } = useBaby();  // AJOUTER

  useEffect(() => {
    if (activeBaby) {
      const unsubscribe = subscribeToEvents(activeBaby.id, (eventsData) => {
        setEvents(eventsData);
      });
      return () => unsubscribe();
    }
  }, [activeBaby]);

  const handleAddEvent = async (eventData) => {
    await addEvent(activeBaby.id, eventData, {
      userId: user.uid,
      displayName: user.displayName
    });
  };
}
```

### 4. Créer l'interface de gestion des membres
Composant `BabyMembers.jsx` pour :
- Voir la liste des membres du bébé
- Inviter un nouveau membre par email
- Retirer un membre (si owner)

### 5. Ajouter un sélecteur de bébé dans le Header
- Dropdown pour changer de bébé si plusieurs
- Bouton pour ajouter un nouveau bébé
- Bouton pour gérer les membres

### 6. Système d'invitation
- Créer une collection `invitations` dans Firestore
- Fonction pour envoyer une invitation par email
- Interface pour accepter/refuser une invitation

## 📝 Déploiement des règles Firestore

Une fois tout implémenté, déployez les nouvelles règles :

```bash
firebase deploy --only firestore:rules
```

## 🔄 Migration des données existantes

Si vous avez déjà des données dans `/users/{userId}/events/`, il faudra les migrer :

```javascript
// Script de migration (à exécuter une fois)
async function migrateUserDataToBaby(userId, babyId) {
  const oldEventsRef = collection(db, 'users', userId, 'events');
  const newEventsRef = collection(db, 'babies', babyId, 'events');

  const snapshot = await getDocs(oldEventsRef);

  for (const doc of snapshot.docs) {
    await setDoc(doc(newEventsRef, doc.id), {
      ...doc.data(),
      addedBy: { userId, displayName: 'Migration' }
    });
  }
}
```

## 🎯 Workflow utilisateur

1. **Première connexion** → Créer le profil du bébé
2. **Inviter le conjoint** → Partager l'email
3. **Le conjoint accepte** → Accès au même bébé
4. **Les deux peuvent** → Ajouter/modifier/supprimer les événements
5. **Voir qui a ajouté** → Chaque événement montre `addedBy.displayName`

## ⚠️ Points importants

- Les **paramètres utilisateur** (thème, intervalle allaitement) restent **personnels**
- Les **événements** sont **partagés** entre tous les membres
- Seul le **propriétaire** peut supprimer le profil bébé
- Chaque utilisateur peut être membre de **plusieurs bébés** (utile pour jumeaux, fratrie)
