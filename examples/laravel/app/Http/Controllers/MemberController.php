<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\StoreTeamRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Contrôleur d'exemple — création de membre / équipe avec réponses JSON pour apForm.
 *
 * Comportement de démo : la première soumission par session renvoie 422 (validation forcée),
 * la suivante renvoie 201. Remplacez par votre logique métier (Eloquent, policies, etc.).
 */
class MemberController extends Controller
{
    /**
     * Affiche le formulaire membre (Alpine + apForm).
     */
    public function create(): View
    {
        return view('members.create', [
            'roleOptions' => $this->roleOptions(),
        ]);
    }

    /**
     * Affiche le formulaire équipe (lignes members.*).
     */
    public function createTeam(): View
    {
        return view('members.team', [
            'roleOptions' => $this->roleOptions(),
        ]);
    }

    /**
     * Enregistre un membre — réponse JSON (201 ou 422).
     *
     * Format 422 (automatique via FormRequest) :
     * { "message": "...", "errors": { "email": ["…"] } }
     */
    public function store(StoreMemberRequest $request): JsonResponse
    {
        $payload = $request->validated();

        if ($this->shouldSimulateValidationFailure($request, 'member')) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'errors'  => [
                    'name'   => ['Le champ nom est obligatoire.'],
                    'email'  => ['Cette adresse e-mail est déjà utilisée.'],
                    'phone'  => ['Le format du téléphone est invalide (ex. : 06 12 34 56 78).'],
                    'role'   => ['Veuillez choisir un rôle.'],
                    'salary' => ['Le salaire doit être supérieur à 0.'],
                ],
            ], 422);
        }

        // TODO: Member::create($payload);

        return response()->json([
            'message' => 'Membre créé avec succès.',
            'member'  => $payload,
        ], 201);
    }

    /**
     * Enregistre une équipe — erreurs imbriquées members.N.champ.
     */
    public function storeTeam(StoreTeamRequest $request): JsonResponse
    {
        $payload = $request->validated();

        if ($this->shouldSimulateValidationFailure($request, 'team')) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'errors'  => [
                    'team_name'       => ['Le nom de l\'équipe est obligatoire.'],
                    'members.0.name'  => ['Le nom du membre est obligatoire.'],
                    'members.0.role'  => ['Veuillez choisir un rôle pour ce membre.'],
                    'members.1.salary'=> ['Le salaire doit être supérieur à 0.'],
                ],
            ], 422);
        }

        return response()->json([
            'message' => 'Équipe enregistrée.',
            'team'    => $payload,
        ], 201);
    }

    /**
     * Options du composant apSelect (passées via @js dans Blade).
     *
     * @return list<array{value: string, label: string, prefix: array}>
     */
    private function roleOptions(): array
    {
        return [
            ['value' => 'dev',    'label' => 'Développeur',     'prefix' => ['type' => 'badge', 'content' => 'DEV', 'color' => 'blue']],
            ['value' => 'design', 'label' => 'Designer',        'prefix' => ['type' => 'badge', 'content' => 'UX',  'color' => 'purple']],
            ['value' => 'pm',     'label' => 'Chef de projet',  'prefix' => ['type' => 'badge', 'content' => 'PM',  'color' => 'amber']],
            ['value' => 'devops', 'label' => 'DevOps',          'prefix' => ['type' => 'badge', 'content' => 'OPS', 'color' => 'gray']],
        ];
    }

    /**
     * Démo : premier POST de la session → échec 422, suivant → succès.
     * En production, supprimez et laissez uniquement StoreMemberRequest gérer les 422.
     */
    private function shouldSimulateValidationFailure(Request $request, string $key): bool
    {
        $sessionKey = "alpine_components_demo_fail_{$key}";

        if (! $request->session()->get($sessionKey, true)) {
            return false;
        }

        $request->session()->put($sessionKey, false);

        return true;
    }
}
