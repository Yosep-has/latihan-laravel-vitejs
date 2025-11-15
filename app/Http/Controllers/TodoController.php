<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage; // Pastikan ini ada
use Inertia\Inertia;
use Inertia\Response;

class TodoController extends Controller
{
    /**
     * Menampilkan daftar todos dengan pagination dan filter.
     */
    public function index(Request $request): Response
    {
        $query = $request->user()->todos();

        // Fitur Pencarian dan Filter
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            if ($request->status === 'finished') {
                $query->where('is_finished', true);
            } elseif ($request->status === 'pending') {
                $query->where('is_finished', false);
            }
        }

        // Pagination 20 data per halaman
        $todos = $query->orderBy('created_at', 'desc')
                       ->paginate(20)
                       ->withQueryString(); 

        // Mengubah data untuk menambahkan URL cover
        $todos->through(fn ($todo) => [
            'id' => $todo->id,
            'title' => $todo->title,
            'description' => $todo->description,
            'is_finished' => $todo->is_finished,
            'created_at' => $todo->created_at,
            'cover_url' => $todo->cover ? Storage::url($todo->cover) : null,
        ]);

        return Inertia::render('Todos/Index', [
            'todos' => $todos,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Menampilkan form untuk membuat todo baru.
     * (INI METHOD YANG HILANG)
     */
    public function create(): Response
    {
        return Inertia::render('Todos/Create');
    }

    /**
     * Menyimpan todo baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('covers', 'public');
        }

        $request->user()->todos()->create([
            'title' => $request->title,
            'description' => $request->description,
            'cover' => $path,
        ]);

        return Redirect::route('todos.index')->with('success', 'Todo berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit todo.
     */
    public function edit(Todo $todo): Response
    {
        $this->authorize('update', $todo);

        return Inertia::render('Todos/Edit', [
            'todo' => [
                'id' => $todo->id,
                'title' => $todo->title,
                'description' => $todo->description,
                'is_finished' => $todo->is_finished,
                'cover_url' => $todo->cover ? Storage::url($todo->cover) : null,
            ],
        ]);
    }

    /**
     * Memperbarui todo di database.
     */
    public function update(Request $request, Todo $todo)
    {
        $this->authorize('update', $todo);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_finished' => 'sometimes|boolean',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->only(['title', 'description', 'is_finished']);

        if ($request->hasFile('cover')) {
            if ($todo->cover) {
                Storage::disk('public')->delete($todo->cover);
            }
            $data['cover'] = $request->file('cover')->store('covers', 'public');
        }

        $todo->update($data);

        if ($request->has('toggle_status')) {
             return Redirect::back()->with('success', 'Status todo diperbarui.');
        }

        return Redirect::route('todos.index')->with('success', 'Todo berhasil diperbarui.');
    }

    /**
     * Menghapus todo dari database.
     */
    public function destroy(Todo $todo)
    {
        $this->authorize('delete', $todo); // Pastikan ada otorisasi

        if ($todo->cover) {
            // Menghapus file cover jika ada
            Storage::disk('public')->delete($todo->cover);
        }

        // Menghapus todo dari database
        $todo->delete();

        // Mengarahkan kembali dengan pesan sukses
        return Redirect::route('todos.index')->with('success', 'Todo berhasil dihapus.');
    }
}