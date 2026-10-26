// Ajustes del plan: funciones puras sobre ConfigPlan. Nunca tocan el progreso:
// como los IDs de bloque no dependen de fechas, los completados se conservan.
import type { ConfigPlan, Ruta } from "../tipos";

export const HORIZONTE_MIN = 7;
export const HORIZONTE_MAX = 120;
export const REFUERZO_MAX = 7;

export function configInicial(fechaInicio: string): ConfigPlan {
  return {
    fechaInicio,
    horizonteDias: 30,
    minutosPorDia: 120,
    diaLigeroCada: 7,
    refuerzos: [],
  };
}

export function cambiarDuracion(
  config: ConfigPlan,
  horizonteDias: number,
): ConfigPlan {
  if (
    !Number.isInteger(horizonteDias) ||
    horizonteDias < HORIZONTE_MIN ||
    horizonteDias > HORIZONTE_MAX
  ) {
    throw new RangeError(
      `La duración debe estar entre ${HORIZONTE_MIN} y ${HORIZONTE_MAX} días.`,
    );
  }
  return { ...config, horizonteDias };
}

export function extenderHorizonte(
  config: ConfigPlan,
  diasExtra: number,
): ConfigPlan {
  if (!Number.isInteger(diasExtra) || diasExtra < 1) {
    throw new RangeError("La extensión debe ser de al menos 1 día.");
  }
  return cambiarDuracion(config, config.horizonteDias + diasExtra);
}

/** `dias` = 0 quita el refuerzo; 1..7 lo crea o lo reemplaza. */
export function fijarRefuerzo(
  config: ConfigPlan,
  temaSlug: string,
  dias: number,
): ConfigPlan {
  if (!Number.isInteger(dias) || dias < 0 || dias > REFUERZO_MAX) {
    throw new RangeError(
      `El refuerzo debe durar entre 0 y ${REFUERZO_MAX} días.`,
    );
  }
  const otros = config.refuerzos.filter((r) => r.temaSlug !== temaSlug);
  return {
    ...config,
    refuerzos: dias === 0 ? otros : [...otros, { temaSlug, dias }],
  };
}

export interface PrerrequisitoDisponible {
  temaSlug: string;
  nombre: string;
  /** Nombres de los temas de la ruta que lo declaran como prerrequisito. */
  requeridoPor: string[];
}

/** Prerrequisitos que la ruta declara, en orden de primera aparición. */
export function prerrequisitosDeRuta(
  ruta: Ruta,
  catalogo: Ruta[],
): PrerrequisitoDisponible[] {
  const resultado: PrerrequisitoDisponible[] = [];
  for (const tema of ruta.temas) {
    for (const slug of tema.prerrequisitos) {
      let entrada = resultado.find((p) => p.temaSlug === slug);
      if (!entrada) {
        const nombre =
          catalogo.flatMap((r) => r.temas).find((t) => t.slug === slug)
            ?.nombre ?? slug;
        entrada = { temaSlug: slug, nombre, requeridoPor: [] };
        resultado.push(entrada);
      }
      entrada.requeridoPor.push(tema.nombre);
    }
  }
  return resultado;
}
