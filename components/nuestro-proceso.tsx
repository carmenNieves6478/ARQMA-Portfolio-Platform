"use client"

import { useEffect, useRef, useState } from "react"
import { ClipboardCheck, HardHat, Lightbulb, PenTool } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Concepto y Visión",
    description: "Escuchamos tus ideas y necesidades para definir el ADN del proyecto, estableciendo los objetivos estéticos y funcionales.",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "Diseño y Anteproyecto",
    description: "Transformamos las ideas en planos y visualizaciones 3D (renders) para que puedas experimentar el espacio antes de construir.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Proyecto Ejecutivo",
    description: "Desarrollamos toda la documentación técnica, estructural y de ingeniería necesaria para una construcción precisa y segura.",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    title: "Construcción y Dirección",
    description: "Supervisamos cada detalle en la etapa de ejecución, garantizando que la realidad supere las expectativas del diseño original.",
    icon: HardHat,
  },
]

export function NuestroProceso() {
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
    <section id="proceso" ref={sectionRef} className="relative bg-card py-12 lg:py-16 overflow-hidden">
      {/* Background Technology Mesh & Glow */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(255,127,0,0.1) 25%, transparent 25%, transparent 50%, rgba(255,127,0,0.1) 50%, rgba(255,127,0,0.1) 75%, transparent 75%, transparent)`,
            backgroundSize: '100px 100px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      </div> */}
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] rotate-12" />
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className={`mx-auto flex max-w-2xl flex-col items-center text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Metodología de Trabajo
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Nuestro Proceso
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
            Acompañamos cada etapa de tu inversión con un enfoque integral, desde el primer trazo hasta la entrega de llaves.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-background/50 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                {step.number}
              </div>

              {/* Icon */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="h-7 w-7" />
              </div>

              {/* Content */}
              <h3 className="font-serif text-xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              {/* Connector (Desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:absolute lg:top-1/2 lg:-right-4 lg:z-10 lg:block lg:h-px lg:w-8 lg:bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
