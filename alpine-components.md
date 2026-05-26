Génère ou intègre des composants Alpine Components (@momoledev/alpine-components) dans le fichier ou la vue demandée par l'utilisateur.

**Règles :**
- Utilise toujours les classes `ap-*` du stylesheet officiel
- Importe le style si ce n'est pas déjà fait : `import '@momoledev/alpine-components/style'`
- Chaque composant nécessite `x-data="apNom({ ... })"` sur le wrapper racine
- Toujours ajouter `@click.outside="close()"` sur les composants avec panneau (Select, Dropdown, InputMask country)
- Toujours ajouter `x-cloak` sur les panneaux pour éviter le flash
- Les composants émettent `input` et `change` — compatibles `wire:model.live`

Référence complète des snippets ci-dessous. Copie le bloc correspondant, adapte les props, et intègre-le.

---

## INSTALL

```js
// app.js
import '@momoledev/alpine-components/style'
import Alpine from 'alpinejs'
import AlpineComponents from '@momoledev/alpine-components'
Alpine.plugin(AlpineComponents)
Alpine.start()
```

```css
/* Surcharge des tokens (optionnel) */
:root {
  --ap-primary: #6366f1;
  --ap-radius:  0.5rem;
  --ap-height:  2.5rem;
}
```

---

## ap-input  (apInputText)

```html
<!-- Simple -->
<div x-data="apInputText({ placeholder: 'Texte…' })">
  <input class="ap-input" :type="inputType" x-model="value"
         :placeholder="placeholder" :disabled="disabled" />
</div>

<!-- Avec addon + clear -->
<div x-data="apInputText({ clearable: true, placeholder: 'Rechercher…' })"
     class="ap-input-wrapper">
  <span class="ap-input-addon">
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"/>
    </svg>
  </span>
  <input class="ap-input" x-model="value" :placeholder="placeholder" :disabled="disabled" />
  <button x-show="clearable && value" class="ap-input-action" @click="clear()" type="button">✕</button>
</div>

<!-- Mot de passe -->
<div x-data="apInputText({ type: 'password' })" class="ap-input-wrapper">
  <input class="ap-input" :type="inputType" x-model="value" placeholder="Mot de passe" />
  <button class="ap-input-action" @click="toggleReveal()" type="button">
    <svg x-show="!revealed" width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/><path d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z"/></svg>
    <svg x-show="revealed"  width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22z"/></svg>
  </button>
</div>
```

**Props :** `value` `type` `placeholder` `disabled` `readonly` `clearable`
**Classes :** `.ap-input` `.ap-input-wrapper` `.ap-input-addon` `.ap-input-addon-right` `.ap-input-action`
**État :** `.is-error`

---

## ap-select  (apSelect)

```html
<!-- Simple -->
<div x-data="apSelect({ options: [{ label: 'Option A', value: 'a' }] })"
     class="ap-select" @click.outside="close()">
  <button class="ap-select-trigger" :class="{ 'is-open': open }" @click="toggleOpen()">
    <span class="ap-select-trigger-label" :class="{ 'is-placeholder': !hasValue }"
          x-text="display || 'Choisir…'"></span>
    <svg class="ap-select-trigger-chevron" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/>
    </svg>
  </button>
  <div class="ap-select-panel" x-show="open" x-cloak>
    <ul class="ap-select-options">
      <template x-for="opt in filteredOptions" :key="opt.value">
        <li class="ap-select-option" :class="{ 'is-selected': isSelected(opt.value), 'is-disabled': opt.disabled }"
            @click="select(opt)" x-text="opt.label"></li>
      </template>
      <li x-show="filteredOptions.length === 0" class="ap-select-empty">Aucun résultat</li>
    </ul>
  </div>
</div>

<!-- Avec recherche + clearable -->
<div x-data="apSelect({ options: [], searchable: true, clearable: true, placeholder: 'Choisir…' })"
     class="ap-select" @click.outside="close()">
  <button class="ap-select-trigger" :class="{ 'is-open': open }" @click="toggleOpen()">
    <span class="ap-select-trigger-label" :class="{ 'is-placeholder': !hasValue }"
          x-text="display || placeholder"></span>
    <button x-show="clearable && hasValue" class="ap-select-clear" @click="clear($event)" type="button">✕</button>
    <svg class="ap-select-trigger-chevron" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/>
    </svg>
  </button>
  <div class="ap-select-panel" x-show="open" x-cloak>
    <input class="ap-select-search" x-model="search" x-ref="searchInput" placeholder="Rechercher…" />
    <ul class="ap-select-options">
      <template x-for="opt in filteredOptions" :key="opt.value">
        <li class="ap-select-option" :class="{ 'is-selected': isSelected(opt.value) }"
            @click="select(opt)">
          <span class="ap-select-option-label" x-text="opt.label"></span>
          <svg x-show="isSelected(opt.value)" class="ap-select-option-check" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"/>
          </svg>
        </li>
      </template>
    </ul>
  </div>
</div>

<!-- Multiple avec tags -->
<div x-data="apSelect({ options: [], multiple: true, placeholder: 'Choisir…' })"
     class="ap-select" @click.outside="close()">
  <button class="ap-select-trigger" @click="toggleOpen()">
    <span class="ap-select-tags" x-show="hasValue">
      <template x-for="opt in selectedOptions" :key="opt.value">
        <span class="ap-select-tag">
          <span class="ap-select-tag-label" x-text="opt.label"></span>
          <button class="ap-select-tag-remove" @click="removeTag(opt.value, $event)" type="button">✕</button>
        </span>
      </template>
    </span>
    <span x-show="!hasValue" class="ap-select-trigger-label is-placeholder" x-text="placeholder"></span>
  </button>
  <div class="ap-select-panel" x-show="open" x-cloak>
    <ul class="ap-select-options">
      <template x-for="opt in filteredOptions" :key="opt.value">
        <li class="ap-select-option" :class="{ 'is-selected': isSelected(opt.value) }"
            @click="select(opt)" x-text="opt.label"></li>
      </template>
    </ul>
  </div>
</div>
```

