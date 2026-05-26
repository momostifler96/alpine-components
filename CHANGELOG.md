# Changelog

Toutes les modifications notables de `@momoledev/alpine-components` sont documentées ici.
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), versionnement [Semantic Versioning](https://semver.org/lang/fr/).

---

## [1.0.7] — 2026-05-26

### Added
- `dist/style.css` — feuille de style prédéfinie optionnelle avec classes `ap-*` pour tous les composants
  - Design tokens CSS (`--ap-primary`, `--ap-border`, `--ap-radius`, …) personnalisables via `:root`
  - **apInputText** : `.ap-input`, `.ap-input-wrapper`, `.ap-input-addon`, `.ap-input-action`
  - **apSelect** : `.ap-select`, `.ap-select-trigger`, `.ap-select-panel`, `.ap-select-option`, `.ap-select-tag`, `.ap-select-search`, `.ap-select-clear`
  - **apDropdown** : `.ap-dropdown`, `.ap-dropdown-panel`, `.ap-dropdown-item`, `.ap-dropdown-divider`, `.ap-dropdown-header`
  - **apInputTags** : `.ap-tags-wrapper`, `.ap-tag`, `.ap-tag-label`, `.ap-tag-remove`, `.ap-tags-input`
  - **apSwitch** : `.ap-switch`, `.ap-switch-thumb`
  - **apSlider** : `.ap-slider`, `.ap-slider-input`, `.ap-slider-tooltip`, `.ap-slider-labels`
  - **apInputMask** : `.ap-mask-wrapper`, `.ap-mask-input`, `.ap-mask-country-btn`, `.ap-mask-country-panel`, `.ap-mask-country-option`
  - **apForm** : `.ap-form`, `.ap-form-field`, `.ap-form-label`, `.ap-form-error`, `.ap-form-hint`, `.ap-form-success`, `.ap-form-submit`
  - **Toast** : `.ap-toast-container`, `.ap-toast`, `.ap-toast-success/error/warning/info`, `.ap-toast-title`, `.ap-toast-message`, `.ap-toast-action`, `.ap-toast-dismiss`
- Export `"./style"` dans `package.json` — importable via `import '@momoledev/alpine-components/style'`

---

## [1.0.6] — 2026-05-26

### Fixed
- `package.json` : champs `module` et `exports.import` corrigés de `dist/index.js` vers `dist/index.mjs` — résout l'erreur `packageEntryFailure` avec Vite 7 et pnpm

---

## [1.0.5] — 2026-05-26

### Added
- `CLAUDE.md` — règles agents pour faciliter la maintenabilité par n'importe quel modèle IA : contrat composant, checklist d'ajout, conventions de code, pipeline de build, workflow de publication
- `src/index.js` — point d'entrée lib dédié avec export default plugin `AlpineComponents(Alpine)` et named exports de chaque composant
- `vite.lib.config.js` — config Vite séparée pour le build bibliothèque (ESM + UMD, sans Tailwind)
- VitePress (`docs/.vitepress/`) — site de documentation avec guide installation, architecture, intégration Livewire et une page de référence par composant
- `Dockerfile` + `docker-compose.yml` — build multi-stage (Node 20 → nginx) et dev hot-reload sur `:5173`
- `.github/workflows/docs.yml` — déploiement automatique sur GitHub Pages à chaque push `master`

### Changed
- Package renommé en `@momoledev/alpine-components` (scope npm)
- `package.json` : champs `main`, `module`, `exports`, `files`, `sideEffects` alignés sur le build lib ; `prepublishOnly` rebuilde automatiquement avant `npm publish`
- Build demo redirigé vers `docs-demo/` ; `dist/` réservé au bundle lib
- `README.md` entièrement réécrit : présentation package npm, intégration JS/TS, intégration Laravel + Vite en 5 étapes avec exemple Blade complet
- `.gitignore` : ignore `docs/.vitepress/dist` et `docs/.vitepress/cache` au lieu de `docs/`

### Fixed
- `vite.config.js` : suppression du conflit entre build demo et build lib sur le même répertoire `dist/`

---

## [1.0.0] — 2026-05-20

### Added
- **apSelect** — liste déroulante simple/multiple avec recherche, clearable, préfixes/suffixes (image, icon, text, badge, dot), options désactivées, `maxSelected`
- **apDropdown** — panneau flottant avec positionnement intelligent (auto-flip), mode `fixed` anti-clipping overflow, largeur `trigger`
- **apInputText** — champ texte avec toggle mot de passe, bouton clear, addons préfixe/suffixe (icon, text, button)
- **apInputTags** — saisie de tags par Entrée/virgule, collage multi-valeurs, `maxTags`, `allowDuplicates`
- **apSwitch** — toggle booléen compatible `wire:model`
- **apSlider** — curseur numérique avec tooltip positionné et formateur personnalisable
- **apForm** — état formulaire (loading, success, errors), soumission fetch, gestion 422 Laravel, CSRF auto, reset, événements `form:success` / `form:error`
- **apInputMask** — masques prédéfinis (`phone-fr`, `phone-intl`, `phone-country`, `money-eur`, `money-usd`, `card`, `date-fr`, `siret`) et masques personnalisés (pattern `#A` / regex)
- **$store.toast** — store Alpine global avec `success`, `error`, `warning`, `info`, `dismiss`, `clear`, action button, durée configurable, `window.$toast`
- `src/data/catalog.js` — métadonnées des composants pour la landing et la documentation
- Playground interactif (`index.html`) et documentation navigateur (`documentation.html`)

[1.0.7]: https://github.com/momostifler96/alpine-components/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/momostifler96/alpine-components/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/momostifler96/alpine-components/compare/v1.0.0...v1.0.5
[1.0.0]: https://github.com/momostifler96/alpine-components/releases/tag/v1.0.0
