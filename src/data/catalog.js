/**
 * Catalogue des composants Alpine Components — métadonnées pour la landing et la doc.
 *
 * @typedef {Object} CatalogEntry
 * @property {string} id          Ancre HTML (#select, #dropdown, …)
 * @property {string} slug        Nom Alpine.data (apSelect, …)
 * @property {string} title       Libellé affiché
 * @property {string} description Résumé métier
 * @property {string} bind        Propriété x-modelable
 * @property {string[]} tags      Mots-clés
 * @property {'component'|'store'|'utility'} kind
 */

/** @type {CatalogEntry[]} */
export const CATALOG = [
  {
    id: 'select',
    slug: 'apSelect',
    title: 'Select',
    description: 'Liste simple ou multiple, recherche, préfixes (emoji, badge, image) et effacement.',
    bind: 'value',
    tags: ['formulaire', 'liste'],
    kind: 'component',
  },
  {
    id: 'dropdown',
    slug: 'apDropdown',
    title: 'Dropdown',
    description: 'Menu déroulant générique avec flip automatique et position fixed anti-clipping.',
    bind: '—',
    tags: ['navigation', 'menu'],
    kind: 'component',
  },
  {
    id: 'inputtext',
    slug: 'apInputText',
    title: 'Input texte',
    description: 'Champ texte avec préfixe/suffixe, mot de passe révélateur et bouton clear.',
    bind: 'value',
    tags: ['formulaire', 'saisie'],
    kind: 'component',
  },
  {
    id: 'inputtags',
    slug: 'apInputTags',
    title: 'Input tags',
    description: 'Saisie de tags par Entrée, virgule ou collage multi-valeurs.',
    bind: 'tags',
    tags: ['formulaire', 'tags'],
    kind: 'component',
  },
  {
    id: 'switch',
    slug: 'apSwitch',
    title: 'Switch',
    description: 'Interrupteur booléen accessible, compatible wire:model.',
    bind: 'value',
    tags: ['formulaire', 'toggle'],
    kind: 'component',
  },
  {
    id: 'slider',
    slug: 'apSlider',
    title: 'Slider',
    description: 'Curseur de plage avec tooltip et formateur personnalisable.',
    bind: 'value',
    tags: ['formulaire', 'plage'],
    kind: 'component',
  },
  {
    id: 'toast',
    slug: '$store.toast',
    title: 'Toast',
    description: 'Notifications globales success, error, warning, info avec actions.',
    bind: '—',
    tags: ['feedback', 'store'],
    kind: 'store',
  },
  {
    id: 'inputmask',
    slug: 'apInputMask',
    title: 'Input mask',
    description: 'Téléphone, montants EUR/USD, carte, SIRET, masques pattern et regex.',
    bind: 'value',
    tags: ['formulaire', 'masque'],
    kind: 'component',
  },
  {
    id: 'form',
    slug: 'apForm',
    title: 'Form',
    description: 'État de formulaire, erreurs Laravel 422, soumission fetch et reset.',
    bind: 'data',
    tags: ['formulaire', 'validation'],
    kind: 'utility',
  },
];
