# Toast

Store Alpine.js global pour les notifications. Accessible via `$store.toast` ou `window.$toast`.

**x-modelable :** — (store global)

## Enregistrement

Le plugin `AlpineComponents` enregistre le store automatiquement. Si vous importez Toast seul :

```js
import { registerToastStore } from '@momoledev/alpine-components'
registerToastStore(Alpine) // avant Alpine.start()
```

## Avec les classes `ap-*`

### Conteneur à placer dans le layout

```html
<div class="ap-toast-container" x-data>
  <template x-for="t in $store.toast.items" :key="t.id">
    <div class="ap-toast"
         :class="`ap-toast-${t.type}`"
         x-show="t.visible"
         x-transition:enter="transition ease-out duration-150"
         x-transition:enter-start="opacity-0 translate-y-2"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-end="opacity-0">

      <!-- Icône -->
      <svg class="ap-toast-icon" viewBox="0 0 20 20" fill="currentColor">
        <!-- success -->
        <path x-show="t.type === 'success'"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"/>
        <!-- error -->
        <path x-show="t.type === 'error'"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"/>
        <!-- warning -->
        <path x-show="t.type === 'warning'"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"/>
        <!-- info -->
        <path x-show="t.type === 'info'"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"/>
      </svg>

      <!-- Corps -->
      <div class="ap-toast-body">
        <p class="ap-toast-title" x-show="t.title" x-text="t.title"></p>
        <p class="ap-toast-message" x-text="t.message"></p>
        <button x-show="t.action" class="ap-toast-action"
                @click="t.action?.fn?.(); $store.toast.dismiss(t.id)"
                x-text="t.action?.label"></button>
      </div>

      <!-- Fermer -->
      <button class="ap-toast-dismiss" @click="$store.toast.dismiss(t.id)" type="button">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
        </svg>
      </button>
    </div>
  </template>
</div>
```

## Déclencher des toasts

```js
// Depuis Alpine
$store.toast.success('Enregistré avec succès')
$store.toast.error('Une erreur est survenue', 'Erreur 500')
$store.toast.warning('Espace disque faible')
$store.toast.info('Mise à jour disponible')

// Depuis JavaScript
window.$toast.success('Copié !')

// Avec action
$store.toast.add({
  type: 'error',
  title: 'Échec de l\'envoi',
  message: 'Vérifiez votre connexion.',
  duration: 0,          // persistant
  action: { label: 'Réessayer', fn: () => retrySubmit() }
})
```

## API du store

| Méthode | Signature | Description |
|---|---|---|
| `success` | `(message, title?, opts?)` | Toast vert |
| `error` | `(message, title?, opts?)` | Toast rouge |
| `warning` | `(message, title?, opts?)` | Toast orange |
| `info` | `(message, title?, opts?)` | Toast bleu |
| `add` | `(opts)` | Toast personnalisé |
| `dismiss` | `(id)` | Ferme un toast |
| `clear` | `()` | Ferme tous les toasts |

## Classes CSS

| Classe | Élément |
|---|---|
| `.ap-toast-container` | Conteneur fixed bas-droite |
| `.ap-toast` | Toast individuel |
| `.ap-toast-success` | Variante verte (barre gauche) |
| `.ap-toast-error` | Variante rouge |
| `.ap-toast-warning` | Variante orange |
| `.ap-toast-info` | Variante bleue |
| `.ap-toast-icon` | Icône SVG colorée |
| `.ap-toast-body` | Zone titre + message |
| `.ap-toast-title` | Titre en gras |
| `.ap-toast-message` | Message secondaire |
| `.ap-toast-action` | Bouton d'action souligné |
| `.ap-toast-dismiss` | Bouton ✕ |
