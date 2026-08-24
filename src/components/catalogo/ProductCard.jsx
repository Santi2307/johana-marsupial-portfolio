import { motion } from "framer-motion";

/**
 * Tarjeta de producto individual
 * Usado en: pasarela horizontal + grid del modal completo
 *
 * Props:
 * - product: objeto del producto (de productos.json)
 * - onClick: función que se ejecuta al hacer click (abre ProductModal)
 * - size: "sm" | "md" | "lg" — controla el tamaño de la card
 */
export const ProductCard = ({ product, onClick, size = "md" }) => {
  const sizes = {
    sm: "w-48 h-64",
    md: "w-64 h-80",
    lg: "w-72 h-96",
  };

  return (
    <motion.button
      type="button"
      onClick={() => onClick?.(product)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`${sizes[size]} group relative flex flex-shrink-0 flex-col overflow-hidden rounded-lg bg-white text-left transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40`}
    >
      {/* Foto del producto */}
      <div className="relative flex-1 overflow-hidden bg-marsupial-purple/5">
        {product.fotos && product.fotos[0] ? (
          <img
            src={product.fotos[0]}
            alt={product.nombre}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // Fallback si la imagen no carga
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/30">
              {product.referencia}
            </span>
          </div>
        )}

        {/* Overlay al hover */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-marsupial-purple/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="mb-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium text-marsupial-purple backdrop-blur-sm">
            Ver detalle
          </span>
        </div>
      </div>

      {/* Info del producto */}
      <div className="border-t border-marsupial-purple/10 bg-white px-4 py-3">
        <h3 className="truncate text-sm font-medium text-marsupial-purple">
          {product.nombre}
        </h3>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-marsupial-purple/50">
          {product.referencia}
        </p>

        {/* Colores como círculos */}
        {product.colores && product.colores.length > 0 && (
          <div className="mt-2 flex gap-1">
            {product.colores.slice(0, 4).map((color) => (
              <span
                key={color.nombre}
                title={color.nombre}
                className="h-3 w-3 rounded-full border border-marsupial-purple/20"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colores.length > 4 && (
              <span className="font-mono text-[9px] text-marsupial-purple/40">
                +{product.colores.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.button>
  );
};

export default ProductCard;
