import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    let response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Obtener el post
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si está publicado o si el usuario es el creador
    const { data: { session } } = await supabase.auth.getSession();
    if (data.estado !== 'publicado' && session?.user.id !== data.autor_id) {
      return NextResponse.json(
        { error: 'No tienes permiso para ver este post' },
        { status: 403 }
      );
    }

    return NextResponse.json({ post: data });
  } catch (err) {
    console.error('Error en GET /api/blog/[id]:', err);
    return NextResponse.json(
      { error: 'Error servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    let response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Verificar autenticación
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener el post actual
    const { data: postActual, error: getError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (getError || !postActual) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que sea el creador
    if (postActual.autor_id !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para editar este post' },
        { status: 403 }
      );
    }

    // Obtener datos para actualizar
    const body = await request.json();
    const { titulo, slug, descripcion, contenido, imagen_url, estado } = body;

    // Validaciones
    const errors: string[] = [];
    if (titulo !== undefined && titulo.trim().length === 0) errors.push('Título no puede estar vacío');
    if (slug !== undefined && slug.trim().length === 0) errors.push('Slug no puede estar vacío');
    if (estado && !['borrador', 'publicado', 'archivado'].includes(estado)) {
      errors.push('Estado inválido');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validación fallida', details: errors },
        { status: 400 }
      );
    }

    // Construir objeto de actualización
    const updateData: Record<string, any> = {
      fecha_actualizacion: new Date().toISOString(),
    };

    if (titulo !== undefined) updateData.titulo = titulo.trim();
    if (slug !== undefined) updateData.slug = slug.trim().toLowerCase();
    if (descripcion !== undefined) updateData.descripcion = descripcion.trim();
    if (contenido !== undefined) updateData.contenido = contenido.trim();
    if (imagen_url !== undefined) updateData.imagen_url = imagen_url;
    if (estado !== undefined) {
      updateData.estado = estado;
      // Si se publica, registra la fecha
      if (estado === 'publicado' && postActual.estado !== 'publicado') {
        updateData.fecha_publicacion = new Date().toISOString();
      }
    }

    // Actualizar
    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error Supabase al actualizar post:', error);
      return NextResponse.json(
        { error: 'Error al actualizar post', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Post actualizado exitosamente',
      post: data?.[0],
    });
  } catch (err) {
    console.error('Error en PUT /api/blog/[id]:', err);
    return NextResponse.json(
      { error: 'Error servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    let response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Verificar autenticación
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener el post
    const { data: post, error: getError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (getError || !post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que sea el creador
    if (post.autor_id !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este post' },
        { status: 403 }
      );
    }

    // Eliminar
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error Supabase al eliminar post:', error);
      return NextResponse.json(
        { error: 'Error al eliminar post', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Post eliminado exitosamente' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error en DELETE /api/blog/[id]:', err);
    return NextResponse.json(
      { error: 'Error servidor' },
      { status: 500 }
    );
  }
}
