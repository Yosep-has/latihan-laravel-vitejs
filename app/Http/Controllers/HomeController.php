<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller
{
    public function home()
    {
        $data = [
            'nama_lengkap' => 'Abdullah Ubaid',
        ];
        return Inertia::render('HomePage', $data);
    }
}
