import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import productosData from "@/data/productos.json";
import { useShop } from "@/shopStore";
import { formatPrecio } from "@/lib/shop";

const EASE_OUT = [0.22, 1, 0.36, 1];
const PRODUCTOS = productosData.productos.filter((p) => p.destacado);
const STEP = 360 / PRODUCTOS.length;

const useRingSize = () => {
  const get = () =>
    typeof window !== "undefined" && window.innerWidth < 768
      ? { card: 150, radius: 210 }
      : { card: 210, radius: 320 };
  const [size, setSize] = useState(get);
  useEffect(() => {
    const onResize = () => setSize(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
};

/* ─────────────── Un zapato dentro del anillo ─────────────── */

const RingItem = ({ product, index, rotation, card, radius, onOpen }) => {
  const angle = index * STEP;
  // Más visible cuanto más de frente está
  const facing = useTransform(rotation, (r) =>
    Math.cos(((r + angle) * Math.PI) / 180),
  );
  const opacity = useTransform(facing, [-1, 0, 1], [0.25, 0.45, 1]);
  const scale = useTransform(facing, [-1, 1], [0.85, 1]);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(product)}
      aria-label={`Ver ${product.nombre}`}
      className="absolute left-1/2 top-1/2 focus:outline-none"
      style={{
        width: card,
        height: card * 1.15,
        marginLeft: -card / 2,
        marginTop: (-card * 1.15) / 2,
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{ opacity, scale }}
        className="flex h-full w-full items-center justify-center rounded-2xl bg-stone shadow-[0_30px_60px_-30px_rgba(22,20,28,0.45)]"
      >
        <img
          src={product.fotos[0]}
          alt=""
          draggable={false}
          className="product-img h-[88%] w-[88%] select-none object-contain"
        />
      </motion.div>
    </motion.button>
  );
};

/* ─────────────── Hero ─────────────── */

export const Hero3D = () => {
  const reduced = useReducedMotion();
  const openProducto = useShop((s) => s.openProducto);
  const { card, radius } = useRingSize();

  const rotation = useMotionValue(0);
  const smooth = useSpring(rotation, { stiffness: 60, damping: 18 });
  const paused = useRef(false);
  const dragging = useRef(false);
  const lastPan = useRef(0);
  const [active, setActive] = useState(0);

  useAnimationFrame((_, delta) => {
    if (reduced || paused.current || dragging.current) return;
    rotation.set(rotation.get() - delta * 0.012);
  });

  useMotionValueEvent(smooth, "change", (r) => {
    const i = ((Math.round(-r / STEP) % PRODUCTOS.length) + PRODUCTOS.length) % PRODUCTOS.length;
    setActive((prev) => (prev === i ? prev : i));
  });

  // Inclinación leve del escenario con el mouse
  const tiltX = useMotionValue(0);
  const tiltSpring = useSpring(tiltX, { stiffness: 80, damping: 20 });
  const stageRotateX = useTransform(tiltSpring, (v) => -8 + v);

  // Parallax al hacer scroll
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const ringY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const actual = PRODUCTOS[active];

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative overflow-hidden bg-paper"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        tiltX.set(((e.clientY / window.innerHeight) - 0.5) * -8);
      }}
    >
      <div className="mx-auto grid min-h-[calc(100svh-6.25rem)] max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-12 pt-10 md:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-0 lg:pb-16">
        {/* ─── Texto ─── */}
        <motion.div style={{ y: textY }} className="relative z-10 order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-marsupial-purple" />
            Nueva colección
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
            className="font-display text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.92] tracking-[-0.02em] text-ink"
          >
            Comodidad
            <br />
            en cada <em className="text-marsupial-purple">paso.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.3 }}
            className="mt-6 max-w-md text-base leading-relaxed text-ink/65 md:text-lg"
          >
            Calzado femenino hecho a mano en Bucaramanga, en cuero natural.
            Diseñado por Johana Sánchez para la mujer real.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.45 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#tienda"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-white transition-all hover:gap-3 hover:bg-marsupial-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
            >
              Comprar ahora
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#johana"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink/5"
            >
              Conoce a Johana
            </a>
          </motion.div>
        </motion.div>

        {/* ─── Anillo 3D ─── */}
        <motion.div
          style={{ y: ringY }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
          className="relative order-1 flex flex-col items-center lg:order-2"
        >
          <motion.div
            className="relative h-[340px] w-full cursor-grab touch-pan-y active:cursor-grabbing md:h-[480px]"
            style={{ perspective: 1400 }}
            onHoverStart={() => (paused.current = true)}
            onHoverEnd={() => (paused.current = false)}
            onPanStart={() => (dragging.current = true)}
            onPan={(_, info) => rotation.set(rotation.get() + info.delta.x * 0.35)}
            onPanEnd={(_, info) => {
              dragging.current = false;
              lastPan.current = Date.now();
              // Encaja en el zapato más cercano, con inercia
              const target = rotation.get() + info.velocity.x * 0.08;
              rotation.set(Math.round(target / STEP) * STEP);
            }}
          >
            {/* Sombra de piso */}
            <div
              aria-hidden
              className="absolute bottom-[6%] left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[100%] bg-ink/15 blur-2xl"
            />
            <motion.div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                rotateX: stageRotateX,
                rotateY: smooth,
              }}
            >
              {PRODUCTOS.map((p, i) => (
                <RingItem
                  key={p.id}
                  product={p}
                  index={i}
                  rotation={smooth}
                  card={card}
                  radius={radius}
                  onOpen={(p) => {
                    // Un arrastre no debe abrir la ficha
                    if (Date.now() - lastPan.current > 200) openProducto(p);
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Producto al frente */}
          <div className="mt-2 flex h-12 flex-col items-center text-center" aria-live="polite">
            <motion.p
              key={actual.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-ink"
            >
              {actual.nombre}
            </motion.p>
            <motion.p
              key={`${actual.id}-p`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="text-sm tabular-nums text-ink/55"
            >
              {formatPrecio(actual.precio)}
            </motion.p>
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ink/35">
            Arrastra para girar · Toca para ver
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero3D;
