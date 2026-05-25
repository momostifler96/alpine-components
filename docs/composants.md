# Référence des composants

Markups complets : playground `index.html`, ancres `#select`, `#dropdown`, etc.

---

## apSelect {#select}

Liste déroulante simple ou multiple.

```js
apSelect({
  options: [],           // { value, label, prefix?, suffix?, disabled? }
  multiple: false,
  value: null,
  placeholder: 'Sélectionner...',
  searchable: false,
  clearable: true,
  disabled: false,
  maxSelected: null,
})
```

| Méthode | Description |
|---------|-------------|
| `select(option)` | Sélectionne une option |
| `toggleOpen()` / `close()` | Ouvre / ferme |
| `clear()` | Réinitialise |
| `isSelected(val)` | État sélection |
| `renderItem(item)` | HTML préfixe/suffixe |

**Bind** : `x-modelable="value"`

---

## apDropdown {#dropdown}

```js
apDropdown({
  placement: 'bottom-start', // bottom-end | top-start | top-end
  disabled: false,
  width: 'auto',             // 'trigger'
  fixed: true,
})
```

| Attribut | Élément |
|----------|---------|
| `data-dropdown-trigger` | Bouton |
| `data-dropdown-panel` | Panneau (`:style="panelStyle"` `:class="panelClass"`) |

| Méthode | Description |
|---------|-------------|
| `toggle()` | Bascule ouvert |
| `close()` | Ferme |

---

## apInputText {#inputtext}

```js
apInputText({
  value: '',
  type: 'text',    // email | password | number | url | tel
  placeholder: '',
  prefix: null,
  suffix: null,
  disabled: false,
  readonly: false,
  clearable: false,
})
```

| Méthode | Description |
|---------|-------------|
| `clear()` | Vide le champ |
| `togglePassword()` | Affiche/masque le mot de passe |

**Bind** : `x-modelable="value"`

---

## apInputTags {#inputtags}

```js
apInputTags({
  tags: [],
  placeholder: 'Ajouter un tag...',
  maxTags: null,
  allowDuplicates: false,
  separators: ['Enter', ','],
  disabled: false,
})
```

| Méthode | Description |
|---------|-------------|
| `addTag(raw)` | Ajoute un tag |
| `removeTag(index)` | Supprime |
| `onKeydown` / `onPaste` | Handlers à brancher sur l’input |

**Bind** : `x-modelable="tags"`

---

## apSwitch {#switch}

```js
apSwitch({ value: false, disabled: false })
```

| Méthode | Description |
|---------|-------------|
| `toggle()` | Inverse la valeur |

**Bind** : `x-modelable="value"`

---

## apSlider {#slider}

```js
apSlider({
  value: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showTooltip: true,
  format: (v) => String(v),
})
```

| Propriété | Description |
|-----------|-------------|
| `percentage` | Position % |
| `displayValue` | Valeur formatée |
| `onInput(event)` | Handler sur `<input type="range">` |

**Bind** : `x-modelable="value"`

---

## Toast — $store.toast {#toast}

Enregistrement : `registerToastStore(Alpine)` avant `Alpine.start()`.

```js
$store.toast.success(message, title?, opts?)
$store.toast.error(message, title?, opts?)
$store.toast.warning(message, title?, opts?)
$store.toast.info(message, title?, opts?)

$store.toast.add({ type, title, message, duration, action })
$store.toast.dismiss(id)
$store.toast.clear()
```

Équivalent : `window.$toast`

---

## apInputMask {#inputmask}

```js
apInputMask({
  value: '',
  mask: 'phone-fr',
  placeholder: '',
  prefix: null,
  suffix: null,
  disabled: false,
  country: 'FR',
})
```

### Presets

| Preset | Usage |
|--------|-------|
| `phone-fr` | 06 12 34 56 78 |
| `phone-intl` | +33 … |
| `phone-country` | Drapeau + indicatif + national |
| `money-eur` / `money-usd` | Montants formatés |
| `card` | Carte bancaire |
| `date-fr` | JJ/MM/AAAA |
| `siret` | 14 chiffres |

### Masques personnalisés

- **Pattern** : `{ pattern: 'AA-###-*' }` — `A` lettre, `#` chiffre, `*` alphanum
- **Regex** : `{ regex: '^\\d{5}$', hint: '…' }`

### Propriétés exposées

`value`, `display`, `raw`, `isValid`, `focused` — et pour `phone-country` : `countryCode`, `dialCode`, `phoneNumber`, `fullPhone`.

### Événements (phone-country)

- `@phone-change` → `{ country, dialCode, number, full }`
- `@country-change` → `{ country, dialCode }`

Template minimal :

```html
<input x-ref="input" x-model="display"
  @focus="onFocus()" @blur="onBlur()" @input="onInput($event)">
```

**Bind** : `x-modelable="value"`

---

## apForm {#form}

```js
apForm({ data: {}, errors: {} })
```

| API | Description |
|-----|-------------|
| `hasError(path)` | Erreur sur un champ (notation pointée) |
| `getError(path)` | Premier message |
| `setErrors(obj)` | Charge les erreurs (422 Laravel) |
| `clearError` / `clearErrors` | Efface |
| `submit(url, opts?)` | `fetch` JSON + CSRF meta |
| `reset()` | Remet data initiale |

**Événements** : `form:success`, `form:error`

**Bind** : champs via `x-model="data.champ"` dans le scope du formulaire
