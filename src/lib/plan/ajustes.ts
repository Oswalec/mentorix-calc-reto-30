// Ajustes del plan: funciones puras sobre ConfigPlan. Nunca tocan el progreso:
// como los IDs de bloque no dependen de fechas, los completados se conservan.
import type { ConfigPlan, Ruta } from "../tipos";

export const HORIZONTE_MIN = 3;
export const HORIZONTE_MAX = 120;
export const REFUERZO_MAX = 7;

/** Configuración con la que arranca una ruta: su duración y minutos base. */
export function configInicial(fechaInicio: string, ruta?: Ruta): ConfigPlan {
  return {
    fechaInicio,
    horizonteDias: ruta?.horizonteBase ?? 30,
    minutosPorDia: ruta?.minutosBase ?? 120,
    diaLigeroCada: 7,
    refuerzos: [],
  };
}

export interface OpcionDuracion {
  dias: number;
  ritmo: string;
  minutos: number;
}

/**
 * Duraciones sugeridas: la base (intensivo) y 4/3, 5/3 y 2 veces la base.
 * Con más días el plan se estira y bastan menos minutos por día.
 */
export function opcionesDuracion(ruta: Ruta): OpcionDuracion[] {
  const base = ruta.horizonteBase;
  return [
    { dias: base, ritmo: "Intensivo", minutos: ruta.minutosBase },
    { dias: Math.round((base * 4) / 3), ritmo: "Normal", minutos: 120 },
    { dias: Math.round((base * 5) / 3), ritmo: "Tranquilo", minutos: 100 },
    { dias: base * 2, ritmo: "Muy tranquilo", minutos: 90 },
  ];
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
export function prerrequisitosDeRuta(ruta: Ruta): PrerrequisitoDisponible[] {
  const resultado: PrerrequisitoDisponible[] = [];
  for (const tema of ruta.temas) {
    for (const prerrequisito of tema.prerrequisitos) {
      let entrada = resultado.find((p) => p.temaSlug === prerrequisito.slug);
      if (!entrada) {
        entrada = {
          temaSlug: prerrequisito.slug,
          nombre: prerrequisito.nombre,
          requeridoPor: [],
        };
        resultado.push(entrada);
      }
      entrada.requeridoPor.push(tema.nombre);
    }
  }
  return resultado;
}
