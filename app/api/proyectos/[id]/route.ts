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

    // Obtener el proyecto
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos
    const { data: { session } } = await supabase.auth.getSession();
    if (data.estado !== 'completado' && session?.user.id !== data.autor_id) {
      return NextResponse.json(
        { error: 'No tienes permiso para ver este proyecto' },
        { status: 403 }
      );
    }

    return NextResponse.json({ proyecto: data });
  } catch (err) {
    console.error('Error en GET /api/proyectos/[id]:', err);
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

    // Obtener proyecto
    const { data: proyecto, error: getError } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', id)
      .single();

    if (getError || !proyecto) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que sea el creador
    if (proyecto.autor_id !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para editar este proyecto' },
        { status: 403 }
      );
    }

    // Obtener datos para actualizar
    const body = await request.json();
    const {
      titulo,
      slug,
      descripcion,
      descripcion_corta,
      contenido,
      imagen_portada,
      imagenes_galeria,
      ubicacion,
      area_m2,
      ano_inicio,
      ano_finalizacion,
      cliente,
      equipo_responsable,
      tecnologias,
      estado,
      orden_visualizacion,
    } = body;

    // Validaciones
    const errors: string[] = [];
    if (titulo !== undefined && !titulo?.trim()) errors.push('Título no puede estar vacío');
    if (slug !== undefined && !slug?.trim()) errors.push('Slug no puede estar vacío');
    if (estado && !['no_publicado', 'en_proceso', 'completado'].includes(estado)) {
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
    if (descripcion_corta !== undefined) updateData.descripcion_corta = descripcion_corta?.trim() || null;
    if (contenido !== undefined) updateData.contenido = contenido?.trim() || null;
    if (imagen_portada !== undefined) updateData.imagen_portada = imagen_portada || null;
    if (imagenes_galeria !== undefined) updateData.imagenes_galeria = Array.isArray(imagenes_galeria) ? imagenes_galeria : [];
    if (ubicacion !== undefined) updateData.ubicacion = ubicacion?.trim() || null;
    if (area_m2 !== undefined) updateData.area_m2 = area_m2 ? parseFloat(area_m2) : null;
    if (ano_inicio !== undefined) updateData.ano_inicio = ano_inicio ? parseInt(ano_inicio) : null;
    if (ano_finalizacion !== undefined) updateData.ano_finalizacion = ano_finalizacion ? parseInt(ano_finalizacion) : null;
    if (cliente !== undefined) updateData.cliente = cliente?.trim() || null;
    if (equipo_responsable !== undefined) updateData.equipo_responsable = equipo_responsable?.trim() || null;
    if (tecnologias !== undefined) updateData.tecnologias = Array.isArray(tecnologias) ? tecnologias : [];
    if (estado !== undefined) updateData.estado = estado;
    if (orden_visualizacion !== undefined) updateData.orden_visualizacion = parseInt(orden_visualizacion) || 0;

    // Actualizar
    const { data, error } = await supabase
      .from('proyectos')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error Supabase:', error);
      return NextResponse.json(
        { error: 'Error al actualizar proyecto', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Proyecto actualizado exitosamente',
      proyecto: data?.[0],
    });
  } catch (err) {
    console.error('Error en PUT /api/proyectos/[id]:', err);
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

    // Obtener proyecto
    const { data: proyecto, error: getError } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', id)
      .single();

    if (getError || !proyecto) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que sea el creador
    if (proyecto.autor_id !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este proyecto' },
        { status: 403 }
      );
    }

    // Eliminar
    const { error } = await supabase
      .from('proyectos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error Supabase:', error);
      return NextResponse.json(
        { error: 'Error al eliminar proyecto', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Proyecto eliminado exitosamente' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error en DELETE /api/proyectos/[id]:', err);
    return NextResponse.json(
      { error: 'Error servidor' },
      { status: 500 }
    );
  }
}
