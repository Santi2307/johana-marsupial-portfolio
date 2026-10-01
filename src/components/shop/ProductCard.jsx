import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { useShop } from "@/shopStore";
import { formatPrecio } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { Tilt3D } from "./Tilt3D";

export const ProductCard = ({ product, index = 0 }) => {
  const openProducto = useShop((s) => s.openProducto);
  const toggleFavorito = useShop((s) => s.toggleFavorito);
  const esFavorito = useShop((s) => s.favoritos.includes(product.id));

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Tilt3D max={8} innerClassName="rounded-2xl">
        <button
          type="button"
          onClick={() => openProducto(product)}
          aria-label={`Ver ${product.nombre}`}
          className="relative block aspect-[4/5] w-full rounded-2xl bg-stone focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={product.fotos?.[0]}
            alt={product.nombre}
            loading="lazy"
            className="product-img absolute inset-0 m-auto h-full w-full object-contain transition-[translate] duration-700 ease-out group-hover:-translate-y-2"
            style={{ transform: "translateZ(40px)" }}
          />
          {product.nuevo && (
            <span
              className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink"
              style={{ transform: "translateZ(30px)" }}
            >
              Nuevo
            </span>
          )}
          <span
            className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-1.5 rounded-full bg-ink/90 py-2.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            style={{ transform: "translateZ(50px)" }}
          >
            <Plus size={14} /> Elegir talla
          </span>
        </button>

        <button
          type="button"
          onClick={() => toggleFavorito(product.id)}
          aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          aria-pressed={esFavorito}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-ink backdrop-blur transition-colors hover:bg-white"
          style={{ transform: "translateZ(30px)" }}
        >
          <motion.span
            key={esFavorito ? "on" : "off"}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="block"
          >
            <Heart
              size={16}
              strokeWidth={1.8}
              className={cn(esFavorito && "fill-marsupial-purple text-marsupial-purple")}
            />
          </motion.span>
        </button>
      </Tilt3D>

      <div className="mt-3 flex flex-col gap-0.5 px-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium leading-snug text-ink sm:truncate">{product.nombre}</h3>
          <p className="mt-0.5 hidden text-xs text-ink/50 sm:block">{product.material}</p>
        </div>
        <p className="shrink-0 text-sm tabular-nums text-ink/80 sm:font-medium sm:text-ink">
          {formatPrecio(product.precio)}
        </p>
      </div>
      {product.colores?.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 px-0.5">
          {product.colores.slice(0, 5).map((c) => (
            <span
              key={c.nombre}
              title={c.nombre}
              className="h-3 w-3 rounded-full ring-1 ring-ink/15"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {product.colores.length > 5 && (
            <span className="text-[10px] text-ink/45">+{product.colores.length - 5}</span>
          )}
        </div>
      )}
    </motion.article>
  );
};

export default ProductCard;
