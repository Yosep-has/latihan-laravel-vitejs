import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
// Pastikan 'Trash2' di-impor
import { AlertTriangle, CheckCircle, PlusCircle, Trash2, Edit, FileImage, ClipboardList } from 'lucide-react';
import Swal from 'sweetalert2';
import SkeletonCard from './Partials/SkeletonCard';

// Komponen Pagination (Helper)
function Pagination({ links }) {
    function cn(...classes) {
        return classes.filter(Boolean).join(' ');
    }
    return (
        <div className="mt-6 flex justify-center gap-1">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    preserveScroll
                    className={cn(
                        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2',
                        link.active ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent',
                        !link.url ? 'opacity-50 cursor-not-allowed' : ''
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

// Komponen Empty State Baru yang Interaktif
function EmptyState() {
    return (
        <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Tidak Ada Data Todo</h3>
                <p className="text-muted-foreground mb-6">
                    Mulai buat daftar pekerjaan Anda agar lebih terorganisir.
                </p>
                <Link href="/todos/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Buat Todo Pertama Anda
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

// Komponen Utama Halaman Index
export default function Index({ auth, todos, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [loading, setLoading] = useState(false);

    // Lacak event Inertia untuk loading state
    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleFinish = () => setLoading(false);

        const unlistenStart = router.on('start', handleStart);
        const unlistenFinish = router.on('finish', handleFinish);

        return () => {
            unlistenStart();
            unlistenFinish();
        };
    }, []);

    const handleFilterChange = () => {
        router.get(
            '/todos',
            { search, status },
            { preserveState: true, replace: true }
        );
    };
    
    const handleSearchKeydown = (e) => {
        if (e.key === 'Enter') {
            handleFilterChange();
        }
    }

    const handleStatusChange = (value) => {
        const newStatus = value === 'all' ? '' : value;
        setStatus(newStatus);
        router.get(
            '/todos',
            { search, status: newStatus },
            { preserveState: true, replace: true }
        );
    };

    // --- FUNGSI HAPUS DATA ---
    const handleDelete = (todo) => {
        Swal.fire({
            title: 'Anda yakin?',
            text: `Anda akan menghapus todo: "${todo.title}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // Merah untuk tombol hapus
            cancelButtonColor: '#6b7280', // Abu-abu untuk tombol batal
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                // Mengirim request DELETE ke server untuk menghapus todo
                router.delete(`/todos/${todo.id}`, { preserveScroll: true });
            }
        });
    };
    // --- AKHIR FUNGSI HAPUS ---
    
    const toggleFinish = (todo) => {
        router.post(`/todos/${todo.id}`, {
            _method: 'PUT',
            title: todo.title,
            description: todo.description,
            is_finished: !todo.is_finished,
            toggle_status: true
        }, {
            preserveScroll: true
        });
    }

    // Fungsi Render Konten
    const renderContent = () => {
        if (loading) {
            return Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} />
            ));
        }

        if (todos.data.length === 0) {
            return <EmptyState />;
        }

        return todos.data.map((todo) => (
            <Card key={todo.id} className="flex flex-col md:flex-row items-start overflow-hidden">
                {todo.cover_url ? (
                    <img
                        src={todo.cover_url}
                        alt={todo.title}
                        className="w-full md:w-32 h-32 md:h-auto object-cover"
                    />
                ) : (
                    <div className="w-full md:w-32 h-32 md:min-h-[100px] bg-secondary flex items-center justify-center shrink-0">
                        <FileImage className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}
                <CardContent className="p-4 flex-grow w-full">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-semibold">{todo.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                Dibuat: {new Date(todo.created_at).toLocaleString()}
                            </p>
                        </div>
                        <Badge variant={todo.is_finished ? 'default' : 'secondary'} className="shrink-0">
                            {todo.is_finished ? 'Finished' : 'Pending'}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        {todo.description || 'Tidak ada deskripsi.'}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant={todo.is_finished ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleFinish(todo)}
                            disabled={loading}
                        >
                            {todo.is_finished ? (
                                <AlertTriangle className="mr-2 h-4 w-4" />
                            ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                            )}
                            {todo.is_finished ? 'Batal Selesai' : 'Selesaikan'}
                        </Button>
                        <Link href={`/todos/${todo.id}/edit`}>
                            <Button variant="outline" size="icon" disabled={loading}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        
                        {/* --- INI TOMBOL HAPUSNYA --- */}
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(todo)}
                            disabled={loading}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        {/* --- AKHIR TOMBOL HAPUS --- */}

                    </div>
                </CardContent>
            </Card>
        ));
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard Todos</h2>}
        >
            <Head title="Dashboard Todos" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    
                    {(todos.data.length > 0 || loading) && (
                        <div className="flex justify-end mb-6">
                            <Link href="/todos/create">
                                <Button disabled={loading}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah Todo
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Filter dan Search */}
                    <div className="mb-4 flex flex-col md:flex-row gap-4">
                        <Input
                            type="text"
                            placeholder="Cari judul todo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearchKeydown}
                            className="flex-grow"
                            disabled={loading}
                        />
                        <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="finished">Finished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Daftar Todos */}
                    <div className="space-y-4">
                        {renderContent()}
                    </div>

                    {/* Pagination */}
                    {!loading && todos.data.length > 0 && todos.links.length > 3 && (
                         <Pagination links={todos.links} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}