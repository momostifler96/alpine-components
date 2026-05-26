# CLAUDE.md — Alpine Components

Règles pour tout agent ou modèle qui travaille sur ce dépôt.
Lire ce fichier en entier avant toute modification.

> **Snippets copy-paste** → [`alpine-components.md`](./alpine-components.md)
> **Skill invocable** → `/alpine-components` (snippets HTML + classes `ap-*` pour tous les composants)

---

## Vue d'ensemble

`@momoledev/alpine-components` est une **bibliothèque npm** de composants headless pour Alpine.js 3.
Chaque composant est une factory `Alpine.data` : elle retourne un objet état + méthodes, sans HTML ni CSS imposé.

- **Site de documentation** : https://alpine-components.momoledev.com
- **npm** : https://www.npmjs.com/package/@momoledev/alpine-components
- **GitHub** : https://github.com/momostifler96/alpine-components

---

## Structure du dépôt

```
src/
  components/       # Un fichier par composant Alpine.data
  utils/            # Fonctions utilitaires internes
  data/catalog.js   # Métadonnées des composants (landing + doc)
  index.js          # Point d'entrée de la lib npm (exports)
  main.js           # Point d'entrée de la démo playground (ne pas publier)

docs/
  .vitepress/
    config.mjs      # Config VitePress (nav, sidebar, base URL)
  index.md          # Page d'accueil hero
  guide/            # Installation, architecture, Livewire
  components/       # Une page Markdown par composant

dist/               # Build lib (ESM + UMD) — généré, ne pas éditer à la main
  index.mjs         # ESM → champ "module" du package.json
  index.umd.js      # UMD → champ "main" du package.json

index.html          # Playground de démo (ne fait pas partie du package npm)
documentation.html  # Doc navigateur (ne fait pas partie du package npm)

Dockerfile          # Multi-stage : node build → nginx serve (docs statiques)
docker-compose.yml  # Dev local docs avec hot reload sur :5173
.github/workflows/
  docs.yml          # CI : build VitePress → deploy GitHub Pages
```

---

## Contrat d'un composant

Tout composant dans `src/components/` doit respecter ces règles sans exception.

### 1. Signature de la factory

```js
export default function apNomComposant(config = {}) {
  return { /* état + méthodes */ };
}
```

- Le nom commence par `ap` (minuscule) suivi du nom en PascalCase.
- Le seul argument est `config` avec une valeur par défaut `{}`.
- Ne jamais importer Alpine dans un composant — Alpine est injecté par le runtime.

### 2. Valeurs par défaut via `??`

```js
// Correct
disabled: config.disabled ?? false,

// Interdit — écrase les valeurs falsy légitimes
disabled: config.disabled || false,
```

### 3. x-modelable : émettre `input` et `change`

Tout composant avec une valeur bindable doit surveiller cette valeur et dispatcher les deux événements :

```js
init() {
  this.$watch('value', val => {
    this.$dispatch('input',  val);
    this.$dispatch('change', val);
  });
},
```

Cela garantit la compatibilité avec `wire:model.live` de Livewire.

### 4. Propriété modelable déclarée

Documenter la propriété `x-modelable` en commentaire JSDoc en tête de fichier :

```js
/**
 * apNom — Description courte
 * x-modelable: value
 */
```

### 5. Pas d'effet de bord global

- Pas de `window.*`, `document.*` ni `localStorage` sauf dans `apInputMask` (sélecteur de pays) et `apForm` (lecture du CSRF token) où c'est justifié.
- Pas d'`import Alpine` — les composants ne démarrent pas Alpine.
- Le store `toast` est la seule exception : il s'enregistre via `registerToastStore(Alpine)`.

### 6. Pas de style inline imposé

Ne jamais hardcoder des classes Tailwind dans la logique JS retournée par la factory.
Exception tolérée : `apDropdown.panelClass` (classes de positionnement nécessaires à la logique).

---

## Ajouter un nouveau composant

