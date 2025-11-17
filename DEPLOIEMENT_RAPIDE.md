# 🚀 Déploiement Rapide - ÉTAPES OBLIGATOIRES

## ⚠️ PROBLÈME ACTUEL

L'application affiche une erreur car **les règles Firestore ne sont pas encore déployées**.

## ✅ SOLUTION EN 3 ÉTAPES

### Étape 1 : Installer Firebase CLI

Ouvre un terminal PowerShell en tant qu'administrateur et exécute :

```powershell
npm install -g firebase-tools
```

### Étape 2 : Se connecter à Firebase

```powershell
firebase login
```

Une fenêtre de navigateur s'ouvrira pour te connecter avec ton compte Google.

### Étape 3 : Initialiser et déployer

Dans le dossier du projet (`c:\Users\antoi\Desktop\Code\baby-track`), exécute :

```powershell
# Initialiser Firestore (une seule fois)
firebase init firestore

# Sélectionne :
# - Use an existing project → baby-track-53ba7
# - Firestore rules file → firestore.rules (appuie sur Entrée)
# - Firestore indexes file → firestore.indexes.json (appuie sur Entrée)

# Déployer les règles
firebase deploy --only firestore:rules
```

### ✨ C'est fait !

Après le déploiement :
1. Rafraîchis la page de l'application
2. Connecte-toi avec ton compte Google
3. Crée le profil du bébé
4. Commence à tracker ! 🎉

## 🔧 Alternative temporaire : Règles publiques (NON recommandé pour production)

Si tu veux tester rapidement **SANS déployer** (seulement pour développement) :

1. Va sur [Firebase Console](https://console.firebase.google.com/project/baby-track-53ba7/firestore/rules)
2. Remplace temporairement les règles par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Clique sur "Publier"
4. Rafraîchis l'application

⚠️ **ATTENTION** : Ces règles permettent à n'importe quel utilisateur authentifié d'accéder à toutes les données. C'est OK pour tester, mais tu DOIS déployer les vraies règles ensuite !

## 📝 Vérification

Tu peux vérifier que les règles sont bien déployées en visitant :
https://console.firebase.google.com/project/baby-track-53ba7/firestore/rules

Les règles déployées doivent contenir :
- `match /babies/{babyId}`
- `request.auth.uid in resource.data.members.map((m) => m.userId)`
