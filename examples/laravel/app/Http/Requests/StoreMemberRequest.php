<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validation du formulaire « Nouveau membre » (Alpine Components + apForm).
 *
 * Les messages personnalisés sont renvoyés dans la réponse 422
 * sous la clé `errors` (tableau de chaînes par champ).
 */
class StoreMemberRequest extends FormRequest
{
    /**
     * Autorise la requête (ajustez selon vos policies).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles alignées sur les champs `data.*` du formulaire Blade.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'min:2', 'max:120'],
            'email'  => ['required', 'email', 'max:255'],
            'phone'  => ['nullable', 'regex:/^(0[67]|0[1-9])\d{8}$/'],
            'role'   => ['required', Rule::in(['dev', 'design', 'pm', 'devops'])],
            'salary' => ['nullable', 'numeric', 'min:0.01'],
            'active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Messages en français — format Laravel 422 consommé par apForm.setErrors().
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required'   => 'Le champ nom est obligatoire.',
            'name.min'        => 'Le nom doit contenir au moins :min caractères.',
            'email.required'  => 'L\'adresse e-mail est obligatoire.',
            'email.email'     => 'L\'adresse e-mail doit être valide.',
            'phone.regex'     => 'Le format du téléphone est invalide (ex. : 06 12 34 56 78).',
            'role.required'   => 'Veuillez choisir un rôle.',
            'role.in'         => 'Le rôle sélectionné est invalide.',
            'salary.numeric'  => 'Le salaire doit être un nombre.',
            'salary.min'      => 'Le salaire doit être supérieur à 0.',
            'active.boolean'  => 'Le champ actif doit être vrai ou faux.',
        ];
    }

    /**
     * Attributs lisibles pour les messages génériques Laravel.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name'   => 'nom',
            'email'  => 'adresse e-mail',
            'phone'  => 'téléphone',
            'role'   => 'rôle',
            'salary' => 'salaire',
            'active' => 'compte actif',
        ];
    }
}
