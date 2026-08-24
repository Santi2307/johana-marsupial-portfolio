import { Search } from "lucide-react";

/**
 * Barra de filtros para el catálogo
 * Usado en: CatalogoModal (vista completa)
 *
 * Props:
 * - categorias: array de categorías desde productos.json
 * - categoriaActiva: id de la categoría seleccionada
 * - onCategoriaChange: función que se ejecuta al cambiar categoría
 * - busqueda: string actual del buscador
 * - onBusquedaChange: función que se ejecuta al escribir en el buscador
 * - contadores: objeto { categoriaId: cantidad }
 */
export const FiltrosBar = ({
  categorias = [],
  categoriaActiva,
  onCategoriaChange,
  busqueda = "",
  onBusquedaChange,
  contadores = {},
}) => {
  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-marsupial-purple/40"
        />
        <input
          type="search"
          placeholder="Buscar producto o referencia..."
          value={busqueda}
          onChange={(e) => onBusquedaChange?.(e.target.value)}
          className="w-full rounded-full border border-marsupial-purple/20 bg-white py-3 pl-11 pr-4 text-sm text-marsupial-purple placeholder:text-marsupial-purple/40 transition-colors focus:border-marsupial-purple/50 focus:outline-none"
        />
      </div>

      {/* Pills de categorías */}
      <div className="flex flex-wrap gap-2">
        {categorias.map((cat) => {
          const isActive = categoriaActiva === cat.id;
          const count = contadores[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoriaChange?.(cat.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40 ${
                isActive
                  ? "bg-marsupial-purple text-white shadow-md"
                  : "border border-marsupial-purple/20 text-marsupial-purple hover:bg-marsupial-purple/5"
              }`}
            >
              <span>{cat.nombre}</span>
              <span
                className={`font-mono text-[10px] ${
                  isActive ? "text-white/70" : "text-marsupial-purple/50"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FiltrosBar;
