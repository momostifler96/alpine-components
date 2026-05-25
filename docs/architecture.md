# Architecture

## Philosophie headless

Alpine Components ne livre pas de bundle CSS monolithique. Chaque brique expose :

1. Une **factory** `function apXxx(config)` retournant un objet Alpine (état + méthodes).
2. Un **enregistrement** `Alpine.data('apXxx', apXxx)`.
3. Un **markup de référence** dans le playground (`index.html`).

Vous gardez le contrôle total du HTML et des classes Tailwind, tout en mutualisant la logique (ouverture, filtrage, validation, positionnement, etc.).

## Flux de données

```
┌─────────────────┐     x-modelable      ┌──────────────────┐
│  Parent Alpine  │ ◄──────────────────► │  apSelect / …    │
│  ou Livewire    │     value / tags       │  (état interne)  │
└────────┬────────┘                      └────────┬─────────┘
         │                                        │
         │ wire:model.live (optionnel)            │ $dispatch
         ▼                                        ▼
   Propriété serveur                      événements input / change
```

Tous les champs bindables émettent **`input`** et **`change`** à chaque mutation — compatibles avec `wire:model` sans plugin supplémentaire.

## Structure du dépôt

```
alpine-components/
├── index.html              # Landing + playground
├── documentation.html      # Doc navigable (navigateur)
├── docs/                   # Documentation Markdown
├── src/
│   ├── main.js             # Bootstrap Alpine
│   ├── style.css           # Tailwind + slider
│   ├── components/         # Logique des composants
│   ├── data/
│   │   ├── catalog.js      # Métadonnées landing
│   │   └── phoneCountries.js
│   └── utils/
│       ├── formatMoney.js
│       └── demoCopy.js
├── vite.config.js
└── package.json
```

## Types de briques

| Type | Exemple | Rôle |
|------|---------|------|
| Composant | `apSelect`, `apSwitch` | `Alpine.data` + UI dans le template |
| Store | `$store.toast` | État global, pas de `x-data` dédié |
| Utilitaire | `apForm` | Mixin étendu via spread dans `x-data` |

### Étendre apForm

```html
<div x-data="{
  ...apForm({ data: { email: '' } }),
  async save() {
    const r = await this.submit('/api/users');
    if (r.ok) $store.toast.success('OK');
  }
}">
```

## Préfixes et addons (Select, InputText)

Objet addon commun :

```js
{ type: 'icon'|'text'|'image'|'badge'|'dot', /* props selon le type */ }
```

`apSelect` expose `renderItem(item)` pour générer le HTML des préfixes d’options.

## InputMask — presets

Les masques sont déclarés dans `InputMask.js` (`PRESETS`). Ajouter un preset = nouvelle entrée + tests manuels dans le playground.

`phone-country` dépend de `phoneCountries.js` et émet `@phone-change` / `@country-change`.

## Bonnes pratiques

- Toujours `@click.outside="close()"` sur les overlays (Select, Dropdown).
- `data-dropdown-trigger` / `data-dropdown-panel` pour `apDropdown`.
- `x-cloak` + transitions Alpine sur les panneaux.
- Ne pas appeler `Alpine.start()` avant l’enregistrement des stores et data components.
