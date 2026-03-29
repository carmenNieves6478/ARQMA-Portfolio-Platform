"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { MapPin, Ruler, Users } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const allProjects = [
  {
    title: "Residencia Mirador",
    category: "Residential Architecture, Houses",
    location: "Mazama, United States",
    images: [
      "/images/project-1.jpg",
      "/images/project-1-up.png",
      "/images/project-1-noche.png",
      "/images/project-1-plano.png",
    ],
    description: "Vivienda de lujo con diseno minimalista y vistas panoramicas integrada al paisaje natural.",
    specs: {
      architects: "Prentiss + Balance + Wickline Architects",
      area: "2400 ft²",
      year: "2025",
      photographs: "Andrew Pogue",
      manufacturers: "Kebony, Heath Tile, Sierra Pacific Windows, Taylor Metal",
      lead: "Margo Peterson-Aspholm"
    }
  },
  {
    title: "Oficinas Nexus",
    category: "Commercial & Corporate",
    location: "Seattle, United States",
    images: [
      "/images/project-2.jpg",
      "/images/project-2-up.jpg",
      "/images/project-2-noche.jpg",
      "/images/project-2-plano.png",
    ],
    description: "Espacio de oficinas de vanguardia que redefine la colaboracion y el bienestar laboral.",
    specs: {
      architects: "ARQEMA Studio + Partners",
      area: "5200 ft²",
      year: "2024",
      photographs: "Lina Stock",
      manufacturers: "Steelcase, Interface, Vitra",
      lead: "Carlos Rodriguez"
    }
  },
  {
    title: "Centro Verde",
    category: "Sustainable & Public Architecture",
    location: "Cusco, Peru",
    images: [
      "/images/project-3.jpg",
      "/images/project-3-plano.png"
    ],
    description: "Un hito de sostenibilidad en los Andes, utilizando materiales locales y tecnologia solar.",
    specs: {
      architects: "ARQEMA Studio",
      area: "3100 ft²",
      year: "2025",
      photographs: "Roberto Meza",
      manufacturers: "Local Stone, Bambu Peru, SolarWatt",
      lead: "Ana Morales"
    }
  },
]

export default function ProyectosPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section id="proyectos" className="relative bg-background py-24 lg:py-32">

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
            {/* Section Header */}
            <div
              className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Portafolio
              </span>
              <h1 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
                Proyectos <span className="text-primary">Destacados</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
                Explora nuestra seleccion de obras mas recientes. Cada proyecto representa un compromiso con la excelencia tecnica y la innovacion espacial.
              </p>
            </div>

            {/* Projects List */}
            <div className="mt-16 space-y-32">
              {allProjects.map((project, index) => (
                <div
                  key={project.title}
                  className={`flex flex-col gap-12 transition-all duration-700 lg:flex-row ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                    } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                  style={{ transitionDelay: `${200 + index * 150}ms` }}
                >
                  {/* Media Section */}
                  <div className="flex-1 space-y-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-2xl">
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div className="h-px w-8 bg-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">
                        {project.category}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                      {project.title}
                    </h2>

                    <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold uppercase tracking-wider">{project.location}</span>
                    </div>

                    <p className="mt-6 text-base leading-relaxed text-muted-foreground lg:text-lg">
                      {project.description}
                    </p>

                    {/* Specs Grid */}
                    <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-10">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold uppercase tracking-tighter text-muted-foreground/60">Arquitectos</span>
                          <span className="text-sm font-semibold text-foreground leading-snug">{project.specs.architects}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Ruler className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold uppercase tracking-tighter text-muted-foreground/60">Area Construida</span>
                          <span className="text-sm font-semibold text-foreground leading-snug">{project.specs.area}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
