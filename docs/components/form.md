# Form

Gestion d'état de formulaire avec soumission fetch, erreurs Laravel 422 et reset.

**x-modelable :** `data`

## Usage minimal

```html
<form x-data="apForm({ data: { email: '' } })"
      @submit.prevent="submit('/api/contact')">
  <input x-model="data.email" />
  <p x-show="hasError('email')" x-text="getError('email')"></p>
  <button :disabled="loading">Envoyer</button>
</form>
```

## Avec les classes `ap-*`

```html
<form class="ap-form"
      x-data="apForm({
        data: { name: '', email: '', message: '' },
        errors: {},
      })"
      @submit.prevent="submit('/api/contact')">

  <!-- Champ Nom -->
  <div class="ap-form-field">
    <label class="ap-form-label is-required">Nom</label>
    <input class="ap-input" :class="{ 'is-error': hasError('name') }"
           x-model="data.name" placeholder="Jean Dupont" />
    <p class="ap-form-error" x-show="hasError('name')" x-text="getError('name')"></p>
  </div>

  <!-- Champ Email -->
  <div class="ap-form-field">
    <label class="ap-form-label is-required">Email</label>
    <input class="ap-input" :class="{ 'is-error': hasError('email') }"
           x-model="data.email" type="email" placeholder="jean@exemple.fr" />
    <p class="ap-form-error" x-show="hasError('email')" x-text="getError('email')"></p>
  </div>

  <!-- Champ Message -->
  <div class="ap-form-field">
    <label class="ap-form-label">Message</label>
    <textarea class="ap-input" style="height: auto; padding-top: 0.5rem; padding-bottom: 0.5rem;"
              x-model="data.message" rows="4"
              :class="{ 'is-error': hasError('message') }"></textarea>
    <p class="ap-form-hint">Optionnel — 500 caractères maximum.</p>
    <p class="ap-form-error" x-show="hasError('message')" x-text="getError('message')"></p>
  </div>

  <!-- Message de succès -->
  <div class="ap-form-success" x-show="success">
    ✓ Message envoyé avec succès.
  </div>

  <!-- Boutons -->
  <div style="display: flex; gap: 0.75rem;">
    <button type="submit" class="ap-form-submit" :class="{ 'is-loading': loading }"
            :disabled="loading">
      <span x-show="!loading">Envoyer</span>
      <span x-show="loading">Envoi en cours…</span>
    </button>
    <button type="button" class="ap-form-submit ap-form-submit-secondary"
            @click="reset()">
      Réinitialiser
    </button>
  </div>
</form>
```

### Avec Select intégré

```html
<form class="ap-form" x-data="apForm({ data: { role: null } })"
      @submit.prevent="submit('/api/save')">

  <div class="ap-form-field">
    <label class="ap-form-label is-required">Rôle</label>

    <div x-data="apSelect({ options: [
           { label: 'Admin',      value: 'admin' },
           { label: 'Éditeur',   value: 'editor' },
           { label: 'Lecteur',   value: 'viewer' },
         ] })"
         x-modelable="value" x-model="data.role"
         class="ap-select" @click.outside="close()">

      <button class="ap-select-trigger" :class="{ 'is-error': hasError('role'), 'is-open': open }"
              @click="toggleOpen()">
        <span class="ap-select-trigger-label"
              :class="{ 'is-placeholder': !hasValue }"
              x-text="display || 'Choisir un rôle'"></span>
      </button>

      <div class="ap-select-panel" x-show="open" x-cloak>
        <ul class="ap-select-options">
          <template x-for="opt in filteredOptions" :key="opt.value">
            <li class="ap-select-option"
                :class="{ 'is-selected': isSelected(opt.value) }"
                @click="select(opt)" x-text="opt.label"></li>
          </template>
        </ul>
      </div>
    </div>

    <p class="ap-form-error" x-show="hasError('role')" x-text="getError('role')"></p>
  </div>

  <button type="submit" class="ap-form-submit" :disabled="loading">Enregistrer</button>
</form>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `data` | `object` | `{}` | Valeurs initiales |
| `errors` | `object` | `{}` | Erreurs pré-remplies (SSR) |

## État exposé

| Propriété | Description |
|---|---|
| `data` | Valeurs courantes |
| `errors` | Erreurs par champ |
| `loading` | Requête en cours |
| `success` | Dernier envoi réussi |

## Méthodes

| Méthode | Signature | Description |
|---|---|---|
| `submit` | `(url, options?)` | Fetch POST, gère 422 auto |
| `hasError` | `(path)` | Teste une erreur |
| `getError` | `(path)` | Premier message d'erreur |
| `setErrors` | `(obj)` | Injecte des erreurs |
| `clearError` | `(path)` | Efface une erreur |
| `clearErrors` | `()` | Efface tout |
| `reset` | `()` | Remet aux valeurs initiales |

## Classes CSS

| Classe | Élément |
|---|---|
| `.ap-form` | Formulaire (flex-column gap) |
| `.ap-form-field` | Groupe label + input + erreur |
| `.ap-form-label` | Libellé |
| `.ap-form-hint` | Texte d'aide gris |
| `.ap-form-error` | Message d'erreur rouge |
| `.ap-form-success` | Bandeau de succès vert |
| `.ap-form-submit` | Bouton de soumission |
| `.ap-form-submit-secondary` | Variante secondaire (outline) |

**Modificateurs :** `.is-required` (sur `.ap-form-label`) · `.is-error` (sur `.ap-input`) · `.is-loading` (sur `.ap-form-submit`)
