import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "./ProductCard";

export const CatalogoCarousel = ({
  productos = [],
  onProductClick,
  direction = "left",
  speed = 40,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const productosDuplicados = useMemo(() => {
    if (!productos.length) return [];
    return Array(3).fill(productos).flat();
  }, [productos]);

  if (!productos.length) return null;

  const animationClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div
      className="group relative w-full overflow-hidden py-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      role="region"
      aria-label="Catálogo de productos destacados"
    >
      {/*
        DEGRADADOS CORREGIDOS:
        - Más estrechos (w-12 o w-16) para que no tapen las tarjetas.
        - Transparencia gradual más fina usando blanco puro o rgba para evitar el efecto "mancha negra".
      */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 md:w-16 bg-gradient-to-r from-white via-white/40 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 md:w-16 bg-gradient-to-l from-white via-white/40 to-transparent" />

      <div
        className={`flex w-max gap-6 will-change-transform ${animationClass}`}
        style={{
          animationDuration: `${speed}s`,
          animationPlayState:
            isPaused || prefersReducedMotion ? "paused" : "running",
        }}
      >
        {productosDuplicados.map((product, index) => (
          <div key={`${product.id}-${index}`} className="flex-shrink-0">
            <ProductCard product={product} onClick={onProductClick} size="md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogoCarousel;
