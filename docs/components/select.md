# Select

Liste déroulante avec recherche, sélection multiple, préfixes/suffixes et options désactivées.

**x-modelable :** `value`

## Usage minimal

```html
<div x-data="apSelect({ options: [
  { label: 'France', value: 'fr' },
  { label: 'Espagne', value: 'es' },
] })">
  <button @click="toggleOpen()" x-text="display || 'Choisir…'"></button>
  <ul x-show="open">
    <template x-for="opt in filteredOptions" :key="opt.value">
      <li @click="select(opt)" x-text="opt.label"></li>
    </template>
  </ul>
</div>
```

## Avec les classes `ap-*`

```html
<div x-data="apSelect({ options: [...], searchable: true, clearable: true })"
     class="ap-select" @click.outside="close()">

  <!-- Trigger -->
  <button class="ap-select-trigger" :class="{ 'is-open': open }"
          @click="toggleOpen()" :disabled="disabled">
    <span class="ap-select-trigger-label"
          :class="{ 'is-placeholder': !hasValue }"
          x-text="display || placeholder"></span>
    <button x-show="clearable && hasValue" class="ap-select-clear"
            @click="clear($event)">✕</button>
    <svg class="ap-select-trigger-chevron" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/>
    </svg>
  </button>

  <!-- Panel -->
  <div class="ap-select-panel" x-show="open" x-cloak>
    <!-- Recherche -->
    <input x-show="searchable" class="ap-select-search"
           x-model="search" placeholder="Rechercher…" x-ref="searchInput" />

    <ul class="ap-select-options">
      <template x-for="opt in filteredOptions" :key="opt.value">
        <li class="ap-select-option"
            :class="{ 'is-selected': isSelected(opt.value), 'is-disabled': opt.disabled }"
            @click="select(opt)">
          <span class="ap-select-option-label" x-text="opt.label"></span>
          <svg x-show="isSelected(opt.value)" class="ap-select-option-check"
               viewBox="0 0 20 20" fill="currentColor">
            <path d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"/>
          </svg>
        </li>
      </template>
      <li x-show="filteredOptions.length === 0" class="ap-select-empty">
        Aucun résultat
      </li>
    </ul>
  </div>
</div>
```

### Mode multiple avec tags

```html
<div x-data="apSelect({ options: [...], multiple: true })"
     class="ap-select" @click.outside="close()">

  <button class="ap-select-trigger" @click="toggleOpen()">
    <span class="ap-select-tags" x-show="hasValue">
      <template x-for="opt in selectedOptions" :key="opt.value">
        <span class="ap-select-tag">
          <span class="ap-select-tag-label" x-text="opt.label"></span>
          <button class="ap-select-tag-remove" @click="removeTag(opt.value, $event)">✕</button>
        </span>
      </template>
    </span>
    <span x-show="!hasValue" class="ap-select-trigger-label is-placeholder"
          x-text="placeholder"></span>
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
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `options` | `Array` | `[]` | Liste `{ label, value, disabled?, prefix?, suffix? }` |
| `value` | `any` | `null` | Valeur sélectionnée (tableau si `multiple`) |
| `multiple` | `boolean` | `false` | Sélection multiple |
| `searchable` | `boolean` | `false` | Champ de recherche |
| `clearable` | `boolean` | `true` | Bouton de réinitialisation |
| `placeholder` | `string` | `'Sélectionner...'` | Texte par défaut |
| `disabled` | `boolean` | `false` | Désactivé |
| `maxSelected` | `number` | `null` | Limite de sélections |

## État exposé

| Propriété | Description |
|---|---|
| `open` | Panneau ouvert |
| `display` | Texte du trigger |
| `filteredOptions` | Options après recherche |
| `selectedOption` | Option sélectionnée (mode simple) |
| `selectedOptions` | Options sélectionnées (mode multiple) |
| `hasValue` | Vrai si une valeur est choisie |
| `search` | Texte de recherche |

## Méthodes

| Méthode | Description |
|---|---|
| `toggleOpen()` | Ouvre/ferme |
| `close()` | Ferme |
| `select(opt)` | Sélectionne une option |
| `clear(event?)` | Réinitialise |
| `removeTag(val, event?)` | Retire un tag (multiple) |
| `isSelected(val)` | Teste si sélectionné |

## Classes CSS

| Classe | Élément |
|---|---|
| `.ap-select` | Wrapper racine |
| `.ap-select-trigger` | Bouton déclencheur |
| `.ap-select-trigger-label` | Texte du trigger |
| `.ap-select-trigger-chevron` | Icône flèche |
| `.ap-select-panel` | Panneau déroulant |
| `.ap-select-search` | Input de recherche |
| `.ap-select-options` | Liste `<ul>` |
| `.ap-select-option` | Ligne d'option |
| `.ap-select-option-check` | Icône de sélection |
| `.ap-select-empty` | Message "aucun résultat" |
| `.ap-select-tags` | Conteneur des tags |
| `.ap-select-tag` | Tag individuel |
| `.ap-select-tag-remove` | Bouton ✕ du tag |
| `.ap-select-clear` | Bouton clear global |

**Modificateurs d'état :** `.is-open` · `.is-selected` · `.is-disabled` · `.is-placeholder`
