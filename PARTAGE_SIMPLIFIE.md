# 🔗 Système de Partage Simplifié - Lien d'Invitation

## 🎯 Comment ça marche ?

Le partage avec ta femme est maintenant **ultra-simple** grâce au système de lien d'invitation !

### Pour toi (le créateur du profil bébé) :

1. **Crée le profil du bébé** (nom + date de naissance)
2. **Va dans Paramètres** (⚙️)
3. **Copie le lien d'invitation**
4. **Envoie-le à ta femme** (WhatsApp, SMS, Email, etc.)

### Pour ta femme :

1. **Clique sur le lien** reçu
2. **Se connecte avec son compte Google**
3. **Clique sur "Accepter l'invitation"**
4. **C'est tout ! ✅** Elle peut maintenant voir et ajouter des événements

## 📱 Fonctionnalités

### Composant InviteLink (dans Paramètres)

- ✅ **Génération automatique** du lien d'invitation
- ✅ **Bouton "Copier"** pour copier le lien
- ✅ **Bouton "Partager"** (sur mobile) pour partager directement
- ✅ **Liste des membres actuels** avec leurs rôles
- ✅ **Format du lien** : `https://ton-app.com/?invite=BABY_ID`

### Composant InviteAccept (écran d'acceptation)

- ✅ **Affichage du nom** et date de naissance du bébé
- ✅ **Liste des membres** déjà présents
- ✅ **Bouton "Accepter"** pour rejoindre
- ✅ **Bouton "Refuser"** pour annuler
- ✅ **Vérification** : si déjà membre, message approprié
- ✅ **Gestion d'erreurs** : bébé inexistant, etc.

## 🔄 Flux complet

```
PAPA (créateur)                    MAMAN (invitée)
     |                                    |
     | 1. Crée profil bébé               |
     |    - Nom: "Léa"                   |
     |    - Date: 2025-01-01             |
     |                                    |
     | 2. Va dans Paramètres             |
     |    - Section "Partager"           |
     |    - Copie le lien                |
     |                                    |
     | 3. Envoie le lien                 |
     | --------------------------------> |
     |                                    | 4. Clique sur le lien
     |                                    |    - Redirigé vers l'app
     |                                    |    - Voir ?invite=BABY_ID
     |                                    |
     |                                    | 5. Se connecte (Google)
     |                                    |
     |                                    | 6. Écran d'invitation
     |                                    |    - Voit le nom "Léa"
     |                                    |    - Voit les membres
     |                                    |    - Bouton "Accepter"
     |                                    |
     |                                    | 7. Clique "Accepter"
     |                                    |    ✅ Ajoutée comme membre
     |                                    |
     | 8. Papa voit Maman               |
     |    dans la liste des membres     |
     |                                    |
     └─────────── PARTAGE ACTIF ─────────┘
```

## 💾 Structure des données

Quand Maman accepte l'invitation, voici ce qui se passe :

```javascript
// AVANT (seulement Papa)
{
  name: "Léa",
  birthDate: "2025-01-01",
  createdBy: "papa-uid",
  memberIds: ["papa-uid"],
  members: [
    {
      userId: "papa-uid",
      email: "papa@email.com",
      displayName: "Papa",
      role: "owner"
    }
  ]
}

// APRÈS (Papa + Maman)
{
  name: "Léa",
  birthDate: "2025-01-01",
  createdBy: "papa-uid",
  memberIds: ["papa-uid", "maman-uid"],  // ← Ajouté
  members: [
    {
      userId: "papa-uid",
      email: "papa@email.com",
      displayName: "Papa",
      role: "owner"
    },
    {  // ← Nouveau membre
      userId: "maman-uid",
      email: "maman@email.com",
      displayName: "Maman",
      role: "member"
    }
  ]
}
```

## 🔐 Sécurité

Les règles Firestore garantissent que :

1. ✅ **Seuls les membres** peuvent voir les données du bébé
2. ✅ **N'importe qui** peut rejoindre via un lien d'invitation
3. ✅ **Seul le créateur** (owner) peut supprimer le bébé
4. ✅ **Tous les membres** peuvent ajouter/modifier/supprimer des événements

