# Intégration Livewire

Tous les composants émettent `input` et `change` sur chaque modification, ce qui les rend compatibles avec `wire:model.live`.

## Exemple avec Select

```html
<div x-data="apSelect({ options: $wire.options })"
     x-modelable="value"
     x-model="$wire.selectedId"
     wire:ignore.self>
  ...
</div>
```

## Exemple avec Form

```html
<form x-data="apForm({ data: { email: @entangle('email') } })"
      @submit.prevent="submit('/api/contact')">
  <input x-model="data.email" />
  <span x-text="getError('email')" x-show="hasError('email')"></span>
  <button type="submit" :disabled="loading">Envoyer</button>
</form>
```

## Exemple avec Toast (depuis Livewire)

```php
// Dans votre composant Livewire
$this->dispatch('toast', type: 'success', message: 'Enregistré !');
```

```js
// Dans votre layout Alpine
window.addEventListener('toast', e => {
  Alpine.store('toast')[e.detail.type](e.detail.message)
})
```

## wire:model vs x-modelable

Préférez `x-modelable` + `x-model="$wire.prop"` plutôt que `wire:model` direct sur un composant Alpine — cela évite les conflits de rendu Livewire.
