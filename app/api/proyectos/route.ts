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

    // Parámetros
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado') || 'completado';
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Obtener proyectos
    let query = supabase
      .from('proyectos')
      .select('*', { count: 'exact' });

    // Si no está autenticado, solo proyectos completados
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      query = query.eq('estado', 'completado');
    } else {
      if (estado !== 'todos') {
        query = query.eq('estado', estado);
      }
    }

    const { data, count, error } = await query
      .order('orden_visualizacion', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Error al obtener proyectos', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      proyectos: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Error en GET /api/proyectos:', err);
    return NextResponse.json(
      { error: 'Error servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Verificar autenticación
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'No autorizado. Debes estar autenticado.' },
        { status: 401 }
      );
    }

    // Obtener datos
    const body = await request.json();
    const {
      titulo,
      slug,
      descripcion,
      descripcion_corta,
      contenido,
      imagen_portada,
      ubicacion,
      area_m2,
      ano_inicio,
      ano_finalizacion,
      cliente,
      equipo_responsable,
      estado,
      orden_visualizacion,
    } = body;

    // Validaciones
    const errors: string[] = [];
    if (!titulo?.trim()) errors.push('Título es requerido');
    if (!slug?.trim()) errors.push('Slug es requerido');
    if (!descripcion?.trim()) errors.push('Descripción es requerida');
    if (estado && !['no_publicado', 'en_proceso', 'completado'].includes(estado)) {
      errors.push('Estado inválido');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validación fallida', details: errors },
        { status: 400 }
      );
    }

    // Insertar proyecto
    const { data, error } = await supabase
      .from('proyectos')
      .insert([
        {
          titulo: titulo.trim(),
          slug: slug.trim().toLowerCase(),
          descripcion: descripcion.trim(),
          descripcion_corta: descripcion_corta?.trim() || null,
          contenido: contenido?.trim() || null,
          imagen_portada: imagen_portada || null,
          ubicacion: ubicacion?.trim() || null,
          area_m2: area_m2 ? parseFloat(area_m2) : null,
          ano_inicio: ano_inicio ? parseInt(ano_inicio) : null,
          ano_finalizacion: ano_finalizacion ? parseInt(ano_finalizacion) : null,
          cliente: cliente?.trim() || null,
          equipo_responsable: equipo_responsable?.trim() || null,
          estado: estado || 'no_publicado',
          orden_visualizacion: orden_visualizacion || 0,
          autor_id: session.user.id,
        },
      ])
      .select();

    if (error) {
      console.error('Error Supabase:', error);
      return NextResponse.json(
        { error: 'Error al crear proyecto', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Proyecto creado exitosamente', proyecto: data?.[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error en POST /api/proyectos:', err);
    return NextResponse.json(
      { error: 'Error servidor' },
      { status: 500 }
    );
  }
}
