# Déploiement des règles Firestore

## ⚠️ IMPORTANT - À faire IMMÉDIATEMENT

Les règles Firestore doivent être déployées pour que l'application fonctionne correctement. Sans cela, vous verrez des erreurs "permission-denied".

## Installation de Firebase CLI

Si ce n'est pas déjà fait, installez Firebase CLI globalement :

```bash
npm install -g firebase-tools
```

## Connexion à Firebase

Connectez-vous à votre compte Firebase :

```bash
firebase login
```

## Initialisation du projet (si pas déjà fait)

Si le projet n'est pas encore initialisé avec Firebase CLI :

```bash
firebase init firestore
```

Sélectionnez :
- Votre projet Firebase existant (`baby-track-53ba7`)
- Utilisez `firestore.rules` comme fichier de règles (déjà créé)
- Utilisez `firestore.indexes.json` comme fichier d'index

## Déploiement des règles

Pour déployer les nouvelles règles Firestore qui permettent le partage multi-utilisateurs :

```bash
firebase deploy --only firestore:rules
```

**Note** : Les règles ont été corrigées pour utiliser `.map((m) => m.userId)` au lieu de `.hasAny()` car Firestore ne peut pas comparer des objets complexes directement.

## Vérification

Après le déploiement, vous pouvez vérifier les règles dans la console Firebase :
https://console.firebase.google.com/project/baby-track-53ba7/firestore/rules

## Règles déployées

Les règles permettent maintenant :
- ✅ Chaque utilisateur peut créer un nouveau profil de bébé
- ✅ Seuls les membres d'un bébé peuvent lire/modifier le profil
- ✅ Seuls les membres peuvent ajouter/modifier/supprimer des événements du bébé
- ✅ Les paramètres utilisateur restent privés (un utilisateur ne peut accéder qu'à ses propres paramètres)

## Structure des données après déploiement

```
/babies/{babyId}
  - name: "Prénom du bébé"
  - birthDate: "2025-01-01"
  - createdBy: "userId du créateur"
  - members: [
      { userId: "xxx", email: "papa@email.com", role: "owner" },
      { userId: "yyy", email: "maman@email.com", role: "member" }
    ]
  - /events/{eventId}
      - type: "feeding" | "diaper"
      - addedBy: { userId: "xxx", displayName: "Papa" }
      - createdAt: "2025-01-01T10:30:00.000Z"
      - ...

/users/{userId}/settings/preferences
  - feedingInterval: 4
  - theme: "dark"
  - notificationsEnabled: true
```

## Test du système multi-utilisateurs

1. Déployez les règles avec la commande ci-dessus
2. Connectez-vous avec votre compte Google
3. Créez un profil de bébé (nom et date de naissance)
4. Ajoutez des événements (allaitement, couche)
5. Pour tester le partage :
   - Demandez à votre partenaire de se connecter avec son propre compte Google
   - Pour l'instant, vous devrez ajouter manuellement son compte dans Firestore
   - Dans la prochaine étape, nous créerons une interface d'invitation

## Ajout manuel d'un membre (temporaire)

En attendant l'interface d'invitation, vous pouvez ajouter un membre manuellement dans la console Firebase :

1. Allez dans Firestore Database
2. Trouvez votre document dans `babies/{babyId}`
3. Cliquez sur "Edit document"
4. Dans le tableau `members`, ajoutez un nouvel élément :
   ```json
   {
     "userId": "UID_DU_PARTENAIRE",
     "email": "email@partenaire.com",
     "displayName": "Prénom",
     "role": "member"
   }
   ```
5. Sauvegardez

Votre partenaire pourra maintenant voir et modifier les événements du bébé !
