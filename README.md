# Alpine Components

Bibliothèque **headless** de composants UI pour [Alpine.js](https://alpinejs.dev/) 3 et [Tailwind CSS](https://tailwindcss.com/) 4 — compatible [Livewire](https://livewire.laravel.com/).

| | |
|---|---|
| **Playground** | `npm run dev` → [localhost:5173](http://localhost:5173) |
| **Documentation web** | [/documentation.html](http://localhost:5173/documentation.html) |
| **Docs Markdown** | [docs/README.md](./docs/README.md) |

## En bref

- **9 briques** : Select, Dropdown, Input, Tags, Switch, Slider, Toast, InputMask, Form
- **Headless** : logique JS + markup Tailwind de référence à copier
- **Livewire** : `x-modelable` + `wire:model.live`
- **Sans CSS imposé** : vous contrôlez le design

## Démarrage rapide

```bash
npm install
npm run dev
```

## Documentation

| Guide | Description |
|-------|-------------|
| [docs/README.md](./docs/README.md) | Index de la documentation |
| [docs/installation.md](./docs/installation.md) | Installation et intégration |
| [docs/architecture.md](./docs/architecture.md) | Philosophie et structure |
| [docs/composants.md](./docs/composants.md) | Référence API |
| [docs/livewire.md](./docs/livewire.md) | Intégration Livewire |
| [docs/laravel.md](./docs/laravel.md) | Laravel + validation 422 |
| [examples/laravel/](./examples/laravel/) | Exemple Blade / Controller / Form Request |

## Intégration minimale

```js
import Alpine from 'alpinejs';
import apSelect from './components/Select.js';
import { registerToastStore } from './components/Toast.js';

registerToastStore(Alpine);
Alpine.data('apSelect', apSelect);
// … voir src/main.js

Alpine.start();
```

```html
<div x-data="apSwitch({ value: false })" x-modelable="value">
  <!-- votre markup -->
</div>
```

## Structure

```
alpine-components/
├── index.html              # Landing + playground
├── documentation.html      # Doc navigateur
├── docs/                   # Documentation Markdown
└── src/
    ├── main.js
    ├── components/
    ├── data/catalog.js
    └── style.css
```

## Scripts

| Commande | Action |
|----------|--------|
| `npm run dev` | Développement |
| `npm run build` | Build production |
| `npm run preview` | Prévisualiser le build |
