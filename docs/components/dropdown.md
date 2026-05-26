# Dropdown

Panneau flottant avec positionnement intelligent et auto-flip au bord de l'écran.

**x-modelable :** —

## Usage minimal

```html
<div x-data="apDropdown()" @click.outside="close()">
  <button data-dropdown-trigger @click="toggle()">Options</button>
  <div data-dropdown-panel x-show="open" :style="panelStyle" :class="panelClass">
    <a href="#">Modifier</a>
  </div>
</div>
```

## Avec les classes `ap-*`

```html
<div x-data="apDropdown({ placement: 'bottom-end' })"
     class="ap-dropdown" @click.outside="close()">

  <!-- Déclencheur -->
  <button data-dropdown-trigger @click="toggle()"
          class="ap-form-submit ap-form-submit-secondary">
    Actions
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/>
    </svg>
  </button>

  <!-- Panneau -->
  <div data-dropdown-panel x-show="open" x-cloak
       :style="panelStyle" :class="panelClass"
       class="ap-dropdown-panel">

    <button class="ap-dropdown-item" @click="close()">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"/>
      </svg>
      Modifier
    </button>

    <button class="ap-dropdown-item" @click="close()">
      Dupliquer
    </button>

    <div class="ap-dropdown-divider"></div>

    <div class="ap-dropdown-header">Zone dangereuse</div>

    <button class="ap-dropdown-item is-danger" @click="close()">
      Supprimer
    </button>
  </div>
</div>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `placement` | `string` | `'bottom-start'` | Position préférée |
| `disabled` | `boolean` | `false` | Désactivé |
| `width` | `string` | `'auto'` | `'auto'` ou `'trigger'` |
| `fixed` | `boolean` | `true` | `position: fixed` (anti-clipping) |

**Valeurs de `placement` :** `bottom-start` · `bottom-end` · `top-start` · `top-end`

## État exposé

| Propriété | Description |
|---|---|
| `open` | Panneau visible |
| `panelStyle` | Style de positionnement (`:style`) |
| `panelClass` | Classe fixed/absolute (`:class`) |

## Méthodes

| Méthode | Description |
|---|---|
| `toggle()` | Ouvre/ferme |
| `close()` | Ferme |

## Classes CSS

| Classe | Élément |
|---|---|
| `.ap-dropdown` | Wrapper `position: relative` |
| `.ap-dropdown-panel` | Panneau flottant |
| `.ap-dropdown-item` | Item cliquable |
| `.ap-dropdown-divider` | Séparateur horizontal |
| `.ap-dropdown-header` | En-tête de section |

**Modificateurs d'état :** `.is-danger` · `.is-disabled`

::: tip
Ajoutez toujours `data-dropdown-trigger` sur le bouton et `data-dropdown-panel` sur le panneau pour que le positionnement automatique fonctionne.
:::
