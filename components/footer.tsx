import { ArrowUp } from "lucide-react"

const links = {
  navegacion: [
    { label: "Inicio", href: "/" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Servicios", href: "/#servicios" },
  ],
  servicios: [
    { label: "Construccion", href: "/#servicios" },
    { label: "Saneamiento", href: "/#servicios" },
    { label: "Diseno y Planos", href: "/#servicios" },
    { label: "Asesoria Tecnica", href: "/#servicios" },
  ],
  recursos: [
    { label: "Proyectos", href: "/proyectos" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="font-serif text-lg font-bold text-primary-foreground">
                  A
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-card-foreground">
                  ARQEMA
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  Studio
                </span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Estudio de arquitectura especializado en diseno y construccion de
              proyectos innovadores, sostenibles y modernos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-card-foreground">
              Navegacion
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {links.navegacion.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-card-foreground">
              Servicios
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {links.servicios.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-card-foreground">
              Recursos
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {links.recursos.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ARQEMA STUDIO. Todos los derechos
            reservados.
          </p>
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            Volver arriba
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
