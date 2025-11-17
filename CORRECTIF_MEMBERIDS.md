# Correctif appliqué : memberIds

## 🔧 Problème résolu

L'erreur "Missing or insufficient permissions" lors de la récupération des bébés était causée par une limitation de Firestore :
- On ne peut pas faire de requêtes `array-contains` sur un tableau d'objets complexes
- `getUserBabies()` ne pouvait pas récupérer les bébés dont l'utilisateur est membre

## ✅ Solution implémentée

Ajout d'un champ `memberIds` qui est un **tableau simple de strings** contenant les IDs des utilisateurs :

```javascript
{
  name: "Bébé",
  birthDate: "2025-01-01",
  createdBy: "user-123",
  memberIds: ["user-123", "user-456"],  // ← NOUVEAU : tableau simple
  members: [                             // ← ANCIEN : tableau d'objets (gardé pour les détails)
    { userId: "user-123", email: "papa@...", displayName: "Papa", role: "owner" },
    { userId: "user-456", email: "maman@...", displayName: "Maman", role: "member" }
  ]
}
```

### Pourquoi les deux ?

- **`memberIds`** : Utilisé pour les requêtes Firestore (`array-contains`)
- **`members`** : Utilisé pour afficher les informations détaillées (email, nom, rôle)

## 📝 Fichiers modifiés

### 1. [src/firebase/babies.js](src/firebase/babies.js)

**`createBaby()`** - Ajoute `memberIds` à la création :
```javascript
memberIds: [userId],
members: [{ userId, email, displayName, role: 'owner' }]
```

**`getUserBabies()`** - Utilise `memberIds` pour la requête :
```javascript
const q = query(babiesRef, where('memberIds', 'array-contains', userId));
```

**`addMemberToBaby()`** - Met à jour les deux champs :
```javascript
memberIds: arrayUnion(memberData.userId),
members: arrayUnion(memberData)
```

### 2. [firestore.rules](firestore.rules)

**Règles simplifiées** avec `memberIds` :
```javascript
function isUserMember(memberIds) {
  return request.auth != null &&
         request.auth.uid in memberIds;
}

allow read: if isUserMember(resource.data.memberIds);
```

## 🚀 Résultat

Maintenant :
1. ✅ `getUserBabies()` peut récupérer les bébés avec une requête efficace
2. ✅ Les règles Firestore vérifient correctement l'appartenance
3. ✅ Les requêtes sont optimisées (index automatique sur `memberIds`)
4. ✅ Pas besoin de lire TOUS les bébés pour filtrer côté client

## 🧪 Test

Rafraîchis l'application et crée un profil de bébé. Ça devrait fonctionner sans erreur de permissions !

## 📊 Performance

**AVANT** : Lire tous les bébés → Filtrer côté client → ❌ Permission denied

**MAINTENANT** : Requête directe `where('memberIds', 'array-contains', userId)` → ✅ Succès
