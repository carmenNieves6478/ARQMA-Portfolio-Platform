'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, BookOpen, FolderOpen, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { session, signOut, loading } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Si no hay sesión y no está cargando, redirige a login
  useEffect(() => {
    if (!loading && !session) {
      router.push('/admin/login');
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-slate-200">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // React Router redirige a login
  }

  async function handleLogout() {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">Panel Admin ARQEMA</h1>
            <p className="text-slate-400 mt-2">
              Bienvenido, <span className="text-orange-500">{session.user?.email}</span>
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            {isSigningOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </Button>
        </div>

        {/* Info de sesión */}
        <Card className="mb-8 p-6 border-blue-200 bg-blue-50">
          <p className="text-sm text-blue-700">
            ✅ <strong>Token JWT activo</strong> - Tu sesión está protegida con token JWT de Supabase.
            El token se almacena de forma segura y se envía automáticamente en cada solicitud.
          </p>
        </Card>

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blog */}
          <Card className="p-8 hover:border-orange-500 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Blog</h2>
                <p className="text-slate-600 mb-4">Gestiona artículos y contenido del blog</p>
                <Button
                  onClick={() => router.push('/admin/blog')}
                  className="w-full"
                >
                  Ir al Blog
                </Button>
              </div>
            </div>
          </Card>

          {/* Proyectos */}
          <Card className="p-8 hover:border-orange-500 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <FolderOpen className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Proyectos</h2>
                <p className="text-slate-600 mb-4">Gestiona el portafolio de proyectos</p>
                <Button
                  onClick={() => router.push('/admin/proyectos')}
                  variant="outline"
                  className="w-full"
                >
                  Ir a Proyectos
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Status */}
        <Card className="mt-8 p-6 bg-slate-800 border-slate-700">
          <h3 className="font-bold mb-4">Estado del Sistema</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>✅ Autenticación: Activa</p>
            <p>✅ Supabase Auth: Conectado</p>
            <p>✅ Tokens JWT: Habilitados</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
