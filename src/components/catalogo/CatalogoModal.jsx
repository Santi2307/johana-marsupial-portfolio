import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { FiltrosBar } from "./FiltrosBar";

/**
 * Modal fullscreen que muestra toda la colección con filtros
 *
 * Props:
 * - open: boolean - si el modal está abierto
 * - onClose: función para cerrar
 * - productos: array completo de productos
 * - categorias: array de categorías
 * - onProductClick: función al hacer click en un producto
 */
export const CatalogoModal = ({
  open,
  onClose,
  productos = [],
  categorias = [],
  onProductClick,
}) => {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [open, onClose]);

  // Reset filtros al cerrar
  useEffect(() => {
    if (!open) {
      setCategoriaActiva("todos");
      setBusqueda("");
    }
  }, [open]);

  // Contadores por categoría
  const contadores = useMemo(() => {
    const result = { todos: productos.length };
    categorias.forEach((cat) => {
      if (cat.id === "todos") return;
      result[cat.id] = productos.filter((p) => p.categoria === cat.id).length;
    });
    return result;
  }, [productos, categorias]);

  // Productos filtrados
  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      // Filtro por categoría
      if (
        categoriaActiva !== "todos" &&
        producto.categoria !== categoriaActiva
      ) {
        return false;
      }

      // Filtro por búsqueda
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase();
        const matchNombre = producto.nombre?.toLowerCase().includes(query);
        const matchRef = producto.referencia?.toLowerCase().includes(query);
        const matchDesc = producto.descripcion?.toLowerCase().includes(query);
        if (!matchNombre && !matchRef && !matchDesc) return false;
      }

      return true;
    });
  }, [productos, categoriaActiva, busqueda]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] overflow-y-auto bg-white"
          role="dialog"
          aria-modal="true"
          aria-labelledby="catalogo-title"
        >
          {/* Header sticky */}
          <div className="sticky top-0 z-10 border-b border-marsupial-purple/10 bg-white/95 backdrop-blur-md">
            <div className="container mx-auto max-w-7xl px-4 py-6">
              <div className="mb-6 flex items-start justify-between gap-6">
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                    Colección completa
                  </p>
                  <h2
                    id="catalogo-title"
                    className="text-2xl font-bold tracking-tight text-marsupial-purple md:text-3xl"
                  >
                    Descubre Marsupial
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar catálogo"
                  className="rounded-full border border-marsupial-purple/20 p-2.5 text-marsupial-purple transition-colors hover:bg-marsupial-purple hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Filtros */}
              <FiltrosBar
                categorias={categorias}
                categoriaActiva={categoriaActiva}
                onCategoriaChange={setCategoriaActiva}
                busqueda={busqueda}
                onBusquedaChange={setBusqueda}
                contadores={contadores}
              />
            </div>
          </div>

          {/* Grid de productos */}
          <div className="container mx-auto max-w-7xl px-4 py-10">
            {productosFiltrados.length === 0 ? (
              <div className="py-20 text-center">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-marsupial-purple/50">
                  Sin resultados
                </p>
                <p className="text-marsupial-purple/70">
                  No encontramos productos con esos filtros.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                  {productosFiltrados.length}{" "}
                  {productosFiltrados.length === 1 ? "producto" : "productos"}
                </p>

                <motion.div
                  layout
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
                >
                  {productosFiltrados.map((producto) => (
                    <motion.div
                      key={producto.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <div className="w-full">
                        <ProductCard
                          product={producto}
                          onClick={onProductClick}
                          size="md"
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CatalogoModal;
