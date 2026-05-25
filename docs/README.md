# Documentation Alpine Components

Bibliothèque **headless** de composants [Alpine.js](https://alpinejs.dev/) 3 + [Tailwind CSS](https://tailwindcss.com/) 4, prête pour **Livewire**.

## Par où commencer ?

| Document | Contenu |
|----------|---------|
| [Installation](./installation.md) | Prérequis, démo locale, intégration dans un projet |
| [Architecture](./architecture.md) | Philosophie headless, structure des fichiers, événements |
| [Référence des composants](./composants.md) | API complète de chaque `Alpine.data()` et store |
| [Livewire](./livewire.md) | `x-modelable`, `wire:model`, erreurs serveur |
| [Laravel](./laravel.md) | apForm, validation 422, exemple complet |
| [examples/laravel/](../examples/laravel/) | Fichiers Blade, Controller, Form Request |

## Ressources interactives

- **Playground** : `index.html` — démos live de tous les composants
- **Documentation web** : ouvrir `/documentation.html` après `npm run dev`
- **README racine** : vue d’ensemble et liens rapides

## Composants disponibles

| Composant | Rôle |
|-----------|------|
| `apSelect` | Select simple / multiple avec recherche |
| `apDropdown` | Menu positionné (flip, fixed) |
| `apInputText` | Champ texte enrichi |
| `apInputTags` | Saisie de tags |
| `apSwitch` | Toggle booléen |
| `apSlider` | Curseur de plage |
| `apInputMask` | Champs formatés (tel, money, …) |
| `apForm` | État + validation + submit |
| `$store.toast` | Notifications globales |

Le markup HTML/Tailwind de référence se trouve dans le playground (`index.html`), section par section.
