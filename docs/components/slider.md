# Slider

Curseur numérique avec tooltip et formateur personnalisé.

**x-modelable :** `value`

## Usage minimal

```html
<div x-data="apSlider({ min: 0, max: 100 })">
  <input type="range" :min="min" :max="max" :step="step"
         x-model.number="value" @input="onInput($event)" />
</div>
```

## Avec les classes `ap-*`

```html
<div x-data="apSlider({ min: 0, max: 100, value: 40, showTooltip: true })">
  <div class="ap-slider">

    <!-- Tooltip -->
    <span x-show="showTooltip" class="ap-slider-tooltip"
          :style="`left: ${percent}%`"
          x-text="formatted"></span>

    <!-- Curseur -->
    <input type="range" class="ap-slider-input"
           :min="min" :max="max" :step="step"
           :disabled="disabled"
           x-model.number="value"
           @input="onInput($event)" />

    <!-- Étiquettes min / max -->
    <div class="ap-slider-labels">
      <span x-text="min"></span>
      <span x-text="max"></span>
    </div>
  </div>
</div>
```

### Avec formateur monétaire

```html
<div x-data="apSlider({
  min: 0, max: 5000, value: 1200, step: 100,
  showTooltip: true,
  format: v => v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
})">
  <div class="ap-slider">
    <span class="ap-slider-tooltip" :style="`left: ${percent}%`"
          x-text="formatted" x-show="showTooltip"></span>
    <input type="range" class="ap-slider-input"
           :min="min" :max="max" :step="step"
           x-model.number="value" @input="onInput($event)" />
    <div class="ap-slider-labels">
      <span>0 €</span>
      <span>5 000 €</span>
    </div>
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
| `showTooltip` | `boolean` | `false` | Tooltip de valeur |
| `format` | `function` | `null` | `(value) => string` |

## État exposé

| Propriété | Description |
|---|---|
| `value` | Valeur courante |
| `percent` | Position en % (pour le tooltip) |
| `formatted` | Valeur après formateur |

## Méthodes

| Méthode | Description |
|---|---|
| `onInput(event)` | Binder sur `@input` |

## Classes CSS

| Classe | Élément |
|---|---|
| `.ap-slider` | Wrapper (padding-top pour le tooltip) |
| `.ap-slider-input` | `<input type="range">` stylisé |
| `.ap-slider-tooltip` | Bulle de valeur |
| `.ap-slider-labels` | Ligne min/max |
