# Math3D Studio

> **Plateforme interactive et animée d'apprentissage des Mathématiques pour les classes de 4ème et 3ème (Programme Sénégal / Préparation BFEM).**

Math3D Studio combine des visualisations géométriques 3D dynamiques (Three.js), un moteur de rendu de formules mathématiques (KaTeX), un pipeline de résolution algébrique à 3 niveaux (Cache, Heuristiques déterministes, Fallback IA Gemini), ainsi que des leçons, quiz et exercices conformes au programme scolaire.

---

## Fonctionnalités Principales

- **Cours & Programmes Découplés (3ème & 4ème)** :
  - *3ème (BFEM)* : Racine carrée, Théorème de Thalès & Réciproque, Angles inscrits & Polygones réguliers, Propriété de Pythagore, Calcul algébrique, Équations et Inéquations à une inconnue, etc.
  - *4ème* : Nombres rationnels, Géométrie dans l'espace, Triangles et parallèles, etc.
- **Visualisations 3D & 2D Interactives** :
  - Animations pas-à-pas avec Three.js et KaTeX.
  - Manipulation en temps réel des figures géométriques et des blocs algébriques.
- **Moteur de Résolution Algébrique à 3 Niveaux** :
  1. **Tier 1 (Cache SHA-256)** : Réponse instantanée (< 50 ms) pour les expressions déjà résolues.
  2. **Tier 2 (Heuristiques Déterministes)** : Factorisation et développement instantanés (< 15 ms, 0 appel IA).
  3. **Tier 3 (Fallback Gemini AI)** : Génération intelligente des étapes et visualisations pour les expressions complexes avec persistance atomique.
- **Exercices & Quiz Interactifs** :
  - Banques d'exercices structurés avec indices et corrections détaillées.
  - Quiz rapides pour tester la compréhension après chaque notion.
- **Métriques & KPI de Performance** :
  - Suivi des taux d'utilisation du cache, heuristiques et IA.
  - Taux de complétion des étapes par les apprenants.

---

## Stack Technologique

