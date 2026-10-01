import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Heart, Minus, Plus, Share2, Truck, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useShop } from "@/shopStore";
import { formatPrecio, whatsappUrl, ENVIO_GRATIS_DESDE } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { Tilt3D } from "./Tilt3D";

const useLockScroll = (locked) => {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
};

const Body = ({ product, onClose }) => {
  const addItem = useShop((s) => s.addItem);
  const toggleFavorito = useShop((s) => s.toggleFavorito);
  const esFavorito = useShop((s) => s.favoritos.includes(product.id));

  const [color, setColor] = useState(0);
  const [talla, setTalla] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState(false);
  const shake = useAnimationControls();

  const colorActual = product.colores?.[color];

  const agregar = () => {
    if (!talla) {
      setError(true);
      shake.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } });
      return;
    }
    addItem(product, { color: colorActual?.nombre, talla, cantidad });
    onClose();
  };

  const mensaje = `Hola Johana, me interesa ${product.nombre} (${product.referencia})${
    colorActual ? ` en color ${colorActual.nombre}` : ""
  }${talla ? `, talla ${talla}` : ""}.`;

  const compartir = async () => {
    const data = { title: `${product.nombre} · Marsupial`, text: product.descripcion, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // cancelado
      }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="grid max-h-[92svh] grid-cols-1 overflow-y-auto md:max-h-[88vh] md:grid-cols-2 md:overflow-hidden">
      {/* Imagen 3D */}
      <div className="bg-stone p-6 md:p-10">
        <Tilt3D max={14} perspective={700} className="h-full" innerClassName="flex aspect-square items-center justify-center bg-stone md:aspect-auto md:h-full">
          <motion.img
            key={product.id}
            initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            src={product.fotos?.[0]}
            alt={product.nombre}
            className="product-img max-h-full w-full object-contain"
            style={{ transform: "translateZ(60px)" }}
          />
        </Tilt3D>
      </div>

      {/* Info */}
      <div className="flex flex-col p-6 md:overflow-y-auto md:p-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45">
          {product.referencia}
          {product.nuevo && <span className="ml-2 text-marsupial-purple">· Nuevo</span>}
        </p>
        <h2 id="product-title" className="mt-2 font-display text-4xl leading-[1.05] text-ink md:text-5xl">
          {product.nombre}
        </h2>
        <p className="mt-3 text-xl font-medium tabular-nums text-ink">{formatPrecio(product.precio)}</p>
        <p className="mt-4 text-sm leading-relaxed text-ink/65">{product.descripcion}</p>

        {product.colores?.length > 0 && (
          <div className="mt-7">
            <p className="mb-3 text-xs font-medium text-ink">
              Color: <span className="font-normal text-ink/60">{colorActual?.nombre}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {product.colores.map((c, i) => (
                <button
                  key={c.nombre}
                  type="button"
                  onClick={() => setColor(i)}
                  aria-label={c.nombre}
                  aria-pressed={color === i}
                  className={cn(
                    "h-8 w-8 rounded-full ring-1 ring-ink/15 transition-all",
                    color === i && "ring-2 ring-ink ring-offset-2 ring-offset-white",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {product.tallas?.length > 0 && (
          <motion.div animate={shake} className="mt-7">
            <div className="mb-3 flex items-baseline justify-between">
              <p className={cn("text-xs font-medium", error ? "text-red-600" : "text-ink")}>
                {error ? "Elige tu talla" : "Talla"}
              </p>
              <a
                href={whatsappUrl(`Hola Johana, ¿qué talla me recomiendas en ${product.nombre}?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-ink/50 underline-offset-2 hover:text-ink hover:underline"
              >
                ¿Dudas con tu talla?
              </a>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.tallas.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTalla(t);
                    setError(false);
                  }}
                  aria-pressed={talla === t}
                  className={cn(
                    "h-11 rounded-lg border text-sm font-medium tabular-nums transition-colors",
                    talla === t
                      ? "border-ink bg-ink text-white"
                      : error
                        ? "border-red-300 text-ink hover:border-ink"
                        : "border-ink/15 text-ink hover:border-ink",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-7 flex gap-3">
          <div className="flex items-center rounded-full border border-ink/15">
            <button type="button" onClick={() => setCantidad((n) => Math.max(1, n - 1))} aria-label="Menos" className="p-3 text-ink/70 hover:text-ink">
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-medium tabular-nums" aria-live="polite">
              {cantidad}
            </span>
            <button type="button" onClick={() => setCantidad((n) => n + 1)} aria-label="Más" className="p-3 text-ink/70 hover:text-ink">
              <Plus size={14} />
            </button>
          </div>
          <motion.button
            type="button"
            onClick={agregar}
            whileTap={{ scale: 0.97 }}
            className="flex-1 rounded-full bg-ink py-3.5 text-sm font-medium text-white transition-colors hover:bg-marsupial-purple"
          >
            Agregar a la bolsa
          </motion.button>
          <button
            type="button"
            onClick={() => toggleFavorito(product.id)}
            aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            aria-pressed={esFavorito}
            className="rounded-full border border-ink/15 p-3.5 text-ink transition-colors hover:border-ink"
          >
            <Heart size={16} className={cn(esFavorito && "fill-marsupial-purple text-marsupial-purple")} />
          </button>
        </div>

        <a
          href={whatsappUrl(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          <FaWhatsapp size={16} /> Preguntar por WhatsApp
        </a>

        <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-sm">
          {product.material && (
            <div className="flex justify-between py-3">
              <dt className="text-ink/55">Material</dt>
              <dd className="text-ink">{product.material}</dd>
            </div>
          )}
          <div className="flex justify-between py-3">
            <dt className="text-ink/55">Hecho en</dt>
            <dd className="text-ink">Bucaramanga, Colombia</dd>
          </div>
          <div className="flex items-center gap-2 py-3 text-ink/70">
            <Truck size={15} /> Envío gratis desde {formatPrecio(ENVIO_GRATIS_DESDE)}
          </div>
        </dl>

        <button type="button" onClick={compartir} className="mt-5 inline-flex items-center gap-2 self-start text-xs font-medium text-ink/55 hover:text-ink">
          <Share2 size={13} /> Compartir
        </button>
      </div>
    </div>
  );
};

export const ProductSheet = () => {
  const product = useShop((s) => s.producto);
  const close = useShop((s) => s.closeProducto);
  useLockScroll(!!product);

  useEffect(() => {
    if (!product) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, close]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/45 backdrop-blur-sm md:items-center md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-title"
        >
          <motion.div
            initial={{ y: 60, opacity: 0, rotateX: 8 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{ transformPerspective: 1200 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-t-3xl bg-white shadow-2xl md:rounded-3xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-white"
            >
              <X size={18} />
            </button>
            <Body key={product.id} product={product} onClose={close} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductSheet;
