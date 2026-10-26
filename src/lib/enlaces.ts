/** Enlace interno con la base del sitio: enlace("hoy/") → "/mentorix-calc-reto-30/hoy/". */
export function enlace(ruta: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  return base + ruta.replace(/^\//, "");
}

/** Enlace al detalle de un día: /dia/?n=<numero>. */
export function enlaceDia(numero: number): string {
  return `${enlace("dia/")}?n=${numero}`;
}
