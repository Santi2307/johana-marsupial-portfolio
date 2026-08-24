import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

/**
 * Modal de producto individual
 * Se abre cuando el cliente hace click en cualquier ProductCard
 *
 * Props:
 * - product: objeto del producto (null si está cerrado)
 * - onClose: función para cerrar el modal
 */

// CAMBIA ESTE NÚMERO por el WhatsApp real de Johana / Marsupial
const WHATSAPP_NUMBER = "573174385716"; // Colombia: 57 + número sin espacios

export const ProductModal = ({ product, onClose }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (product) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [product, onClose]);

  // Reset al abrir un producto nuevo
  useEffect(() => {
    setSelectedPhoto(0);
    setSelectedColor(0);
  }, [product?.id]);

  if (!product) return null;

  const colorActual = product.colores?.[selectedColor];
  const mensaje = `Hola Johana, me interesa ${product.nombre} (${product.referencia})${
    colorActual ? ` en color ${colorActual.nombre}` : ""
  }.`;
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.nombre} · Marsupial`,
          text: product.descripcion,
          url: window.location.href,
        });
      } catch {
        // usuario canceló
      }
    } else {
      // Fallback: copiar link al portapapeles
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado al portapapeles");
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-marsupial-purple/40 backdrop-blur-sm"
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-[80] w-[95%] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-title"
          >
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-marsupial-purple backdrop-blur-sm transition-colors hover:bg-marsupial-purple hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40"
            >
              <X size={18} />
            </button>

            <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
              {/* ─── IZQUIERDA — Galería de fotos ─── */}
              <div className="relative bg-marsupial-purple/5">
                <div className="relative aspect-square md:h-full">
                  {product.fotos && product.fotos[selectedPhoto] ? (
                    <img
                      src={product.fotos[selectedPhoto]}
                      alt={product.nombre}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-marsupial-purple/30">
                        Foto no disponible
                      </span>
                    </div>
                  )}
                </div>

                {/* Miniaturas si hay más de una foto */}
                {product.fotos && product.fotos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {product.fotos.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedPhoto(i)}
                        aria-label={`Ver foto ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          selectedPhoto === i
                            ? "w-6 bg-marsupial-purple"
                            : "w-2 bg-marsupial-purple/30 hover:bg-marsupial-purple/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ─── DERECHA — Info del producto ─── */}
              <div className="flex flex-col overflow-y-auto p-8 md:p-10">
                {/* Referencia + colección */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                    {product.referencia}
                  </span>
                  {product.coleccion && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-marsupial-purple/30" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                        {product.coleccion}
                      </span>
                    </>
                  )}
                </div>

                {/* Nombre */}
                <h2
                  id="product-title"
                  className="mb-4 text-3xl font-bold leading-tight tracking-tight text-marsupial-purple md:text-4xl"
                >
                  {product.nombre}
                </h2>

                {/* Descripción */}
                <p className="mb-6 text-sm leading-relaxed text-marsupial-purple/70 md:text-base">
                  {product.descripcion}
                </p>

                {/* Colores disponibles */}
                {product.colores && product.colores.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                      Color · {colorActual?.nombre}
                    </p>
                    <div className="flex gap-2">
                      {product.colores.map((color, i) => (
                        <button
                          key={color.nombre}
                          type="button"
                          onClick={() => setSelectedColor(i)}
                          aria-label={`Seleccionar color ${color.nombre}`}
                          className={`h-10 w-10 rounded-full border-2 transition-all ${
                            selectedColor === i
                              ? "border-marsupial-purple ring-2 ring-marsupial-purple/30 ring-offset-2"
                              : "border-marsupial-purple/20 hover:border-marsupial-purple/50"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tallas disponibles */}
                {product.tallas && product.tallas.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                      Tallas disponibles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.tallas.map((talla) => (
                        <span
                          key={talla}
                          className="flex h-10 w-10 items-center justify-center rounded-md border border-marsupial-purple/20 text-sm font-medium text-marsupial-purple"
                        >
                          {talla}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Material */}
                {product.material && (
                  <div className="mb-8">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                      Material
                    </p>
                    <p className="text-sm text-marsupial-purple/80">
                      {product.material}
                    </p>
                  </div>
                )}

                {/* CTAs */}
                <div className="mt-auto flex flex-col gap-3">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-marsupial-purple px-6 py-3 text-sm font-medium text-white transition-all hover:gap-3 hover:bg-marsupial-purple-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40"
                  >
                    <FaWhatsapp size={16} />
                    Consultar por WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-marsupial-purple/30 px-6 py-3 text-sm font-medium text-marsupial-purple transition-all hover:bg-marsupial-purple/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40"
                  >
                    <Share2 size={14} />
                    Compartir producto
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
