import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE_OUT = [0.22, 1, 0.36, 1];

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-marsupial-purple px-4"
    >
      <div className="container mx-auto max-w-4xl text-center">
        {/* Preheader */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-white/50"
        >
          <span className="text-white">01</span>
          <span className="mx-2 opacity-40">/</span>
          Inicio
        </motion.p>

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
          className="text-5xl font-normal leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl"
        >
          Hola, soy <span className="text-white">Johana.</span>
        </motion.h1>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.3 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          Fundadora y Directora Creativa de Calzado Marsupial.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.5 }}
          className="mt-10 flex justify-center"
        >
          <a
            href="#catalogo"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-marsupial-purple transition-all hover:gap-3 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Conoce nuestro catalogo
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
