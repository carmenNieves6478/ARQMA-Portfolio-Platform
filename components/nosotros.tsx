"use client"

import { useEffect, useRef, useState } from "react"
import { Eye, Target, ShieldCheck } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Profesionalismo",
    description:
      "Cada proyecto es abordado con el mas alto nivel de exigencia y dedicacion profesional.",
  },
  {
    icon: Eye,
    title: "Innovacion",
    description:
      "Incorporamos las ultimas tendencias y tecnologias en cada diseno arquitectonico.",
  },
  {
    icon: ShieldCheck,
    title: "Responsabilidad",
    description:
      "Comprometidos con la calidad, la sostenibilidad y el cumplimiento de cada compromiso.",
  },
]

export function Nosotros() {
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
      id="nosotros"
      ref={sectionRef}
      className="relative bg-background py-12 lg:py-16 overflow-hidden"
    >
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

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Sobre Nosotros
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Arquitectura con proposito
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
            En ARQEMA STUDIO transformamos ideas en espacios excepcionales. Con
            anos de experiencia, nos especializamos en proyectos innovadores,
            sostenibles y modernos que superan expectativas.
          </p>
        </div>

        {/* Mission & Vision */}
        <div
          className={`mt-16 grid gap-6 md:grid-cols-2 transition-all duration-700 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <div className="group rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-lg lg:p-10">
            <div className="mb-4 inline-flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Mision
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-card-foreground">
              Crear espacios que inspiran
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Disenar y construir proyectos arquitectonicos que combinen
              estetica, funcionalidad y sostenibilidad, superando las
              expectativas de nuestros clientes y contribuyendo al desarrollo
              urbano responsable.
            </p>
          </div>
          <div className="group rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-lg lg:p-10">
            <div className="mb-4 inline-flex items-center gap-2">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Vision
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-card-foreground">
              Liderar la arquitectura del manana
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Ser el estudio de referencia en arquitectura innovadora y
              sostenible, reconocido por la excelencia en el diseno, la
              construccion y la transformacion de entornos que mejoran la calidad
              de vida.
            </p>
          </div>
        </div>

        {/* Values */}
        <div
          className={`mt-16 grid gap-6 sm:grid-cols-3 transition-all duration-700 delay-400 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          {values.map((value) => (
            <div
              key={value.title}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all duration-500 hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-lg font-bold text-card-foreground">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
