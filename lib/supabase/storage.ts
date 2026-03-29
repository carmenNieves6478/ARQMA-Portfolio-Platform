import { createClient } from './client';

// Tipos
export interface UploadResult {
  url: string;
  path: string;
}

// Upload para Blog
export async function uploadBlogImage(file: File): Promise<UploadResult> {
  const supabase = createClient();

  // Validar archivo
  if (!file.type.startsWith('image/')) {
    throw new Error('Solo se aceptan imágenes');
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB
    throw new Error('La imagen no puede ser mayor a 5MB');
  }

  // Crear nombre único
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const filename = `blog-${timestamp}-${random}-${file.name}`;

  // Subir a Supabase Storage
  const { data, error } = await supabase.storage
    .from('blog_images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message}`);
  }

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from('blog_images')
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
  };
}

// Upload para Proyectos
export async function uploadProyectoImage(file: File): Promise<UploadResult> {
  const supabase = createClient();

  // Validar archivo
  if (!file.type.startsWith('image/')) {
    throw new Error('Solo se aceptan imágenes');
  }

  if (file.size > 10 * 1024 * 1024) {
    // 10MB
    throw new Error('La imagen no puede ser mayor a 10MB');
  }

  // Crear nombre único
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const filename = `proyecto-${timestamp}-${random}-${file.name}`;

  // Subir a Supabase Storage
  const { data, error } = await supabase.storage
    .from('proyecto_images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message}`);
  }

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from('proyecto_images')
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
  };
}

// Eliminar imagen
export async function deleteImage(bucket: 'blog_images' | 'proyecto_images', path: string) {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Error al eliminar imagen: ${error.message}`);
  }
}