1. Créer `src/components/NomComposant.js` en respectant le contrat ci-dessus.
2. Exporter depuis `src/index.js` :
   ```js
   export { default as apNomComposant } from './components/NomComposant.js';
   ```
   Et l'enregistrer dans le plugin par défaut :
   ```js
   Alpine.data('apNomComposant', apNomComposant);
   ```
3. Ajouter une entrée dans `src/data/catalog.js` :
   ```js
   {
   
     id: 'nom-composant',       // ancre HTML
     slug: 'apNomComposant',    // nom Alpine.data
     title: 'Nom Composant',
     description: 'Description courte.',
     bind: 'value',             // propriété x-modelable, ou '—'
     tags: ['formulaire'],
     kind: 'component',         // 'component' | 'store' | 'utility'
   }
   ```
4. Enregistrer dans `src/main.js` pour le playground de démo.
5. Créer `docs/components/nom-composant.md` (voir section Docs).
6. Ajouter l'entrée dans la sidebar de `docs/.vitepress/config.mjs`.

---

## Page de documentation d'un composant

Chaque fichier `docs/components/xxx.md` doit suivre cette structure :

```markdown
# NomComposant

Description courte.

**x-modelable :** `value`  (ou `—` si absent)

## Usage

\`\`\`html
<!-- Exemple minimal montrant les directives Alpine essentielles -->
\`\`\`

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|

## État exposé

| Propriété | Description |
|---|---|

## Méthodes

| Méthode | Description |
|---|---|
```

Ajouter des sections supplémentaires si le composant a des cas avancés (ex : masques personnalisés, imbrication, events).

---

## Conventions de code

- **ES modules uniquement** — pas de CommonJS dans `src/`.
- **Pas de TypeScript dans les sources** — la lib reste en JS pur pour ne pas ajouter de build step côté consommateur.
- **Commentaires** : uniquement quand le "pourquoi" n'est pas évident. Pas de JSDoc exhaustif sur chaque méthode triviale.
- **Pas de dépendances runtime** — `alpinejs` est `peerDependency`. Aucun autre package ne doit entrer dans le bundle.
- **Pas de `console.log`** laissé dans les sources.

---

## Pipeline de build

| Commande | Résultat |
|---|---|
| `npm run build` | Lib ESM+UMD → `dist/` via `vite.lib.config.js` |
| `npm run build:demo` | Demo HTML → `docs-demo/` via `vite.config.js` |
| `npm run docs:build` | Site VitePress → `docs/.vitepress/dist/` |
| `npm run docs:dev` | Dev VitePress hot-reload sur `:5173` |

**Ne jamais committer `docs/.vitepress/dist/`** — il est dans `.gitignore`.  
**Ne jamais committer `docs/.vitepress/cache/`** — il est dans `.gitignore`.  
**`dist/index.mjs` et `dist/index.umd.js` sont commités** — ils font partie du package npm publié.

### Vérification avant PR

```bash
npm run build          # doit terminer sans erreur ni warning
npm run docs:build     # doit terminer sans erreur
```

---

## Publication npm

Le package est `@momoledev/alpine-components` (scope public).

```bash
# 1. Bumper la version dans package.json (semver)
# 2. Builder
npm run build

# 3. Tagger
git tag vX.Y.Z
git push origin master --tags

# 4. Publier
npm publish --access public
```

`prepublishOnly` dans `package.json` relance `npm run build` automatiquement.  
La publication requiert une authentification OTP npm — prévoir le 2FA.

### Semver

| Type de changement | Version |
|---|---|
| Correction de bug, comportement inchangé | patch `x.x.Z` |
| Nouvelle prop/méthode, rétrocompatible | minor `x.Y.0` |
| Changement de signature, suppression prop | major `X.0.0` |

---

## GitHub Pages (docs)

Le workflow `.github/workflows/docs.yml` se déclenche automatiquement sur chaque push `master`.  
Il build VitePress et déploie sur GitHub Pages.

La `base` VitePress est `/alpine-components/` — ne pas la changer sans mettre à jour le workflow.

