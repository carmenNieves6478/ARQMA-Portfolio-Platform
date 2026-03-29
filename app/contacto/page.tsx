"use client"

import { useEffect, useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Linkedin, Youtube, CheckCircle, AlertCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
]

const paises = [
  { codigo: "PE", nombre: "Perú", prefijo: "+51", minDígitos: 9, maxDígitos: 9 },
  { codigo: "AR", nombre: "Argentina", prefijo: "+54", minDígitos: 10, maxDígitos: 10 },
  { codigo: "MX", nombre: "México", prefijo: "+52", minDígitos: 10, maxDígitos: 10 },
  { codigo: "CO", nombre: "Colombia", prefijo: "+57", minDígitos: 10, maxDígitos: 10 },
  { codigo: "CL", nombre: "Chile", prefijo: "+56", minDígitos: 9, maxDígitos: 9 },
  { codigo: "ES", nombre: "España", prefijo: "+34", minDígitos: 9, maxDígitos: 9 },
  { codigo: "US", nombre: "USA/Canadá", prefijo: "+1", minDígitos: 10, maxDígitos: 10 },
  { codigo: "BR", nombre: "Brasil", prefijo: "+55", minDígitos: 11, maxDígitos: 11 },
  { codigo: "BO", nombre: "Bolivia", prefijo: "+591", minDígitos: 8, maxDígitos: 8 },
  { codigo: "EC", nombre: "Ecuador", prefijo: "+593", minDígitos: 9, maxDígitos: 9 },
]

const contactInfo = [
  {
    icon: MapPin,
    label: "Ubicacion",
    value: "Universidad Nacional del Altiplano, Av. Floral 1153, Puno 21001, Peru",
  },
  {
    icon: Phone,
    label: "Telefono",
    value: "+51 951 247 830",
  },
  {
    icon: Mail,
    label: "Correo",
    value: "contacto.puno@arqemastudio.com",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun - Vie: 9:00 AM - 6:00 PM (previa coordinacion)",
  },
]

