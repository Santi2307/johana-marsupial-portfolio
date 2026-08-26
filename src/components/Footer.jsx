import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

// Hook para obtener el año en la zona horaria de Bogotá
const useBogotaYear = () => {
  const getYear = () =>
    parseInt(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Bogota",
        year: "numeric",
      }).format(new Date()),
      10,
    );

  const [year, setYear] = useState(getYear);

  useEffect(() => {
    const scheduleNext = () => {
      const nowInBogota = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }),
      );
      const nextNewYear = new Date(
        nowInBogota.getFullYear() + 1,
        0,
        1,
        0,
        0,
        1,
      );
      const msUntil = nextNewYear.getTime() - nowInBogota.getTime();

      return setTimeout(() => {
        setYear(getYear());
        scheduleNext();
      }, msUntil);
    };

    const id = scheduleNext();
    return () => clearTimeout(id);
  }, []);

  return year;
};

// Componente Footer corregido
export const Footer = () => {
  // CORRECCIÓN: Usar el hook correcto con la zona horaria de Bogotá
  const year = useBogotaYear();

  return (
    <footer
      id="footer"
      className="border-t border-white/10 bg-marsupial-purple px-4 py-10"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 sm:flex-row">
          <span>
            <span className="tabular-nums text-white">© {year}</span>
            <span className="mx-3 opacity-40">/</span>
            Diseñado y desarrollado por Johana Sanchez Pulido. Todos
            los Derechos Reservados.
          </span>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="group inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:rounded"
          >
            <ArrowUp
              size={11}
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
