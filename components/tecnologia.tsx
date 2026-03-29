"use client"

import { useEffect, useRef, useState } from "react"
import { Box, Code, Cpu, Layers } from "lucide-react"

const technologies = [
  {
    title: "Precisión 2D",
    tools: "AutoCAD",
    description: "Modelado bidimensional riguroso para la documentación técnica y planos de detalle con estándares internacionales.",
    icon: Layers,
  },
  {
    title: "Ecosistema BIM",
    tools: "Revit & ArchiCAD",
    description: "Modelado de información para la construcción que permite coordinar arquitectura, estructuras e ingenierías en un solo modelo vivo.",
    icon: Box,
  },
  {
    title: "Optimización de Datos",
    tools: "Programación BIM",
    description: "Implementamos scripts y automatización para optimizar tiempos, reducir errores y gestionar metrados precisos automáticamente.",
    icon: Code,
  },
  {
    title: "Visualización Inmersiva",
    tools: "Blender & Unity",
    description: "Renderizado fotorrealista y experiencias de realidad virtual que permiten recorrer el proyecto en tiempo real antes de la primera piedra.",
    icon: Cpu,
  },
]

export function Tecnologia() {
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
    <section id="tecnologia" ref={sectionRef} className="relative bg-background py-12 lg:py-16 overflow-hidden">
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
        {/* Section body-technology */}
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Header + Left Content */}
          <div className={`transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Vanguardia Digital
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Tecnología que impulsa la arquitectura
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              No solo diseñamos espacios, construimos entornos inteligentes. Utilizamos las herramientas de software más potentes del mercado para garantizar precisión milimétrica.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {["BIM", "VR", "VDC", "Real-Time Rendering"].map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {technologies.map((tech, index) => (
              <div
                key={tech.title}
                className={`group relative rounded-2xl border border-border bg-card p-6 transition-all duration-700 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <tech.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  {tech.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-primary">
                  {tech.tools}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
