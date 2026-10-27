// Datos derivados (puros) del plan + progreso. El avance de actividades y el
// dominio declarado se calculan por separado y nunca se mezclan.
import type { Dia, Plan, Ruta } from "../tipos";
import {
  NIVELES_DOMINIO,
  type NivelDominio,
  type ProgresoRuta,
  type RegistroDificultad,
} from "./estado";

export type EstadoDia = "pendiente" | "parcial" | "completado";
export type PosicionDia = "pasado" | "hoy" | "futuro";

export function estadoDelDia(
  dia: Dia,
  completados: Record<string, string>,
): EstadoDia {
  const obligatorios = dia.bloques.filter((b) => !b.opcional);
  const hechos = obligatorios.filter((b) => b.id in completados).length;
  if (hechos === 0) return "pendiente";
  return hechos === obligatorios.length ? "completado" : "parcial";
}

export function posicionDelDia(numero: number, hoyNumero: number): PosicionDia {
  if (numero === hoyNumero) return "hoy";
  return numero < hoyNumero ? "pasado" : "futuro";
}

export interface Avance {
  completados: number;
  total: number;
  porcentaje: number;
}

/** Bloques del plan actual completados / bloques totales del plan. */
export function progresoGlobal(
  plan: Plan,
  completados: Record<string, string>,
): Avance {
  const ids = plan.dias.flatMap((d) =>
    d.bloques.filter((b) => !b.opcional).map((b) => b.id),
  );
  const hechos = ids.filter((id) => id in completados).length;
  return {
    completados: hechos,
    total: ids.length,
    porcentaje: ids.length === 0 ? 0 : Math.round((hechos * 100) / ids.length),
  };
}

/** Temas con al menos un día de estudio en el plan y todos esos días completados. */
export function temasEstudiados(
  ruta: Ruta,
  plan: Plan,
  completados: Record<string, string>,
): string[] {
  return ruta.temas
    .map((t) => t.slug)
    .filter((slug) => {
      const dias = plan.dias.filter(
        (d) => d.tipo === "estudio" && d.temaSlug === slug,
      );
      return (
        dias.length > 0 &&
        dias.every((d) => estadoDelDia(d, completados) === "completado")
      );
    });
}

export interface RepasoPendiente {
  subtemaSlug: string;
  diaNumero: number;
}

/** Repasos programados hasta hoy (inclusive) cuyo bloque Repaso no está marcado. */
export function repasosPendientes(
  plan: Plan,
  completados: Record<string, string>,
  hoyNumero: number,
): RepasoPendiente[] {
  const pendientes: RepasoPendiente[] = [];
  for (const dia of plan.dias) {
    if (dia.numero > hoyNumero) break;
    const bloque = dia.bloques.find((b) => b.tipo === "repaso");
    if (!bloque || bloque.id in completados) continue;
    for (const subtemaSlug of dia.repasoSlugs) {
      pendientes.push({ subtemaSlug, diaNumero: dia.numero });
    }
  }
  return pendientes;
}

export function dificultadesAbiertas(
  progreso: ProgresoRuta,
): RegistroDificultad[] {
  return progreso.dificultades.filter((d) => !d.resuelta);
}

/** Cuántos subtemas de la ruta hay en cada nivel declarado (sin declarar = sin-evaluar). */
export function resumenDominio(
  ruta: Ruta,
  progreso: ProgresoRuta,
): Record<NivelDominio, number> {
  const resumen = Object.fromEntries(
    NIVELES_DOMINIO.map((nivel) => [nivel, 0]),
  ) as Record<NivelDominio, number>;
  for (const subtema of ruta.temas.flatMap((t) => t.subtemas)) {
    resumen[progreso.dominio[subtema.slug]?.nivel ?? "sin-evaluar"] += 1;
  }
  return resumen;
}
