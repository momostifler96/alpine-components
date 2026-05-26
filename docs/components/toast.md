# Toast

Store Alpine.js global pour les notifications. Accessible via `$store.toast` ou `window.$toast`.

**x-modelable :** — (store global)

## Enregistrement

Le plugin `AlpineComponents` enregistre le store automatiquement. Si vous importez Toast seul :

```js
import { registerToastStore } from '@momoledev/alpine-components'
registerToastStore(Alpine) // avant Alpine.start()
```

## Afficher les toasts

Ajoutez un conteneur dans votre layout :

```html
<div x-data class="fixed bottom-4 right-4 space-y-2 z-50">
  <template x-for="toast in $store.toast.items" :key="toast.id">
    <div :class="toast.type" x-show="toast.visible"
         x-transition>
      <strong x-text="toast.title"></strong>
      <span x-text="toast.message"></span>
      <button @click="$store.toast.dismiss(toast.id)">✕</button>
    </div>
  </template>
</div>
```

## Déclencher un toast

```js
// Depuis Alpine
$store.toast.success('Enregistré avec succès')
$store.toast.error('Une erreur est survenue', 'Erreur 500')
$store.toast.warning('Espace disque faible')
$store.toast.info('Mise à jour disponible', 'Info')

// Depuis JavaScript
window.$toast.success('Copié !')
```

## API du store

### Méthodes raccourcies

| Méthode | Signature | Description |
|---|---|---|
| `success` | `(message, title?, opts?)` | Toast vert |
| `error` | `(message, title?, opts?)` | Toast rouge |
| `warning` | `(message, title?, opts?)` | Toast orange |
| `info` | `(message, title?, opts?)` | Toast bleu |

### Méthode `add` complète

```js
$store.toast.add({
  type: 'success',      // 'success' | 'error' | 'warning' | 'info'
  title: 'Succès',
  message: 'Fichier enregistré',
  duration: 4500,       // 0 = persistant
  action: {             // bouton d'action optionnel
    label: 'Annuler',
    fn: () => undoSave()
  }
})
```

### Gestion

| Méthode | Description |
|---|---|
| `dismiss(id)` | Masque puis retire un toast (animation de sortie) |
| `clear()` | Retire tous les toasts avec animation |

## Constante de transition

`TOAST_TRANSITION_MS` (320 ms) est exportée pour synchroniser vos animations CSS :

```js
import { TOAST_TRANSITION_MS } from '@momoledev/alpine-components'
```
