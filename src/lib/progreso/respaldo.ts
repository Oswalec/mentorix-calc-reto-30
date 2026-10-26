// Exportar e importar el progreso como archivo JSON (único "sincronizador").
import { diferenciaDias } from "../fechas";
import { migrar, type Estado } from "./estado";
import { validarEstado } from "./validar";

export const DIAS_RECORDATORIO_RESPALDO = 7;

export interface ResumenRespaldo {
  rutas: number;
  rutaActiva: string | null;
  bloquesCompletados: number;
  evaluaciones: number;
  dificultades: number;
}

export function nombreArchivoRespaldo(fecha: string): string {
  return `mentorix-reto-${fecha}.json`;
}

export function serializarRespaldo(estado: Estado): string {
  return `${JSON.stringify(estado, null, 2)}\n`;
}

export function resumirEstado(estado: Estado): ResumenRespaldo {
  const progresos = Object.values(estado.rutas);
  return {
    rutas: progresos.length,
    rutaActiva: estado.rutaActiva,
    bloquesCompletados: progresos.reduce(
      (total, p) => total + Object.keys(p.completados).length,
      0,
    ),
    evaluaciones: progresos.reduce((t, p) => t + p.evaluaciones.length, 0),
    dificultades: progresos.reduce((t, p) => t + p.dificultades.length, 0),
  };
}

function plural(n: number, singular: string, varios: string): string {
  return `${n} ${n === 1 ? singular : varios}`;
}

export function describirResumen(resumen: ResumenRespaldo): string {
  return [
    plural(resumen.rutas, "ruta", "rutas"),
    plural(
      resumen.bloquesCompletados,
      "bloque completado",
      "bloques completados",
    ),
    plural(resumen.evaluaciones, "evaluación", "evaluaciones"),
    plural(resumen.dificultades, "dificultad", "dificultades"),
  ].join(" · ");
}

/** Lee el texto de un archivo de respaldo. Nunca lanza: devuelve Error. */
export function leerRespaldo(
  texto: string,
): { estado: Estado; resumen: ResumenRespaldo } | Error {
  let datos: unknown;
  try {
    datos = JSON.parse(texto);
  } catch {
    return new Error("El archivo no es un respaldo válido: no es JSON.");
  }
  const estado = validarEstado(migrar(datos));
  if (estado instanceof Error) {
    return new Error(`El archivo no es un respaldo válido. ${estado.message}`);
  }
  return { estado, resumen: resumirEstado(estado) };
}

function hayProgreso(estado: Estado): boolean {
  const r = resumirEstado(estado);
  return r.bloquesCompletados + r.evaluaciones + r.dificultades > 0;
}

/** true si hay progreso y nunca se exportó, o el último respaldo tiene 7 días o más. */
export function necesitaRecordatorio(estado: Estado, hoy: string): boolean {
  if (!hayProgreso(estado)) return false;
  if (estado.ultimoRespaldo === null) return true;
  return (
    diferenciaDias(estado.ultimoRespaldo, hoy) >= DIAS_RECORDATORIO_RESPALDO
  );
}

/** Descarga `texto` como archivo en el navegador. */
export function descargarTexto(nombre: string, texto: string): void {
  const blob = new Blob([texto], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}
