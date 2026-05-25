<?php

/**
 * Routes à fusionner dans routes/web.php de votre application Laravel.
 *
 * Prérequis : MemberController dans App\Http\Controllers
 */

use App\Http\Controllers\MemberController;
use Illuminate\Support\Facades\Route;

Route::get('/members/create', [MemberController::class, 'create'])->name('members.create');
Route::post('/members', [MemberController::class, 'store'])->name('members.store');

Route::get('/teams/create', [MemberController::class, 'createTeam'])->name('teams.create');
Route::post('/teams', [MemberController::class, 'storeTeam'])->name('teams.store');
