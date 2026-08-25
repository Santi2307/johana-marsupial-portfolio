import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Package,
  Factory,
  Clock,
  Handshake,
  MapPin,
  FileText,
  Calendar,
  MessageCircle,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const EASE_OUT = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════════════════════════════════════
   DATOS EDITABLES — Personaliza estos objetos
   ═══════════════════════════════════════════════════════════════════════ */

// Los 4 bloques principales de "Qué ofrecemos"
const OFERTAS = [
  {
    icon: Package,
    titulo: "Pedidos personalizados",
    lineas: [
      "Mínimo por referencia: 12 pares",
      "Variedad de tallas y colores por diseño",
    ],
  },
  {
    icon: Factory,
    titulo: "Producción propia",
    lineas: [
      "Taller propio en Bucaramanga",
      "Capacidad de 5.000+ pares mensuales",
    ],
  },
  {
    icon: Clock,
    titulo: "Tiempos de entrega",
    lineas: [
      "30-45 días para pedidos regulares",
      "Órdenes urgentes bajo consulta",
    ],
  },
  {
    icon: Handshake,
    titulo: "Términos comerciales",
    lineas: [
      "Precios mayoristas competitivos",
      "Plazos de pago negociables",
      "Envíos nacionales e internacionales",
    ],
  },
];

// Categorías de producto disponibles para mayoristas
const CATEGORIAS = [
  "Sandalias",
  "Baletas",
  "Tacones",
  "Plataformas",
  "Botas",
  "Casual",
];

// Ubicación física de Marsupial (dirección del taller/oficina)
const UBICACION = {
  direccion: "Cl. 21 #20-55",
  sector: "Comuna 4 Occidental",
  ciudad: "Bucaramanga, Santander",
  pais: "Colombia",
};

// Los 3 botones de acción
const CTAS = [
  {
    icon: FileText,
    label: "Solicitar catálogo mayorista",
    href: "mailto:johana@marsupial.com.co?subject=Solicitud%20de%20catálogo%20mayorista",
    primary: true,
  },
  {
    icon: Calendar,
    label: "Agendar reunión",
    href: "mailto:johana@marsupial.com.co?subject=Agendar%20reunión%20comercial",
    primary: false,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Business",
    href: "https://wa.me/573174385716?text=Hola%20Johana,%20estoy%20interesado%20en%20trabajar%20con%20Marsupial%20como%20mayorista.",
    primary: false,
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   SUBCOMPONENTES
   ═══════════════════════════════════════════════════════════════════════ */

const OfertaCard = ({ oferta, delay }) => {
  const Icon = oferta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className="group relative overflow-hidden rounded-2xl border border-marsupial-purple/10 bg-white p-6 transition-all hover:border-marsupial-purple/30 hover:shadow-lg"
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-marsupial-purple/10 text-marsupial-purple transition-colors group-hover:bg-marsupial-purple group-hover:text-white">
        <Icon size={20} strokeWidth={1.5} />
      </div>

      <h3 className="mb-3 text-lg font-semibold text-marsupial-purple">
        {oferta.titulo}
      </h3>

      <ul className="space-y-1.5">
        {oferta.lineas.map((linea, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-marsupial-purple/70"
          >
            <CheckCircle2
              size={14}
              className="mt-0.5 flex-shrink-0 text-marsupial-purple/40"
            />
            <span>{linea}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════════════════ */

export const SkillsSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Construye la URL de Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${UBICACION.direccion}, ${UBICACION.sector}, ${UBICACION.ciudad}, ${UBICACION.pais}`,
  )}`;

  return (
    <section
      id="wholesale"
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-4 py-24 md:py-32"
      aria-labelledby="wholesale-heading"
    >
      <div className="container mx-auto max-w-6xl">
        {/* ─── HEADER ─── */}
        <div className="mb-16 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-marsupial-purple/50"
          >
            <span className="text-marsupial-purple">03</span> / wholesale
          </motion.p>

          <motion.h2
            id="wholesale-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-6 text-4xl font-bold leading-[1.05] tracking-tight text-marsupial-purple md:text-6xl"
          >
            Trabajemos Juntos.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
            className="text-base leading-relaxed text-marsupial-purple/70 md:text-lg"
          >
            Marsupial trabaja con boutiques multimarca, tiendas departamentales
            y distribuidores en Colombia y Latinoamérica. Producción propia,
            calidad garantizada y términos comerciales flexibles.
          </motion.p>
        </div>

        {/* ─── QUÉ OFRECEMOS — Grid de 4 ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-20"
        >
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
            Qué ofrecemos
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {OFERTAS.map((oferta, i) => (
              <OfertaCard key={oferta.titulo} oferta={oferta} delay={i * 0.1} />
            ))}
          </div>
        </motion.div>

        {/* ─── CATEGORÍAS + UBICACIÓN — Grid de 2 ─── */}
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Categorías disponibles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
              Categorías disponibles
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-marsupial-purple/20 bg-white px-4 py-2 text-sm font-medium text-marsupial-purple transition-colors hover:border-marsupial-purple/50 hover:bg-marsupial-purple/5"
                >
                  {cat}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Nuestra ubicación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
          >
            <p className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
              <MapPin size={11} />
              Nuestra ubicación
            </p>
            <p className="mb-3 text-sm text-marsupial-purple/70">
              Taller y oficina comercial:
            </p>
            <address className="not-italic text-base leading-relaxed text-marsupial-purple">
              <span className="block font-medium">{UBICACION.direccion}</span>
              <span className="block text-marsupial-purple/70">
                {UBICACION.sector}
              </span>
              <span className="block text-marsupial-purple/70">
                {UBICACION.ciudad}
              </span>
              <span className="block text-marsupial-purple/70">
                {UBICACION.pais}
              </span>
            </address>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-marsupial-purple transition-colors hover:text-marsupial-purple-soft"
            >
              Ver en Google Maps
              <ArrowUpRight size={12} />
            </a>
          </motion.div>
        </div>

        {/* ─── CTAs — 3 botones ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="border-t border-marsupial-purple/10 pt-12"
        >
          <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
            ¿Interesado en trabajar con nosotros?
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            {CTAS.map((cta) => {
              const Icon = cta.icon;
              return (
                <a
                  key={cta.label}
                  href={cta.href}
                  target={cta.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    cta.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={
                    cta.primary
                      ? "group inline-flex items-center gap-2 rounded-full bg-marsupial-purple px-6 py-3 text-sm font-medium text-white transition-all hover:gap-3 hover:bg-marsupial-purple-soft hover:shadow-xl hover:shadow-marsupial-purple/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40"
                      : "group inline-flex items-center gap-2 rounded-full border border-marsupial-purple/30 px-6 py-3 text-sm font-medium text-marsupial-purple transition-all hover:border-marsupial-purple/60 hover:bg-marsupial-purple/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40"
                  }
                >
                  <Icon size={14} />
                  {cta.label}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
