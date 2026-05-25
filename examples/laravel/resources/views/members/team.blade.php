@extends('layouts.app')

@section('title', 'Nouvelle équipe — validation nested')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Nouvelle équipe</h1>
    <p class="text-sm text-gray-500 mt-1">
        Erreurs imbriquées Laravel : <code class="bg-gray-100 px-1 rounded text-xs">members.0.name</code>,
        <code class="bg-gray-100 px-1 rounded text-xs">members.1.salary</code> — lues par <code class="bg-gray-100 px-1 rounded text-xs">hasError('members.'+i+'.name')</code>.
    </p>
</div>

<div
    x-data="{
        ...apForm({
            data: {
                team_name: '',
                members: [
                    { name: '', role: null, salary: '', active: true },
                    { name: '', role: null, salary: '', active: false },
                ],
            },
        }),
        roleOptions: @js($roleOptions),
        addMember() {
            if (this.data.members.length >= 5) return;
            this.data.members.push({ name: '', role: null, salary: '', active: true });
        },
        removeMember(i) {
            if (this.data.members.length <= 1) return;
            this.data.members.splice(i, 1);
            this.clearErrors();
        },
        async handleSubmit() {
            const result = await this.submit(@js(route('teams.store')), { method: 'POST' });
            if (result.ok) {
                $store.toast.success(result.data?.message ?? 'Équipe enregistrée.', 'Succès');
                return;
            }
            if (result.status === 422) {
                $store.toast.error('Corrigez les lignes en erreur.', 'Validation');
            }
        },
    }"
    class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6"
>
    <form @submit.prevent="handleSubmit()" novalidate class="space-y-6">

        <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nom de l'équipe</label>
            <input type="text" x-model="data.team_name" placeholder="Équipe Produit"
                class="w-full px-3 py-2.5 text-sm border rounded-xl"
                :class="hasError('team_name') ? 'border-red-300' : 'border-gray-300'">
            <p x-show="hasError('team_name')" x-cloak class="mt-1 text-xs text-red-500" x-text="getError('team_name')"></p>
        </div>

        <div class="overflow-x-auto border border-gray-200 rounded-xl">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                        <th class="px-3 py-2 text-left">Nom</th>
                        <th class="px-3 py-2 text-left">Rôle</th>
                        <th class="px-3 py-2 text-left">Salaire</th>
                        <th class="px-3 py-2 w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    <template x-for="(member, i) in data.members" :key="i">
                        <tr :class="hasError('members.'+i+'.name') || hasError('members.'+i+'.role') || hasError('members.'+i+'.salary') ? 'bg-red-50/50' : ''">
                            <td class="px-3 py-2 align-top">
                                <input type="text" x-model="member.name" placeholder="Nom"
                                    class="w-full px-2 py-1.5 border rounded-lg text-sm"
                                    :class="hasError('members.'+i+'.name') ? 'border-red-300' : 'border-gray-200'">
                                <p x-show="hasError('members.'+i+'.name')" x-cloak class="text-xs text-red-500 mt-0.5" x-text="getError('members.'+i+'.name')"></p>
                            </td>
                            <td class="px-3 py-2 align-top">
                                <select x-model="member.role"
                                    class="w-full px-2 py-1.5 border rounded-lg text-sm"
                                    :class="hasError('members.'+i+'.role') ? 'border-red-300' : 'border-gray-200'">
                                    <option :value="null">—</option>
                                    <template x-for="opt in roleOptions" :key="opt.value">
                                        <option :value="opt.value" x-text="opt.label"></option>
                                    </template>
                                </select>
                                <p x-show="hasError('members.'+i+'.role')" x-cloak class="text-xs text-red-500 mt-0.5" x-text="getError('members.'+i+'.role')"></p>
                            </td>
                            <td class="px-3 py-2 align-top">
                                <input type="text" x-model="member.salary" placeholder="45000"
                                    class="w-full px-2 py-1.5 border rounded-lg text-sm"
                                    :class="hasError('members.'+i+'.salary') ? 'border-red-300' : 'border-gray-200'">
                                <p x-show="hasError('members.'+i+'.salary')" x-cloak class="text-xs text-red-500 mt-0.5" x-text="getError('members.'+i+'.salary')"></p>
                            </td>
                            <td class="px-2 py-2 align-top">
                                <button type="button" @click="removeMember(i)" class="text-gray-400 hover:text-red-500" title="Supprimer">×</button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <button type="button" @click="addMember()" class="text-sm text-indigo-600 hover:underline">+ Ajouter une ligne</button>

        <button type="submit"
            class="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            :disabled="loading">
            <span x-text="loading ? 'Envoi…' : 'Enregistrer l\'équipe'"></span>
        </button>
    </form>
</div>
@endsection
