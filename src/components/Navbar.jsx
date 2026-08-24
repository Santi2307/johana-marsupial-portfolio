import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── Navegación ─────────────────────────── */

const navItems = [
  { name: "Inicio", href: "#hero", index: "01" },
  { name: "Acerca de", href: "#about", index: "02" },
  { name: "Referencias", href: "#skills-heading", index: "03" },
  { name: "Catálogo", href: "#catalogo", index: "04" },
  { name: "Contacto", href: "#contact", index: "05" },
];

/* ─────────────────────────── Hooks ─────────────────────────── */

const useScrollDirection = () => {
  const [state, setState] = useState({ dir: "up", scrolledPast: 0 });
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setState({
        dir: y > last.current && y > 80 ? "down" : "up",
        scrolledPast: y,
      });
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return state;
};

const useActiveSection = () => {
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const targets = navItems
      .map((n) => document.querySelector(n.href))
      .filter(Boolean);

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return active;
};

/* ─────────────────────────── Wordmark (logo) ─────────────────────────── */

const Wordmark = () => (
  <a
    href="#hero"
    className="group inline-flex items-baseline gap-0.5 text-lg font-bold uppercase tracking-[0.18em] text-marsupial-purple transition-opacity hover:opacity-70"
    aria-label="Johana Sánchez — Marsupial"
  >
    <span>Johana Sanchez</span>
  </a>
);

/* ─────────────────────────── Desktop nav link ─────────────────────────── */

const DesktopNavLink = ({ item, isActive, linkRef }) => (
  <a
    ref={linkRef}
    href={item.href}
    aria-current={isActive ? "location" : undefined}
    className={cn(
      "group relative inline-flex items-baseline gap-2 px-4 py-2 text-sm font-medium transition-colors",
      isActive
        ? "text-marsupial-purple"
        : "text-marsupial-purple/50 hover:text-marsupial-purple",
    )}
  >
    <span
      className={cn(
        "font-mono text-[10px] transition-colors",
        isActive
          ? "text-marsupial-purple/70"
          : "text-marsupial-purple/30 group-hover:text-marsupial-purple/60",
      )}
    >
      {item.index}
    </span>
    <span>{item.name}</span>
  </a>
);

/* ─────────────────────────── Desktop nav (with sliding underline) ─────────────────────────── */

const DesktopNav = ({ activeHref }) => {
  const containerRef = useRef(null);
  const linkRefs = useRef({});
  const [underline, setUnderline] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const el = linkRefs.current[activeHref];
    const container = containerRef.current;
    if (!el || !container) {
      setUnderline((u) => ({ ...u, opacity: 0 }));
      return;
    }
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setUnderline({
      left: elRect.left - containerRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, [activeHref]);

  return (
    <nav
      ref={containerRef}
      aria-label="Primary"
      className="relative hidden items-center gap-1 md:flex"
    >
      {navItems.map((item) => (
        <DesktopNavLink
          key={item.href}
          item={item}
          isActive={activeHref === item.href}
          linkRef={(el) => (linkRefs.current[item.href] = el)}
        />
      ))}

      <motion.span
        aria-hidden
        animate={underline}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-marsupial-purple"
      />
    </nav>
  );
};

/* ─────────────────────────── Mobile drawer ─────────────────────────── */

const MobileDrawer = ({ open, onClose, activeHref }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-marsupial-purple/60 backdrop-blur-sm md:hidden"
          aria-hidden
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white p-8 shadow-2xl md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between">
            <Wordmark />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-full p-2 text-marsupial-purple transition-colors hover:bg-marsupial-purple/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="mt-12 flex flex-col gap-1" aria-label="Mobile">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-baseline gap-3 border-b border-marsupial-purple/10 py-4 text-lg font-medium transition-colors",
                    isActive
                      ? "text-marsupial-purple"
                      : "text-marsupial-purple/60 hover:text-marsupial-purple",
                  )}
                >
                  <span className="font-mono text-xs text-marsupial-purple/40">
                    {item.index}
                  </span>
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          <div className="mt-12 border-t border-marsupial-purple/10 pt-6">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/40">
              Ubicación
            </p>
            <p className="text-sm font-medium text-marsupial-purple">
              Bucaramanga · Colombia
            </p>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ─────────────────────────── Main navbar ─────────────────────────── */

export const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { dir, scrolledPast } = useScrollDirection();
  const activeHref = useActiveSection();

  const hidden = useMemo(
    () => dir === "down" && scrolledPast > 100 && !drawerOpen,
    [dir, scrolledPast, drawerOpen],
  );

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
        className={cn(
          "fixed top-0 z-40 w-full transition-all duration-300",
          scrolledPast > 20
            ? "border-b border-marsupial-purple/10 bg-white/90 backdrop-blur-xl shadow-sm"
            : "border-b border-transparent bg-white/50 backdrop-blur-md",
        )}
      >
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:h-20">
          <Wordmark />

          <DesktopNav activeHref={activeHref} />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-marsupial-purple transition-colors hover:bg-marsupial-purple/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40 md:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeHref={activeHref}
      />
    </>
  );
};

export default Navbar;
