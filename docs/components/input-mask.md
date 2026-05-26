# InputMask

Saisie avec masque de format : téléphone, carte bancaire, SIRET, date, montant et masque personnalisé.

**x-modelable :** `value`

## Usage minimal

```html
<div x-data="apInputMask({ mask: 'phone-fr' })">
  <input x-model="value" :placeholder="placeholder" />
</div>
```

## Avec les classes `ap-*`

### Champ masqué simple

```html
<div x-data="apInputMask({ mask: 'date-fr', placeholder: 'JJ/MM/AAAA' })"
     class="ap-mask-wrapper">
  <input class="ap-mask-input" x-model="value"
         :placeholder="placeholder" :disabled="disabled" />
</div>
```

### Avec addon préfixe

```html
<div x-data="apInputMask({ mask: 'money-eur', placeholder: '0,00' })"
     class="ap-mask-wrapper">
  <span class="ap-input-addon">€</span>
  <input class="ap-mask-input" x-model="value" :placeholder="placeholder" />
</div>
```

### Sélecteur de pays (phone-country)

```html
<div x-data="apInputMask({ mask: 'phone-country', country: 'FR' })"
     class="ap-mask-wrapper" style="position: relative;">

  <!-- Bouton pays -->
  <button class="ap-mask-country-btn" @click="toggleCountryPicker()" type="button">
    <span x-text="country.flag ?? '🌍'"></span>
    <span x-text="dialCode"></span>
    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/>
    </svg>
  </button>

  <input class="ap-mask-input" x-model="phoneNumber"
         :placeholder="placeholder" />

  <!-- Panel pays -->
  <div class="ap-mask-country-panel" x-show="open" x-cloak
       @click.outside="closeCountryPicker()">
    <input class="ap-mask-country-search" x-model="countrySearch"
           placeholder="Rechercher un pays…" />
    <ul class="ap-mask-country-list">
      <template x-for="c in filteredCountries" :key="c.code">
        <li class="ap-mask-country-option"
            :class="{ 'is-selected': c.code === countryCode }"
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

## Masques prédéfinis

| Valeur | Format | Exemple |
|---|---|---|
| `phone-fr` | `## ## ## ## ##` | `06 12 34 56 78` |
| `phone-intl` | `+## # ## ## ## ##` | `+33 6 12 34 56 78` |
| `phone-country` | Sélecteur pays + local | `+33 6 12 34 56 78` |
| `money-eur` | Séparateur de milliers + `,` | `1 234,56` |
| `money-usd` | Séparateur de milliers + `.` | `1,234.56` |
| `card` | `#### #### #### ####` | `4111 1111 1111 1111` |
| `date-fr` | `##/##/####` | `31/12/2024` |
| `siret` | `### ### ### #####` | `123 456 789 00012` |

## Masque personnalisé

```js
// Pattern : # = chiffre, A = lettre
apInputMask({ mask: { pattern: '##/##/####' } })

// Regex
apInputMask({ mask: { regex: /^\d{0,5}$/ } })
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `value` | `string` | `''` | Valeur initiale |
| `mask` | `string\|object` | — | Masque prédéfini ou `{ pattern }` / `{ regex }` |
| `placeholder` | `string` | `''` | Placeholder |
| `disabled` | `boolean` | `false` | Désactivé |
| `country` | `string` | `'FR'` | Code pays ISO (phone-country) |

## Classes CSS

| Classe | Élément |
|---|---|
| `.ap-mask-wrapper` | Conteneur avec bordure |
| `.ap-mask-input` | Champ de saisie |
| `.ap-mask-country-btn` | Bouton sélecteur de pays |
| `.ap-mask-country-panel` | Panneau de sélection |
| `.ap-mask-country-search` | Input de recherche pays |
| `.ap-mask-country-list` | Liste `<ul>` |
| `.ap-mask-country-option` | Item pays |
| `.ap-mask-country-dial` | Indicatif téléphonique |

**Modificateurs d'état :** `.is-error` (sur `.ap-mask-wrapper`) · `.is-selected` (sur `.ap-mask-country-option`)
