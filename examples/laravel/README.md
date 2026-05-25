# Exemple Laravel — Alpine Components + validation backend

Exemple d’intégration d’**apForm** avec un backend Laravel qui renvoie les erreurs au format **422** (convention `ValidationException`).

## Fichiers fournis

```
examples/laravel/
├── README.md
├── routes/web.snippet.php
├── app/
│   ├── Http/Controllers/MemberController.php
│   └── Http/Requests/
│       ├── StoreMemberRequest.php      # Formulaire membre
│       └── StoreTeamRequest.php        # Tableau members.* (nested)
├── resources/
│   ├── js/alpine-components.js        # Bootstrap Alpine
│   └── views/
│       ├── layouts/app.blade.php
│       └── members/
│           ├── create.blade.php        # Formulaire simple
│           └── team.blade.php          # Boucle + erreurs imbriquées
└── samples/
    └── validation-422.json             # Réponse JSON de référence
```

## Installation dans un projet Laravel 11+

1. Copiez `src/components/` (et utils/data) depuis la racine du dépôt vers `resources/js/alpine-components/` ou publiez-les via Vite.
2. Copiez les fichiers de cet exemple dans les dossiers Laravel correspondants.
3. Enregistrez les routes (`routes/web.snippet.php`).
4. Chargez `resources/js/alpine-components.js` dans `vite.config.js` :

```js
// vite.config.js
export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.js', 'resources/js/alpine-components.js'],
    }),
  ],
});
```

5. Dans `resources/js/app.js` :

```js
import './alpine-components.js';
```

6. Layout : `@vite(['resources/css/app.css', 'resources/js/app.js'])` + meta CSRF.

## Format de réponse attendu (422)

`apForm.submit()` appelle automatiquement `setErrors(body.errors)` si le statut est **422** et que le JSON contient `errors` :

```json
{
  "message": "The given data was invalid. (and 3 more errors)",
  "errors": {
    "name": ["Le champ nom est obligatoire."],
    "email": ["L'adresse e-mail est déjà utilisée."],
    "phone": ["Le format du téléphone est invalide."],
    "role": ["Le rôle sélectionné est invalide."],
    "salary": ["Le salaire doit être supérieur à 0."],
    "members.0.name": ["Le nom du membre est obligatoire."]
  }
}
```

Chaque clé correspond à `hasError('email')` ou `hasError('members.0.name')` côté Alpine.

Voir [samples/validation-422.json](./samples/validation-422.json).

## Routes de démo

| Méthode | URI | Action |
|---------|-----|--------|
| GET | `/members/create` | Formulaire membre |
| POST | `/members` | Création (JSON) |
| GET | `/teams/create` | Formulaire équipe (nested) |
| POST | `/teams` | Création équipe (JSON) |

## Tester sans base de données

Les contrôleurs simulent la persistance : le **premier POST** renvoie toujours **422** avec des erreurs ; le **second POST** identique renvoie **201** (succès). Adaptez `MemberController` pour brancher un vrai modèle `Member`.
