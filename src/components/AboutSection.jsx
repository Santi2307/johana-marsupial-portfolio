import { cn } from "@/lib/utils";
import usePhotoStore from "@/store";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────── Content ─────────────────────────── */

const PHOTOS = [
  { src: "/images/johana1.jpeg" },
  { src: "/images/johana2.jpeg" },
];


const BIO = [
  "Hola mi nombre es Johana, soy la Directora Comercial de Marsupial. Marsupial nace con el proposito y la mision de ofrecer comodidad en cada paso, mientras la mujer se siente representada. Nuestra historia nace desde hace mas de 20 años con la union entre dos hermanos.",
];

const SKILLS = [
  {
    number: "01",
    title: "Inspiración y Diseño",
    summary: "De la observacion al boceto.",
    detail:
      " Cada colección nace de observar a la mujer real, cómo camina, qué necesita, qué la hace sentir bien. Estudio tendencias, materiales y siluetas antes de traducir ideas en bocetos. Cada línea del dibujo tiene una razón: la altura del tacón, la curva de la horma, el detalle de una hebilla. Aquí es donde nace el ADN de cada par de zapatos que llevan el nombre de Marsupial.",
    tags: ["Bocetos", "Inspiración", "Tendencias", "Diseño"],
  },
  {
    number: "02",
    title: "Selección de Materiales",
    summary: "Cuero, forro y componentes elegidos a mano.",
    detail:
      "Antes de cortar el primer par, superviso personalmente cada material que entra al taller. Cueros nacionales seleccionados por textura y flexibilidad, forros que respiran, suelas cómodas y hebillas duraderas. La calidad de un zapato empieza mucho antes de la producción — empieza en la mesa donde decido qué materiales merecen llevar el nombre Marsupial.",
    tags: ["Cuero Natural", "Materiales", "Curaduria", "Calidad"],
  },
  {
    number: "03",
    title: "Producción Artesanal",
    summary: "Manos colombianas construyendo cada par.",
    detail:
      "En la fabrica, cada par pasa por manos de artesanos con décadas de oficio. Corte, aparado, montaje y terminación, cada etapa se hace con la atención que merece un producto hecho para durar. No producimos en masa: cada zapato tiene el tiempo que necesita para salir perfecto. Aquí es donde el diseño se convierte en realidad.",
    tags: ["Artesanos", "Produccion", "Oficio", "Bucaramanga"],
  },
  {
    number: "04",
    title: "Control de Calidad y Entrega",
    summary: "Revisado, empacado y listo para su nueva dueña.",
    detail:
      "Antes de que cualquier par salga de la fabrica, pasa por revisión final: costuras, terminaciones, simetría, comodidad. Solo lo que cumple con nuestros estándares se empaca y despacha. Ya sea para nuestra tienda o un distribuidor internacional, cada zapato Marsupial llega con la promesa de ofrecer comodidad y lujo.",
    tags: ["Calidad", "Empaque", "Despacho", "Cliente Final"],
  },
];

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 80;
const EASE_OUT = [0.22, 1, 0.36, 1];

/* ─────────────────────────── Photo gallery ─────────────────────────── */

