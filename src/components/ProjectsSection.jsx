import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CatalogoCarousel } from "./catalogo/CatalogoCarousel";
import { CatalogoModal } from "./catalogo/CatalogoModal";
import { ProductModal } from "./catalogo/ProductModal";
import productosData from "@/data/productos.json";

const EASE_OUT = [0.22, 1, 0.36, 1];

/**
 * Sección de Catálogo — reemplaza la sección Projects original
 * Estructura: header + pasarela + botón "Ver todo" + modales
 */
export const ProjectsSection = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  const [catalogoOpen, setCatalogoOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { productos = [], categorias = [] } = productosData;
  const destacados = productos.filter((p) => p.destacado);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <section
        id="catalogo"
        ref={sectionRef}
        className="relative overflow-hidden bg-white px-4 py-24 md:py-32"
        aria-labelledby="catalogo-heading"
      >
        <div className="container mx-auto max-w-7xl">
          {/* ─── Header ─── */}
          <div className="mb-12 flex items-end justify-between gap-8">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-marsupial-purple/50"
              >
                <span className="text-marsupial-purple">04</span> / catálogo
              </motion.p>
              <motion.h2
                id="catalogo-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="text-4xl font-bold leading-[1.05] tracking-tight text-marsupial-purple md:text-6xl"
              >
                Descubre Marsupial.
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden max-w-xs text-right text-sm leading-relaxed text-marsupial-purple/60 md:block"
            >
              Piezas cuidadosamente diseñadas para acompañar cada momento. Cada
              par es una expresión de artesanía colombiana.
            </motion.div>
          </div>

          {/* ─── Pasarela ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="-mx-4 mb-12"
          >
            <p className="mb-6 px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
              Dale un vistazo a nuestro catalogo.
            </p>

            <CatalogoCarousel
              productos={destacados}
              onProductClick={handleProductClick}
              direction="left"
              speed={60}
            />
          </motion.div>

          {/* ─── Botón "Ver toda la colección" ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex justify-center"
          >
            <button
              type="button"
              onClick={() => setCatalogoOpen(true)}
              className="group inline-flex items-center gap-3 rounded-full bg-marsupial-purple px-8 py-4 text-sm font-medium text-white transition-all hover:gap-4 hover:bg-marsupial-purple-soft hover:shadow-xl hover:shadow-marsupial-purple/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40"
            >
              Ver nuestro Catalogo
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </motion.div>

          {/* Info debajo del botón */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/40"
          >
            {productos.length} productos · {categorias.length - 1} categorías
          </motion.p>
        </div>
      </section>

      {/* ─── Modal fullscreen con toda la colección ─── */}
      <CatalogoModal
        open={catalogoOpen}
        onClose={() => setCatalogoOpen(false)}
        productos={productos}
        categorias={categorias}
        onProductClick={handleProductClick}
      />

      {/* ─── Modal de producto individual ─── */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default ProjectsSection;
