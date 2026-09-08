# Product Requirements Document (PRD) : Tableau Interactif V2 (Blackboard)

## 1. Vue d'ensemble (Executive Summary)
Le Tableau Interactif (Blackboard) de Math3D Studio est actuellement un outil robuste permettant la saisie d'équations (MathLive) et le dessin libre. L'objectif de cette version 2 (V2) est de transformer cet espace de brouillon passif en un **tuteur intelligent et collaboratif**, tout en respectant le programme sénégalais (4ème/3ème).

## 2. Problèmes Actuels & Limites
- **Isolé & Passif** : Le tableau ne comprend pas les mathématiques saisies. Un élève peut écrire une erreur entre la ligne 1 et la ligne 2 sans être corrigé.
- **Dessin basique** : Le mode "Dessin" se limite au trait libre, ce qui rend difficile le tracé de figures géométriques propres (triangles rectangles, cercles).
- **Stockage Local** : Les sauvegardes utilisent `localStorage`, ce qui empêche l'élève de retrouver son travail sur un autre appareil.
- **Absence de Graphiques** : Impossible de visualiser rapidement une fonction affine ou linéaire.

---

## 3. Nouvelles Fonctionnalités Proposées (Features)

### 🚀 Feature 1 : Validation d'Étapes Intelligente (Step Checker)
**Description :** Lorsqu'un élève résout une équation sur plusieurs lignes, il peut cliquer sur un bouton "Vérifier" entre deux lignes.
**Comportement :** 
- Le système compare la ligne $N$ et la ligne $N+1$.
- Il indique par un ✅ ou ❌ si l'égalité est conservée (ex: si l'élève a oublié un signe moins en développant).
**Implémentation :** Utilisation de l'API Node.js (`server/resolve`) respectant la règle des 3 Tiers (Cache -> Heuristique -> Gemini AI Fallback).

### 📐 Feature 2 : Outils de Géométrie Avancés
**Description :** Amélioration du mode Dessin (`WhiteboardCanvas`).
**Comportement :**
- Ajout d'outils de tracé : Ligne droite, Cercle, Rectangle.
- Outils virtuels : Règle, Équerre, Rapporteur intégrés en surimpression pour simuler la géométrie sur papier.

### ☁️ Feature 3 : Sauvegarde Cloud (JSON Backend)
**Description :** Migration du `localStorage` vers le serveur Express.
**Comportement :**
- Les brouillons sont sauvegardés sur le serveur dans le dossier `/data/boards/` sous forme de fichiers JSON (conformément aux règles d'architecture sans base de données).
- Permet à un professeur d'accéder au brouillon d'un élève via une URL partagée.

### 📈 Feature 4 : Mode "Traceur de Courbes"
**Description :** Intégration d'un mini-traceur de graphiques.
**Comportement :**
- Si l'élève sélectionne une équation de type $y = ax + b$, un bouton "Tracer" apparaît.
- Génère un repère orthonormé interactif affichant la droite.

### 👥 Feature 5 : Collaboration en Temps Réel (Mode Tutorat)
**Description :** Tableau blanc partagé entre le professeur et l'élève.
**Comportement :**
- Synchronisation WebSockets. Le professeur peut voir l'élève taper ses équations en direct et utiliser le pointeur pour lui montrer ses erreurs.

---

## 4. Architecture & Contraintes Techniques

- **Frontend** : 
  - Garder React 19 et TailwindCSS v4. 
  - Conserver le design en *Glassmorphism* et les animations `motion/react`.
- **Backend (Express)** : 
  - Création de nouveaux endpoints pour la gestion des fichiers JSON : `POST /api/boards/save`, `GET /api/boards/:id`.
  - Attention : Ignorer le dossier `data/boards/` dans `vite.config.ts` pour éviter les rechargements HMR intempestifs.
- **Sécurité & IA** :
  - Minimiser les appels Gemini (Tier 3) en utilisant le cache par hachage SHA-256 pour la validation des étapes (Tier 1).

## 5. Priorisation (Roadmap)
1. **Phase 1** : Sauvegarde Cloud (JSON) & Outils de Géométrie de base (Ligne, Cercle).
2. **Phase 2** : Validation d'Étapes Intelligente (Backend & Gemini).
3. **Phase 3** : Traceur de Courbes et Collaboration WebSockets.
