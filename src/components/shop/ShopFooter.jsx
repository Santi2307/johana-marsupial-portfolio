import { ArrowUp } from "lucide-react";
import { FaInstagram, FaPinterestP, FaWhatsapp } from "react-icons/fa6";
import { useShop } from "@/shopStore";
import { WHATSAPP_NUMBER } from "@/lib/shop";

const year = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  year: "numeric",
}).format(new Date());

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/marsupialstore", icon: FaInstagram },
  { label: "Pinterest", href: "https://pinterest.com/marsupialstore/", icon: FaPinterestP },
  { label: "WhatsApp", href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: FaWhatsapp },
];

const Col = ({ title, children }) => (
  <div>
    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">{title}</p>
    <ul className="space-y-2.5 text-sm text-white/80">{children}</ul>
  </div>
);

const linkCls = "transition-colors hover:text-white";

export const ShopFooter = () => {
  const setFiltro = useShop((s) => s.setFiltro);

  return (
    <footer className="bg-ink px-4 pb-8 pt-20 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <p className="font-brand text-2xl font-bold uppercase tracking-[0.28em]">Marsupial</p>
            <p className="mt-4 max-w-xs font-display text-2xl italic leading-snug text-white/75">
              Comodidad en cada paso, mientras la mujer se siente representada.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIAL.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-white/20 p-2.5 text-white/80 transition-colors hover:border-white hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <Col title="Tienda">
            {[
              ["todos", "Toda la colección"],
              ["nuevos", "Novedades"],
              ["sandalias", "Sandalias"],
              ["tacones", "Tacones"],
            ].map(([id, label]) => (
              <li key={id}>
                <a href="#tienda" onClick={() => setFiltro(id)} className={linkCls}>
                  {label}
                </a>
              </li>
            ))}
          </Col>

          <Col title="Marsupial">
            <li><a href="#johana" className={linkCls}>Nuestra historia</a></li>
            <li><a href="#wholesale" className={linkCls}>Mayoristas</a></li>
            <li><a href="#colaboraciones" className={linkCls}>Colaboraciones</a></li>
            <li><a href="#contact" className={linkCls}>Contacto</a></li>
          </Col>

          <Col title="Visítanos">
            <li className="text-white/70">Cl. 21 #20-55</li>
            <li className="text-white/70">Bucaramanga, Santander</li>
            <li><a href="mailto:johana@marsupial.com.co" className={linkCls}>johana@marsupial.com.co</a></li>
          </Col>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.16em] text-white/45 sm:flex-row">
          <span>© {year} Marsupial · Johana Sánchez Pulido</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            Volver arriba <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ShopFooter;
