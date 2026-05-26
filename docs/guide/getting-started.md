# Installation

## Via npm

```bash
npm install @momoledev/alpine-components
```

Enregistrez le plugin avant `Alpine.start()` :

```js
import Alpine from 'alpinejs'
import AlpineComponents from '@momoledev/alpine-components'

Alpine.plugin(AlpineComponents)
Alpine.start()
```

## Feuille de style prédéfinie

Le package inclut une feuille de style optionnelle avec des classes `ap-*` prêtes à l'emploi pour chaque composant.

```js
import '@momoledev/alpine-components/style'
import Alpine from 'alpinejs'
import AlpineComponents from '@momoledev/alpine-components'

Alpine.plugin(AlpineComponents)
Alpine.start()
```

Dans un projet **Laravel + Vite**, importez dans `resources/js/app.js` ou `resources/css/app.css` :

```css
@import '@momoledev/alpine-components/style';
```

### Personnalisation via CSS custom properties

Toutes les couleurs, tailles et rayons sont des variables CSS surchargeables sur `:root` :

```css
:root {
  --ap-primary:       #10b981;   /* couleur principale */
  --ap-primary-hover: #059669;
  --ap-primary-light: #ecfdf5;
  --ap-primary-ring:  rgba(16, 185, 129, 0.25);
  --ap-border:        #e2e8f0;
  --ap-radius:        0.375rem;  /* coins */
  --ap-height:        2.25rem;   /* hauteur des champs */
  --ap-font-size:     0.875rem;
}
```

| Variable | Rôle | Défaut |
|---|---|---|
| `--ap-primary` | Couleur d'accentuation | `#6366f1` |
| `--ap-border` | Couleur des bordures | `#e2e8f0` |
| `--ap-border-focus` | Bordure au focus | `#6366f1` |
| `--ap-border-error` | Bordure en erreur | `#ef4444` |
| `--ap-bg` | Fond des composants | `#ffffff` |
| `--ap-bg-hover` | Fond au survol | `#f8fafc` |
| `--ap-bg-selected` | Fond option sélectionnée | `#eef2ff` |
| `--ap-text` | Texte principal | `#1e293b` |
| `--ap-text-muted` | Texte secondaire | `#94a3b8` |
| `--ap-radius` | Rayon des coins | `0.5rem` |
| `--ap-height` | Hauteur des champs | `2.5rem` |
| `--ap-font-size` | Taille de police | `0.875rem` |

## Via CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@momoledev/alpine-components/dist/style.css">
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
<script type="module">
  import AlpineComponents from 'https://cdn.jsdelivr.net/npm/@momoledev/alpine-components/dist/index.mjs'
  document.addEventListener('alpine:init', () => Alpine.plugin(AlpineComponents))
</script>
```

## Importer uniquement certains composants

```js
import Alpine from 'alpinejs'
import { apSelect, apForm, registerToastStore } from '@momoledev/alpine-components'

registerToastStore(Alpine)
Alpine.data('apSelect', apSelect)
Alpine.data('apForm',   apForm)
Alpine.start()
```

## Prérequis

| Dépendance | Version minimale |
|---|---|
| Alpine.js | `^3.0.0` |
| CSS (optionnel) | `import '@momoledev/alpine-components/style'` |