**Props :** `options[]` `value` `multiple` `searchable` `clearable` `placeholder` `disabled` `maxSelected`
**Classes :** `.ap-select` `.ap-select-trigger` `.ap-select-trigger-label` `.ap-select-trigger-chevron` `.ap-select-panel` `.ap-select-search` `.ap-select-options` `.ap-select-option` `.ap-select-option-label` `.ap-select-option-check` `.ap-select-empty` `.ap-select-tags` `.ap-select-tag` `.ap-select-tag-label` `.ap-select-tag-remove` `.ap-select-clear`
**État :** `.is-open` `.is-selected` `.is-disabled` `.is-placeholder` `.is-error`

---

## ap-dropdown  (apDropdown)

```html
<div x-data="apDropdown({ placement: 'bottom-end' })"
     class="ap-dropdown" @click.outside="close()">
  <button data-dropdown-trigger @click="toggle()" type="button">
    Ouvrir
  </button>
  <div data-dropdown-panel x-show="open" x-cloak
       :style="panelStyle" :class="panelClass"
       class="ap-dropdown-panel">
    <button class="ap-dropdown-item" @click="close()">Modifier</button>
    <button class="ap-dropdown-item" @click="close()">Dupliquer</button>
    <div class="ap-dropdown-divider"></div>
    <div class="ap-dropdown-header">Zone critique</div>
    <button class="ap-dropdown-item is-danger" @click="close()">Supprimer</button>
  </div>
</div>
```

**Props :** `placement` (`bottom-start` `bottom-end` `top-start` `top-end`) `disabled` `width` (`auto` `trigger`) `fixed`
**Classes :** `.ap-dropdown` `.ap-dropdown-panel` `.ap-dropdown-item` `.ap-dropdown-divider` `.ap-dropdown-header`
**État :** `.is-danger` `.is-disabled`
**Attributs HTML requis :** `data-dropdown-trigger` `data-dropdown-panel`

---

## ap-tags  (apInputTags)

```html
<div x-data="apInputTags({ placeholder: 'Ajouter…' })"
     class="ap-tags-wrapper" @click="$el.querySelector('.ap-tags-input').focus()">
  <template x-for="(tag, i) in tags" :key="i">
    <span class="ap-tag">
      <span class="ap-tag-label" x-text="tag"></span>
      <button class="ap-tag-remove" @click.stop="removeTag(i)" type="button">
        <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
      </button>
    </span>
  </template>
  <input class="ap-tags-input" x-model="input" @keydown="onKeydown($event)"
         :placeholder="tags.length === 0 ? placeholder : ''" />
</div>
```

**Props :** `tags[]` `placeholder` `maxTags` `allowDuplicates` `separators`
**Classes :** `.ap-tags-wrapper` `.ap-tag` `.ap-tag-label` `.ap-tag-remove` `.ap-tags-input`
**État :** `.is-error` (sur `.ap-tags-wrapper`)

---

## ap-switch  (apSwitch)

```html
<div x-data="apSwitch({ value: false })">
  <button class="ap-switch" :class="{ 'is-on': value }"
          @click="toggle()" :disabled="disabled" type="button"
          role="switch" :aria-checked="value.toString()">
    <span class="ap-switch-thumb"></span>
  </button>
</div>

<!-- Avec libellé -->
<div x-data="apSwitch()" style="display:flex;align-items:center;gap:0.75rem;">
  <button class="ap-switch" :class="{ 'is-on': value }" @click="toggle()" type="button">
    <span class="ap-switch-thumb"></span>
  </button>
  <span x-text="value ? 'Activé' : 'Désactivé'"></span>
</div>
```

