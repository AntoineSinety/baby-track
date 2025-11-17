# 🔥 Commandes Firebase CLI

## Installation de Firebase CLI

```bash
npm install -g firebase-tools
```

## Connexion à Firebase

```bash
firebase login
```

Une fenêtre de navigateur s'ouvrira pour vous connecter avec votre compte Google.

## Initialisation du projet (première fois seulement)

```bash
firebase init
```

Sélectionnez :
- **Hosting** : Configure files for Firebase Hosting
- Use existing project : **baby-track-53ba7**
- What do you want to use as your public directory? : **dist**
- Configure as a single-page app? : **Yes**
- Set up automatic builds with GitHub? : **No**
- File dist/index.html already exists. Overwrite? : **No**

## Déploiement des règles Firestore

```bash
firebase deploy --only firestore:rules
```

## Build et déploiement sur Firebase Hosting

```bash
# 1. Build de production
npm run build

# 2. Déploiement
firebase deploy --only hosting
```

Votre app sera disponible sur : `https://baby-track-53ba7.web.app`

## Voir les logs

```bash
firebase functions:log
```

## Commandes utiles

### Tester le déploiement localement

```bash
npm run build
firebase serve
```

### Déployer tout (hosting + rules)

```bash
npm run build
firebase deploy
```

### Déployer uniquement les règles Firestore

```bash
firebase deploy --only firestore:rules
```

### Déployer uniquement le hosting

```bash
firebase deploy --only hosting
```

### Annuler le dernier déploiement

```bash
firebase hosting:channel:deploy preview
```

### Lister les projets Firebase

```bash
firebase projects:list
```

### Changer de projet

```bash
firebase use baby-track-53ba7
```

## Workflow de déploiement recommandé

### Déploiement initial (première fois)

```bash
# 1. Installer Firebase CLI
npm install -g firebase-tools

# 2. Se connecter
firebase login

# 3. Déployer les règles Firestore
firebase deploy --only firestore:rules

# 4. Build l'application
npm run build

# 5. Initialiser hosting
firebase init hosting

# 6. Déployer
firebase deploy --only hosting
```

### Mises à jour ultérieures

```bash
# 1. Build l'application
npm run build

# 2. Déployer
firebase deploy --only hosting
```

## URLs après déploiement

Une fois déployé, votre application sera accessible sur :

- **Production** : https://baby-track-53ba7.web.app
- **Alternative** : https://baby-track-53ba7.firebaseapp.com

## Ajouter un domaine personnalisé (optionnel)

1. Allez dans Firebase Console → Hosting
2. Cliquez sur "Add custom domain"
3. Suivez les instructions pour configurer votre DNS

## Configuration des domaines autorisés

Après le déploiement, ajoutez votre domaine dans :

Firebase Console → Authentication → Settings → Authorized domains :
- `baby-track-53ba7.web.app`
- `baby-track-53ba7.firebaseapp.com`
- Votre domaine personnalisé (si applicable)

## Vérifier le statut du projet

```bash
firebase projects:list
```

## Aide

```bash
firebase --help
firebase deploy --help
firebase init --help
```

## Exemple de workflow complet

```bash
# Terminal 1 : Développement
npm run dev

# Terminal 2 : Quand prêt à déployer
git add .
git commit -m "Update features"
npm run build
firebase deploy --only hosting

# Vérifier en ligne
open https://baby-track-53ba7.web.app
```

## Notes importantes

- **Toujours builder avant de déployer** : `npm run build`
- **Le dossier à déployer est `dist/`** (généré par la commande build)
- **Les règles Firestore** sont dans `firestore.rules`
- **La configuration hosting** est dans `firebase.json`

## Commandes de debug

### Tester les règles Firestore localement

```bash
firebase emulators:start --only firestore
```

### Tester le hosting localement

```bash
npm run build
firebase serve --only hosting
```

L'app sera disponible sur http://localhost:5000

## En cas de problème

### Erreur "not authorized"

```bash
firebase logout
firebase login
```

### Erreur "No project active"

```bash
firebase use baby-track-53ba7
```

### Erreur lors du build

```bash
rm -rf node_modules
npm install
npm run build
```

## Ressources

- [Documentation Firebase CLI](https://firebase.google.com/docs/cli)
- [Documentation Hosting](https://firebase.google.com/docs/hosting)
- [Documentation Firestore](https://firebase.google.com/docs/firestore)

---

**Fait avec ❤️ pour Baby Track**
