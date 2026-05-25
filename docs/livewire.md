# Intégration Livewire

Alpine Components est conçu pour fonctionner avec [Livewire](https://livewire.laravel.com/) sans couche d’adaptation.

## Principe

1. Le composant Alpine gère l’UI et l’état local.
2. `x-modelable` expose la propriété bindable vers le parent.
3. `wire:model` / `wire:model.live` sur le même élément synchronise avec le serveur.
4. Les événements `input` et `change` garantissent la compatibilité wire:model.

## Select multiple

```blade
<div
    x-data="apSelect(@js([
        'options'   => $options,
        'multiple'  => true,
        'searchable'=> true,
    ]))"
    x-modelable="value"
    wire:model.live="selectedTechs"
    @click.outside="close()"
    class="relative"
>
    {{-- Copier le trigger + panneau depuis index.html #select --}}
</div>
```

## Switch

```blade
<div x-data="apSwitch()" x-modelable="value" wire:model.live="darkMode">
    <button type="button" @click="toggle()" role="switch" :aria-checked="value.toString()">
        {{-- track + thumb --}}
    </button>
</div>
```

## Slider

```blade
<div x-data="apSlider({ min: 0, max: 100, value: $volume })" x-modelable="value" wire:model.live="volume">
    <input type="range" :min="min" :max="max" :step="step"
        :value="value" @input="onInput($event)">
</div>
```

## Input tags

```blade
<div x-data="apInputTags({ tags: $tags })" x-modelable="tags" wire:model.live="tags">
    {{-- markup tags --}}
</div>
```

## Erreurs de validation serveur

Après une action Livewire qui retourne des erreurs :

```html
<div x-data="{ ...apForm({ data: @js($form) }), init() {
  this.$watch('$wire.errors', e => this.setErrors(e));
}}">
```

Ou manuellement après un appel :

```js
this.setErrors($wire.__instance?.snapshot?.memo?.errors ?? {});
```

`apForm.setErrors()` normalise les messages en tableaux (`{ email: ['…'] }`).

## apForm + API Laravel (sans Livewire)

`submit()` gère automatiquement le statut **422** et appelle `setErrors(body.errors)` si la réponse JSON suit la convention Laravel.

```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

## Checklist Livewire

- [ ] `@js()` pour passer options PHP → Alpine
- [ ] `x-modelable` sur la bonne propriété (`value`, `tags`)
- [ ] `wire:model.live` pour réactivité immédiate
- [ ] `@click.outside="close()"` sur Select / Dropdown
- [ ] Conteneur Toast dans le layout Livewire
