import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useShop, selectCount, selectSubtotal } from "@/shopStore";
import {
  COSTO_ENVIO,
  ENVIO_GRATIS_DESDE,
  formatPrecio,
  mensajePedido,
  whatsappUrl,
} from "@/lib/shop";

export const CartDrawer = () => {
  const open = useShop((s) => s.cartOpen);
  const setOpen = useShop((s) => s.setCartOpen);
  const items = useShop((s) => s.items);
  const setCantidad = useShop((s) => s.setCantidad);
  const removeItem = useShop((s) => s.removeItem);
  const count = useShop(selectCount);
  const subtotal = useShop(selectSubtotal);

  const envio = subtotal >= ENVIO_GRATIS_DESDE || subtotal === 0 ? 0 : COSTO_ENVIO;
  const falta = Math.max(0, ENVIO_GRATIS_DESDE - subtotal);
  const progreso = Math.min(1, subtotal / ENVIO_GRATIS_DESDE);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm"
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-paper"
            role="dialog"
            aria-modal="true"
            aria-label="Bolsa de compras"
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-3xl text-ink">
                Tu bolsa <span className="font-sans text-sm tabular-nums text-ink/50">({count})</span>
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar bolsa" className="rounded-full p-2 text-ink hover:bg-ink/5">
                <X size={20} />
              </button>
            </header>

            {items.length > 0 && (
              <div className="border-b border-ink/10 px-6 py-4">
                <p className="text-xs text-ink/70">
                  {falta > 0 ? (
                    <>
                      Te faltan <strong className="text-ink">{formatPrecio(falta)}</strong> para envío gratis
                    </>
                  ) : (
                    <strong className="text-ink">¡Tu envío es gratis!</strong>
                  )}
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className="h-full rounded-full bg-marsupial-purple"
                    initial={false}
                    animate={{ width: `${progreso * 100}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag size={36} strokeWidth={1.2} className="text-ink/30" />
                <p className="mt-4 font-display text-3xl text-ink">Tu bolsa está vacía</p>
                <p className="mt-2 text-sm text-ink/55">Encuentra tu próximo par favorito.</p>
                <a
                  href="#tienda"
                  onClick={() => setOpen(false)}
                  className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-marsupial-purple"
                >
                  Ir a la tienda
                </a>
              </div>
            ) : (
              <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
                <AnimatePresence initial={false}>
                  {items.map((it) => (
                    <motion.li
                      key={it.key}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, paddingTop: 0, paddingBottom: 0 }}
                      className="flex gap-4 py-5"
                    >
                      <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-stone">
                        <img src={it.foto} alt="" className="product-img h-[85%] w-[85%] object-contain" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-3">
                          <p className="truncate text-sm font-medium text-ink">{it.nombre}</p>
                          <p className="shrink-0 text-sm tabular-nums text-ink">{formatPrecio(it.precio * it.cantidad)}</p>
                        </div>
                        <p className="mt-0.5 text-xs text-ink/55">
                          {it.color && `${it.color} · `}Talla {it.talla}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-ink/15">
                            <button type="button" onClick={() => setCantidad(it.key, it.cantidad - 1)} aria-label="Menos" className="p-2 text-ink/70 hover:text-ink">
                              <Minus size={12} />
                            </button>
                            <span className="w-5 text-center text-xs font-medium tabular-nums">{it.cantidad}</span>
                            <button type="button" onClick={() => setCantidad(it.key, it.cantidad + 1)} aria-label="Más" className="p-2 text-ink/70 hover:text-ink">
                              <Plus size={12} />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeItem(it.key)} className="text-xs text-ink/50 underline-offset-2 hover:text-ink hover:underline">
                            Quitar
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {items.length > 0 && (
              <footer className="border-t border-ink/10 px-6 py-5">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-ink/65">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">{formatPrecio(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-ink/65">
                    <dt>Envío</dt>
                    <dd className="tabular-nums">{envio === 0 ? "Gratis" : formatPrecio(envio)}</dd>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-medium text-ink">
                    <dt>Total</dt>
                    <dd className="tabular-nums">{formatPrecio(subtotal + envio)}</dd>
                  </div>
                </dl>
                <a
                  href={whatsappUrl(mensajePedido(items, subtotal, envio))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-medium text-white transition-colors hover:bg-marsupial-purple"
                >
                  <FaWhatsapp size={17} /> Finalizar pedido por WhatsApp
                </a>
                <p className="mt-3 text-center text-[11px] text-ink/45">
                  Johana confirma disponibilidad, pago y envío por WhatsApp.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
