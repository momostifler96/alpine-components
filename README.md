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

### Avec le style prédéfini (recommandé)

```ts
import '@momoledev/alpine-components/style'  // classes ap-* + tokens CSS
import Alpine from 'alpinejs'
import AlpineComponents from '@momoledev/alpine-components'

Alpine.plugin(AlpineComponents)
Alpine.start()
```

### Sans style (headless pur)

```ts
import Alpine from 'alpinejs'
import AlpineComponents from '@momoledev/alpine-components'

Alpine.plugin(AlpineComponents)
Alpine.start()
```

### Importer uniquement certains composants

```ts
import Alpine from 'alpinejs'
import { apSelect, apForm, registerToastStore } from '@momoledev/alpine-components'

registerToastStore(Alpine)
Alpine.data('apSelect', apSelect)
Alpine.data('apForm', apForm)
Alpine.start()
```

### Via CDN

```html
<!-- Style prédéfini -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@momoledev/alpine-components/dist/style.css">
<!-- Alpine.js -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
<!-- Composants -->
<script type="module">
  import AlpineComponents from 'https://cdn.jsdelivr.net/npm/@momoledev/alpine-components/dist/index.mjs'
  document.addEventListener('alpine:init', () => Alpine.plugin(AlpineComponents))
</script>
```

### Personnaliser les tokens CSS

Surchargez les variables sur `:root` après l'import du style :

```css
:root {
  --ap-primary:       #10b981;  /* couleur principale */
  --ap-primary-hover: #059669;
  --ap-primary-light: #ecfdf5;
  --ap-primary-ring:  rgba(16, 185, 129, 0.25);
  --ap-radius:        0.375rem; /* coins */
  --ap-height:        2.25rem;  /* hauteur des champs */
}
```

---

## Intégration — Laravel + Vite

### 1. Installer le package

```bash
npm install @momoledev/alpine-components
```

### 2. Enregistrer dans `resources/js/app.js`

```js
import '@momoledev/alpine-components/style'
import Alpine from 'alpinejs'
import AlpineComponents from '@momoledev/alpine-components'

Alpine.plugin(AlpineComponents)

window.Alpine = Alpine
Alpine.start()
```

### 3. `vite.config.js` (inchangé)

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

### 4. Layout Blade

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

    {{-- Conteneur Toast (une fois dans le layout) --}}
    <div x-data class="ap-toast-container">
        <template x-for="t in $store.toast.items" :key="t.id">
            <div class="ap-toast" :class="`ap-toast-${t.type}`"
                 x-show="t.visible" x-transition>
                <div class="ap-toast-body">
                    <p class="ap-toast-title" x-show="t.title" x-text="t.title"></p>
                    <p class="ap-toast-message" x-text="t.message"></p>
                </div>
                <button class="ap-toast-dismiss" @click="$store.toast.dismiss(t.id)">✕</button>
            </div>
        </template>
    </div>
</body>
</html>
```

### 5. Formulaire Blade avec classes `ap-*`

```blade
{{-- resources/views/members/create.blade.php --}}
<form class="ap-form"
      x-data="apForm({
          data: { name: '', email: '', role: null },
          errors: @json($errors->getMessages()),
      })"
      @submit.prevent="submit('{{ route('members.store') }}')">

    <div class="ap-form-field">
        <label class="ap-form-label is-required">Nom</label>
        <input class="ap-input" :class="{ 'is-error': hasError('name') }"
               x-model="data.name" placeholder="Jean Dupont">
        <p class="ap-form-error" x-show="hasError('name')" x-text="getError('name')"></p>
    </div>

    <div class="ap-form-field">
        <label class="ap-form-label is-required">Rôle</label>
        <div x-data="apSelect({ options: [
                 { label: 'Développeur', value: 'dev' },
                 { label: 'Designer',    value: 'design' },
             ] })"
             x-modelable="value" x-model="data.role"
             class="ap-select" @click.outside="close()">
            <button class="ap-select-trigger" :class="{ 'is-error': hasError('role'), 'is-open': open }"
                    @click="toggleOpen()">
                <span class="ap-select-trigger-label"
                      :class="{ 'is-placeholder': !hasValue }"
                      x-text="display || 'Choisir un rôle'"></span>
            </button>
            <div class="ap-select-panel" x-show="open" x-cloak>
                <ul class="ap-select-options">
                    <template x-for="opt in filteredOptions" :key="opt.value">
                        <li class="ap-select-option"
                            :class="{ 'is-selected': isSelected(opt.value) }"
                            @click="select(opt)" x-text="opt.label"></li>
                    </template>
                </ul>
            </div>
        </div>
        <p class="ap-form-error" x-show="hasError('role')" x-text="getError('role')"></p>
    </div>

    <div class="ap-form-success" x-show="success">✓ Enregistré.</div>

    <button type="submit" class="ap-form-submit" :disabled="loading">
        <span x-show="!loading">Enregistrer</span>
        <span x-show="loading">Envoi…</span>
    </button>
</form>
```

> `apForm` lit `meta[name="csrf-token"]` automatiquement et gère les réponses **422** de Laravel.

---

## Utiliser avec un agent IA

Le projet inclut un skill prêt à l'emploi avec tous les snippets copy-paste.

### Claude Code

```bash
# Dans n'importe quel projet qui utilise @momoledev/alpine-components
/alpine-components
```

Le skill fournit instantanément les snippets HTML complets avec classes `ap-*` pour tous les composants.

### Copier le fichier de référence dans votre projet

```bash
curl -O https://raw.githubusercontent.com/momostifler96/alpine-components/master/alpine-components.md
```

Puis indiquez à votre agent de lire ce fichier comme contexte :

```
# Cursor / Windsurf / Copilot
@alpine-components.md

# Claude / ChatGPT / autre LLM
"Lis alpine-components.md puis génère un formulaire avec apSelect et apForm"
```

### Contenu du fichier de référence

`alpine-components.md` contient pour chaque composant :
- Snippet HTML minimal (sans style)
- Snippet complet avec classes `ap-*`
- Liste des props, état et méthodes
- Combinaisons courantes (form + select, switch dans form, dropdown dans tableau)

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
