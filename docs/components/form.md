# Form

Gestion d'état de formulaire avec soumission fetch, erreurs Laravel 422 et reset.

**x-modelable :** `data`

## Usage

```html
<form x-data="apForm({ data: { name: '', email: '' } })"
      @submit.prevent="submit('/api/contact')">

  <input x-model="data.name" />
  <p x-show="hasError('name')" x-text="getError('name')"></p>

  <input x-model="data.email" />
  <p x-show="hasError('email')" x-text="getError('email')"></p>

  <button type="submit" :disabled="loading">
    <span x-show="loading">Envoi…</span>
    <span x-show="!loading">Envoyer</span>
  </button>

  <p x-show="success">Message envoyé !</p>
</form>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `data` | `object` | `{}` | Valeurs initiales des champs |
| `errors` | `object` | `{}` | Erreurs pré-remplies (depuis SSR) |

## État exposé

| Propriété | Description |
|---|---|
| `data` | Valeurs courantes des champs |
| `errors` | Erreurs par champ |
| `loading` | Requête en cours |
| `success` | Dernier envoi réussi |

## Méthodes

| Méthode | Signature | Description |
|---|---|---|
| `submit` | `(url, options?)` | Soumet via fetch, gère 422 automatiquement |
| `hasError` | `(path)` | Teste si un champ a une erreur |
| `getError` | `(path)` | Retourne le premier message d'erreur |
| `setErrors` | `(obj)` | Injecte des erreurs manuellement |
| `clearError` | `(path)` | Efface l'erreur d'un champ |
| `clearErrors` | `()` | Efface toutes les erreurs |
| `reset` | `()` | Remet `data` aux valeurs initiales |

## Options de `submit`

```js
submit('/api/contact', {
  method: 'POST',         // défaut POST
  headers: {},            // headers additionnels
  transform: data => data // transforme data avant envoi
})
```

Le CSRF token est lu depuis `document.querySelector('meta[name="csrf-token"]')`.

## Événements émis

| Événement | Détail | Quand |
|---|---|---|
| `form:success` | `{ data: responseData }` | Réponse 2xx |
| `form:error` | `{ errors }` | Réponse 422 |

## Erreurs imbriquées

Les chemins en notation pointée sont supportés :

```js
hasError('address.city')   // true si errors['address.city'] existe
getError('address.city')   // retourne le message
```
