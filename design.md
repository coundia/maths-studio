# Math3D Studio - Design System & Architecture UI

Ce document décrit les principes de design, l'architecture des composants et les règles esthétiques qui régissent l'interface de Math3D Studio.

---

## 1. Principes Fondamentaux de l'UX/UI

Math3D Studio est conçu pour offrir une expérience d'apprentissage fluide, engageante et moderne. L'interface repose sur plusieurs principes clés :

- **Glassmorphism & Superposition** : Utilisation intensive de fonds semi-transparents (`bg-white/70`, `bg-slate-900/70`) couplés à des filtres de flou (`backdrop-blur-md`, `backdrop-blur-xl`) pour créer de la profondeur spatiale, particulièrement utile lors de l'affichage de modèles 3D en arrière-plan.
- **Couleurs Vibrantes & Dégradés** : Au lieu de couleurs primaires plates, nous privilégions des dégradés modernes (ex: `bg-gradient-to-br from-emerald-500 to-indigo-500`) pour les éléments d'appel à l'action (CTA) ou les décorations (glow).
- **Micro-animations (Framer Motion)** : Chaque interaction utilisateur est accompagnée d'un retour visuel fluide. Les boutons et cartes utilisent des animations de mise à l'échelle (`hover:scale-105 active:scale-95`). Les transitions d'états complexes (changement d'étape algorithmique, ouverture de tiroirs) sont gérées avec `AnimatePresence`.
- **Mode Sombre Natif (Dark Mode)** : L'application est nativement pensée pour s'adapter à la préférence système de l'utilisateur. Chaque composant possède son pendant `dark:` garantissant un contraste parfait (WCAG).

---

## 2. Palette de Couleurs Dynamique

La palette de l'application n'est pas hardcodée (jamais de codes hexadécimaux directement dans les classes Tailwind). 

### Architecture de la palette
- Les couleurs sont configurées globalement via les variables d'environnement (`VITE_THEME_*` dans `.env`).
- Le script `scripts/vite-plugin-theme.ts` intercepte ces variables pour générer le module virtuel `virtual:theme.css` à la compilation.
- **Tokens Sémantiques** : Nous utilisons des classes sémantiques Tailwind comme `bg-canvas`, `bg-surface`, `text-ink`, `border-line`, ou `bg-primary`.
- **Contraste & Accessibilité** : Les teintes de texte varient selon le mode (ex: `600/700` en mode clair, `300/400` en mode sombre). La commande `npm run theme:check` permet d'auditer ces paires de couleurs.

### Gestion des couleurs dynamiques (Données)
Les couleurs provenant de données dynamiques (comme les étapes de résolution) passent systématiquement par le Hook `useReadableColor()` (`src/theme/useReadableColor.ts`) pour assurer leur lisibilité sur les fonds clairs ou sombres.

---

## 3. Typographie

Math3D Studio exploite la famille de polices natives du système complétée par des typographies mathématiques spécifiques :
- **Sans-serif (UI)** : Police d'interface claire et lisible (par défaut via Tailwind).
- **Serif / Mathématique** : Rendu LaTeX géré exclusivement via `KaTeX` et `MathLive` (`<math-field>`).

---

## 4. Breakpoints et Comportement Responsive

L'interface s'adapte à 3 grandes catégories d'écrans :

- **Mobile (< 640px)** :
  - Le `Header` s'affiche sur deux lignes.
  - La navigation principale (tabs) occupe toute la largeur.
  - La barre latérale des cours (`CourseSidebar`) devient un menu superposé (Drawer).
- **Tablette (640px - 1023px)** :
  - La `CourseSidebar` reste un tiroir escamotable pour maximiser l'espace dédié au contenu de la leçon.
  - Certains boutons flottants secondaires sont masqués pour épurer l'interface.
- **Desktop (>= 1024px / `lg`)** :
  - La barre latérale devient une colonne statique permanente.
  - Le branding complet et le logo apparaissent.

*Règle d'or : Aucun élément ne doit forcer un défilement horizontal de la page entière. Les contenus larges (tableaux, formules complexes) doivent toujours être englobés dans un conteneur `overflow-x-auto`.*

---

## 5. Composants Communs & Bonnes Pratiques

### Tiroirs (Drawers)
L'affichage d'informations contextuelles (Synthèse de cours, Prérequis, Paramètres du Tableau) s'effectue via des "Drawers" latéraux (côté droit ou gauche) animés.
- Ils possèdent un fond flouté bloquant (backdrop).
- Sur impression PDF, ces tiroirs gèrent l'isolation visuelle en masquant l'interface située en dessous.

### Boîtes de dialogue (DialogProvider)
L'application interdit formellement l'usage des alertes natives du navigateur (`window.alert`, `window.confirm`, `window.prompt`).
- Ces appels sont remplacés par le hook `useDialog()` fourni par le `DialogProvider`.
- Les boîtes de dialogue personnalisées respectent l'identité visuelle du projet (Glassmorphism, icônes Lucide, animations d'apparition).

### Exportation PDF / Impression
L'application garantit une exportation PDF propre pour certaines vues (Tableau Noir, Synthèse de cours).
- L'isolation est obtenue en injectant dynamiquement des règles CSS (`print:hidden`) sur les composants de layout (Header, Sidebar) lorsque ces vues spécifiques sont actives.
- La règle `@media print` s'assure que les ombres, les bordures colorées superflues et les fonds de l'UI sont purgés au profit d'un fond blanc pur.
