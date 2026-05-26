# Architecture

## Modèle headless

Chaque composant est une **factory Alpine.data** : elle retourne un objet avec l'état réactif et les méthodes. Le HTML reste entièrement sous votre contrôle.

```html
<!-- Vous écrivez le HTML -->
<div x-data="apSelect({ options: [...] })">
  <input :value="display" @click="toggle()" readonly />
  <ul x-show="open">
    <template x-for="opt in filtered">
      <li @click="select(opt)" x-text="opt.label"></li>
    </template>
  </ul>
</div>
```

## x-modelable

Tous les composants exposent leur valeur principale via `x-modelable`, ce qui permet le binding bidirectionnel depuis un parent :

```html
<div x-data="{ ville: null }">
  <div x-data="apSelect({ options: villes })" x-modelable="value" x-model="ville">
    ...
  </div>
  <span x-text="ville"></span>
</div>
```

## Événements

Chaque modification de valeur émet `input` et `change` sur l'élément racine du composant. Cela garantit la compatibilité avec `wire:model.live` de Livewire.

```js
el.addEventListener('input', e => console.log(e.target.value))
```

## Propriété `bind`

Chaque composant documente sa propriété `x-modelable` :

| Composant | bind |
|---|---|
| Select | `value` |
| InputText | `value` |
| InputTags | `tags` |
| Switch | `value` |
| Slider | `value` |
| Form | `data` |
| InputMask | `value` |
| Dropdown | — |
| Toast | store global |
