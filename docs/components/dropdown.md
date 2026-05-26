# Dropdown

Panneau flottant avec positionnement intelligent et auto-flip au bord de l'écran.

**x-modelable :** —

## Usage

```html
<div x-data="apDropdown({ placement: 'bottom-start' })">
  <button @click="toggle()">Options</button>

  <div x-show="open" :style="panelStyle" :class="panelClass">
    <a href="#">Modifier</a>
    <a href="#">Supprimer</a>
  </div>
</div>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `placement` | `string` | `'bottom-start'` | Position préférée du panneau |
| `disabled` | `boolean` | `false` | Désactive le toggle |
| `width` | `string` | `'auto'` | `'auto'` ou `'trigger'` (même largeur que le déclencheur) |
| `fixed` | `boolean` | `false` | Utilise `position: fixed` (pour les conteneurs overflow hidden) |

### Valeurs de `placement`

`bottom-start` · `bottom-end` · `top-start` · `top-end`

## État exposé

| Propriété | Description |
|---|---|
| `open` | Panneau visible |
| `panelStyle` | Style de positionnement dynamique à binder avec `:style` |
| `panelClass` | Classe de position à binder avec `:class` |
| `resolvedPlacement` | Placement effectif (peut différer si auto-flip) |

## Méthodes

| Méthode | Description |
|---|---|
| `toggle()` | Ouvre/ferme |
| `close()` | Ferme |

## Positionnement fixe

Utile dans les tableaux ou les conteneurs avec `overflow: hidden` :

```html
<div x-data="apDropdown({ placement: 'bottom-end', fixed: true })">
  ...
</div>
```
