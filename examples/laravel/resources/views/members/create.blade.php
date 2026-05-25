@extends('layouts.app')

@section('title', 'Nouveau membre — Alpine Components')

@section('content')
<div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Nouveau membre</h1>
    <p class="text-sm text-gray-500 mt-1">
        Soumission via <code class="bg-gray-100 px-1 rounded text-xs">apForm.submit()</code>
        — erreurs Laravel <strong>422</strong> mappées avec <code class="bg-gray-100 px-1 rounded text-xs">setErrors(body.errors)</code>.
    </p>
</div>

{{--
  Erreurs SSR (optionnel) : si vous utilisez redirect()->back()->withErrors()
  au lieu du fetch JSON, injectez-les à l'init :

  errors: @json($errors->getMessages())
--}}
<div
    x-data="{
        ...apForm({
            data: {
                name:   @js(old('name', '')),
                email:  @js(old('email', '')),
                phone:  @js(old('phone', '')),
                role:   @js(old('role')),
                salary: @js(old('salary', '')),
                active: @js(old('active', true)),
            },
            errors: @json($errors->getMessages()),
        }),
        roleOptions: @js($roleOptions),
        async handleSubmit() {
            const result = await this.submit(@js(route('members.store')), { method: 'POST' });

            if (result.ok) {
                $store.toast.success(result.data?.message ?? 'Enregistré.', 'Succès');
                this.reset();
                return;
            }

            if (result.status === 422) {
                $store.toast.error('Corrigez les champs en erreur.', 'Validation échouée');
                return;
            }

            $store.toast.error(result.data?.message ?? 'Erreur serveur.', 'Erreur');
        },
    }"
    @form:success.window="console.log('form:success', $event.detail)"
    @form:error.window="console.log('form:error', $event.detail)"
    class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
>
    <form @submit.prevent="handleSubmit()" novalidate class="space-y-4">

        {{-- Nom --}}
        <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nom <span class="text-red-400">*</span></label>
            <input type="text" x-model="data.name" placeholder="Alice Martin"
                class="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all"
                :class="hasError('name') ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'">
            <p x-show="hasError('name')" x-cloak class="mt-1 text-xs text-red-500" x-text="getError('name')"></p>
        </div>

        {{-- Email --}}
        <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">E-mail <span class="text-red-400">*</span></label>
            <input type="email" x-model="data.email" placeholder="alice@exemple.com"
                class="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all"
                :class="hasError('email') ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'">
            <p x-show="hasError('email')" x-cloak class="mt-1 text-xs text-red-500" x-text="getError('email')"></p>
        </div>

        {{-- Téléphone (apInputMask) --}}
        <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
            <div x-data="apInputMask({ mask: 'phone-fr' })" x-modelable="value" x-model="data.phone">
                <input x-ref="input" x-model="display" inputmode="tel" placeholder="06 12 34 56 78"
                    @focus="onFocus()" @blur="onBlur()" @input="onInput($event)"
                    class="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all"
                    :class="$parent.hasError('phone') ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'">
            </div>
            <p x-show="hasError('phone')" x-cloak class="mt-1 text-xs text-red-500" x-text="getError('phone')"></p>
        </div>

        {{-- Rôle (apSelect) --}}
        <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Rôle <span class="text-red-400">*</span></label>
            <div
                x-data="apSelect({ options: roleOptions, placeholder: 'Choisir un rôle…' })"
                x-modelable="value"
                x-model="data.role"
                class="relative"
                @click.outside="close()"
            >
                <button type="button" @click="toggleOpen()"
                    class="w-full flex items-center gap-2 px-3 py-2.5 bg-white border rounded-xl text-sm text-left"
                    :class="$parent.hasError('role') ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-300'">
                    <template x-if="selectedOption">
                        <span class="flex items-center gap-2">
                            <span x-html="renderItem(selectedOption.prefix, 'sm')"></span>
                            <span x-text="selectedOption.label"></span>
                        </span>
                    </template>
                    <template x-if="!selectedOption"><span class="text-gray-400" x-text="placeholder"></span></template>
                    <svg class="w-4 h-4 ml-auto text-gray-400" :class="open && 'rotate-180'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div x-show="open" x-cloak class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                    <template x-for="option in filteredOptions" :key="option.value">
                        <button type="button" @click="select(option)"
                            class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50"
                            :class="isSelected(option.value) && 'bg-indigo-50 text-indigo-700'">
                            <span x-html="renderItem(option.prefix, 'sm')"></span>
                            <span x-text="option.label"></span>
                        </button>
                    </template>
                </div>
            </div>
            <p x-show="hasError('role')" x-cloak class="mt-1 text-xs text-red-500" x-text="getError('role')"></p>
        </div>

        {{-- Salaire (money-eur) --}}
        <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Salaire annuel brut</label>
            <div x-data="apInputMask({ mask: 'money-eur' })" x-modelable="value" x-model="data.salary">
                <div class="flex border rounded-xl overflow-hidden"
                    :class="$parent.hasError('salary') ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-300'">
                    <span class="px-3 py-2.5 text-sm text-gray-500 bg-gray-50 border-r">€</span>
                    <input x-ref="input" x-model="display" inputmode="decimal" placeholder="45 000,00"
                        @focus="onFocus()" @blur="onBlur()" @input="onInput($event)"
                        class="flex-1 px-3 py-2.5 text-sm outline-none">
                </div>
            </div>
            <p x-show="hasError('salary')" x-cloak class="mt-1 text-xs text-red-500" x-text="getError('salary')"></p>
        </div>

        {{-- Actif (apSwitch) --}}
        <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-700">Compte actif</span>
            <div x-data="apSwitch({ value: true })" x-modelable="value" x-model="data.active">
                <button type="button" @click="toggle()" role="switch" :aria-checked="value"
                    class="relative w-11 h-6 rounded-full transition-colors"
                    :class="value ? 'bg-indigo-600' : 'bg-gray-200'">
                    <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
                        :class="value ? 'translate-x-5' : ''"></span>
                </button>
            </div>
        </div>

        <p class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Démo : le <strong>premier envoi</strong> renvoie un 422 simulé ; le <strong>second</strong> réussit (201).
            En production, seules les règles de <code class="bg-amber-100 px-1 rounded">StoreMemberRequest</code> s'appliquent.
        </p>

        <button type="submit"
            class="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            :class="loading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'"
            :disabled="loading">
            <span x-text="loading ? 'Envoi…' : 'Enregistrer le membre'"></span>
        </button>
    </form>
</div>

<details class="mt-8 text-sm text-gray-500">
    <summary class="cursor-pointer font-medium text-gray-700">Format JSON 422 attendu</summary>
    <pre class="mt-3 p-4 bg-gray-900 text-indigo-100 rounded-xl text-xs overflow-x-auto">{
  "message": "Les données fournies sont invalides.",
  "errors": {
    "email": ["Cette adresse e-mail est déjà utilisée."],
    "phone": ["Le format du téléphone est invalide."]
  }
}</pre>
</details>
@endsection
