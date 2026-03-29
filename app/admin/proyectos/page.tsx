'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { uploadProyectoImage } from '@/lib/supabase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

interface Proyecto {
  id: number;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_corta: string | null;
  contenido: string | null;
  imagen_portada: string | null;
  estado: 'no_publicado' | 'en_proceso' | 'completado';
  ubicacion: string | null;
  area_m2: number | null;
  ano_inicio: number | null;
  ano_finalizacion: number | null;
  orden_visualizacion: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export default function AdminProyectosPage() {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  // Estados
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Formulario
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    titulo: string;
    slug: string;
    descripcion: string;
    descripcion_corta: string;
    contenido: string;
    imagen_portada: string;
    ubicacion: string;
    area_m2: string;
    ano_inicio: string;
    ano_finalizacion: string;
    cliente: string;
    equipo_responsable: string;
    estado: 'no_publicado' | 'en_proceso' | 'completado';
    orden_visualizacion: string;
  }>({
    titulo: '',
    slug: '',
    descripcion: '',
    descripcion_corta: '',
    contenido: '',
    imagen_portada: '',
    ubicacion: '',
    area_m2: '',
    ano_inicio: '',
    ano_finalizacion: '',
    cliente: '',
    equipo_responsable: '',
    estado: 'no_publicado',
    orden_visualizacion: '0',
  });

