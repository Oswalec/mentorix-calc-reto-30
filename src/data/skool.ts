// Enlaces a las lecciones del acompañamiento en Skool (comunidad mentorix-8847).
// Única fuente de URLs: si el docente reorganiza Skool, se actualiza aquí y en
// los archivos de rutas que llaman a `leccion()`. Los IDs se leyeron de Skool
// el 2026-10-27. Solo se enlaza: la app nunca copia contenido de las lecciones.
import type { Enlace } from "../lib/tipos";

const BASE = "https://www.skool.com/mentorix-8847/classroom";

export const CURSOS = {
  introduccion: "d853019a",
  funciones: "35137bcf",
  limites: "1d1d6b19",
  continuidad: "b362f1e5",
  derivadas: "eef7cc3c",
  integrales: "da5d25ca",
  parametricas: "f04e57c3",
  polares: "41746eb9",
} as const;

export type Curso = keyof typeof CURSOS;

/** Enlace a una lección concreta (`id` = parámetro `md` de Skool). */
export function leccion(curso: Curso, titulo: string, id: string): Enlace {
  return { titulo, url: `${BASE}/${CURSOS[curso]}?md=${id}` };
}

/** Enlace a la portada de un curso completo. */
export function cursoCompleto(curso: Curso, titulo: string): Enlace {
  return { titulo, url: `${BASE}/${CURSOS[curso]}` };
}
