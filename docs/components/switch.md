# Switch

Interrupteur booléen.

**x-modelable :** `value`

## Usage

```html
<div x-data="apSwitch({ value: false })">
  <button @click="toggle()" :disabled="disabled"
          :class="value ? 'bg-blue-600' : 'bg-gray-200'">
    <span :class="value ? 'translate-x-5' : 'translate-x-0'"
          class="inline-block w-4 h-4 rounded-full bg-white transition"></span>
  </button>
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

## Avec x-modelable

```html
<div x-data="{ actif: false }">
  <div x-data="apSwitch()" x-modelable="value" x-model="actif">
    <button @click="toggle()">...</button>
  </div>
  <span x-text="actif ? 'Actif' : 'Inactif'"></span>
</div>
```
