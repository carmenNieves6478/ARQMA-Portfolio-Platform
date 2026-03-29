import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  try {
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

    // Parámetros de query
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado') || 'publicado';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Obtener posts
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' });

    // Si es cliente no autenticado, solo mostrar publicados
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      query = query.eq('estado', 'publicado');
    } else {
      // Si está autenticado, puede ver sus borradores y publicados
      if (estado !== 'todos') {
        query = query.eq('estado', estado);
      }
    }

    const { data, count, error } = await query
      .order('fecha_publicacion', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Error al obtener posts', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      posts: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Error en GET /api/blog:', err);
    return NextResponse.json(
      { error: 'Error servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Crear cliente Supabase
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

    // Verificar que esté autenticado (admin)
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado. Debes estar autenticado.' },
        { status: 401 }
      );
    }

    // Obtener datos del request
    const body = await request.json();
    const { titulo, slug, descripcion, contenido, imagen_url, estado } = body;

    // Validaciones
    const errors: string[] = [];
    if (!titulo || titulo.trim().length === 0) errors.push('Título es requerido');
    if (!slug || slug.trim().length === 0) errors.push('Slug es requerido');
    if (!descripcion || descripcion.trim().length === 0) errors.push('Descripción es requerida');
    if (!contenido || contenido.trim().length === 0) errors.push('Contenido es requerido');
    if (estado && !['borrador', 'publicado', 'archivado'].includes(estado)) {
      errors.push('Estado inválido');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validación fallida', details: errors },
        { status: 400 }
      );
    }

    // Insertar post
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          titulo: titulo.trim(),
          slug: slug.trim().toLowerCase(),
          descripcion: descripcion.trim(),
          contenido: contenido.trim(),
          imagen_url: imagen_url || null,
          estado: estado || 'borrador',
          autor_id: session.user.id,
          fecha_publicacion: estado === 'publicado' ? new Date().toISOString() : null,
        },
      ])
      .select();

    if (error) {
      console.error('Error Supabase al crear post:', error);
      return NextResponse.json(
        { error: 'Error al crear post', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Post creado exitosamente', post: data?.[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error en POST /api/blog:', err);
    return NextResponse.json(
      { error: 'Error servidor' },
      { status: 500 }
    );
  }
}
