# 🚀 Déploiement sur GitHub Pages

## 📋 Prérequis

- Compte GitHub
- Git installé
- Repository GitHub créé

## 🔧 Configuration initiale (une seule fois)

### 1. Créer le repository GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter le remote
git remote add origin https://github.com/TON-USERNAME/baby-track.git

# Premier commit
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Configurer les secrets GitHub

Va sur ton repository GitHub :
- **Settings** → **Secrets and variables** → **Actions**
- Clique sur **New repository secret**

Ajoute ces 7 secrets (un par un) :

| Nom du secret | Valeur |
|---------------|--------|
| `VITE_FIREBASE_API_KEY` | Ta clé API Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | `ton-projet.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `ton-projet-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `ton-projet.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123:web:abc` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` |

💡 **Copie ces valeurs depuis ton fichier `.env`**

### 3. Activer GitHub Pages

Dans ton repository GitHub :
1. **Settings** → **Pages**
2. **Source** : GitHub Actions
3. Clique sur **Save**

## 🎯 Déploiement automatique

### À chaque push sur main

```bash
git add .
git commit -m "Mon message de commit"
git push
```

GitHub Actions va automatiquement :
1. ✅ Installer les dépendances
2. ✅ Builder l'application
3. ✅ Déployer sur GitHub Pages

Suivi du déploiement :
- **Actions** tab dans GitHub
- Attends ~2-3 minutes

### URL de l'application

Une fois déployé, ton app sera accessible sur :

```
https://TON-USERNAME.github.io/baby-track/
```

Remplace `TON-USERNAME` par ton nom d'utilisateur GitHub.

## 🔧 Configuration Firebase (OBLIGATOIRE)

### ⚠️ Ajouter le domaine GitHub Pages

**IMPORTANT** : Sans cette étape, l'authentification Google ne fonctionnera pas !

1. Va dans [Firebase Console](https://console.firebase.google.com)
2. Sélectionne ton projet
3. **Authentication** → **Settings** → **Authorized domains**
4. Clique sur **"Add domain"**
5. Ajoute : `antoinesinety.github.io` (remplace par ton username GitHub)
6. Clique sur **"Add"**
7. Vérifie que le domaine apparaît dans la liste

**L'erreur `auth/unauthorized-domain` signifie que cette étape n'a pas été faite.**

### Mettre à jour les règles CORS (si nécessaire)

Si tu utilises Firebase Storage, configure les règles CORS.

## 📱 Tester le déploiement

1. Ouvre l'URL : `https://TON-USERNAME.github.io/baby-track/`
2. Teste la connexion Google
3. Crée un profil bébé
4. Ajoute des événements
5. Teste le lien de partage

## 🔄 Workflow GitHub Actions

Le fichier `.github/workflows/deploy.yml` configure :

- **Déclenchement** : Push sur `main`
- **Build** : Avec les variables d'environnement
- **Déploiement** : Automatique sur GitHub Pages

### Voir les logs

1. **Actions** tab
2. Clique sur le dernier workflow
3. Vérifie les étapes

## ⚠️ Problèmes courants

### Le déploiement échoue

**Vérifier** :
- Les secrets sont bien configurés
- Le nom des secrets est exact (majuscules)
- La branche `main` existe

### Erreur 404 après déploiement

**Solution** :
- Attends 5 minutes (propagation DNS)
- Vérifie que GitHub Pages est activé
- Force un nouveau déploiement : push un commit

### Firebase Auth ne fonctionne pas

**Vérifier** :
- Le domaine `TON-USERNAME.github.io` est autorisé dans Firebase
- Les secrets Firebase sont corrects

### L'app affiche une page blanche

**Vérifier** :
- Les logs du build (Actions tab)
- La console du navigateur (F12)
- Les secrets sont bien définis

## 🎨 Personnaliser l'URL

Si tu veux un domaine personnalisé :

1. Achète un domaine (ex: babytrack.com)
2. Configure le DNS
3. GitHub Settings → Pages → Custom domain
4. Ajoute ton domaine dans Firebase Auth

## 📝 Commandes utiles

```bash
# Forcer un nouveau déploiement
git commit --allow-empty -m "Redeploy"
git push

# Vérifier le status
git status

# Voir l'historique
git log --oneline

# Annuler le dernier commit (local)
git reset --soft HEAD~1
```

## 🔐 Sécurité

✅ **Bon** :
- Les secrets Firebase sont dans GitHub Secrets
- Le fichier `.env` est dans `.gitignore`

❌ **Ne jamais** :
- Commit le fichier `.env`
- Exposer les clés API dans le code

## 🚀 Workflow de développement

```bash
# 1. Développement local
npm run dev

# 2. Test des modifications
# ... teste ton app ...

# 3. Commit et push
git add .
git commit -m "Ajout fonctionnalité X"
git push

# 4. Attends le déploiement (2-3 min)
# 5. Teste sur https://TON-USERNAME.github.io/baby-track/
```

## 📊 Monitoring

### Voir les déploiements

- **GitHub** → **Actions** → Historique
- **GitHub** → **Deployments** → Liste des déploiements

### Analytics

Si tu as activé Google Analytics :
- Firebase Console → Analytics
- Vois les utilisateurs en temps réel

## 🎯 Prochaines étapes

Après le premier déploiement :

1. ✅ Partage l'URL avec ta femme
2. ✅ Teste le lien d'invitation
3. ✅ Teste les notifications
4. ✅ Installe comme PWA

## 📱 Installation PWA

Sur mobile :
1. Ouvre l'URL
2. Menu → "Ajouter à l'écran d'accueil"
3. L'icône apparaît sur ton écran

Sur desktop (Chrome) :
1. Icône d'installation dans la barre d'adresse
2. Clique pour installer

---

**Besoin d'aide ?** Vérifie les logs dans l'onglet **Actions** de GitHub !
