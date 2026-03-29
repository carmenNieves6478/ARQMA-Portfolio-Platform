"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, MapPin, ExternalLink } from "lucide-react"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const featuredProjects = [
  {
    title: "Residencia Mirador",
    category: "Residencial",
    location: "Lima, Peru",
    images: [
      "/images/project-1.jpg",
      "/images/project-1-up.png",
      "/images/project-1-noche.png",
      "/images/project-1-plano.png",
    ],
    description: "Vivienda de lujo con diseno minimalista y vistas panoramicas.",
  },
  {
    title: "Oficinas Nexus",
    category: "Comercial",
    location: "Arequipa, Peru",
    images: [
      "/images/project-2.jpg",
      "/images/project-2-up.jpg",
      "/images/project-2-noche.jpg",
      "/images/project-2-plano.png",
    ],
    description: "Espacio de oficinas moderno con interiores abiertos e iluminacion natural.",
  },
  {
    title: "Centro Verde",
    category: "Sostenible",
    location: "Cusco, Peru",
    images: [
      "/images/project-3.jpg",
      "/images/project-3-plano.png"
    ],
    description: "Edificio eco-amigable con fachada verde vertical y certificacion LEED.",
  },
  {
    title: "Torre Altus",
    category: "Corporativo",
    location: "Lima, Peru",
    images: [
      "/images/project-4.jpg"
    ],
    description: "Complejo corporativo de diseno geometrico con fachada de vidrio.",
  },
  {
    title: "Villa Sol",
    category: "Residencial",
    location: "Cusco, Peru",
    images: [
      "/images/project-1.jpg",
      "/images/project-1-noche.png",
      "/images/project-1-plano.png"
    ],
    description: "Villa rustica moderna integrada con el entorno natural de los Andes.",
  },
  {
    title: "Plaza Norte",
    category: "Comercial",
    location: "Lima, Peru",
    images: [
      "/images/project-2.jpg",
      "/images/project-2-up.jpg",
      "/images/project-2-plano.png"
    ],
    description: "Centro comercial con espacios abiertos y areas verdes recreativas.",
  },
]

const AUTO_PLAY_MS = 7000

function ProjectCard({ project, index, isActive, onClick, isVisible }: { project: any, index: number, isActive: boolean, onClick: () => void, isVisible: boolean }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let interval: any
    if (isHovered && project.images.length > 1) {
      interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % project.images.length)
      }, 1200)
    } else {
      setImgIndex(0)
    }
    return () => clearInterval(interval)
  }, [isHovered, project.images.length])

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative cursor-pointer perspective-[1000px] transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
        }`}
      style={{ transitionDelay: `${(index + 1) * 100}ms` }}
    >
      <div
        className={`relative isolate aspect-[4/5] overflow-hidden rounded-2xl bg-card border border-border transition-all duration-700 transform-gpu ${isActive ? "ring-2 ring-primary ring-offset-4 ring-offset-background scale-95" : "hover:-translate-y-1 hover:scale-[0.98]"
          }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {project.images.map((img: string, i: number) => (
          <Image
            key={img}
            src={img}
            alt={`${project.title} - Vista ${i + 1}`}
            fill
            className={`rounded-2xl object-cover transition-all duration-1000 ${i === imgIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

        {/* Info Content */}
        <div className="absolute inset-0 rounded-2xl flex flex-col justify-end p-4 text-white">
          <span className="mb-1 text-[8px] font-bold uppercase tracking-wider text-primary">
            {project.category}
          </span>
          <h3 className="font-serif text-sm font-bold leading-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          {/* Details Link - Appears on Hover */}
          <a
            href="/proyectos"
            className="mt-3 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-tight backdrop-blur-md transition-all hover:bg-primary hover:text-primary-foreground opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            Ver más detalles
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

export function ProyectosDestacados() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeThumbIndex, setActiveThumbIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

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

  useEffect(() => {
    if (!carouselApi || !isVisible) return

    const intervalId = setInterval(() => {
      carouselApi.scrollNext()
    }, AUTO_PLAY_MS)

    return () => clearInterval(intervalId)
  }, [carouselApi, isVisible])

  return (
    <section id="proyectos" ref={sectionRef} className="relative overflow-hidden bg-background py-12 lg:py-16">
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
        {/* Header Centered */}
        <div className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Portafolio Seleccionado
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Proyectos Destacados
          </h2>
          <p className="mt-4 text-muted-foreground">
            Una seleccion de nuestras obras mas emblematicas, explorando la convergencia entre forma y funcion.
          </p>
        </div>

        {/* Main Carousel Viewer - Fade Animation */}
        <div className={`mt-16 transition-all duration-5000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
          <Carousel
            setApi={setCarouselApi}
            opts={{ loop: true, duration: 50 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card"
          >
            <CarouselContent className="ml-0">
              {featuredProjects.map((project, index) => (
                <CarouselItem key={project.title} className="pl-0">
                  <div className="relative aspect-[16/9] lg:aspect-[21/9]">
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Project Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
                      <div className="max-w-3xl">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                            {project.category}
                          </span>
                        </div>
                        <h3 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-6xl">
                          {project.title}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-white/80">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium uppercase tracking-wider lg:text-base">{project.location}</span>
                        </div>
                        <p className="mt-6 hidden max-w-xl text-base text-white/70 sm:block lg:text-lg">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="top-auto bottom-8 left-auto right-24 h-12 w-12 -translate-y-0 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md hover:border-primary hover:bg-primary" />
            <CarouselNext className="top-auto bottom-8 right-8 h-12 w-12 -translate-y-0 rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md hover:border-primary hover:bg-primary" />
          </Carousel>
        </div>

        {/* Thumbnails Grid (Selectors) */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isActive={index === activeThumbIndex}
              onClick={() => {
                setActiveThumbIndex(index)
                carouselApi?.scrollTo(index)
              }}
              isVisible={isVisible}
            />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <a href="/proyectos" className="group flex items-center gap-2 text-sm font-semibold text-primary">
            Explorar Catálogo Completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
