# Deploiement GitHub Pages via GitHub Actions

Ce document explique le fonctionnement, l'architecture et la procedure de deploiement de Math3D Studio sur GitHub Pages en utilisant GitHub Actions.

---

## 1. Architecture du Mode Statique

Math3D Studio dispose d'une architecture a double mode :
1. **Mode Full-Stack Local** : Execute un serveur Express (`server.ts`) avec des routes d'API (`/api/resolve`, `/api/metrics`, `/api/board/settings`).
2. **Mode Statique / Client-Only (GitHub Pages)** : Concu pour un hebergement gratuit sans serveur actif, active grace a la variable d'environnement `VITE_STATIC_MODE=true`.

### Fonctionnalites en Mode Statique
- **Resolution Mathematique (Tier 1 & Tier 2)** : Le calcul heuristique et le dictionnaire de solutions sont executes directement dans le navigateur du client (`src/lib/clientApi/resolver.ts`).
- **Resolution IA (Tier 3)** : Appel direct au SDK Gemini depuis le navigateur lorsque l'utilisateur fournit sa cle API dans les parametres.
- **Stockage des Parametres et Metriques** : Les configurations du tableau noir et les compteurs d'exercices sont persistes dans le `localStorage` du navigateur du visiteur.
- **Gestion des Donnees (JSON)** : Les fichiers de programmes (`courses-*.json`, `exercises-*.json`, `math3d_cache.json`) sont servis depuis le dossier `public/data/` integre au bundle statique.

---

## 2. Configuration du Workflow CI/CD

Le workflow GitHub Actions est defini dans le fichier suivant :
`.github/workflows/deploy.yml`

### Declencheur
Le deploiement se lance automatiquement a chaque `git push` sur la branche principale :
```yaml
on:
  push:
    branches:
      - main
```

### Permissions Requises
Pour que le token interne de GitHub Actions puisse publier le site, les permissions suivantes sont obligatoires :
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### Etapes du Job Build
1. **Checkout** (`actions/checkout@v4`) : Recupere le code source du depot.
2. **Setup Node** (`actions/setup-node@v4`) : Prepare l'environnement Node.js (version 22).
3. **Installation des Dependances** :
   ```bash
   if [ -f package-lock.json ]; then npm ci; else npm install; fi
   ```
4. **Compilation Statique** :
   Execute `npm run build:ghpages`, qui :
   - Synchronise `data/*` vers `public/data/`.
   - Lance Vite avec `VITE_STATIC_MODE=true` et `--base=./` pour generer des chemins d'actifs relatifs compatibles avec les sous-domaines de GitHub (`https://coundia.github.io/maths-studio/`).
5. **Configuration Pages** (`actions/configure-pages@v5`) : Prepare les metadonnees du site avec `enablement: true`.
6. **Upload de l'Artefact** (`actions/upload-pages-artifact@v3`) : Envoie le contenu de `dist/` vers l'infrastructure GitHub Pages.

### Etape du Job Deploy
- **Publication** (`actions/deploy-pages@v4`) : Active la nouvelle version du site a l'URL publique de GitHub Pages.

---

## 3. Activation Initiale sur GitHub

Pour que le workflow puisse deployer le site, GitHub Pages doit etre explicitement configure sur le depot.

1. Rendez-vous sur la page des parametres du depot :
   `https://github.com/coundia/maths-studio/settings/pages`
2. Dans la section **Build and deployment** :
   - Sous **Source**, selectionnez **GitHub Actions** (ne pas laisser *Deploy from a branch*).
3. Sauvegardez si necessaire.

---

## 4. Resolution des Incidents Courants

### Erreur : `Get Pages site failed. Please verify that the repository has Pages enabled... HttpError: Not Found`
- **Cause** : La fonctionnalite Pages n'est pas encore configuree sur le depot GitHub, ou la source est restee sur *Deploy from a branch*.
- **Solution** : Aller dans `Settings > Pages` sur GitHub et selectionner **GitHub Actions** comme source.

### Erreur : `The npm ci command can only install with an existing package-lock.json`
- **Cause** : Le fichier `package-lock.json` n'est pas versionne dans Git.
- **Solution** : Le workflow utilise la commande conditionnelle `if [ -f package-lock.json ]; then npm ci; else npm install; fi` pour tolerer l'absence de lockfile tout en favorisant les builds deterministes des qu'il est cree.

### Erreur : Chemins d'actifs en 404 (fichiers JS, CSS ou JSON introuvables)
- **Cause** : Les URL absolues de premier niveau (`/assets/...`, `/data/...`) echouent lorsque le projet est heberge sous un sous-dossier de depot (`https://coundia.github.io/maths-studio/`).
- **Solution** :
  - Utilisation de `--base=./` dans le script `build:ghpages`.
  - Utilisation de la constante `import.meta.env.BASE_URL` dans `src/api/apiClient.ts` et `src/lib/clientApi/storage.ts`.

---

## 5. Commandes de Mise en Production

Pour publier une nouvelle version :

```bash
# 1. Verifier la compilation TypeScript en local
npm run lint

# 2. Tester le build statique localement
npm run build:ghpages

# 3. Commiter et pousser les modifications
git add .
git commit -m "feat: description de la fonctionnalite"
git push origin main
```

Le suivi en temps reel du deploiement est accessible sur l'onglet **Actions** de votre depot GitHub.
