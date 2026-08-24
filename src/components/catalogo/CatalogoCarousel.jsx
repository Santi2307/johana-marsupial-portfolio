import { useState } from "react";
import { ProductCard } from "./ProductCard";

/**
 * Pasarela horizontal con auto-scroll infinito
 * Se pausa al hacer hover, se puede clickear cada producto
 *
 * Props:
 * - productos: array de productos a mostrar
 * - onProductClick: función que se ejecuta al hacer click en un producto
 * - direction: "left" | "right" — dirección del scroll
 * - speed: número en segundos para una vuelta completa (default 60)
 */
export const CatalogoCarousel = ({
  productos = [],
  onProductClick,
  direction = "left",
  speed = 60,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicamos el array para crear el efecto infinito
  const productosDuplicados = [...productos, ...productos];

  const animationClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div
      className="group relative w-full overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Gradients a los lados para efecto fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

      {/* Track de la pasarela */}
      <div
        className={`flex gap-6 ${animationClass}`}
        style={{
          animationDuration: `${speed}s`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {productosDuplicados.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
            onClick={onProductClick}
            size="md"
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogoCarousel;
