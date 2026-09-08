# 📝 Documentation : Tableau Interactif (Blackboard)

Le Tableau Interactif est l'outil principal de brouillon et de résolution mathématique de **Math3D Studio**. Il a été entièrement repensé pour offrir une expérience d'édition WYSIWYG (What You See Is What You Get) fluide, proche d'une feuille de papier.

## 🏗️ Architecture Technique

Le composant principal se trouve dans : `src/components/blackboard/BlackboardDrawer.tsx`.

Il repose sur trois piliers technologiques :
1. **MathLive** (`mathlive`) : Bibliothèque web-component (`<math-field>`) utilisée pour l'affichage en temps réel et la saisie mathématique avancée.
2. **React / Tailwind CSS** : Gestion de l'état (lignes multiples, modes) et design en *Glassmorphism*.
3. **Framer Motion** (`motion/react`) : Animations d'ouverture/fermeture du tiroir plein écran et du panneau latéral.

---

## ✨ Fonctionnalités Principales

### 1. Mode Multi-lignes de Calcul
Au lieu d'un seul champ de texte, le tableau génère dynamiquement une liste de composants `<math-field>`.
- Un bouton **"+ Nouvelle Ligne de Calcul"** permet d'ajouter une étape.
- Un bouton **Corbeille** (visible au survol) permet de supprimer une ligne (à condition d'en avoir au moins deux).
- Chaque ligne est numérotée pour un suivi clair des étapes de résolution.

### 2. Éditeur WYSIWYG & Clavier Virtuel MathLive
- L'utilisateur peut taper directement au clavier de son ordinateur de façon naturelle.
- **Tiroir Droit (Right Drawer)** : Si l'utilisateur est sur tablette ou préfère cliquer, un clavier virtuel ultra-complet (intégré nativement par MathLive) glisse depuis la droite de l'écran. Il contient des onglets pour le pavé numérique, les fonctions, l'alphabet grec, etc.

### 3. Barre de Formatage Intégrée (Sticky Toolbar)
Une barre d'outils flotte au-dessus de l'espace de calcul et permet d'appliquer du style sur la sélection courante :
- **Couleurs** : Rouge, Bleu, Vert, Orange (idéal pour mettre en évidence un terme lors d'une factorisation).
- **Réinitialisation** : Un bouton "X" pour enlever la couleur.
- **Soulignement** : Un bouton pour insérer la balise `\underline{}` autour du texte sélectionné.

### 4. Auto-complétion & Raccourcis Sénégalais
Une case à cocher **"Auto-complétion"** permet d'activer/désactiver la transformation intelligente du texte.
Lorsque cette case est activée, des raccourcis spécifiques au programme de collège/lycée sont injectés.

**Quelques raccourcis configurés :**
- `x2` → $x^2$ (idem pour `y2`, `a2`, `n2`...)
- `x3` → $x^3$
- `!=` → $\neq$
- `<=` → $\leq$
- `>=` → $\geq$
- `racine` ou `rac` → $\sqrt{}$
- `vecteur` → $\vec{}$
- `IR`, `IN`, `IZ`, `IQ` → $\mathbb{R}, \mathbb{N}, \mathbb{Z}, \mathbb{Q}$

*Voir la constante `mf.inlineShortcuts` dans le code pour la liste complète.*

---

## 🔧 Maintenance et Améliorations Futures

- **État React vs Web Component** : `<math-field>` étant un Web Component, son état interne gère le LaTeX. Si vous devez extraire la valeur exacte d'une ligne pour l'envoyer au backend (ex: mode interprétation automatique / Gemini), utilisez la référence du champ : `mathFieldsRef.current[id].value`.
- **Clavier Virtuel** : Le conteneur du clavier virtuel est rattaché à une `div` spécifique (`kbdContainerRef`) via `window.mathVirtualKeyboard.container = kbdContainerRef.current`. Lors du démontage du composant, il est crucial de réinitialiser le conteneur à `document.body` pour éviter les fuites de mémoire et les bugs d'affichage sur les autres pages.
