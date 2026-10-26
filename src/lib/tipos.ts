// Tipos del dominio. Única fuente de las formas de rutas, planes y bloques.

/** 1 = baja, 2 = media, 3 = alta. */
export type Dificultad = 1 | 2 | 3;

export interface Subtema {
  /** Identificador estable. Nunca se renombra una vez publicado. */
  slug: string;
  nombre: string;
  /** Días de estudio que consume. Entero >= 1. El plan nunca lo reduce. */
  diasEstimados: number;
  dificultad: Dificultad;
}

export interface Tema {
  slug: string;
  nombre: string;
  /** Slugs de temas (de esta u otra ruta) que conviene dominar antes. */
  prerrequisitos: string[];
  subtemas: Subtema[];
}

export interface Ruta {
  slug: string;
  nombre: string;
  descripcion: string;
  temas: Tema[];
}

export interface Refuerzo {
  /** Slug de un tema que algún tema de la ruta declara como prerrequisito. */
  temaSlug: string;
  /** Días de refuerzo, entero 1..7. */
  dias: number;
}

export interface ConfigPlan {
  /** Fecha local YYYY-MM-DD del día 1. */
  fechaInicio: string;
  /** Entero 7..120. */
  horizonteDias: number;
  /** Múltiplo de 5 entre 60 y 360. */
  minutosPorDia: number;
  /** Cada cuántos días hay un día ligero de repaso. 0 = nunca. */
  diaLigeroCada: number;
  refuerzos: Refuerzo[];
}

export type TipoDia =
  "estudio" | "refuerzo" | "evaluacion" | "correccion" | "repaso" | "simulacro";

export type TipoBloque =
  | "recuperar"
  | "teoria"
  | "ejemplos"
  | "practica"
  | "evaluacion"
  | "descanso"
  | "repaso"
  | "cierre";

export interface Bloque {
  /** `${rutaSlug}:${tipoDia}:${clave}:${tipoBloque}` — ver generador.ts. */
  id: string;
  tipo: TipoBloque;
  titulo: string;
  instruccion: string;
  minutos: number;
  subtemaSlug?: string;
}

export interface Dia {
  /** 1..horizonteDias */
  numero: number;
  /** YYYY-MM-DD */
  fecha: string;
  tipo: TipoDia;
  /** Tema estudiado, reforzado o evaluado; null en repaso, simulacro y su corrección. */
  temaSlug: string | null;
  /** Subtema estudiado; solo en días de estudio. */
  subtemaSlug: string | null;
  /** Título corto para el calendario. */
  titulo: string;
  objetivo: string;
  queEstudiar: string;
  queHacer: string;
  /** Textos de repaso espaciado programados para este día. */
  repaso: string[];
  /** Slugs de los subtemas cuyo repaso espaciado cae en este día. */
  repasoSlugs: string[];
  bloques: Bloque[];
  cierre: string[];
  siguientePaso: string;
}

export interface SubtemaRef {
  temaSlug: string;
  subtemaSlug: string;
  nombre: string;
  diasEstimados: number;
}

export interface Plan {
  dias: Dia[];
  fueraDelHorizonte: SubtemaRef[];
}
