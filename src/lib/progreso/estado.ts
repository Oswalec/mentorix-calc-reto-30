// Modelo de progreso guardado en localStorage bajo CLAVE_ALMACEN.
// Cambiar esta forma exige subir VERSION_ESTADO y ampliar migrar().
import type { ConfigPlan } from "../tipos";

export const CLAVE_ALMACEN = "mentorix-reto:v1";
/** Copia intacta de datos que no pasaron la validación. Nunca se borra sola. */
export const CLAVE_DANADA = "mentorix-reto:v1:danado";
export const VERSION_ESTADO = 1;

export type NivelDominio =
  "sin-evaluar" | "en-progreso" | "inseguro" | "dominado";

export const NIVELES_DOMINIO: NivelDominio[] = [
  "sin-evaluar",
  "en-progreso",
  "inseguro",
  "dominado",
];

export interface Evaluacion {
  id: string;
  diaNumero: number;
  /** Tema evaluado; null en el simulacro. */
  temaSlug: string | null;
  /** YYYY-MM-DD */
  fecha: string;
  nota: number | null;
  notaMaxima: number | null;
  errores: string;
  temasAReforzar: string[];
}

export interface RegistroDificultad {
  id: string;
  /** YYYY-MM-DD */
  fecha: string;
  subtemaSlug: string | null;
  texto: string;
  resuelta: boolean;
}

export interface DominioSubtema {
  nivel: NivelDominio;
  evidencia: string;
  /** YYYY-MM-DD */
  fecha: string;
}

export interface ProgresoRuta {
  config: ConfigPlan;
  /** bloqueId → instante ISO en que se marcó. */
  completados: Record<string, string>;
  evaluaciones: Evaluacion[];
  dificultades: RegistroDificultad[];
  /** subtemaSlug → dominio declarado por el estudiante. */
  dominio: Record<string, DominioSubtema>;
  /** String(diaNumero) → reflexión del día. */
  reflexiones: Record<string, string>;
}

export interface Estado {
  version: 1;
  rutaActiva: string | null;
  /** YYYY-MM-DD del último respaldo exportado; null si nunca. */
  ultimoRespaldo: string | null;
  rutas: Record<string, ProgresoRuta>;
}

export function estadoInicial(): Estado {
  return { version: 1, rutaActiva: null, ultimoRespaldo: null, rutas: {} };
}

export function progresoInicial(config: ConfigPlan): ProgresoRuta {
  return {
    config,
    completados: {},
    evaluaciones: [],
    dificultades: [],
    dominio: {},
    reflexiones: {},
  };
}

/**
 * Lleva datos guardados por versiones anteriores a la forma actual.
 * Hoy solo existe la versión 1: se devuelve tal cual y validarEstado decide.
 */
export function migrar(datos: unknown): unknown {
  return datos;
}
