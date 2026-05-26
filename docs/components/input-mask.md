# InputMask

Saisie avec masque de format : téléphone, carte bancaire, SIRET, date, montant et masque personnalisé.

**x-modelable :** `value`

## Usage

```html
<div x-data="apInputMask({ mask: 'phone-fr', placeholder: '06 12 34 56 78' })">
  <input x-model="value" :placeholder="placeholder" :disabled="disabled" />
</div>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `value` | `string` | `''` | Valeur initiale |
| `mask` | `string \| object` | — | Masque prédéfini ou personnalisé |
| `placeholder` | `string` | `''` | Placeholder |
| `prefix` | `object` | — | Addon gauche |
| `suffix` | `object` | — | Addon droit |
| `disabled` | `boolean` | `false` | Désactivé |
| `country` | `string` | `'FR'` | Code pays ISO (pour `phone-country`) |

## Masques prédéfinis

| Valeur | Format |
|---|---|
| `phone-fr` | `06 12 34 56 78` |
| `phone-intl` | `+33 6 12 34 56 78` |
| `phone-country` | Sélecteur de pays + numéro local |
| `money-eur` | `1 234,56 €` |
| `money-usd` | `$1,234.56` |
| `card` | `4111 1111 1111 1111` |
| `date-fr` | `31/12/2024` |
| `siret` | `123 456 789 00012` |

## Masque personnalisé

```js
// Pattern : # = chiffre, A = lettre
apInputMask({ mask: { pattern: '##/##/####' } })

// Regex
apInputMask({ mask: { regex: /^\d{0,5}$/ } })
```

## Sélecteur de pays (phone-country)

Quand `mask: 'phone-country'`, des propriétés supplémentaires sont exposées :

| Propriété | Description |
|---|---|
| `countryCode` | Code ISO sélectionné |
| `dialCode` | Indicatif (`+33`) |
| `phoneNumber` | Numéro local formaté |
| `fullPhone` | Numéro complet avec indicatif |
| `countries` | Liste des pays disponibles |

| Méthode | Description |
|---|---|
| `toggleCountryPicker()` | Ouvre/ferme le sélecteur |
| `closeCountryPicker()` | Ferme le sélecteur |
| `selectCountry(c)` | Sélectionne un pays |

## Événements additionnels

| Événement | Émis quand |
|---|---|
| `phone-change` | Le numéro change (phone-country) |
| `country-change` | Le pays change (phone-country) |
