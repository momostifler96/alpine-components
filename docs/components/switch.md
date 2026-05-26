# Switch

Interrupteur booléen.

**x-modelable :** `value`

## Usage minimal

```html
<div x-data="apSwitch({ value: false })">
  <button @click="toggle()" :disabled="disabled">
    <span :style="`transform: translateX(${value ? '20px' : '0'})`"></span>
  </button>
</div>
```

## Avec les classes `ap-*`

```html
<div x-data="apSwitch({ value: false })">
  <button class="ap-switch" :class="{ 'is-on': value }"
          @click="toggle()" :disabled="disabled" type="button"
          :aria-checked="value" role="switch">
    <span class="ap-switch-thumb"></span>
  </button>
</div>
```

### Avec libellé

```html
<div x-data="apSwitch({ value: true })" class="flex items-center gap-3">
  <button class="ap-switch" :class="{ 'is-on': value }"
          @click="toggle()" type="button">
    <span class="ap-switch-thumb"></span>
  </button>
  <span x-text="value ? 'Activé' : 'Désactivé'"></span>
</div>
```

### Avec x-modelable

```html
<div x-data="{ notifications: true }">
  <div x-data="apSwitch()" x-modelable="value" x-model="notifications">
    <button class="ap-switch" :class="{ 'is-on': value }"
            @click="toggle()">
      <span class="ap-switch-thumb"></span>
    </button>
  </div>
  <p x-text="notifications ? 'Notifications activées' : 'Notifications désactivées'"></p>
</div>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `value` | `boolean` | `false` | État initial |
| `disabled` | `boolean` | `false` | Désactivé |

## État exposé

| Propriété | Description |
|---|---|
| `value` | État courant |

## Méthodes

| Méthode | Description |
|---|---|
| `toggle()` | Inverse l'état |

## Classes CSS

| Classe | Élément |
|---|---|
| `.ap-switch` | Bouton track |
| `.ap-switch-thumb` | Pastille coulissante |

**Modificateurs d'état :** `.is-on` (sur `.ap-switch`)