  // Cargar proyectos
  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/admin/login');
      return;
    }

    if (!authLoading) {
      fetchProyectos();
    }
  }, [authLoading, session, router]);

  async function fetchProyectos() {
    try {
      setLoading(true);
      const response = await fetch('/api/proyectos?estado=todos&limit=100', {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al cargar proyectos');

      const data = await response.json();
      setProyectos(data.proyectos || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar
    if (!formData.titulo || !formData.slug || !formData.descripcion) {
      setError('Título, slug y descripción son requeridos');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/proyectos/${editingId}` : '/api/proyectos';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: formData.titulo,
          slug: formData.slug,
          descripcion: formData.descripcion,
          descripcion_corta: formData.descripcion_corta || null,
          contenido: formData.contenido || null,
          imagen_portada: formData.imagen_portada || null,
          ubicacion: formData.ubicacion || null,
          area_m2: formData.area_m2 ? parseFloat(formData.area_m2) : null,
          ano_inicio: formData.ano_inicio ? parseInt(formData.ano_inicio) : null,
          ano_finalizacion: formData.ano_finalizacion ? parseInt(formData.ano_finalizacion) : null,
          cliente: formData.cliente || null,
          equipo_responsable: formData.equipo_responsable || null,
          estado: formData.estado,
          orden_visualizacion: parseInt(formData.orden_visualizacion) || 0,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al guardar');
      }

      setSuccess(editingId ? 'Proyecto actualizado' : 'Proyecto creado');
      setFormData({
        titulo: '',
        slug: '',
        descripcion: '',
        descripcion_corta: '',
        contenido: '',
        imagen_portada: '',
        ubicacion: '',
        area_m2: '',
        ano_inicio: '',
        ano_finalizacion: '',
        cliente: '',
        equipo_responsable: '',
        estado: 'no_publicado',
        orden_visualizacion: '0',
      });
      setEditingId(null);

      // Recargar proyectos
      setTimeout(() => fetchProyectos(), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadProyectoImage(file);
      setFormData({ ...formData, imagen_portada: result.url });
      setSuccess('Imagen cargada exitosamente');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar imagen');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este proyecto? No se puede deshacer.')) return;

    try {
      const response = await fetch(`/api/proyectos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setSuccess('Proyecto eliminado');
      fetchProyectos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  function handleEdit(proyecto: Proyecto) {
    setEditingId(proyecto.id);
    setFormData({
      titulo: proyecto.titulo,
      slug: proyecto.slug,
      descripcion: proyecto.descripcion,
      descripcion_corta: proyecto.descripcion_corta || '',
      contenido: proyecto.contenido || '',
      imagen_portada: proyecto.imagen_portada || '',
      ubicacion: proyecto.ubicacion || '',
      area_m2: proyecto.area_m2 ? proyecto.area_m2.toString() : '',
      ano_inicio: proyecto.ano_inicio ? proyecto.ano_inicio.toString() : '',
      ano_finalizacion: proyecto.ano_finalizacion ? proyecto.ano_finalizacion.toString() : '',
      cliente: '',
      equipo_responsable: '',
      estado: proyecto.estado,
      orden_visualizacion: proyecto.orden_visualizacion.toString(),
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
          <h1 className="text-4xl font-bold mb-2">Gestión de Proyectos</h1>
          <p className="text-slate-400">Crea, edita y elimina proyectos del portafolio</p>
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
          <Card className="lg:col-span-1 p-6 sticky top-8 h-fit overflow-y-auto max-h-[calc(100vh-120px)]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <Label htmlFor="titulo">Titulo *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ej: Centro Cultural Puno"
                  size={30}
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="centro-cultural"
                  size={30}
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción detallada del proyecto"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="descripcion_corta">Descripción corta</Label>
                <Input
                  id="descripcion_corta"
                  value={formData.descripcion_corta}
                  onChange={(e) => setFormData({ ...formData, descripcion_corta: e.target.value })}
                  placeholder="Resumen de una línea"
                />
              </div>

              <div>
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  placeholder="Puno, Perú"
                />
              </div>

              <div>
                <Label htmlFor="imagen_portada">Imagen portada</Label>
                <div className="flex gap-2">
                  <Input
                    id="imagen_portada"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="flex-1"
                  />
                  {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-orange-500" />}
                </div>
                {formData.imagen_portada && (
                  <div className="mt-2">
                    <p className="text-xs text-green-600 mb-2">✓ Imagen cargada</p>
                    <img
                      src={formData.imagen_portada}
                      alt="Vista previa"
                      className="w-full h-24 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="ano_inicio">Año inicio</Label>
                  <Input
                    id="ano_inicio"
                    type="number"
                    value={formData.ano_inicio}
                    onChange={(e) => setFormData({ ...formData, ano_inicio: e.target.value })}
                    placeholder="2023"
                  />
                </div>
                <div>
                  <Label htmlFor="ano_finalizacion">Año fin</Label>
                  <Input
                    id="ano_finalizacion"
                    type="number"
                    value={formData.ano_finalizacion}
                    onChange={(e) => setFormData({ ...formData, ano_finalizacion: e.target.value })}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area_m2}
                  onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                  placeholder="5000"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                  className="w-full px-2 py-1 border border-slate-300 rounded-md bg-white text-sm"
                >
                  <option value="no_publicado">No publicado</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>

              <div>
                <Label htmlFor="orden">Orden de visualización</Label>
                <Input
                  id="orden"
                  type="number"
                  value={formData.orden_visualizacion}
                  onChange={(e) => setFormData({ ...formData, orden_visualizacion: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2 pt-4">
                <Button type="submit" className="w-full text-sm">
                  {editingId ? 'Actualizar' : 'Crear'} Proyecto
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        titulo: '',
                        slug: '',
                        descripcion: '',
                        descripcion_corta: '',
                        contenido: '',
                        imagen_portada: '',
                        ubicacion: '',
                        area_m2: '',
                        ano_inicio: '',
                        ano_finalizacion: '',
                        cliente: '',
                        equipo_responsable: '',
                        estado: 'no_publicado',
                        orden_visualizacion: '0',
                      });
                    }}
                    className="w-full text-sm"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Lista de proyectos */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : proyectos.length === 0 ? (
              <Card className="p-8 text-center text-slate-400">
                No hay proyectos aún. Crea uno usando el formulario.
              </Card>
            ) : (
              proyectos.map((proyecto) => (
                <Card key={proyecto.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    {/* Imagen si existe */}
                    {proyecto.imagen_portada && (
                      <img
                        src={proyecto.imagen_portada}
                        alt={proyecto.titulo}
                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{proyecto.titulo}</h3>
                      <p className="text-sm text-slate-500 mb-2">{proyecto.slug}</p>
                      <p className="text-sm text-slate-600 line-clamp-2">{proyecto.descripcion}</p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded ${
                          proyecto.estado === 'completado'
                            ? 'bg-green-100 text-green-700'
                            : proyecto.estado === 'en_proceso'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {proyecto.estado}
                        </span>
                        {proyecto.ubicacion && (
                          <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded">
                            📍 {proyecto.ubicacion}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(proyecto)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(proyecto.id)}
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
