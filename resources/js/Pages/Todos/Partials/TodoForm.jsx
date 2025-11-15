import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError } from '@/components/ui/field';

export default function TodoForm({ todo = null, submitLabel = 'Simpan' }) {
    const { data, setData, post, processing, errors } = useForm({
        title: todo?.title || '',
        description: todo?.description || '',
        cover: null,
        _method: todo ? 'PUT' : 'POST',
    });

    const [preview, setPreview] = useState(todo?.cover_url || null);

    function handleCoverChange(e) {
        const file = e.target.files[0];
        if (file) {
            setData('cover', file);
            setPreview(URL.createObjectURL(file));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        // --- Perbaikan di sini ---
        const url = todo ? `/todos/${todo.id}` : '/todos';
        
        post(url, {
            forceFormData: true, 
            onSuccess: () => {
                if (!todo) {
                    setData({ title: '', description: '', cover: null });
                    setPreview(null);
                    e.target.reset();
                }
            },
        });
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{todo ? 'Edit Todo' : 'Buat Todo Baru'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <Field>
                        <Label htmlFor="title">Judul</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            disabled={processing}
                            aria-invalid={errors.title ? 'true' : 'false'}
                        />
                        <FieldError errors={[{ message: errors.title }]} />
                    </Field>

                    <Field>
                        <Label htmlFor="description">Deskripsi (Opsional)</Label>
                        <Textarea
                            id="description"
                            rows="5"
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            disabled={processing}
                        />
                        <FieldError errors={[{ message: errors.description }]} />
                    </Field>

                    <Field>
                        <Label htmlFor="cover">Cover (Opsional)</Label>
                        {preview && (
                            <img src={preview} alt="Preview" className="mt-2 w-full max-w-xs rounded-md border" />
                        )}
                        <Input
                            id="cover"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            disabled={processing}
                            aria-invalid={errors.cover ? 'true' : 'false'}
                            className="file:text-foreground"
                        />
                        <FieldError errors={[{ message: errors.cover }]} />
                    </Field>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Link href="/todos" className="text-sm text-muted-foreground hover:text-primary"> {/* <-- Perbaikan */}
                        Batal
                    </Link>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : submitLabel}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}