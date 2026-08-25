import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════════════════════════════════════
   DATOS EDITABLES — Reemplaza con las marcas reales
   ═══════════════════════════════════════════════════════════════════════ */

const PARTNERS = [
  {
    nombre: "Velez",
    logo: "/partners/marca-1.png",
    url: "https://www.velez.com.co/", // opcional — pon null si no quieres que sea clickeable
  },
  {
    nombre: "Bosi Colombia",
    logo: "/partners/marca-2.png",
    url: "https://www.bosi.com.co",
  },
  {
    nombre: "Amare Shoe Lounge",
    logo: "/partners/marca-3.png",
    url: "https://amareshoelounge.com",
  },
  {
    nombre: "Isleñas Crew",
    logo: "/partners/marca-4.png",
    url: "https://lasislenas.com/",
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   LOGO CARD — cada logo individual
   ═══════════════════════════════════════════════════════════════════════ */

const LogoCard = ({ partner }) => {
  const content = (
    <div className="flex h-24 w-48 flex-shrink-0 items-center justify-center rounded-lg bg-white p-6 transition-all duration-300 hover:shadow-md">
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.nombre}
          className="max-h-full max-w-full object-contain opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
          onError={(e) => {
            // Fallback: si la imagen no carga, muestra el nombre
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.innerHTML = `
              <span class="text-sm font-medium text-marsupial-purple/50">
                ${partner.nombre}
              </span>
            `;
          }}
        />
      ) : (
        <span className="text-sm font-medium text-marsupial-purple/50">
          {partner.nombre}
        </span>
      )}
    </div>
  );

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visitar ${partner.nombre}`}
      >
        {content}
      </a>
    );
  }

  return content;
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════════════════ */

export const PartnersSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Duplicamos el array 3 veces para que se vea denso con solo 4 logos
const partnersConRepeticion = [
  ...PARTNERS,
  ...PARTNERS,
  ...PARTNERS,
  ...PARTNERS,
];
const partnersDuplicados = [...partnersConRepeticion, ...partnersConRepeticion];

  return (
    <section
      id="colaboraciones"
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-4 py-20 md:py-28"
      aria-labelledby="colaboraciones-heading"
    >
      <div className="container mx-auto max-w-6xl">
        {/* ─── Header ─── */}
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-marsupial-purple/50"
          >
            <span className="text-marsupial-purple">05</span> / colaboraciones
          </motion.p>

          <motion.h2
            id="colaboraciones-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-4 text-3xl font-bold leading-[1.05] tracking-tight text-marsupial-purple md:text-5xl"
          ></motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
            className="mx-auto max-w-xl text-sm leading-relaxed text-marsupial-purple/70 md:text-base"
          >
            Trabajamos con marcas que valoran la calidad y el diseño colombiano.
            Diseñamos, producimos y entregamos.
          </motion.p>
        </div>

        {/* ─── Carrusel de logos ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative -mx-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Fade gradients a los lados */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

          {/* Track del carrusel */}
          <div
            className="flex w-max gap-6 py-4 animate-marquee-left"
            style={{
              animationDuration: "30s",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {partnersDuplicados.map((partner, index) => (
              <LogoCard key={`${partner.nombre}-${index}`} partner={partner} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
