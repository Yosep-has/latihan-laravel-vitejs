import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TodoForm from './Partials/TodoForm';

export default function Edit({ todo }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Edit Todo: ${todo.title}`} />
            <div className="container mx-auto px-4 py-8">
                <TodoForm todo={todo} submitLabel="Update Todo" />
            </div>
        </AuthenticatedLayout>
    );
}