const PhotoGallery = () => {
  const { photos, currentPhotoIndex, setNextPhoto, setPrevPhoto } =
    usePhotoStore();
  const reducedMotion = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  const next = useCallback(() => {
    setDirection(1);
    setNextPhoto();
  }, [setNextPhoto]);

  const prev = useCallback(() => {
    setDirection(-1);
    setPrevPhoto();
  }, [setPrevPhoto]);

  useEffect(() => {
    if (isPaused || reducedMotion || photos.length <= 1) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, reducedMotion, photos.length, next]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onKey = (e) => {
      if (!node.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (!photos.length) return null;

  const current = photos[currentPhotoIndex];

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div
      ref={containerRef}
      className="group relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos of Santiago"
    >
      {/* Frame number — top left */}
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          <span className="text-foreground">
            {String(currentPhotoIndex + 1).padStart(2, "0")}
          </span>
          <span className="opacity-40">
            {" "}
            / {String(photos.length).padStart(2, "0")}
          </span>
        </span>
        <span className="opacity-50"></span>
      </div>

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg ring-1 ring-border">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.img
            key={current.src ?? current}
            src={current.src ?? current}
            alt={current.alt ?? `Photo ${currentPhotoIndex + 1}`}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-cover"
            variants={slideVariants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: EASE_OUT }}
            drag={photos.length > 1 && !reducedMotion ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x > SWIPE_THRESHOLD) prev();
              else if (info.offset.x < -SWIPE_THRESHOLD) next();
            }}
          />
        </AnimatePresence>

        {/* Caption bar overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.alt}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-4 right-4 z-10 text-xs text-white/80"
          >
            {current.alt}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls below */}
      <div className="mt-4 flex items-center justify-between">
        <div
          className="flex items-center gap-1"
          role="tablist"
          aria-label="Photo indicators"
        >
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              onClick={() => {
                setDirection(i > currentPhotoIndex ? 1 : -1);
                // jump to specific index — uses sequential next/prev to stay simple
                const diff = i - currentPhotoIndex;
                if (diff > 0) for (let k = 0; k < diff; k++) setNextPhoto();
                else for (let k = 0; k < -diff; k++) setPrevPhoto();
              }}
              aria-current={i === currentPhotoIndex}
              aria-label={`Go to photo ${i + 1}`}
              className={cn(
                "h-px transition-all duration-500",
                i === currentPhotoIndex
                  ? "w-12 bg-foreground"
                  : "w-6 bg-muted-foreground/40 hover:bg-muted-foreground",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Screen-reader live region */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        Photo {currentPhotoIndex + 1} of {photos.length}
      </span>
    </div>
  );
};

/* ─────────────────────────── Skill row (editorial style) ─────────────────────────── */

const SkillRow = ({ skill, index, isOpen, onToggle, isLast }) => {
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const onMouseMove = useCallback(
    (e) => {
      if (reducedMotion) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY, reducedMotion],
  );
  const glow = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, hsl(var(--primary) / 0.07), transparent 70%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.6, ease: EASE_OUT }}
      className="group relative"
    >
      {/* Línea vertical del timeline */}
      {!isLast && (
        <svg
          aria-hidden
          className="pointer-events-none absolute left-[7px] top-8 h-full w-16 -translate-x-1/2"
          preserveAspectRatio="none"
          viewBox="0 0 40 100"
        >
          <path
            d={
              index % 2 === 0
                ? "M 20 0 Q 40 25, 20 50 T 20 100"
                : "M 20 0 Q 0 25, 20 50 T 20 100"
            }
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-marsupial-purple/30"
          />
        </svg>
      )}

      {/* Dot del timeline */}
      <div
        aria-hidden
        className={cn(
          "absolute left-0 top-8 h-[15px] w-[15px] rounded-full border-2 transition-all duration-300",
          isOpen
            ? "border-marsupial-purple bg-marsupial-purple scale-110"
            : "border-border bg-background group-hover:border-marsupial-purple/60",
        )}
      />

      {/* Cursor spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glow }}
      />

      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={isOpen}
        aria-controls={`skill-detail-${index}`}
        className="relative z-10 grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-6 py-6 pl-10 pr-1 text-left transition-colors hover:text-foreground"
      >
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {skill.number}
        </span>
        <div>
          <h4 className="text-lg font-semibold leading-tight md:text-xl">
            {skill.title}
          </h4>
          <p
            className={cn(
              "mt-1 text-sm text-muted-foreground transition-opacity duration-300",
              isOpen && "opacity-0 md:opacity-60",
            )}
          >
            {skill.summary}
          </p>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="text-muted-foreground transition-colors group-hover:text-foreground"
          aria-hidden
        >
          <Plus size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`skill-detail-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="relative z-10 overflow-hidden"
          >
            <div className="grid grid-cols-[auto_1fr_auto] gap-6 pb-6 pl-10 pr-1">
              <span aria-hidden />
              <div className="max-w-2xl space-y-3">
                <p className="text-sm leading-relaxed text-foreground/80">
                  {skill.detail}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-card/40 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span aria-hidden />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};



/* ─────────────────────────── Main section ─────────────────────────── */

export const AboutSection = () => {
  const { setPhotos } = usePhotoStore();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  // Open the first skill by default — invites interaction without forcing it
  const [openSkill, setOpenSkill] = useState(0);
  const handleToggleSkill = useCallback((index) => {
    setOpenSkill((current) => (current === index ? -1 : index));
  }, []);

  useEffect(() => {
    setPhotos(PHOTOS);
  }, [setPhotos]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-24 md:py-32"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto max-w-6xl">
        {/* ─── Section header ─── */}
        <div className="mb-16 flex items-end justify-between gap-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              <span className="text-marsupial-purple">02</span> / about
            </motion.p>
            <motion.h2
              id="about-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl"
            >
              Acerca de
            </motion.h2>
          </div>

          {/* Right-aligned hint, desktop only */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden max-w-xs text-right text-xs leading-relaxed text-muted-foreground md:block"
          >
            Conoce un poco mas de mí.
          </motion.div>
        </div>

        {/* ─── Two-column body ─── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* LEFT — photos + meta + bio + CTAs */}
          <div className="md:col-span-5 lg:col-span-5">
            <PhotoGallery />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 space-y-4"
            >
              {BIO.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="text-[15px] leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
              >
                Contactame
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>
          </div>

          {/* RIGHT — expertise list (editorial style) */}
          <div className="md:col-span-7 lg:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
            >
              Procesos detras de nuestros productos.
            </motion.p>

            <div role="list" aria-label="Areas of expertise">
              {SKILLS.map((skill, i) => (
                <SkillRow
                  key={skill.number}
                  skill={skill}
                  index={i}
                  isOpen={openSkill === i}
                  onToggle={handleToggleSkill}
                  isLast={i === SKILLS.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