### Règles Firestore

```javascript
// Lecture : uniquement si membre
allow read: if request.auth.uid in resource.data.memberIds;

// Création : l'utilisateur doit s'ajouter comme membre
allow create: if request.auth.uid in request.resource.data.memberIds;

// Mise à jour : uniquement si membre
allow update: if request.auth.uid in resource.data.memberIds;
```

## 🎨 Interface

### Page Paramètres (Settings)

```
┌─────────────────────────────────────┐
│  👥 Partager avec votre partenaire  │
│                                     │
│  Partagez ce lien pour que votre   │
│  partenaire puisse rejoindre...    │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ http://localhost:5176/      │  │
│  │ ?invite=abc123def           │  │
│  └─────────────────────────────┘  │
│                                     │
│  [📋 Copier]  [📤 Partager]        │
│                                     │
│  Membres actuels :                 │
│  • 👑 Papa (Propriétaire)          │
│  • 👤 Maman (Membre)               │
└─────────────────────────────────────┘
```

### Page d'Invitation (InviteAccept)

```
┌─────────────────────────────────────┐
│              👶                      │
│    Invitation à rejoindre           │
│                                     │
│  ╔═══════════════════════════════╗ │
│  ║         Léa                    ║ │
│  ║    Né(e) le 1 janvier 2025    ║ │
│  ╚═══════════════════════════════╝ │
│                                     │
│  Vous êtes invité(e) à suivre      │
│  l'allaitement et les couches de   │
│  Léa avec les autres membres.      │
│                                     │
│  Membres actuels :                 │
│  [P] [M]                           │
│                                     │
│  [✓ Accepter l'invitation]         │
│  [Refuser]                         │
└─────────────────────────────────────┘
```

## 📋 Fichiers créés

### Nouveaux composants

1. **[src/components/InviteLink.jsx](src/components/InviteLink.jsx)** - Affiche le lien d'invitation
2. **[src/components/InviteLink.css](src/components/InviteLink.css)** - Styles
3. **[src/components/InviteAccept.jsx](src/components/InviteAccept.jsx)** - Écran d'acceptation
4. **[src/components/InviteAccept.css](src/components/InviteAccept.css)** - Styles

### Modifications

1. **[src/App.jsx](src/App.jsx)** - Détection du paramètre `?invite=` dans l'URL
2. **[src/components/Settings.jsx](src/components/Settings.jsx)** - Intégration de InviteLink

## 🧪 Test

### Étape 1 : Créer le profil (Papa)

1. Lance l'app : http://localhost:5176
2. Connecte-toi avec ton compte Google
3. Crée le profil du bébé

### Étape 2 : Obtenir le lien

1. Va dans Paramètres (⚙️)
2. Section "Partager avec votre partenaire"
3. Copie le lien

### Étape 3 : Tester l'invitation (Maman)

1. Ouvre une fenêtre de navigation privée
2. Colle le lien d'invitation
3. Connecte-toi avec un autre compte Google
4. Clique sur "Accepter l'invitation"
5. ✅ Tu es maintenant membre !

### Étape 4 : Vérifier le partage

1. Ajoute un événement avec le compte de Papa
2. Rafraîchis l'app avec le compte de Maman
3. ✅ L'événement est visible !

## 🎉 Avantages

- ✅ **Ultra-simple** : Un seul clic pour rejoindre
- ✅ **Pas de configuration manuelle** dans Firebase Console
- ✅ **Fonctionne sur mobile** avec le bouton Partager natif
- ✅ **Sécurisé** : Chacun a son propre compte Google
- ✅ **Pas de limite** : Invite autant de personnes que tu veux (grands-parents, etc.)
- ✅ **Traçabilité** : On sait qui a ajouté chaque événement

## 🚀 Prochaines améliorations possibles

- [ ] Système d'expiration des liens d'invitation
- [ ] Notifications quand quelqu'un rejoint
- [ ] Permissions différentes (viewer, editor, owner)
- [ ] Invitation par email directe
- [ ] QR Code pour partager en personne