**Props :** `value` `disabled`
**Classes :** `.ap-switch` `.ap-switch-thumb`
**État :** `.is-on` (sur `.ap-switch`)

---

## ap-slider  (apSlider)

```html
<div x-data="apSlider({ min: 0, max: 100, value: 50, showTooltip: true })">
  <div class="ap-slider">
    <span class="ap-slider-tooltip" x-show="showTooltip"
          :style="`left:${percent}%`" x-text="formatted"></span>
    <input type="range" class="ap-slider-input"
           :min="min" :max="max" :step="step" :disabled="disabled"
           x-model.number="value" @input="onInput($event)" />
    <div class="ap-slider-labels">
      <span x-text="min"></span>
      <span x-text="max"></span>
    </div>
  </div>
</div>
```

**Props :** `value` `min` `max` `step` `disabled` `showTooltip` `format`
**Classes :** `.ap-slider` `.ap-slider-input` `.ap-slider-tooltip` `.ap-slider-labels`

---

## ap-mask  (apInputMask)

```html
<!-- Masque simple -->
<div x-data="apInputMask({ mask: 'phone-fr', placeholder: '06 00 00 00 00' })"
     class="ap-mask-wrapper">
  <input class="ap-mask-input" x-model="value" :placeholder="placeholder" :disabled="disabled" />
</div>

<!-- Avec addon -->
<div x-data="apInputMask({ mask: 'money-eur', placeholder: '0,00' })"
     class="ap-mask-wrapper">
  <span class="ap-input-addon">€</span>
  <input class="ap-mask-input" x-model="value" :placeholder="placeholder" />
</div>

<!-- Sélecteur de pays -->
<div x-data="apInputMask({ mask: 'phone-country', country: 'FR' })"
     class="ap-mask-wrapper" style="position:relative;">
  <button class="ap-mask-country-btn" @click="toggleCountryPicker()" type="button">
    <span x-text="country?.flag ?? '🌍'"></span>
    <span x-text="dialCode"></span>
  </button>
  <input class="ap-mask-input" x-model="phoneNumber" :placeholder="placeholder" />
  <div class="ap-mask-country-panel" x-show="open" x-cloak @click.outside="closeCountryPicker()">
    <input class="ap-mask-country-search" x-model="countrySearch" placeholder="Pays…" />
    <ul class="ap-mask-country-list">
      <template x-for="c in filteredCountries" :key="c.code">
        <li class="ap-mask-country-option" :class="{ 'is-selected': c.code === countryCode }"
            @click="selectCountry(c)">
          <span x-text="c.flag ?? '🌍'"></span>
          <span x-text="c.name"></span>
          <span class="ap-mask-country-dial" x-text="c.dialCode"></span>
        </li>
      </template>
    </ul>
  </div>
</div>
```

**Masques prédéfinis :** `phone-fr` `phone-intl` `phone-country` `money-eur` `money-usd` `card` `date-fr` `siret`
**Masque custom :** `{ pattern: '##/##/####' }` ou `{ regex: /^\d{0,5}$/ }`
**Classes :** `.ap-mask-wrapper` `.ap-mask-input` `.ap-mask-country-btn` `.ap-mask-country-panel` `.ap-mask-country-search` `.ap-mask-country-list` `.ap-mask-country-option` `.ap-mask-country-dial`
**État :** `.is-error` (sur `.ap-mask-wrapper`) `.is-selected` (sur `.ap-mask-country-option`)

---

## ap-form  (apForm)

```html
<form class="ap-form"
      x-data="apForm({ data: { name: '', email: '' } })"
      @submit.prevent="submit('/api/endpoint')">

  <div class="ap-form-field">
    <label class="ap-form-label is-required">Nom</label>
    <input class="ap-input" :class="{ 'is-error': hasError('name') }"
           x-model="data.name" placeholder="Jean Dupont" />
    <p class="ap-form-error" x-show="hasError('name')" x-text="getError('name')"></p>
  </div>

  <div class="ap-form-field">
    <label class="ap-form-label is-required">Email</label>
    <input class="ap-input" :class="{ 'is-error': hasError('email') }"
           x-model="data.email" type="email" placeholder="jean@exemple.fr" />
    <p class="ap-form-hint">Jamais partagé.</p>
    <p class="ap-form-error" x-show="hasError('email')" x-text="getError('email')"></p>
  </div>

  <div class="ap-form-success" x-show="success">✓ Enregistré avec succès.</div>

  <div style="display:flex;gap:0.75rem;">
    <button type="submit" class="ap-form-submit" :class="{ 'is-loading': loading }"
            :disabled="loading">
      <span x-show="!loading">Envoyer</span>
      <span x-show="loading">Envoi…</span>
    </button>
    <button type="button" class="ap-form-submit ap-form-submit-secondary"
            @click="reset()">Annuler</button>
  </div>
</form>
```

