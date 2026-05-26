# InputTags

Saisie de tags avec ajout par touche, suppression et collage multiple.

**x-modelable :** `tags`

## Usage minimal

```html
<div x-data="apInputTags({ placeholder: 'Ajouter un tag…' })">
  <template x-for="(tag, i) in tags" :key="i">
    <span>
      <span x-text="tag"></span>
      <button @click="removeTag(i)">✕</button>
    </span>
  </template>
  <input x-model="input" @keydown="onKeydown($event)" />
</div>
```

## Avec les classes `ap-*`

```html
<div x-data="apInputTags({ placeholder: 'Technologies…', maxTags: 5 })"
     class="ap-tags-wrapper" @click="$el.querySelector('.ap-tags-input').focus()">

  <template x-for="(tag, i) in tags" :key="i">
    <span class="ap-tag">
      <span class="ap-tag-label" x-text="tag"></span>
      <button class="ap-tag-remove" @click.stop="removeTag(i)" type="button">
        <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
        </svg>
      </button>
    </span>
  </template>

  <input class="ap-tags-input"
         x-model="input"
         @keydown="onKeydown($event)"
         :placeholder="tags.length === 0 ? placeholder : ''" />
</div>
```

### Avec état d'erreur

```html
<div x-data="apInputTags()"
     class="ap-tags-wrapper"
     :class="{ 'is-error': tags.length === 0 }">
  <!-- … -->
</div>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `tags` | `Array<string>` | `[]` | Tags initiaux |
| `placeholder` | `string` | `''` | Placeholder si vide |
| `maxTags` | `number` | `Infinity` | Nombre maximum |
| `allowDuplicates` | `boolean` | `false` | Autorise les doublons |
| `separators` | `Array<string>` | `['Enter', ',']` | Touches de validation |

## État exposé

| Propriété | Description |
|---|---|
| `tags` | Tableau des tags |
| `input` | Saisie en cours |

## Méthodes

| Méthode | Description |
|---|---|
| `onKeydown(event)` | Binder sur `@keydown` |
| `removeTag(index)` | Supprime un tag |

## Classes CSS

| Classe | Élément |
|---|---|
| `.ap-tags-wrapper` | Conteneur principal |
| `.ap-tag` | Tag individuel |
| `.ap-tag-label` | Texte du tag |
| `.ap-tag-remove` | Bouton ✕ |
| `.ap-tags-input` | Champ de saisie |

**Modificateurs d'état :** `.is-error` (sur `.ap-tags-wrapper`)
