<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validation d'une équipe avec lignes imbriquées `members.*`.
 *
 * Les clés d'erreur suivent la notation pointée Laravel :
 * `members.0.name`, `members.1.role`, etc. — compatibles avec apForm.hasError().
 */
class StoreTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'team_name'           => ['required', 'string', 'min:2', 'max:80'],
            'members'             => ['required', 'array', 'min:1'],
            'members.*.name'      => ['required', 'string', 'min:2', 'max:120'],
            'members.*.role'      => ['required', Rule::in(['dev', 'design', 'pm', 'devops'])],
            'members.*.salary'    => ['nullable', 'numeric', 'min:0.01'],
            'members.*.active'    => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'team_name.required'        => 'Le nom de l\'équipe est obligatoire.',
            'members.required'        => 'Ajoutez au moins un membre.',
            'members.*.name.required' => 'Le nom du membre est obligatoire.',
            'members.*.role.required' => 'Veuillez choisir un rôle pour ce membre.',
            'members.*.role.in'       => 'Le rôle sélectionné est invalide.',
            'members.*.salary.min'    => 'Le salaire doit être supérieur à 0.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'team_name'        => 'nom de l\'équipe',
            'members.*.name'   => 'nom du membre',
            'members.*.role'   => 'rôle',
            'members.*.salary' => 'salaire',
        ];
    }
}
