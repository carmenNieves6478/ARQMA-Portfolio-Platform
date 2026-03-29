"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const posts = [
  {
    title: "Tendencias en arquitectura sostenible para 2026",
    summary:
      "Descubre las tendencias mas importantes en construccion verde, desde materiales reciclados hasta edificios de energia cero.",
    image: "/images/blog-2.jpg",
    date: "15 Feb 2026",
    category: "Sostenibilidad",
  },
  {
    title: "La importancia de los planos en un proyecto exitoso",
    summary:
      "Un buen plano es la columna vertebral de cualquier construccion. Aprende por que la planificacion detallada marca la diferencia.",
    image: "/images/blog-1.jpg",
    date: "28 Ene 2026",
    category: "Planificacion",
  },
  {
    title: "Diseno de interiores: tendencias que transforman hogares",
    summary:
      "Exploramos las claves del diseno interior contemporaneo: materiales naturales, paletas calidas y espacios multifuncionales.",
    image: "/images/blog-3.jpg",
    date: "10 Ene 2026",
    category: "Interiorismo",
  },
]

export default function BlogPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section id="blog" className="relative bg-secondary py-24 lg:py-32">
          {/* Fondos difuminados */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Glow inferior derecho */}
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] rotate-12" />
            {/* Glow superior izquierdo */}
            <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          </div>
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Section Header */}
            <div
              className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Blog
              </span>
              <h1 className="mt-3 font-serif text-3xl font-bold text-secondary-foreground sm:text-4xl lg:text-5xl text-balance">
                Ideas y conocimiento
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
                Articulos, tendencias y novedades del mundo de la arquitectura y el diseno.
              </p>
            </div>

            {/* Blog Grid */}
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {posts.map((post, index) => (
                <article
                  key={post.title}
                  className={`group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-700 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 ${isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                    }`}
                  style={{ transitionDelay: `${200 + index * 150}ms` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <time className="text-xs">{post.date}</time>
                    </div>
                    <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-card-foreground transition-colors duration-300 group-hover:text-primary text-pretty">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.summary}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-2">
                      Leer mas
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
