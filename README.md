# Alpine Components

Bibliothèque **headless** de composants UI pour [Alpine.js](https://alpinejs.dev/) 3 — compatible [Livewire](https://livewire.laravel.com/) et Laravel.

[![npm](https://img.shields.io/npm/v/@momoledev/alpine-components)](https://www.npmjs.com/package/@momoledev/alpine-components)
[![license](https://img.shields.io/npm/l/@momoledev/alpine-components)](./LICENSE)

**Documentation** → [alpine-components.momoledev.com](https://alpine-components.momoledev.com)

---

## Composants

| Composant | Rôle | x-modelable |
|---|---|---|
| `apSelect` | Select simple/multiple avec recherche | `value` |
| `apDropdown` | Menu flottant avec auto-flip | — |
| `apInputText` | Champ texte, password, clearable | `value` |
| `apInputTags` | Saisie de tags | `tags` |
| `apSwitch` | Toggle booléen | `value` |
| `apSlider` | Curseur numérique avec tooltip | `value` |
| `apForm` | État formulaire + submit fetch + erreurs 422 | `data` |
| `apInputMask` | Masques : tel, carte, SIRET, money… | `value` |
| `$store.toast` | Notifications globales (store Alpine) | — |

---

## Installation

```bash
npm install @momoledev/alpine-components
```

---

## Intégration — JavaScript / TypeScript

```ts
import Alpine from 'alpinejs'
import AlpineComponents from '@momoledev/alpine-components'

Alpine.plugin(AlpineComponents)
Alpine.start()
```

Importer uniquement certains composants :

```ts
import Alpine from 'alpinejs'
import { apSelect, apForm, registerToastStore } from '@momoledev/alpine-components'

registerToastStore(Alpine)
Alpine.data('apSelect', apSelect)
Alpine.data('apForm', apForm)
Alpine.start()
```

---

## Intégration — Laravel + Vite

### 1. Installer le package

```bash
npm install @momoledev/alpine-components
```

### 2. Enregistrer dans `resources/js/app.js`

```js
import Alpine from 'alpinejs'
import AlpineComponents from '@momoledev/alpine-components'

Alpine.plugin(AlpineComponents)

window.Alpine = Alpine
Alpine.start()
```

### 3. Importer dans `vite.config.js`

```js
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
})
```

### 4. Charger les assets dans le layout Blade

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @yield('content')

    {{-- Conteneur Toast --}}
    <div x-data class="fixed bottom-4 right-4 z-50 space-y-2">
        <template x-for="t in $store.toast.items" :key="t.id">
            <div x-show="t.visible" x-transition x-text="t.message"></div>
        </template>
    </div>
</body>
</html>
```

### 5. Utiliser dans un formulaire Blade

```blade
{{-- resources/views/members/create.blade.php --}}
<form x-data="apForm({
    data: { name: '', email: '', role: null },
    errors: @json($errors->getMessages()),
})" @submit.prevent="submit('{{ route('members.store') }}')">

    <input x-model="data.name" placeholder="Nom">
    <p x-show="hasError('name')" x-text="getError('name')"></p>

    <div x-data="apSelect({
        options: [
            { label: 'Développeur', value: 'dev' },
            { label: 'Designer',    value: 'design' },
        ],
    })" x-modelable="value" x-model="data.role">
        <button @click="toggle()" x-text="display || 'Choisir un rôle'"></button>
        <ul x-show="open">
            <template x-for="opt in filtered" :key="opt.value">
                <li @click="select(opt)" x-text="opt.label"></li>
            </template>
        </ul>
    </div>

    <button type="submit" :disabled="loading">
        <span x-show="!loading">Enregistrer</span>
        <span x-show="loading">Envoi…</span>
    </button>
</form>
```

> `apForm` lit le meta `csrf-token` automatiquement et gère les réponses **422** de Laravel.

---

## Scripts

| Commande | Action |
|---|---|
| `npm run dev` | Dev playground |
| `npm run build` | Build lib (ESM + UMD → `dist/`) |
| `npm run docs:dev` | Dev VitePress |
| `npm run docs:build` | Build docs statiques |

## Licence

MIT — [Momoledev](https://github.com/momostifler96)
