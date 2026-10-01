import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { useShop, selectCount } from "@/shopStore";
import { formatPrecio, ENVIO_GRATIS_DESDE } from "@/lib/shop";
import { cn } from "@/lib/utils";

const NAV = [
  { name: "Tienda", href: "#tienda" },
  { name: "Novedades", href: "#tienda", filtro: "nuevos" },
  { name: "Johana", href: "#johana" },
  { name: "Mayoristas", href: "#wholesale" },
  { name: "Contacto", href: "#contact" },
];

const MENSAJES = [
  `Envío gratis desde ${formatPrecio(ENVIO_GRATIS_DESDE)}`,
  "Hecho a mano en Bucaramanga",
  "Cuero natural colombiano",
  "Pide fácil por WhatsApp",
];

/* ─────────────── Barra superior de anuncios ─────────────── */

const AnnouncementBar = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % MENSAJES.length), 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-9 overflow-hidden bg-ink text-[11px] font-medium uppercase tracking-[0.18em] text-white">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={i}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center px-4 text-center"
        >
          {MENSAJES[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

/* ─────────────── Hook: ocultar al bajar ─────────────── */

const useHideOnScroll = () => {
  const [state, setState] = useState({ hidden: false, scrolled: false });
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setState({ hidden: y > last.current && y > 240, scrolled: y > 40 });
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return state;
};

/* ─────────────── Iconos con contador ─────────────── */

const IconButton = ({ label, count, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={count ? `${label} (${count})` : label}
    className="relative rounded-full p-2.5 text-ink transition-colors hover:bg-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
  >
    {children}
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-marsupial-purple px-1 text-[10px] font-semibold tabular-nums text-white"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  </button>
);

/* ─────────────── Header principal ─────────────── */

export const ShopHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { hidden, scrolled } = useHideOnScroll();
  const count = useShop(selectCount);
  const favoritos = useShop((s) => s.favoritos.length);
  const setCartOpen = useShop((s) => s.setCartOpen);
  const setFiltro = useShop((s) => s.setFiltro);

  const onNav = (item) => {
    if (item.filtro) setFiltro(item.filtro);
    else if (item.href === "#tienda") setFiltro("todos");
    setMenuOpen(false);
  };

  const verFavoritos = () => {
    setFiltro("favoritos");
    document.getElementById("tienda")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <AnnouncementBar />

      <motion.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-colors duration-300",
          scrolled
            ? "border-ink/10 bg-paper/85 backdrop-blur-xl"
            : "border-transparent bg-paper",
        )}
      >
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:px-8">
          {/* Izquierda: nav desktop / menú móvil */}
          <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => onNav(item)}
                className="relative text-[13px] font-medium text-ink/70 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100"
              >
                {item.name}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="-ml-2 justify-self-start rounded-full p-2.5 text-ink hover:bg-ink/5 lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Centro: marca */}
          <a href="#inicio" className="flex flex-col items-center leading-none" aria-label="Marsupial, inicio">
            <span className="font-brand text-xl font-bold uppercase tracking-[0.28em] text-marsupial-purple md:text-2xl">
              Marsupial
            </span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.32em] text-ink/50">
              por Johana Sánchez
            </span>
          </a>

          {/* Derecha: favoritos + bolsa */}
          <div className="flex items-center justify-self-end gap-1">
            <IconButton label="Favoritos" count={favoritos} onClick={verFavoritos}>
              <Heart size={19} strokeWidth={1.6} />
            </IconButton>
            <IconButton label="Bolsa de compras" count={count} onClick={() => setCartOpen(true)}>
              <ShoppingBag size={19} strokeWidth={1.6} />
            </IconButton>
          </div>
        </div>
      </motion.header>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm lg:hidden"
              aria-hidden
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="fixed left-0 top-0 z-50 flex h-full w-[86%] max-w-sm flex-col bg-paper p-6 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menú"
            >
              <div className="flex items-center justify-between">
                <span className="font-brand text-lg font-bold uppercase tracking-[0.28em] text-marsupial-purple">
                  Marsupial
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className="rounded-full p-2 text-ink hover:bg-ink/5"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="mt-10 flex flex-col" aria-label="Móvil">
                {NAV.map((item, i) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => onNav(item)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    className="border-b border-ink/10 py-4 font-display text-3xl text-ink"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>
              <p className="mt-auto text-xs uppercase tracking-[0.2em] text-ink/50">
                Bucaramanga · Colombia
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShopHeader;
