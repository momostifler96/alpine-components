# Slider

Curseur numérique avec tooltip et formateur personnalisé.

**x-modelable :** `value`

## Usage

```html
<div x-data="apSlider({ min: 0, max: 100, showTooltip: true })">
  <div class="relative">
    <input type="range" :min="min" :max="max" :step="step"
           x-model.number="value" @input="onInput($event)" />
    <span x-show="showTooltip" x-text="formatted"
          :style="`left: ${percent}%`" class="absolute -top-8">
    </span>
  </div>
</div>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `value` | `number` | `0` | Valeur initiale |
| `min` | `number` | `0` | Minimum |
| `max` | `number` | `100` | Maximum |
| `step` | `number` | `1` | Pas |
| `disabled` | `boolean` | `false` | Désactivé |
| `showTooltip` | `boolean` | `false` | Affiche la valeur au-dessus du curseur |
| `format` | `function` | `null` | Formateur personnalisé `(value) => string` |

## État exposé

| Propriété | Description |
|---|---|
| `value` | Valeur courante |
| `percent` | Position en pourcentage (pour positionner le tooltip) |
| `formatted` | Valeur affichée (après formateur) |

## Méthodes

| Méthode | Description |
|---|---|
| `onInput(event)` | À binder sur `@input` du `<input type="range">` |

## Formateur personnalisé

```js
apSlider({
  min: 0, max: 1000, value: 250,
  format: v => v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
})
```
