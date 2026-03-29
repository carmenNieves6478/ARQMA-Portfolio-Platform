import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey })
}

const supabase = createClient(supabaseUrl!, supabaseKey!)

// Validadores de opciones permitidas
const CANALES_PERMITIDOS = ['whatsapp', 'llamada', 'correo']
const TIPOS_PROYECTO_PERMITIDOS = ['vivienda', 'remodelacion', 'comercial', 'interiorismo', 'expediente']
const PRESUPUESTOS_PERMITIDOS = ['menos-20k', '20k-50k', '50k-100k', 'mas-100k']
const PLAZOS_PERMITIDOS = ['inmediato', '1-3', '3-6', '6+']
const ETAPAS_PERMITIDAS = ['idea', 'anteproyecto', 'diseno', 'ejecucion']

// Función para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 100
}

// Función para validar teléfono
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/
  return phoneRegex.test(phone)
}

// Función para sanitizar y validar texto
function sanitizeText(text: string, maxLength: number, fieldName: string): string | null {
  if (typeof text !== 'string') return null
  
  const trimmed = text.trim()
  if (trimmed.length === 0) return null
  if (trimmed.length > maxLength) return null
  
  // Permitir caracteres alfanuméricos, espacios, puntuación común
  const validTextRegex = /^[a-zA-Z0-9\sáéíóúñÁÉÍÓÚÑ\.\,\-\(\)]+$/
  if (!validTextRegex.test(trimmed)) return null
  
  return trimmed
}

// Función para validar número
function isValidNumber(value: any): number | null {
  const num = parseFloat(value)
  return !isNaN(num) && num > 0 && num < 100000 ? num : null
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar que los campos requeridos existan y sean del tipo correcto
    const { nombre, email, telefono, pais, canal_preferido, tipo_proyecto, ubicacion_proyecto, area, presupuesto, plazo, etapa, mensaje } = data

    // Validaciones básicas de existencia
    if (!nombre || !email || !telefono || !pais || !canal_preferido || !tipo_proyecto || !ubicacion_proyecto || !presupuesto || !plazo || !etapa) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar y sanitizar campos de texto
    const nombreSanitized = sanitizeText(nombre, 100, 'nombre')
    const emailValidated = isValidEmail(email) ? email.toLowerCase() : null
    const telefonoSanitized = isValidPhone(telefono) ? telefono : null
    const ubicacionSanitized = sanitizeText(ubicacion_proyecto, 150, 'ubicacion')
    const mensajeSanitized = mensaje ? sanitizeText(mensaje, 1000, 'mensaje') : null

    // Validar valor de país
    const paisValido = ['PE', 'AR', 'MX', 'CO', 'CL', 'ES', 'US', 'BR', 'BO', 'EC'].includes(pais)
    if (!paisValido) {
      return NextResponse.json(
        { error: 'País inválido' },
        { status: 400 }
      )
    }

    // Validar valores de opciones (selects)
    if (!CANALES_PERMITIDOS.includes(canal_preferido)) {
      return NextResponse.json(
        { error: 'Canal preferido inválido' },
        { status: 400 }
      )
    }

    if (!TIPOS_PROYECTO_PERMITIDOS.includes(tipo_proyecto)) {
      return NextResponse.json(
        { error: 'Tipo de proyecto inválido' },
        { status: 400 }
      )
    }

    if (!PRESUPUESTOS_PERMITIDOS.includes(presupuesto)) {
      return NextResponse.json(
        { error: 'Presupuesto inválido' },
        { status: 400 }
      )
    }

    if (!PLAZOS_PERMITIDOS.includes(plazo)) {
      return NextResponse.json(
        { error: 'Plazo inválido' },
        { status: 400 }
      )
    }

    if (!ETAPAS_PERMITIDAS.includes(etapa)) {
      return NextResponse.json(
        { error: 'Etapa inválida' },
        { status: 400 }
      )
    }

    // Validar campos sanitizados
    if (!nombreSanitized || !emailValidated || !telefonoSanitized || !ubicacionSanitized) {
      return NextResponse.json(
        { error: 'Datos inválidos o caracteres no permitidos' },
        { status: 400 }
      )
    }

    // Validar y convertir area si existe
    const areaNormalized = area ? isValidNumber(area) : null

    // Insertar en Supabase (ya usa parameterized queries automáticamente)
    const { data: insertedData, error } = await supabase
      .from('contactos')
      .insert([
        {
          nombre: nombreSanitized,
          email: emailValidated,
          telefono: telefonoSanitized,
          pais,
          canal_preferido,
          tipo_proyecto,
          ubicacion_proyecto: ubicacionSanitized,
          area: areaNormalized,
          presupuesto,
          plazo,
          etapa,
          mensaje: mensajeSanitized,
        },
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Error al guardar el contacto. Intenta más tarde.' },
        { status: 500 }
      )
    }

    console.log('Successfully inserted contact from:', emailValidated)
    return NextResponse.json(
      { success: true, message: 'Contacto guardado correctamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in API route:', error)
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}
