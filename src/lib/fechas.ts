// Fechas locales como cadenas YYYY-MM-DD. Sin zonas horarias: la aritmética
// se hace en UTC sobre días calendario, así que "hoy" nunca se corre.

const DIA_MS = 86_400_000;
const PATRON = /^(\d{4})-(\d{2})-(\d{2})$/;
const DIAS_SEMANA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

function aMilisegundos(fecha: string): number {
  const partes = PATRON.exec(fecha);
  if (!partes) throw new RangeError(`Fecha inválida: ${fecha}`);
  const [anio, mes, dia] = [
    Number(partes[1]),
    Number(partes[2]),
    Number(partes[3]),
  ];
  const ms = Date.UTC(anio, mes - 1, dia);
  const control = new Date(ms);
  if (
    control.getUTCFullYear() !== anio ||
    control.getUTCMonth() !== mes - 1 ||
    control.getUTCDate() !== dia
  ) {
    throw new RangeError(`Fecha inválida: ${fecha}`);
  }
  return ms;
}

function aCadena(ms: number): string {
  const d = new Date(ms);
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dia = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${mes}-${dia}`;
}

export function esFechaValida(fecha: string): boolean {
  try {
    aMilisegundos(fecha);
    return true;
  } catch {
    return false;
  }
}

export function sumarDias(fecha: string, dias: number): string {
  return aCadena(aMilisegundos(fecha) + dias * DIA_MS);
}

/** Días calendario de `desde` a `hasta` (negativo si `hasta` es anterior). */
export function diferenciaDias(desde: string, hasta: string): number {
  return Math.round((aMilisegundos(hasta) - aMilisegundos(desde)) / DIA_MS);
}

/** Fecha local del dispositivo, como YYYY-MM-DD. */
export function hoyLocal(ahora: Date = new Date()): string {
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

/** Número de día del plan que corresponde a `hoy` (1 = fechaInicio). */
export function numeroDelDia(fechaInicio: string, hoy: string): number {
  return diferenciaDias(fechaInicio, hoy) + 1;
}

/** "dom 1 mar 2026" — sin Intl, para que no dependa del idioma del navegador. */
export function formatearFecha(fecha: string): string {
  const d = new Date(aMilisegundos(fecha));
  return `${DIAS_SEMANA[d.getUTCDay()]} ${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
