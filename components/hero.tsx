"use client"

import { useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"
import Image from "next/image"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-building.jpg"
          alt="Edificio moderno de arquitectura contemporanea"
          fill
          className="object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-foreground/60" /> */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-widest text-white/80">
              Arquitectura e Innovacion
            </span>
          </div>
        </div>

        <h1
          className={`font-serif text-3xl font-bold leading-tight text-white transition-all duration-1000 delay-200 sm:text-4xl md:text-5xl lg:text-6xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
           Construimos el{" "}
          <span className="text-primary">futuro</span>
          <br />
          que imaginas
        </h1>

        <p
          className={`mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 transition-all duration-1000 delay-400 sm:text-lg md:text-xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          Diseno arquitectonico innovador, sostenible y moderno.
          Transformamos espacios con profesionalismo y vision.
        </p>

        <div
          className={`mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <a
            href="/contacto"
            className="rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Iniciar Proyecto
          </a>
          <a
            href="/proyectos"
            className="rounded-lg border border-[#a6a6a6] bg-[#a6a6a6] px-8 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:bg-[#c2c3c6] hover:-translate-y-0.5"
          >
            Ver Proyectos
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a
          href="#nosotros"
          className="flex flex-col items-center gap-2 text-white/60 transition-colors duration-300 hover:text-white"
          aria-label="Ir a Nosotros"
        >
          <span className="text-xs uppercase tracking-widest">Descubrir</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
