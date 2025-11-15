<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;

/*
|-------------------------------------------------------------------------- 
| Halaman Utama (Redirect ke Login)
|-------------------------------------------------------------------------- 
*/
Route::get('/', function () {
    return Redirect::route('login');
});

/*
|-------------------------------------------------------------------------- 
| Halaman Dashboard (Redirect ke Todos)
|-------------------------------------------------------------------------- 
*/
Route::get('/dashboard', function () {
    return Redirect::route('todos.index');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|-------------------------------------------------------------------------- 
| Rute yang Membutuhkan Autentikasi
|-------------------------------------------------------------------------- 
*/
Route::middleware('auth')->group(function () {
    // Rute Profil (Bawaan Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rute Todos (Yang Anda buat)
    Route::get('/todos', [TodoController::class, 'index'])->name('todos.index');
    Route::get('/todos/create', [TodoController::class, 'create'])->name('todos.create');
    Route::post('/todos', [TodoController::class, 'store'])->name('todos.store');
    Route::get('/todos/{todo}/edit', [TodoController::class, 'edit'])->name('todos.edit');
    
    // Update Todo
    Route::put('/todos/{todo}', [TodoController::class, 'update'])->name('todos.update'); 
    
    // Delete Todo
    Route::delete('/todos/{todo}', [TodoController::class, 'destroy'])->name('todos.destroy');
});

/*
|-------------------------------------------------------------------------- 
| Rute Autentikasi (Bawaan Breeze)
|-------------------------------------------------------------------------- 
*/
require __DIR__.'/auth.php';
