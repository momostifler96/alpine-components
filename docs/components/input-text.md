# InputText

Champ texte enrichi avec affichage du mot de passe, bouton d'effacement et addons préfixe/suffixe.

**x-modelable :** `value`

## Usage

```html
<div x-data="apInputText({ type: 'password', clearable: true })">
  <div class="flex">
    <input :type="inputType" x-model="value"
           :placeholder="placeholder" :disabled="disabled" />
    <button x-show="clearable && value" @click="clear()">✕</button>
    <button x-show="type === 'password'" @click="toggleReveal()"
            x-text="revealed ? '🙈' : '👁'"></button>
  </div>
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
| `prefix` | `object` | — | Addon gauche |
| `suffix` | `object` | — | Addon droit |

## État exposé

| Propriété | Description |
|---|---|
| `value` | Valeur courante |
| `inputType` | Type effectif (`text` quand le mot de passe est révélé) |
| `revealed` | Mot de passe visible |

## Méthodes

| Méthode | Description |
|---|---|
| `clear()` | Vide la valeur |
| `toggleReveal()` | Bascule la visibilité du mot de passe |

## Addons préfixe / suffixe

```js
apInputText({
  prefix: { type: 'text',   content: 'https://' },
  suffix: { type: 'button', label: 'Copier', action: 'copy' },
})
```

Types : `icon`, `text`, `button`.