- **Frontend** :
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite 6](https://vitejs.dev/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Three.js](https://threejs.org/) (Rendu 3D interactif)
  - [KaTeX](https://katex.org/) (Rendu des formules LaTeX)
  - [Motion (Framer Motion)](https://motion.dev/) & [Lucide React](https://lucide.dev/)
- **Backend / Serveur** :
  - [Express](https://expressjs.com/) (API REST & Middleware Vite en développement)
  - [@google/genai](https://www.npmjs.com/package/@google/genai) (Intégration Gemini AI)
  - [tsx](https://github.com/privatenumber/tsx) & [esbuild](https://esbuild.github.io/)

---

## Démarrage Rapide

### 1. Prérequis
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- `npm`

### 2. Configuration des Variables d'Environnement
Copiez le fichier exemple `.env.example` vers `.env` :
```bash
cp .env.example .env
```

Renseignez vos clés dans `.env` :
```env
# Clé API Google Gemini (optionnelle si utilisation du mode hors-ligne / heuristique)
GEMINI_API_KEY="VOTRE_CLE_GEMINI"

# URL de l'application
APP_URL="http://localhost:3000"
```

---

## Lancement de l'Application

Math3D Studio dispose d'une **Architecture Multi-Modes**. Vous pouvez le lancer avec son serveur backend complet (Node.js) ou en mode 100% statique (sans backend, idéal pour GitHub Pages).

### Option A : Via Go Task (Recommandé si installé)
Si vous avez [`task`](https://taskfile.dev/) installé, vous pouvez utiliser ces commandes simples :
```bash
task dev          # Mode Développement complet (Frontend + Backend Node)
task dev:static   # Mode Statique local (Frontend uniquement, sans backend)
task build        # Compilation pour production (Frontend + Backend)
task build:static # Compilation pour GitHub Pages (Mode Statique)
task start        # Lancement du serveur de production
```

### Option B : Via les scripts automatisés `sh`

```bash
# Serveur Complet (Frontend + Backend)
./start.sh         # Mode Développement
./start.sh prod    # Mode Production

# Mode Statique (Sans Backend)
./scripts/start-static.sh  # Mode Développement statique
./scripts/build-static.sh  # Compiler pour GitHub Pages
```

### Option C : Via les commandes `npm`

```bash
# 1. Installation des dépendances
npm install

# 2. Mode Développement
npm run dev           # Complet
npm run dev:static    # Statique

# 3. Mode Production
npm run build         # Complet
npm start

npm run build:ghpages # Statique
```

L'application est disponible sur : **`http://localhost:3000`** (ou `http://localhost:5173` en mode statique).

---

## Structure du Projet

```text
maths-studio/
├── data/                  # Données JSON des cours, exercices et caches
│   ├── courses-3e.json    # Programme et cours de 3ème
│   ├── courses-4e.json    # Programme et cours de 4ème
│   ├── exercises-3e.json  # Exercices 3ème
│   ├── exercises-4e.json  # Exercices 4ème
│   ├── math3d_cache.json  # Cache persistant des résolutions
│   └── quickQuizzes.json  # Banques de quiz rapides
├── server/                # Logique backend et API
│   ├── courseApi.ts       # Endpoints REST cours et exercices
│   ├── gemini.ts          # Moteur de résolution Fallback Gemini AI
│   ├── heuristics.ts      # Moteur déterministe de factorisation/développement
│   └── storage.ts         # Gestionnaire de persistance JSON & métriques
├── src/                   # Application Frontend React
│   ├── components/        # Composants UI, visualiseurs 3D et moteurs de cours
│   │   ├── Math3DViewer.tsx          # Moteur 3D Three.js
│   │   ├── CalculAlgebriqueCourse.tsx # Visualiseur de cours interactif
│   │   ├── FactorizationEngine.tsx   # Visualiseur de factorisation
│   │   ├── DevelopmentEngine.tsx     # Visualiseur de développement
│   │   └── GeometryVisualizers3e.tsx # Visualiseurs de géométrie 3ème
│   ├── context/           # Contextes React (thème, état global)
│   ├── services/          # Client API frontend
│   ├── App.tsx            # Composant racine
│   └── main.tsx           # Point d'entrée React
├── server.ts              # Serveur Express & configuration Vite Middleware
├── start.sh               # Script de démarrage tout-en-un
├── package.json           # Dépendances et scripts
└── vite.config.ts         # Configuration Vite
```

---

## Endpoints de l'API

*(Disponibles uniquement en mode Serveur complet)*

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Vérification de l'état du serveur |
| `GET` | `/api/courses` | Liste des cours (supporte `?level=3e` ou `4e`) |
| `GET` | `/api/courses/:id` | Détail d'un cours spécifique |
| `GET` | `/api/exercises` | Liste des exercices disponibles |
| `GET` | `/api/exercises/:chapterId` | Exercices liés à un chapitre |
| `POST` | `/api/resolve` | Résolution d'une expression algébrique (Pipeline 3 Tiers) |
| `GET` | `/api/history` | Historique des 30 dernières expressions résolues |
| `GET` | `/api/metrics` | Métriques de performance et statistiques d'usage |
| `POST` | `/api/step-complete` | Enregistrement de la progression d'un apprenant |

---

## Déploiement sur GitHub Pages (CI/CD)

Le projet est configuré avec un **Workflow GitHub Actions** (`.github/workflows/deploy.yml`) qui déploie automatiquement l'application sur GitHub Pages en mode 100% statique à chaque push sur la branche principale (`main`).
En mode statique, l'IA Gemini et les heuristiques de calcul s'exécutent entièrement côté client via le navigateur.

---

## Licence

Projet développé pour l'éducation et l'apprentissage interactif des mathématiques au Sénégal.
