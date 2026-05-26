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

## Via CDN

```html
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
| Tailwind CSS | recommandé (aucun CSS fourni) |
