import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Nosotros } from "@/components/nosotros"
import { Servicios } from "@/components/servicios"
import { ProyectosDestacados } from "@/components/proyectos-destacados"
import { NuestroProceso } from "@/components/nuestro-proceso"
import { Tecnologia } from "@/components/tecnologia"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Nosotros />
        <Servicios />
        <ProyectosDestacados />
        <NuestroProceso />
        <Tecnologia />
      </main>
      <Footer />
    </>
  )
}