**Props :** `data{}` `errors{}`
**État :** `loading` `success` `errors`
**Méthodes :** `submit(url, opts?)` → `{ok, status, data}` · `hasError(path)` · `getError(path)` · `setErrors(obj)` · `clearErrors()` · `reset()`
**Classes :** `.ap-form` `.ap-form-field` `.ap-form-label` `.ap-form-hint` `.ap-form-error` `.ap-form-success` `.ap-form-submit` `.ap-form-submit-secondary`
**Modificateurs :** `.is-required` (sur `.ap-form-label`) · `.is-error` (sur `.ap-input`) · `.is-loading` (sur `.ap-form-submit`)
**Laravel 422 :** `apForm` lit `meta[name="csrf-token"]` et gère `{errors:{}}` automatiquement.

---

## ap-toast  ($store.toast)

```html
<!-- Conteneur à placer une fois dans le layout -->
<div class="ap-toast-container" x-data>
  <template x-for="t in $store.toast.items" :key="t.id">
    <div class="ap-toast" :class="`ap-toast-${t.type}`"
         x-show="t.visible"
         x-transition:enter="transition ease-out duration-150"
         x-transition:enter-start="opacity-0 translate-y-2"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-end="opacity-0">
      <div class="ap-toast-body">
        <p class="ap-toast-title" x-show="t.title" x-text="t.title"></p>
        <p class="ap-toast-message" x-text="t.message"></p>
        <button x-show="t.action" class="ap-toast-action"
                @click="t.action?.fn?.(); $store.toast.dismiss(t.id)"
                x-text="t.action?.label"></button>
      </div>
      <button class="ap-toast-dismiss" @click="$store.toast.dismiss(t.id)" type="button">✕</button>
    </div>
  </template>
</div>
```

**Déclencher :**
```js
$store.toast.success('Message', 'Titre')
$store.toast.error('Message', 'Titre')
$store.toast.warning('Message')
$store.toast.info('Message')
$store.toast.add({ type: 'success', title: '', message: '', duration: 4500, action: { label: 'Annuler', fn: () => {} } })
$store.toast.dismiss(id)
$store.toast.clear()
window.$toast.success('Copié !')  // accès global
```

**Classes :** `.ap-toast-container` `.ap-toast` `.ap-toast-success` `.ap-toast-error` `.ap-toast-warning` `.ap-toast-info` `.ap-toast-body` `.ap-toast-title` `.ap-toast-message` `.ap-toast-action` `.ap-toast-dismiss`

---

## COMBINAISONS COURANTES

### Champ avec erreur form + select

```html
<div class="ap-form-field">
  <label class="ap-form-label is-required">Statut</label>
  <div x-data="apSelect({ options: [{ label: 'Actif', value: 1 }, { label: 'Inactif', value: 0 }] })"
       x-modelable="value" x-model="data.status"
       class="ap-select" @click.outside="close()">
    <button class="ap-select-trigger" :class="{ 'is-error': hasError('status'), 'is-open': open }"
            @click="toggleOpen()">
      <span class="ap-select-trigger-label" :class="{ 'is-placeholder': !hasValue }"
            x-text="display || 'Choisir'"></span>
    </button>
    <div class="ap-select-panel" x-show="open" x-cloak>
      <ul class="ap-select-options">
        <template x-for="opt in filteredOptions" :key="opt.value">
          <li class="ap-select-option" :class="{ 'is-selected': isSelected(opt.value) }"
              @click="select(opt)" x-text="opt.label"></li>
        </template>
      </ul>
    </div>
  </div>
  <p class="ap-form-error" x-show="hasError('status')" x-text="getError('status')"></p>
</div>
```

### Switch dans un form

```html
<div class="ap-form-field" style="flex-direction:row;align-items:center;justify-content:space-between;">
  <label class="ap-form-label">Notifications</label>
  <div x-data="apSwitch()" x-modelable="value" x-model="data.notifications">
    <button class="ap-switch" :class="{ 'is-on': value }" @click="toggle()" type="button">
      <span class="ap-switch-thumb"></span>
    </button>
  </div>
</div>
```

### Dropdown dans un tableau

```html
<td>
  <div x-data="apDropdown({ placement: 'bottom-end', fixed: true })"
       class="ap-dropdown" @click.outside="close()">
    <button data-dropdown-trigger @click="toggle()" type="button">⋯</button>
    <div data-dropdown-panel x-show="open" x-cloak
         :style="panelStyle" :class="panelClass" class="ap-dropdown-panel">
      <button class="ap-dropdown-item" @click="close()">Voir</button>
      <button class="ap-dropdown-item is-danger" @click="close()">Supprimer</button>
    </div>
  </div>
</td>
```