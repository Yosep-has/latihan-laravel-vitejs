import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TodoForm from './Partials/TodoForm';

export default function Create() {
    return (
        <AuthenticatedLayout>
            <Head title="Tambah Todo Baru" />
            <div className="container mx-auto px-4 py-8">
                <TodoForm submitLabel="Tambah Todo" />
            </div>
        </AuthenticatedLayout>
    );
}