import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import productosData from "@/data/productos.json";
import { useShop } from "@/shopStore";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { Tilt3D } from "./Tilt3D";

const { productos: PRODUCTOS, subcategorias_zapatos: SUBCATS } = productosData;
const EASE_OUT = [0.22, 1, 0.36, 1];

// Solo mostramos categorías que tengan productos
const CATEGORIAS = SUBCATS.map((c) => ({
  ...c,
  productos: PRODUCTOS.filter((p) => p.subcategoria === c.id),
})).filter((c) => c.productos.length > 0);

const ORDENES = [
  { id: "destacados", nombre: "Destacados" },
  { id: "precio-asc", nombre: "Precio: menor a mayor" },
  { id: "precio-desc", nombre: "Precio: mayor a menor" },
  { id: "nombre", nombre: "Nombre A–Z" },
];

const irATienda = () =>
  document.getElementById("tienda")?.scrollIntoView({ behavior: "smooth" });

/* ─────────────── Cinta de valores ─────────────── */

const VALORES = [
  "Hecho a mano en Bucaramanga",
  "Cuero natural",
  "Más de 20 años de oficio",
  "Diseño colombiano",
  "Tallas 35 a 40",
];

export const ValuesStrip = () => {
  const fila = [...VALORES, ...VALORES, ...VALORES];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-paper py-4" aria-hidden>
      <div className="animate-marquee-left flex w-max gap-10" style={{ animationDuration: "40s" }}>
        {fila.map((v, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl italic text-ink/80 md:text-3xl">
            {v}
            <span className="text-base not-italic text-marsupial-purple">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────── Categorías en 3D ─────────────── */

export const CategoryTiles = () => {
  const setFiltro = useShop((s) => s.setFiltro);

  return (
    <section className="bg-paper px-4 pb-6 pt-20 md:px-8 md:pt-28" aria-labelledby="cats-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 id="cats-heading" className="font-display text-4xl leading-none text-ink md:text-6xl">
            Compra por <em>estilo</em>
          </h2>
          <a href="#tienda" onClick={() => setFiltro("todos")} className="hidden text-sm font-medium text-ink underline-offset-4 hover:underline md:block">
            Ver todo
          </a>
        </div>

        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
          {CATEGORIAS.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE_OUT }}
              className="w-[58vw] shrink-0 snap-start sm:w-[38vw] md:w-auto"
            >
              <Tilt3D max={12} innerClassName="rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setFiltro(cat.id);
                    irATienda();
                  }}
                  className="group relative flex aspect-[3/4] w-full flex-col justify-between rounded-2xl bg-stone p-4 text-left"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink/50" style={{ transform: "translateZ(20px)" }}>
                    {cat.productos.length} {cat.productos.length === 1 ? "estilo" : "estilos"}
                  </span>
                  <img
                    src={cat.productos[0].fotos[0]}
                    alt=""
                    loading="lazy"
                    className="product-img absolute inset-0 m-auto h-[70%] w-[85%] object-contain transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110"
                    style={{ transform: "translateZ(60px)" }}
                  />
                  <span className="relative font-display text-3xl text-ink" style={{ transform: "translateZ(40px)" }}>
                    {cat.nombre}
                  </span>
                </button>
              </Tilt3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────── Catálogo con filtros ─────────────── */

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "relative shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
      active ? "text-white" : "text-ink/70 hover:text-ink",
    )}
  >
    {active && (
      <motion.span
        layoutId="chip-bg"
        className="absolute inset-0 rounded-full bg-ink"
        transition={{ type: "spring", stiffness: 400, damping: 34 }}
      />
    )}
    <span className="relative">{children}</span>
  </button>
);

export const ShopSection = () => {
  const filtro = useShop((s) => s.filtro);
  const setFiltro = useShop((s) => s.setFiltro);
  const favoritos = useShop((s) => s.favoritos);
  const [orden, setOrden] = useState("destacados");

  const lista = useMemo(() => {
    let r = PRODUCTOS;
    if (filtro === "nuevos") r = r.filter((p) => p.nuevo);
    else if (filtro === "favoritos") r = r.filter((p) => favoritos.includes(p.id));
    else if (filtro !== "todos") r = r.filter((p) => p.subcategoria === filtro);

    const sorted = [...r];
    if (orden === "precio-asc") sorted.sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") sorted.sort((a, b) => b.precio - a.precio);
    if (orden === "nombre") sorted.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    return sorted;
  }, [filtro, orden, favoritos]);

  const chips = [
    { id: "todos", nombre: "Todo" },
    { id: "nuevos", nombre: "Nuevos" },
    ...CATEGORIAS,
    ...(favoritos.length ? [{ id: "favoritos", nombre: `Favoritos (${favoritos.length})` }] : []),
  ];

  return (
    <section id="tienda" className="bg-paper px-4 py-16 md:px-8 md:py-20" aria-labelledby="tienda-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/50">
              Tienda · {lista.length} {lista.length === 1 ? "producto" : "productos"}
            </p>
            <h2 id="tienda-heading" className="font-display text-5xl leading-none text-ink md:text-7xl">
              La colección
            </h2>
          </div>

          <label className="relative inline-flex items-center">
            <span className="sr-only">Ordenar por</span>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="appearance-none rounded-full border border-ink/15 bg-transparent py-2 pl-4 pr-9 text-[13px] font-medium text-ink focus:border-ink focus:outline-none"
            >
              {ORDENES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3.5 text-ink/60" />
          </label>
        </div>

        <div className="no-scrollbar -mx-4 mb-10 flex gap-1 overflow-x-auto border-b border-ink/10 px-4 py-3 md:mx-0 md:px-0">
          {chips.map((c) => (
            <Chip key={c.id} active={filtro === c.id} onClick={() => setFiltro(c.id)}>
              {c.nombre}
            </Chip>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {lista.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {lista.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display text-3xl text-ink">
              {filtro === "favoritos" ? "Aún no tienes favoritos." : "No hay productos aquí todavía."}
            </p>
            <button
              type="button"
              onClick={() => setFiltro("todos")}
              className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-marsupial-purple"
            >
              Ver toda la colección
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopSection;
