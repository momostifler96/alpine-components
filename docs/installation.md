# Installation

## Prérequis

- **Node.js** 18 ou supérieur
- **Alpine.js** ^3.14 (`x-modelable` natif)
- **Tailwind CSS** 4 (recommandé pour le rendu de la démo)

## Cloner et lancer la démo

```bash
git clone <url-du-repo>
cd alpine-components
npm install
npm run dev
```

| URL | Page |
|-----|------|
| `/` | Landing + playground interactif |
| `/documentation.html` | Documentation navigable dans le navigateur |

```bash
npm run build    # sortie dans dist/
npm run preview  # prévisualiser le build
```

## Intégrer dans votre application

Le projet est marqué `"private": true` — il s’intègre par **copie des sources**, pas via npm (pour l’instant).

### 1. Copier les fichiers

```
src/components/     → obligatoire
src/utils/          → si apInputMask (formatMoney)
src/data/           → si apInputMask (phoneCountries)
```

### 2. Enregistrer Alpine

Dans votre point d’entrée JS, **avant** `Alpine.start()` :

```js
import Alpine from 'alpinejs';
import apSelect from './components/Select.js';
// … autres imports
import { registerToastStore } from './components/Toast.js';

registerToastStore(Alpine);

Alpine.data('apSelect', apSelect);
// … autres Alpine.data()

window.Alpine = Alpine;
Alpine.start();
```

Voir `src/main.js` pour la liste complète.

### 3. Styles

```css
@import "tailwindcss";
```

- Reprenez les règles `input[type="range"]` de `src/style.css` pour **apSlider**.
- Ajoutez `[x-cloak] { display: none !important; }` dans le layout.

### 4. Toast (optionnel)

Copiez le bloc conteneur Toast depuis `index.html` (début du `<body>`) dans votre layout principal.

### 5. Markup des composants

Chaque composant est **headless** : seule la logique est fournie. Copiez le HTML de la section correspondante dans `index.html` ou adaptez-le à votre design system.

## Checklist d’intégration

- [ ] Dépendances `alpinejs` installées
- [ ] Composants enregistrés avant `Alpine.start()`
- [ ] `registerToastStore` si notifications
- [ ] Tailwind + styles slider
- [ ] `x-cloak` sur les panneaux `x-show`
- [ ] `x-modelable` sur la propriété documentée (`value`, `tags`, …)