export default function ContactoPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form fields state
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [pais, setPais] = useState("PE")
  const [telefono, setTelefono] = useState("")
  const [canal, setCanal] = useState("")
  const [tipoProyecto, setTipoProyecto] = useState("")
  const [ubicacionProyecto, setUbicacionProyecto] = useState("")
  const [area, setArea] = useState("")
  const [presupuesto, setPresupuesto] = useState("")
  const [plazo, setPlazo] = useState("")
  const [etapa, setEtapa] = useState("")
  const [mensaje, setMensaje] = useState("")

  // Errores de validación en tiempo real
  const [errores, setErrores] = useState<{ email?: string, telefono?: string }>({})

  // Obtener país seleccionado
  const paisSeleccionado = paises.find(p => p.codigo === pais) || paises[0]

  // Validar email en tiempo real
  const validarEmail = (valor: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (valor.length === 0) {
      setErrores(prev => ({ ...prev, email: undefined }))
    } else if (!emailRegex.test(valor)) {
      setErrores(prev => ({ ...prev, email: 'Por favor ingresa un correo válido' }))
    } else {
      setErrores(prev => ({ ...prev, email: undefined }))
    }
    setEmail(valor)
  }

  // Validar teléfono en tiempo real
  const validarTelefono = (valor: string) => {
    const soloNumeros = valor.replace(/\D/g, '')
    if (valor.length === 0) {
      setErrores(prev => ({ ...prev, telefono: undefined }))
    } else if (soloNumeros.length < paisSeleccionado.minDígitos || soloNumeros.length > paisSeleccionado.maxDígitos) {
      setErrores(prev => ({ ...prev, telefono: `El teléfono debe tener ${paisSeleccionado.minDígitos}-${paisSeleccionado.maxDígitos} dígitos` }))
    } else {
      setErrores(prev => ({ ...prev, telefono: undefined }))
    }
    setTelefono(valor)
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Si hay errores de validación, no permitir envío
    if (errores.email || errores.telefono) {
      setMessage({ type: 'error', text: 'Por favor corrige los errores antes de enviar' })
      return
    }

    // Validar campos requeridos
    if (!nombre || !email || !telefono || !canal || !tipoProyecto || !ubicacionProyecto || !presupuesto || !plazo || !etapa) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos requeridos' })
      return
    }

    // Validar longitudes máximas
    if (nombre.length > 100) {
      setMessage({ type: 'error', text: 'El nombre es demasiado largo (máx. 100 caracteres)' })
      return
    }

    if (ubicacionProyecto.length > 150) {
      setMessage({ type: 'error', text: 'La ubicación es demasiado larga (máx. 150 caracteres)' })
      return
    }

    if (mensaje && mensaje.length > 1000) {
      setMessage({ type: 'error', text: 'El mensaje es demasiado largo (máx. 1000 caracteres)' })
      return
    }

    // Validar que area sea un número válido si existe
    if (area) {
      const areaNum = parseFloat(area)
      if (isNaN(areaNum) || areaNum <= 0 || areaNum > 100000) {
        setMessage({ type: 'error', text: 'Por favor ingresa un área válida' })
        return
      }
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
          telefono: telefono.trim(),
          pais,
          canal_preferido: canal,
          tipo_proyecto: tipoProyecto,
          ubicacion_proyecto: ubicacionProyecto.trim(),
          area: area ? parseFloat(area) : null,
          presupuesto,
          plazo,
          etapa,
          mensaje: mensaje ? mensaje.trim() : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el formulario')
      }

      // Success
      setMessage({ type: 'success', text: '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.' })

      // Reset form
      setNombre("")
      setEmail("")
      setPais("PE")
      setTelefono("")
      setCanal("")
      setTipoProyecto("")
      setUbicacionProyecto("")
      setArea("")
      setPresupuesto("")
      setPlazo("")
      setEtapa("")
      setMensaje("")
      setErrores({})
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error al enviar el formulario' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section id="contacto" className="relative bg-background py-24 lg:py-32">

          {/* Background Technology Mesh & Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `
              linear-gradient(45deg, rgba(255,127,0,0.1) 25%, transparent 25%, transparent 50%, rgba(255,127,0,0.1) 50%, rgba(255,127,0,0.1) 75%, transparent 75%, transparent)
            `,
                backgroundSize: '100px 100px',
              }}
            />
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[130px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          </div>


          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Section Header Centered */}
            <div
              className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Contacto
              </span>
              <h1 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
                Hablemos de tu proyecto
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
                Somos un equipo de arquitectos en etapa universitaria en Puno. Aun no contamos con local propio, pero atendemos por coordinacion y acompanamos tu proyecto desde el primer dia.
              </p>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div
                className={`transition-all duration-700 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {message && (
                    <div className={`p-4 rounded-lg flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      {message.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                        {message.text}
                      </p>
                    </div>
                  )}
                  <div className="mb-1 inline-flex items-center gap-2">
                    <div className="h-px w-8 bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">Datos de contacto</span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="nombre" className="text-sm font-medium text-foreground">Nombre</label>
                      <input
                        id="nombre"
                        type="text"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">Correo</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => validarEmail(e.target.value)}
                        className={`rounded-lg border bg-card px-4 py-3 text-sm focus:outline-none ${errores.email ? 'border-red-500 focus:border-red-500' : 'border-input focus:border-primary'}`}
                      />
                      {errores.email && <p className="text-xs text-red-600">{errores.email}</p>}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="telefono" className="text-sm font-medium text-foreground">Teléfono</label>
                      <div className="flex gap-0">
                        <select
                          id="pais"
                          value={pais}
                          onChange={(e) => {
                            setPais(e.target.value)
                            setTelefono("")
                            setErrores(prev => ({ ...prev, telefono: undefined }))
                          }}
                          className="rounded-l-lg border border-r-0 border-input bg-card px-3 py-3 text-sm focus:border-primary focus:outline-none w-[85px]"
                        >
                          {paises.map(p => (
                            <option key={p.codigo} value={p.codigo}>
                              {p.prefijo}
                            </option>
                          ))}
                        </select>
                        <input
                          id="telefono"
                          type="tel"
                          placeholder={`${paisSeleccionado.minDígitos} dígitos`}
                          value={telefono}
                          onChange={(e) => validarTelefono(e.target.value)}
                          className={`flex-1 rounded-r-lg border bg-card px-4 py-3 text-sm focus:outline-none ${errores.telefono ? 'border-red-500 focus:border-red-500' : 'border-input focus:border-primary'}`}
                        />
                      </div>
                      {errores.telefono && <p className="text-xs text-red-600">{errores.telefono}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="canal" className="text-sm font-medium text-foreground">Canal preferido</label>
                      <select
                        id="canal"
                        value={canal}
                        onChange={(e) => setCanal(e.target.value)}
                        className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="">Selecciona una opcion</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="llamada">Llamada</option>
                        <option value="correo">Correo</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-1 mt-2 inline-flex items-center gap-2">
                    <div className="h-px w-8 bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">Datos del proyecto</span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="tipoProyecto" className="text-sm font-medium text-foreground">Tipo de proyecto</label>
                      <select
                        id="tipoProyecto"
                        value={tipoProyecto}
                        onChange={(e) => setTipoProyecto(e.target.value)}
                        className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="">Selecciona una opcion</option>
                        <option value="vivienda">Vivienda</option>
                        <option value="remodelacion">Remodelacion</option>
                        <option value="comercial">Comercial</option>
                        <option value="interiorismo">Interiorismo</option>
                        <option value="expediente">Expediente tecnico</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="ubicacionProyecto" className="text-sm font-medium text-foreground">Ubicacion del proyecto</label>
                      <input
                        id="ubicacionProyecto"
                        type="text"
                        placeholder="Ciudad o distrito"
                        value={ubicacionProyecto}
                        onChange={(e) => setUbicacionProyecto(e.target.value)}
                        className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="area" className="text-sm font-medium text-foreground">Area aproximada (m2)</label>
                      <input
                        id="area"
                        type="number"
                        min="0"
                        placeholder="Ej. 120"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="presupuesto" className="text-sm font-medium text-foreground">Presupuesto estimado</label>
                      <select
                        id="presupuesto"
                        value={presupuesto}
                        onChange={(e) => setPresupuesto(e.target.value)}
                        className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="">Selecciona una opcion</option>
                        <option value="menos-20k">Menor a $20,000</option>
                        <option value="20k-50k">$20,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="mas-100k">Mayor a $100,000</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="plazo" className="text-sm font-medium text-foreground">Plazo de inicio</label>
                      <select
                        id="plazo"
                        value={plazo}
                        onChange={(e) => setPlazo(e.target.value)}
                        className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="">Selecciona una opcion</option>
                        <option value="inmediato">Inmediato</option>
                        <option value="1-3">1 a 3 meses</option>
                        <option value="3-6">3 a 6 meses</option>
                        <option value="6+">Mas de 6 meses</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="etapa" className="text-sm font-medium text-foreground">Etapa actual</label>
                      <select
                        id="etapa"
                        value={etapa}
                        onChange={(e) => setEtapa(e.target.value)}
                        className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="">Selecciona una opcion</option>
                        <option value="idea">Idea inicial</option>
                        <option value="anteproyecto">Anteproyecto</option>
                        <option value="diseno">Diseno</option>
                        <option value="ejecucion">Ejecucion</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="mensaje" className="text-sm font-medium text-foreground">Mensaje</label>
                    <textarea
                      id="mensaje"
                      rows={5}
                      placeholder="Cuentanos sobre tu proyecto en Puno o alrededores..."
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className={`grid grid-cols-2 gap-8 transition-all duration-700 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                <div>
                  <div className="mb-4 inline-flex items-center gap-2">
                    <div className="h-px w-8 bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nuestros Datos</span>
                  </div>
                  <div className="grid gap-4 grid-cols-1 mt-6">
                    {contactInfo.map((info) => (
                      <div key={info.label} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <info.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{info.label}</p>
                          <p className="mt-1 text-sm font-medium text-card-foreground break-all">{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4 inline-flex items-center gap-2">
                    <div className="h-px w-8 bg-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Siguenos</span>
                  </div>
                  <div className="grid gap-4 grid-cols-1 mt-6">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        aria-label={social.name}
                        className="flex items-center gap-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <social.icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-card-foreground">{social.name}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
