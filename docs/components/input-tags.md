# InputTags

Saisie de tags avec ajout par touche, suppression et collage multiple.

**x-modelable :** `tags`

## Usage

```html
<div x-data="apInputTags({ placeholder: 'Ajouter un tag…' })">
  <div class="flex flex-wrap gap-1">
    <template x-for="(tag, i) in tags" :key="i">
      <span>
        <span x-text="tag"></span>
        <button @click="removeTag(i)">✕</button>
      </span>
    </template>
    <input x-model="input" @keydown="onKeydown($event)"
           :placeholder="tags.length ? '' : placeholder" />
  </div>
</div>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `tags` | `Array<string>` | `[]` | Tags initiaux |
| `placeholder` | `string` | `''` | Placeholder quand vide |
| `maxTags` | `number` | `Infinity` | Nombre maximum de tags |
| `allowDuplicates` | `boolean` | `false` | Autorise les doublons |
| `separators` | `Array<string>` | `['Enter', ',']` | Touches qui valident un tag |

## État exposé

| Propriété | Description |
|---|---|
| `tags` | Tableau des tags courants |
| `input` | Valeur de l'input en cours de saisie |

## Méthodes

| Méthode | Description |
|---|---|
| `onKeydown(event)` | À binder sur `@keydown` de l'input |
| `removeTag(index)` | Supprime le tag à l'index donné |

## Collage multiple

Coller `tag1, tag2, tag3` ajoute automatiquement les trois tags (séparés par la virgule).
