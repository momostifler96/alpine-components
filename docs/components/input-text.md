# InputText

Champ texte enrichi avec affichage du mot de passe, bouton d'effacement et addons préfixe/suffixe.

**x-modelable :** `value`

## Usage minimal

```html
<div x-data="apInputText({ type: 'text', clearable: true })">
  <input :type="inputType" x-model="value" :placeholder="placeholder" />
</div>
```

## Avec les classes `ap-*`

### Champ simple

```html
<div x-data="apInputText({ placeholder: 'Votre nom' })">
  <input class="ap-input" :type="inputType" x-model="value"
         :placeholder="placeholder" :disabled="disabled" :readonly="readonly" />
</div>
```

### Avec addon préfixe et bouton clear

```html
<div x-data="apInputText({ clearable: true, placeholder: 'Rechercher…' })"
     class="ap-input-wrapper">

  <!-- Addon gauche -->
  <span class="ap-input-addon">
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"/>
    </svg>
  </span>

  <input class="ap-input" :type="inputType" x-model="value"
         :placeholder="placeholder" :disabled="disabled" />

  <!-- Bouton clear -->
  <button x-show="clearable && value" class="ap-input-action"
          @click="clear()" type="button">✕</button>
</div>
```

### Champ mot de passe

```html
<div x-data="apInputText({ type: 'password' })"
     class="ap-input-wrapper">

  <input class="ap-input" :type="inputType" x-model="value"
         placeholder="Mot de passe" />

  <button class="ap-input-action" @click="toggleReveal()" type="button">
    <svg x-show="!revealed" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
      <path d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z"/>
    </svg>
    <svg x-show="revealed" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22z"/>
    </svg>
  </button>
</div>
```

### Avec addon texte à droite

```html
<div x-data="apInputText({ placeholder: '0.00' })"
     class="ap-input-wrapper">
  <input class="ap-input" x-model="value" :placeholder="placeholder" />
  <span class="ap-input-addon ap-input-addon-right">EUR</span>
</div>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `value` | `string` | `''` | Valeur initiale |
| `type` | `string` | `'text'` | `text` · `email` · `password` · `number` · `url` · `tel` |
| `placeholder` | `string` | `''` | Placeholder |
| `disabled` | `boolean` | `false` | Désactivé |
| `readonly` | `boolean` | `false` | Lecture seule |
| `clearable` | `boolean` | `false` | Bouton d'effacement |

## État exposé

| Propriété | Description |
|---|---|
| `value` | Valeur courante |
| `inputType` | Type effectif (`text` quand révélé) |
| `revealed` | Mot de passe visible |

## Méthodes

| Méthode | Description |
|---|---|
| `clear()` | Vide la valeur |
| `toggleReveal()` | Bascule visibilité mot de passe |

## Classes CSS

| Classe | Élément |
|---|---|
| `.ap-input` | Champ `<input>` autonome |
| `.ap-input-wrapper` | Conteneur avec addons |
| `.ap-input-addon` | Addon gauche (texte, icône) |
| `.ap-input-addon-right` | Addon droit |
| `.ap-input-action` | Bouton action (clear, reveal) |

**Modificateurs d'état :** `.is-error`
