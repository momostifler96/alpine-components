# Select

Liste déroulante avec recherche, sélection multiple, préfixes/suffixes et options désactivées.

**x-modelable :** `value`

## Usage minimal

```html
<div x-data="apSelect({ options: [
  { label: 'France', value: 'fr' },
  { label: 'Espagne', value: 'es' },
] })">
  <button @click="toggle()" x-text="display || 'Choisir…'"></button>
  <ul x-show="open">
    <template x-for="opt in filtered" :key="opt.value">
      <li @click="select(opt)" x-text="opt.label"></li>
    </template>
  </ul>
</div>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `options` | `Array` | `[]` | Liste des options `{ label, value, disabled?, prefix?, suffix? }` |
| `value` | `any` | `null` | Valeur sélectionnée (tableau si `multiple`) |
| `multiple` | `boolean` | `false` | Sélection multiple |
| `searchable` | `boolean` | `false` | Active le champ de recherche |
| `clearable` | `boolean` | `false` | Affiche un bouton de réinitialisation |
| `placeholder` | `string` | `''` | Texte affiché quand rien n'est sélectionné |
| `disabled` | `boolean` | `false` | Désactive le composant |
| `maxSelected` | `number` | `Infinity` | Limite le nombre de sélections |
| `prefix` | `object` | — | Décoration gauche du trigger |
| `suffix` | `object` | — | Décoration droite du trigger |

## État exposé

| Propriété | Description |
|---|---|
| `open` | Panneau ouvert |
| `display` | Texte affiché dans le trigger |
| `filtered` | Options filtrées par la recherche |
| `search` | Valeur du champ de recherche |
| `isSelected(opt)` | Teste si une option est sélectionnée |

## Méthodes

| Méthode | Description |
|---|---|
| `toggle()` | Ouvre/ferme |
| `close()` | Ferme |
| `select(opt)` | Sélectionne une option |
| `clear()` | Réinitialise la valeur |

## Préfixes / Suffixes

Les options acceptent `prefix` et `suffix` pour afficher une icône, une image, un badge ou un point coloré :

```js
{ label: 'France', value: 'fr', prefix: { type: 'image', src: '/fr.png' } }
{ label: 'Actif',  value: 1,    suffix: { type: 'dot',   color: 'green' } }
{ label: 'Admin',  value: 'a',  prefix: { type: 'icon',  html: '<svg>…</svg>' } }
```

Types disponibles : `image`, `icon`, `text`, `badge`, `dot`.
