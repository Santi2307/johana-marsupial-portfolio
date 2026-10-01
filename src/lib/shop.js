// Datos de la tienda — edita aquí número de WhatsApp y reglas de envío
export const WHATSAPP_NUMBER = "573174385716";
export const ENVIO_GRATIS_DESDE = 250000;
export const COSTO_ENVIO = 15000;

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const formatPrecio = (valor) =>
  typeof valor === "number" ? cop.format(valor) : "Consultar";

export const whatsappUrl = (mensaje) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

export const lineKey = (id, color, talla) => `${id}|${color ?? ""}|${talla ?? ""}`;

export const mensajePedido = (items, subtotal, envio) => {
  const lineas = items.map(
    (it) =>
      `• ${it.cantidad} x ${it.nombre} (${it.referencia})` +
      `${it.color ? ` · ${it.color}` : ""} · Talla ${it.talla} — ${formatPrecio(
        it.precio * it.cantidad,
      )}`,
  );
  return [
    "Hola Johana, quiero hacer este pedido en Marsupial:",
    "",
    ...lineas,
    "",
    `Subtotal: ${formatPrecio(subtotal)}`,
    `Envío: ${envio === 0 ? "Gratis" : formatPrecio(envio)}`,
    `Total: ${formatPrecio(subtotal + envio)}`,
  ].join("\n");
};
