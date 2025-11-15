<?php

namespace App\Providers;

// ===== 1. TAMBAHKAN IMPORT INI =====
use App\Models\Todo;
use App\Policies\TodoPolicy;
// ===================================

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // ===== 2. TAMBAHKAN BARIS INI =====
        Todo::class => TodoPolicy::class,
        // ===================================
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}