Pour tester localement :
```bash
npm run docs:dev           # dev avec hot reload
# ou avec Docker :
docker compose up          # hot reload sur :5173
docker build -t ap-docs .  # build prod nginx
```

---

## Mise à jour obligatoire du README

**Toute modification qui impose une action à l'utilisateur final doit être reflétée dans `README.md` avant de committer.**

Exemples de changements qui déclenchent une mise à jour du README :

| Changement | Section README à mettre à jour |
|---|---|
| Nouvel export dans `package.json` (`"./style"`, etc.) | Installation — ajouter l'import |
| Nouvelle prop obligatoire sur un composant | Exemple de code de la section correspondante |
| Changement d'API publique (méthode renommée, etc.) | Tous les exemples de code qui l'utilisent |
| Nouveau prérequis (peer dep, meta tag, etc.) | Prérequis / étapes d'intégration |
| Nouveau script npm utile | Tableau Scripts |
| Changement du nom du package | Toutes les occurrences `@momoledev/alpine-components` |

**Règle concrète :** si un utilisateur suit le README de bout en bout et que ça ne fonctionne pas à cause de ton changement, le README est incomplet. Corrige-le dans le même commit.

---

## Skill agent — `/alpine-components`

Le fichier `.claude/commands/alpine-components.md` est un **skill Claude Code** invocable via `/alpine-components`.
Le fichier `alpine-components.md` (racine) est la version standalone pour les autres agents et éditeurs.

### Quand mettre à jour ces fichiers

Mettre à jour **les deux fichiers simultanément** dès qu'un de ces cas se présente :
- Nouveau composant ajouté
- Nouvelles props ou méthodes publiques sur un composant existant
- Nouvelles classes CSS `ap-*` dans `src/ap-components.css`
- Changement de signature d'une factory
- Nouveau pattern de combinaison recommandé

### Structure du skill

Chaque section suit ce format strict pour rester lisible par n'importe quel modèle :

```
## ap-nom  (apNomComposant)

\`\`\`html
<!-- snippet minimal -->
<!-- snippet avec ap-* classes -->
\`\`\`

**Props :** `prop1` `prop2` ...
**Classes :** `.ap-nom` `.ap-nom-element` ...
**État :** `.is-modifier` ...
```

### Comment les agents utilisent ce skill

**Claude Code (ce projet) :**
```
/alpine-components
```

**Claude Code (projet consommateur) :**
```bash
# Copier le fichier dans le projet
curl -O https://raw.githubusercontent.com/momostifler96/alpine-components/master/alpine-components.md
# Puis dans Claude Code :
/alpine-components   # si copié dans .claude/commands/
# ou demander à Claude de lire le fichier comme contexte
```

**Cursor / Windsurf / GitHub Copilot :**
```
@alpine-components.md  générer un formulaire avec apSelect et apForm
```

**Claude.ai / ChatGPT / autre LLM :**
```
[joindre ou coller le contenu de alpine-components.md]
"Génère un formulaire complet avec les classes ap-* pour..."
```

**Commande curl pour récupérer le fichier de référence :**
```bash
curl -O https://raw.githubusercontent.com/momostifler96/alpine-components/master/alpine-components.md
```

---

## Ce qu'il ne faut pas faire

- Ne pas modifier `dist/` à la main — toujours passer par `npm run build`.
- Ne pas ajouter de dépendances runtime (`dependencies` dans `package.json`) — tout doit rester dans `devDependencies` ou `peerDependencies`.
- Ne pas importer Alpine dans les composants — les factories doivent être des fonctions pures qui retournent un objet.
- Ne pas émettre d'événements DOM personnalisés depuis `init()` au démarrage — uniquement en réponse à une action utilisateur ou un `$watch`.
- Ne pas toucher à `src/main.js` pour la lib — ce fichier n'est que pour le playground de démo.
- Ne pas modifier `vite.config.js` pour le build lib — utiliser `vite.lib.config.js`.
- Ne pas faire un changement visible pour l'utilisateur sans mettre à jour `README.md` dans le même commit.
