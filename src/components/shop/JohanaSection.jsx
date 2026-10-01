import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Tilt3D } from "./Tilt3D";

const EASE_OUT = [0.22, 1, 0.36, 1];

const BIO =
  "Hola, mi nombre es Johana, soy la Directora Comercial de Marsupial. Marsupial nace con el propósito y la misión de ofrecer comodidad en cada paso, mientras la mujer se siente representada. Nuestra historia nace hace más de 20 años con la unión entre dos hermanos.";

const CIFRAS = [
  { valor: "+20", label: "años de historia" },
  { valor: "1.000+", label: "pares al mes" },
  { valor: "35–40", label: "tallas disponibles" },
];

const PROCESO = [
  {
    number: "01",
    title: "Inspiración y diseño",
    summary: "De la observación al boceto.",
    detail:
      "Cada colección nace de observar a la mujer real: cómo camina, qué necesita, qué la hace sentir bien. Estudio tendencias, materiales y siluetas antes de traducir ideas en bocetos. Cada línea tiene una razón: la altura del tacón, la curva de la horma, el detalle de una hebilla.",
  },
  {
    number: "02",
    title: "Selección de materiales",
    summary: "Cuero, forro y componentes elegidos a mano.",
    detail:
      "Antes de cortar el primer par, superviso personalmente cada material que entra al taller. Cueros nacionales seleccionados por textura y flexibilidad, forros que respiran, suelas cómodas y hebillas duraderas.",
  },
  {
    number: "03",
    title: "Producción artesanal",
    summary: "Manos colombianas construyendo cada par.",
    detail:
      "En la fábrica, cada par pasa por manos de artesanos con décadas de oficio. Corte, aparado, montaje y terminación: cada etapa se hace con la atención que merece un producto hecho para durar.",
  },
  {
    number: "04",
    title: "Calidad y entrega",
    summary: "Revisado, empacado y listo para su nueva dueña.",
    detail:
      "Antes de salir de la fábrica, cada par pasa por revisión final: costuras, terminaciones, simetría, comodidad. Solo lo que cumple con nuestros estándares se empaca y despacha.",
  },
];

const PasoProceso = ({ paso, open, onToggle }) => (
  <div className="border-t border-white/15">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-5 py-5 text-left"
    >
      <span className="text-xs tabular-nums text-white/40">{paso.number}</span>
      <span>
        <span className="block font-display text-2xl text-white md:text-3xl">{paso.title}</span>
        <span className="mt-1 block text-sm text-white/55">{paso.summary}</span>
      </span>
      <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-white/60">
        <Plus size={18} />
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.p
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="overflow-hidden pb-6 pl-10 text-sm leading-relaxed text-white/70"
        >
          {paso.detail}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export const JohanaSection = () => {
  const ref = useRef(null);
  const [abierto, setAbierto] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const backY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const frontY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      id="johana"
      ref={ref}
      className="relative overflow-hidden bg-marsupial-purple-dark px-4 py-24 text-white md:px-8 md:py-32"
      aria-labelledby="johana-heading"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
        {/* ─── Collage 3D ─── */}
        <Tilt3D max={7} glare={false} perspective={1200} className="relative mx-auto w-full max-w-lg">
          <div className="relative aspect-[4/5] w-full" style={{ transformStyle: "preserve-3d" }}>
            <motion.figure
              style={{ y: backY, z: -40 }}
              className="absolute right-0 top-0 w-[72%] overflow-hidden rounded-2xl shadow-2xl"
            >
              <img src="/images/familia.jpg" alt="La familia Marsupial" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </motion.figure>
            <motion.figure
              style={{ y: frontY, z: 50 }}
              className="absolute bottom-0 left-0 w-[60%] overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-4 ring-marsupial-purple-dark"
            >
              <img src="/images/johana1.jpeg" alt="Johana Sánchez" loading="lazy" className="aspect-[3/4] w-full object-cover" />
            </motion.figure>
            <div
              className="absolute bottom-[12%] right-[4%] rounded-2xl bg-white px-5 py-4 text-ink shadow-xl"
              style={{ transform: "translateZ(90px)" }}
            >
              <p className="font-brand text-base font-bold uppercase tracking-[0.24em] text-marsupial-purple">Marsupial</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink/60">Bucaramanga · Colombia</p>
            </div>
          </div>
        </Tilt3D>

        {/* ─── Historia ─── */}
        <div className="flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/50"
          >
            La mujer detrás de Marsupial
          </motion.p>
          <motion.h2
            id="johana-heading"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="font-display text-5xl leading-[0.95] md:text-7xl"
          >
            Hola, soy <em>Johana.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
          >
            {BIO}
          </motion.p>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-white/15 py-6">
            {CIFRAS.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <dt className="sr-only">{c.label}</dt>
                <dd className="font-display text-4xl md:text-5xl">{c.valor}</dd>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/55">{c.label}</dd>
              </motion.div>
            ))}
          </dl>

          <div className="mt-10">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">
              Cómo nace cada par
            </p>
            {PROCESO.map((p, i) => (
              <PasoProceso
                key={p.number}
                paso={p}
                open={abierto === i}
                onToggle={() => setAbierto((a) => (a === i ? -1 : i))}
              />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#tienda"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
            >
              Comprar la colección
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:border-white"
            >
              Escríbele a Johana
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JohanaSection;
