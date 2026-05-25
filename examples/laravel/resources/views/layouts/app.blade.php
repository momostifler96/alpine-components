<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Alpine Components — Laravel')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>[x-cloak] { display: none !important; }</style>
</head>
<body class="bg-slate-50 text-gray-900 min-h-screen antialiased">

    {{-- Conteneur Toast (obligatoire pour $store.toast) --}}
    <div x-data aria-live="polite" class="fixed bottom-5 right-5 z-[9999] flex flex-col-reverse gap-2.5 w-80 pointer-events-none">
        <template x-for="toast in $store.toast.items" :key="toast.id">
            <div x-show="toast.visible" x-cloak
                class="pointer-events-auto flex items-start gap-3 p-4 bg-white rounded-2xl shadow-lg border text-sm"
                :class="{
                    'border-green-200': toast.type === 'success',
                    'border-red-200': toast.type === 'error',
                    'border-amber-200': toast.type === 'warning',
                    'border-blue-200': toast.type === 'info',
                }">
                <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-900" x-text="toast.title"></div>
                    <div class="text-gray-500 text-xs mt-0.5" x-text="toast.message" x-show="toast.message"></div>
                </div>
                <button type="button" @click="$store.toast.dismiss(toast.id)" class="text-gray-300 hover:text-gray-500">×</button>
            </div>
        </template>
    </div>

    <header class="bg-white border-b border-gray-200">
        <div class="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4 text-sm">
            <a href="{{ route('members.create') }}" class="font-semibold text-gray-900">Membre</a>
            <a href="{{ route('teams.create') }}" class="text-gray-500 hover:text-indigo-600">Équipe (nested)</a>
        </div>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-10">
        @yield('content')
    </main>

</body>
</html>
