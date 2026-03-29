'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { uploadBlogImage } from '@/lib/supabase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit2, Trash2, Loader2, AlertCircle, CheckCircle2, Plus } from 'lucide-react';

interface BlogPost {
    id: string;
    titulo: string;
    slug: string;
    descripcion: string;
    contenido: string;
    imagen_url: string | null;
    estado: 'borrador' | 'publicado' | 'archivado';
    fecha_publicacion: string | null;
    fecha_creacion: string;
    fecha_actualizacion: string;
}

export default function AdminBlogPage() {
    const { session, loading: authLoading } = useAuth();
    const router = useRouter();

    // Estados
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    // Formulario
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        titulo: string;
        slug: string;
        descripcion: string;
        contenido: string;
        imagen_url: string;
        estado: 'borrador' | 'publicado' | 'archivado';
    }>({
        titulo: '',
        slug: '',
        descripcion: '',
        contenido: '',
        imagen_url: '',
        estado: 'borrador',
    });

    // Cargar posts
    useEffect(() => {
        if (!authLoading && !session) {
            router.push('/admin/login');
            return;
        }

        if (!authLoading) {
            fetchPosts();
        }
    }, [authLoading, session, router]);

    async function fetchPosts() {
        try {
            setLoading(true);
            const response = await fetch('/api/blog?estado=todos&limit=100', {
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Error al cargar posts');

            const data = await response.json();
            setPosts(data.posts || []);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const result = await uploadBlogImage(file);
            setFormData({ ...formData, imagen_url: result.url });
            setSuccess('Imagen cargada exitosamente');
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar imagen');
        } finally {
            setUploadingImage(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validar
        if (!formData.titulo || !formData.slug || !formData.descripcion || !formData.contenido) {
            setError('Todos los campos son requeridos');
            return;
        }

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/blog/${editingId}` : '/api/blog';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al guardar');
            }

            setSuccess(editingId ? 'Post actualizado' : 'Post creado');
            setFormData({ titulo: '', slug: '', descripcion: '', contenido: '', imagen_url: '', estado: 'borrador' });
            setEditingId(null);

            // Recargar posts
            setTimeout(() => fetchPosts(), 500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar este post? No se puede deshacer.')) return;

        try {
            const response = await fetch(`/api/blog/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Error al eliminar');

            setSuccess('Post eliminado');
            fetchPosts();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar');
        }
    }

    function handleEdit(post: BlogPost) {
        setEditingId(post.id);
        setFormData({
            titulo: post.titulo,
            slug: post.slug,
            descripcion: post.descripcion,
            contenido: post.contenido,
            imagen_url: post.imagen_url || '',
            estado: post.estado,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Encabezado */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Gestión de Blog</h1>
                    <p className="text-slate-400">Crea, edita y elimina contenido del blog</p>
                </div>

                {/* Alertas */}
                {error && (
                    <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-md">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <p className="text-green-700">{success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <Card className="lg:col-span-1 p-6 sticky top-8 h-fit">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            {editingId ? 'Editar Post' : 'Nuevo Post'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="titulo">Titulo *</Label>
                                <Input
                                    id="titulo"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    placeholder="Ej: Proyecto en Puno"
                                />
                            </div>

                            <div>
                                <Label htmlFor="slug">Slug (URL) *</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="proyecto-puno"
                                />
                            </div>

                            <div>
                                <Label htmlFor="descripcion">Descripción corta *</Label>
                                <Textarea
                                    id="descripcion"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Resumen del post"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="contenido">Contenido *</Label>
                                <Textarea
                                    id="contenido"
                                    value={formData.contenido}
                                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                                    placeholder="Contenido completo del artículo"
                                    rows={4}
                                />
                            </div>

                            {/* Upload de imagen */}
            <div>
                <Label htmlFor="imagen">Imagen destacada {!editingId && '*'}</Label>
                <div className="flex gap-2">
                    <Input
                        id="imagen"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="flex-1"
                    />
                    {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-orange-500" />}
                </div>
                {formData.imagen_url ? (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-xs text-green-700 font-semibold mb-2">✓ Imagen cargada correctamente</p>
                        <img
                            src={formData.imagen_url}
                            alt="Vista previa"
                            className="w-full h-32 object-cover rounded-md"
                        />
                    </div>
                ) : (
                    !editingId && <p className="text-xs text-red-600 mt-2">La imagen es requerida para nuevos posts</p>
                )}
            </div>

                            <div>
                                <Label htmlFor="estado">Estado</Label>
                                <select
                                    id="estado"
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                                >
                                    <option value="borrador">Borrador</option>
                                    <option value="publicado">Publicado</option>
                                    <option value="archivado">Archivado</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={uploadingImage || (!editingId && !formData.imagen_url)}
                                >
                                    {editingId ? 'Actualizar' : 'Crear'} Post
                                </Button>
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({ titulo: '', slug: '', descripcion: '', contenido: '', imagen_url: '', estado: 'borrador' });
                                        }}
                                        className="w-full"
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Card>

                    <div className="lg:col-span-2 space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : posts.length === 0 ? (
                            <Card className="p-8 text-center text-slate-400">
                                No hay posts aún. Crea uno usando el formulario.
                            </Card>
                        ) : (
                            posts.map((post) => (
                                <Card key={post.id} className="p-4 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start gap-4">
                                        {post.imagen_url && (
                                            <img
                                                src={post.imagen_url}
                                                alt={post.titulo}
                                                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                                            />
                                        )}

                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{post.titulo}</h3>
                                            <p className="text-sm text-slate-500 mb-2">{post.slug}</p>
                                            <p className="text-sm text-slate-600 line-clamp-2">{post.descripcion}</p>
                                            <div className="flex gap-2 mt-3">
                                                <span className={`text-xs px-2 py-1 rounded ${post.estado === 'publicado'
                                                        ? 'bg-green-100 text-green-700'
                                                        : post.estado === 'borrador'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {post.estado}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(post)}
                                                className="gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(post.id)}
                                                className="gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
