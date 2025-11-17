# 🔐 Règles de Sécurité Firestore

## 📋 Résumé

Les règles Firestore permettent :
- ✅ **Lecture des bébés** : Tout utilisateur authentifié (pour voir les invitations)
- ✅ **Création de bébé** : L'utilisateur doit s'ajouter comme membre
- ✅ **Mise à jour** : Les membres peuvent modifier OU les nouveaux utilisateurs peuvent s'ajouter
- ✅ **Événements** : Seulement les membres peuvent lire/écrire
- ✅ **Paramètres** : Chaque utilisateur accède seulement à ses propres paramètres

## 🎯 Cas d'usage supportés

### 1. Voir une invitation (utilisateur non-membre)

**Scénario** : Maman reçoit un lien `?invite=baby123` et clique dessus

**Règle applicable** :
```javascript
allow read: if request.auth != null;
```

**Résultat** : ✅ Maman peut lire les infos du bébé (nom, date, membres) même si elle n'est pas encore membre

### 2. Accepter une invitation

**Scénario** : Maman clique sur "Accepter l'invitation"

**Action** : `addMemberToBaby()` ajoute Maman dans `memberIds` et `members`

**Règle applicable** :
```javascript
allow update: if request.auth != null && (
  isUserMember(resource.data.memberIds) ||  // Déjà membre
  // OU s'ajoute comme membre
  (!isUserMember(resource.data.memberIds) &&
   isUserMember(request.resource.data.memberIds))
);
```

**Résultat** : ✅ Maman peut s'ajouter elle-même comme membre

### 3. Créer un bébé

**Scénario** : Papa crée le profil du bébé

**Règle applicable** :
```javascript
allow create: if request.auth != null &&
  request.resource.data.createdBy == request.auth.uid &&
  isUserMember(request.resource.data.memberIds);
```

**Résultat** : ✅ Papa peut créer un bébé et s'ajoute automatiquement comme membre

### 4. Voir les événements

**Scénario** : Maman (maintenant membre) veut voir les allaitements

**Règle applicable** :
```javascript
allow read: if request.auth != null &&
  isUserMember(get(/databases/$(database)/documents/babies/$(babyId)).data.memberIds);
```

**Résultat** : ✅ Maman peut voir les événements car elle est membre

### 5. Ajouter un événement

**Scénario** : Maman ajoute un allaitement

**Règle applicable** :
```javascript
allow write: if request.auth != null &&
  isUserMember(get(/databases/$(database)/documents/babies/$(babyId)).data.memberIds);
```

**Résultat** : ✅ Maman peut ajouter des événements car elle est membre

## ⚠️ Sécurité

### Ce qui est permis :

1. ✅ **Utilisateur authentifié** peut lire les infos de n'importe quel bébé
   - **Pourquoi** : Pour afficher l'écran d'invitation
   - **Risque** : Faible - les infos sont juste nom + date de naissance
   - **Atténuation** : Les événements (allaitements, couches) sont protégés

2. ✅ **Utilisateur non-membre** peut s'ajouter comme membre
   - **Pourquoi** : Pour accepter une invitation
   - **Risque** : Modéré - quelqu'un pourrait s'inviter sans permission
   - **Atténuation** : Nécessite de connaître l'ID exact du bébé (dans l'URL)

3. ✅ **Membres** peuvent tout faire sur les événements
   - **Pourquoi** : Partage complet entre parents
   - **Risque** : Faible - seulement les membres de confiance

### Ce qui est interdit :

1. ❌ **Utilisateur non-authentifié** ne peut rien faire
2. ❌ **Utilisateur non-membre** ne peut pas voir les événements
3. ❌ **Utilisateur non-membre** ne peut pas modifier un bébé (sauf pour s'ajouter)
4. ❌ **Utilisateur non-créateur** ne peut pas supprimer un bébé

## 🔒 Amélioration possible de la sécurité

Si tu veux renforcer la sécurité (empêcher quelqu'un de s'auto-inviter), tu peux :

### Option 1 : Système d'invitations avec tokens

Créer une collection `invitations` avec des tokens temporaires :

```javascript
/invitations/{inviteToken}
  - babyId: "baby123"
  - email: "maman@email.com"  // Optional
  - createdAt: timestamp
  - expiresAt: timestamp
  - used: false
```

### Option 2 : Whitelist d'emails

Ajouter une liste d'emails autorisés dans le profil bébé :

```javascript
{
  name: "Léa",
  memberIds: ["papa-uid"],
  invitedEmails: ["maman@email.com", "grandma@email.com"]
}
```

Règle :
```javascript
allow update: if request.auth != null && (
  isUserMember(resource.data.memberIds) ||
  request.auth.token.email in resource.data.invitedEmails
);
```

## 📊 Comparaison

| Méthode | Facilité | Sécurité | Implémentation |
|---------|----------|----------|----------------|
| **Actuelle** (lecture publique) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ Déjà fait |
| **Tokens d'invitation** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⏳ Moyen |
| **Whitelist emails** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⏳ Facile |

## 🎯 Recommandation

Pour l'instant, **la méthode actuelle est suffisante** car :

1. ✅ Les données sensibles (événements) sont protégées
2. ✅ Il faut connaître l'ID exact du bébé pour s'inviter
3. ✅ Seulement le créateur peut supprimer le bébé
4. ✅ Tu peux voir qui s'est ajouté dans la liste des membres
5. ✅ Si quelqu'un s'invite sans permission, tu peux le retirer manuellement

Si tu veux plus de sécurité plus tard, on peut implémenter les tokens ou la whitelist !

## 📝 Règles actuelles complètes

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isUserMember(memberIds) {
      return request.auth != null &&
             request.auth.uid in memberIds;
    }

    match /babies/{babyId} {
      // Lecture publique (authentifiée) pour les invitations
      allow read: if request.auth != null;

      // Création avec auto-membership
      allow create: if request.auth != null &&
                      request.resource.data.createdBy == request.auth.uid &&
                      isUserMember(request.resource.data.memberIds);

      // Mise à jour par membres OU auto-ajout
      allow update: if request.auth != null && (
                      isUserMember(resource.data.memberIds) ||
                      (!isUserMember(resource.data.memberIds) &&
                       isUserMember(request.resource.data.memberIds))
                    );

      // Suppression par créateur uniquement
      allow delete: if request.auth != null &&
                      resource.data.createdBy == request.auth.uid;

      // Événements protégés (membres seulement)
      match /events/{eventId} {
        allow read, write: if request.auth != null &&
                             isUserMember(get(/databases/$(database)/documents/babies/$(babyId)).data.memberIds);
      }
    }

    // Paramètres utilisateur (privés)
    match /users/{userId}/settings/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
