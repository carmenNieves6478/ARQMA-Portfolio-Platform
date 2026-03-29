"use client"

import { useEffect, useRef, useState } from "react"
import { HardHat, Droplets, PenTool, MessageSquare, ArrowRight } from "lucide-react"

const services = [
  {
    icon: HardHat,
    title: "Construccion",
    description:
      "Ejecutamos proyectos de construccion con los mas altos estandares de calidad, desde viviendas residenciales hasta complejos comerciales e industriales.",
    features: ["Obra nueva", "Remodelacion", "Ampliaciones"],
  },
  {
    icon: Droplets,
    title: "Saneamiento",
    description:
      "Soluciones integrales de saneamiento y sistemas hidraulicos que garantizan eficiencia, sostenibilidad y cumplimiento normativo.",
    features: ["Agua potable", "Aguas residuales", "Drenaje pluvial"],
  },
  {
    icon: PenTool,
    title: "Diseno y Planos",
    description:
      "Creamos disenos arquitectonicos unicos y planos detallados que dan vida a tu vision, con atencion a cada detalle y funcionalidad.",
    features: ["Planos arquitectonicos", "Diseno interior", "Modelado 3D"],
  },
  {
    icon: MessageSquare,
    title: "Asesoria Tecnica",
    description:
      "Brindamos asesoria especializada en normativas, materiales y procesos constructivos para que tu proyecto se desarrolle sin contratiempos.",
    features: ["Consultoria", "Normativa", "Supervision"],
  },
]

export function Servicios() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)   // cuando entra en pantalla
        } else {
          setIsVisible(false)  // cuando sale de pantalla
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])


  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="relative bg-secondary py-12 lg:py-16 overflow-hidden"
    >
      {/* Background Technology Mesh & Glow */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(255,127,0,0.1) 25%, transparent 25%, transparent 50%, rgba(255,127,0,0.1) 50%, rgba(255,127,0,0.1) 75%, transparent 75%, transparent)`,
            backgroundSize: '100px 100px',
          }}
        />
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] rotate-12" />
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div> */}
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] rotate-12" />
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Nuestros Servicios
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-secondary-foreground sm:text-4xl lg:text-5xl text-balance">
            Soluciones integrales en arquitectura
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
            Ofrecemos un abanico completo de servicios para cubrir cada etapa de
            tu proyecto, desde la concepcion hasta la entrega final.
          </p>
        </div>

        {/* Service Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group flex flex-col rounded-2xl border border-border bg-card p-8 transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 ${isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
                }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-lg font-bold text-card-foreground">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <ul className="mt-4 flex flex-col gap-1.5">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#contacto"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all duration-300 hover:gap-2"
              >
                Mas informacion
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
