import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FaPinterest, FaWhatsapp } from "react-icons/fa6";
import { PiStorefront } from "react-icons/pi";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Linkedin,
  Instagram,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mqpzrbep";
const EASE_OUT = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════════ */

const useCopy = (resetMs = 1500) => {
  const [copied, setCopied] = useState(false);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
    } catch {
      // silent fail
    }
  };
  return { copied, copy };
};

/* ═══════════════════════════════════════════════════════════════════════
   CHANNEL ROW
   ═══════════════════════════════════════════════════════════════════════ */

const ChannelRow = ({ icon: Icon, label, value, href, copyable = true }) => {
  const { copied, copy } = useCopy();

  const Inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-marsupial-purple/20 bg-white text-marsupial-purple transition-colors group-hover:text-marsupial-purple">
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-center text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-marsupial-purple/50">
          {label}
        </span>
        <span className="truncate text-sm font-medium text-marsupial-purple">
          {value}
        </span>
      </span>
    </>
  );

  return (
    <div className="group relative grid grid-cols-[1fr_auto] items-center gap-3 py-4">
      {href ? (
        <a href={href} className="flex items-center gap-3 transition-colors">
          {Inner}
        </a>
      ) : (
        <div className="flex items-center gap-3">{Inner}</div>
      )}

      <div className="w-9 flex justify-end">
        {copyable && (
          <button
            type="button"
            onClick={() => copy(value)}
            aria-label={`Copiar ${label.toLowerCase()}`}
            className="shrink-0 rounded-md p-2 text-marsupial-purple/50 opacity-0 transition-all hover:bg-marsupial-purple/10 hover:text-marsupial-purple focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/30 group-hover:opacity-100"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  className="block"
                >
                  <Check size={13} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  className="block"
                >
                  <Copy size={13} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   FORM
   ═══════════════════════════════════════════════════════════════════════ */

const contactFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  email: z.string().email("Ingresa un correo válido."),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres.")
    .max(2000, "El mensaje es demasiado largo."),
});

const Field = ({ label, hint, error, children }) => (
  <div>
    <div className="mb-1.5 flex items-baseline justify-between">
      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-marsupial-purple/60">
        {label}
      </label>
      {hint && (
        <span className="font-mono text-[10px] tabular-nums text-marsupial-purple/40">
          {hint}
        </span>
      )}
    </div>
    {children}
    {error && (
      <p role="alert" className="mt-1.5 font-mono text-[10px] text-red-500">
        {error}
      </p>
    )}
  </div>
);

const inputClasses = (hasError) =>
  cn(
    "w-full rounded-md border bg-white px-3 py-2.5 text-sm text-marsupial-purple placeholder:text-marsupial-purple/40 transition-colors",
    "focus:outline-none focus:border-marsupial-purple/60",
    hasError ? "border-red-400" : "border-marsupial-purple/20",
  );

const ContactForm = ({ onSent }) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
  });

  const messageValue = watch("message", "");
  const messageCount = messageValue?.length ?? 0;

  const onSubmit = async (data) => {
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: `Nuevo mensaje de ${data.name}`,
        }),
      });

      if (response.ok) {
        reset();
        onSent();
      } else {
        toast({
          title: "No se pudo enviar tu mensaje",
          description:
            "Algo salió mal. Intenta de nuevo o escríbeme directamente.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error de red",
        description: "Revisa tu conexión e intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" error={errors.name?.message}>
          <input
            type="text"
            placeholder="Nombre Apellido"
            {...register("name")}
            className={inputClasses(!!errors.name)}
          />
        </Field>

        <Field label="Correo Electrónico" error={errors.email?.message}>
          <input
            type="email"
            placeholder="ejemplo@gmail.com"
            {...register("email")}
            className={inputClasses(!!errors.email)}
          />
        </Field>
      </div>

      <Field
        label="Mensaje"
        hint={`${messageCount} / 2000`}
        error={errors.message?.message}
      >
        <textarea
          rows={6}
          placeholder="Envíame un mensaje..."
          {...register("message")}
          className={cn(
            inputClasses(!!errors.message),
            "resize-y min-h-[140px]",
          )}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-marsupial-purple px-5 py-3 text-sm font-medium text-white transition-all hover:gap-3 hover:bg-marsupial-purple-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/40",
          isSubmitting && "cursor-not-allowed opacity-70",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            Enviar mensaje
            <Send
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </>
        )}
      </button>
    </form>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SUCCESS STATE
   ═══════════════════════════════════════════════════════════════════════ */

const SuccessState = ({ onReset }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: EASE_OUT }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
      className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-marsupial-purple/20"
    >
      <CheckCircle2
        className="h-7 w-7 text-marsupial-purple"
        strokeWidth={1.5}
      />
    </motion.div>

    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
      Estado — enviado
    </p>
    <h3 className="mb-3 text-2xl font-semibold tracking-tight text-marsupial-purple">
      Mensaje recibido.
    </h3>
    <p className="mb-8 max-w-sm text-sm leading-relaxed text-marsupial-purple/70">
      Gracias por escribirme. Te responderé dentro de las próximas 24 horas —
      usualmente mucho antes.
    </p>

    <button
      type="button"
      onClick={onReset}
      className="inline-flex items-center gap-2 rounded-full border border-marsupial-purple/30 px-4 py-2 text-sm font-medium text-marsupial-purple transition-colors hover:bg-marsupial-purple/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/30"
    >
      <ArrowLeft size={13} />
      Enviar otro
    </button>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════
   SOCIAL LINKS — Con colores de marca al hover
   ═══════════════════════════════════════════════════════════════════════ */

const SOCIAL_LINKS = [
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/johana-sánchez-pulido-a708b864/",
    label: "LinkedIn",
    brand: {
      bg: "#0A66C2",
      text: "#ffffff",
      shadow: "rgba(10, 102, 194, 0.35)",
    },
  },
  {
    icon: FaPinterest,
    href: "https://pinterest.com/marsupialstore/",
    label: "Pinterest",
    brand: {
      bg: "#E60023",
      text: "#ffffff",
      shadow: "rgba(230, 0, 35, 0.35)",
    },
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/marsupialstore",
    label: "Instagram",
    brand: {
      bg: "linear-gradient(45deg, #F58529 0%, #DD2A7B 40%, #8134AF 70%, #515BD4 100%)",
      text: "#ffffff",
      shadow: "rgba(221, 42, 123, 0.4)",
    },
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/573183045429",
    label: "WhatsApp",
    brand: {
      bg: "#25D366",
      text: "#ffffff",
      shadow: "rgba(37, 211, 102, 0.35)",
    },
  },
  {
    icon: PiStorefront,
    href: "https://marsupial.com.co",
    label: "Tienda Virtual",
    brand: {
      bg: "#3D2C7A",
      text: "#ffffff",
      shadow: "rgba(61, 44, 122, 0.4)",
    },
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   SOCIAL BUTTON — brand-colored hover
   ═══════════════════════════════════════════════════════════════════════ */

const SocialButton = ({ link }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = link.icon;

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
      animate={{
        boxShadow: isHovered
          ? `0 12px 32px -10px ${link.brand.shadow}`
          : "0 0 0 0 transparent",
      }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      style={{
        borderColor: isHovered ? "transparent" : undefined,
      }}
      className="group relative block overflow-hidden rounded-md border border-marsupial-purple/20 bg-white text-xs transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-marsupial-purple/30"
    >
      {/* Brand background layer */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        style={{ background: link.brand.bg }}
        className="absolute inset-0"
      />

      {/* Content */}
      <motion.span
        animate={{ color: isHovered ? link.brand.text : undefined }}
        transition={{ duration: 0.3 }}
        className="relative flex items-center justify-between gap-2 px-3 py-2.5 text-marsupial-purple"
      >
        <span className="flex min-w-0 items-center gap-2">
          <motion.span
            animate={{
              scale: isHovered ? 1.15 : 1,
              rotate: isHovered ? -4 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex-shrink-0"
          >
            <Icon size={14} />
          </motion.span>
          <span className="truncate font-medium">{link.label}</span>
        </span>
        <motion.span
          animate={{
            x: isHovered ? 2 : 0,
            y: isHovered ? -2 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="flex-shrink-0"
        >
          <ArrowUpRight size={12} />
        </motion.span>
      </motion.span>
    </motion.a>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════════════════ */

export const ContactSection = () => {
  const [sent, setSent] = useState(false);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-white px-4 py-24 md:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto max-w-6xl">
        {/* ─── Section header ─── */}
        <div className="mb-16 flex items-end justify-between gap-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-marsupial-purple/50"
            >
              <span className="text-marsupial-purple">06</span> / contacto
            </motion.p>
            <motion.h2
              id="contact-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="text-4xl font-bold leading-[1.05] tracking-tight text-marsupial-purple md:text-6xl"
            >
              Contáctame.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden max-w-xs text-right text-xs leading-relaxed text-marsupial-purple/60 md:block"
          >
            ¿Quieres colaborar? ¿Tienes una pregunta? Escríbeme y con gusto te
            respondo lo más pronto posible.
          </motion.div>
        </div>

        {/* ─── Two-column body ─── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          {/* LEFT — channels + socials */}
          <aside className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="md:sticky md:top-24"
            >
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                Información personal
              </p>

              <div className="divide-y divide-marsupial-purple/10 border-t border-b border-marsupial-purple/10">
                <ChannelRow
                  icon={Mail}
                  label="Correo Electrónico"
                  value="johana@marsupial.com.co"
                  href="mailto:johana@marsupial.com.co"
                  copyable
                />
                <ChannelRow
                  icon={Phone}
                  label="Teléfono"
                  value="+57 (317) 438-5716"
                  href="tel:+573174385716"
                  copyable
                />
                <ChannelRow
                  icon={MapPin}
                  label="Ubicación"
                  value="Bucaramanga · Colombia"
                  href={null}
                  copyable={false}
                />
              </div>

              <div className="mt-10">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                  Mis redes sociales
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SOCIAL_LINKS.map((link) => (
                    <SocialButton key={link.label} link={link} />
                  ))}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* RIGHT — form */}
          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-marsupial-purple/50">
                Envíame un mensaje
              </p>

              <div className="border-t border-marsupial-purple/10 pt-6">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <SuccessState
                      key="success"
                      onReset={() => setSent(false)}
                    />
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ContactForm onSent={() => setSent(true)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
