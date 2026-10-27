// Generador del plan: función pura, fuente de verdad del calendario.
// Especificación completa en blueprint §4 «Algoritmo del plan».
import { esFechaValida, sumarDias } from "../fechas";
import type {
  Bloque,
  ConfigPlan,
  Dia,
  Dificultad,
  Enlace,
  Plan,
  Prerrequisito,
  Ruta,
  Subtema,
  SubtemaRef,
  Tema,
  TipoBloque,
  TipoDia,
} from "../tipos";
import { minutosDelDia, repartirMinutos, repartoDelDia } from "./minutos";

export const DESPLAZAMIENTOS_REPASO = [1, 3, 7, 14] as const;

export const CIERRE_SESION = [
  "Marca los bloques que completaste.",
  "Registra los errores o dificultades que encontraste.",
  "Escribe en una frase qué aprendiste hoy.",
];

export const AUTOEVALUACION =
  "Autoevalúate: ¿podrías resolver sin mirar un ejercicio de cada tema de hoy? Registra lo que te costó.";

type Unidad =
  | { tipo: "estudio"; tema: Tema; subtema: Subtema; k: number; total: number }
  | {
      tipo: "refuerzo";
      prerrequisito: Prerrequisito;
      para: Tema;
      k: number;
      total: number;
    }
  | { tipo: "evaluacion" | "correccion"; tema: Tema };

interface Grupo {
  tema: Tema;
  subtema: Subtema;
  unidades: Unidad[];
}

type Asignacion =
  | { tipo: "unidad"; unidad: Unidad }
  | { tipo: "repaso" }
  | { tipo: "simulacro" }
  | { tipo: "correccion-final" };

/** Devuelve la lista de errores de la configuración; vacía si es válida. */
export function erroresConfig(config: ConfigPlan): string[] {
  const errores: string[] = [];
  if (!esFechaValida(config.fechaInicio)) {
    errores.push("La fecha de inicio debe tener el formato AAAA-MM-DD.");
  }
  if (
    !Number.isInteger(config.horizonteDias) ||
    config.horizonteDias < 3 ||
    config.horizonteDias > 120
  ) {
    errores.push("La duración debe ser un número entero entre 3 y 120 días.");
  }
  if (
    !Number.isInteger(config.minutosPorDia) ||
    config.minutosPorDia % 5 !== 0 ||
    config.minutosPorDia < 60 ||
    config.minutosPorDia > 360
  ) {
    errores.push(
      "Los minutos por día deben ser un múltiplo de 5 entre 60 y 360.",
    );
  }
  if (
    !Number.isInteger(config.diaLigeroCada) ||
    config.diaLigeroCada < 0 ||
    config.diaLigeroCada > 30
  ) {
    errores.push("El día ligero debe ser un entero entre 0 y 30.");
  }
  for (const refuerzo of config.refuerzos) {
    if (
      !Number.isInteger(refuerzo.dias) ||
      refuerzo.dias < 1 ||
      refuerzo.dias > 7
    ) {
      errores.push(
        `El refuerzo de ${refuerzo.temaSlug} debe durar entre 1 y 7 días.`,
      );
    }
  }
  return errores;
}

/**
 * `extras` = días de estudio añadidos a cada subtema cuando la duración
 * elegida supera lo que el contenido necesita (ver repartirExtras).
 */
function construirGrupos(
  ruta: Ruta,
  config: ConfigPlan,
  extras: ReadonlyMap<string, number>,
): Grupo[] {
  const grupos: Grupo[] = [];
  const usados = new Set<string>();
  for (const tema of ruta.temas) {
    const refuerzos: Unidad[] = [];
    for (const prerrequisito of tema.prerrequisitos) {
      const refuerzo = config.refuerzos.find(
        (r) => r.temaSlug === prerrequisito.slug,
      );
      if (!refuerzo || refuerzo.dias < 1 || usados.has(prerrequisito.slug)) {
        continue;
      }
      usados.add(prerrequisito.slug);
      for (let k = 1; k <= refuerzo.dias; k++) {
        refuerzos.push({
          tipo: "refuerzo",
          prerrequisito,
          para: tema,
          k,
          total: refuerzo.dias,
        });
      }
    }
    tema.subtemas.forEach((subtema, indice) => {
      const unidades: Unidad[] = indice === 0 ? [...refuerzos] : [];
      const total = subtema.diasEstimados + (extras.get(subtema.slug) ?? 0);
      for (let k = 1; k <= total; k++) {
        unidades.push({ tipo: "estudio", tema, subtema, k, total });
      }
      if (indice === tema.subtemas.length - 1 && !tema.sinEvaluacion) {
        unidades.push({ tipo: "evaluacion", tema });
        unidades.push({ tipo: "correccion", tema });
      }
      grupos.push({ tema, subtema, unidades });
    });
  }
  return grupos;
}

/**
 * Reparte `sobrantes` días de estudio extra, una vuelta tras otra, sobre los
 * subtemas ordenados por dificultad (3, luego 2, luego 1; en orden de ruta).
 */
export function repartirExtras(
  ruta: Ruta,
  sobrantes: number,
): Map<string, number> {
  const extras = new Map<string, number>();
  const orden = ruta.temas
    .flatMap((t) => t.subtemas)
    .map((subtema, indice) => ({ subtema, indice }))
    .sort(
      (a, b) =>
        b.subtema.dificultad - a.subtema.dificultad || a.indice - b.indice,
    )
    .map(({ subtema }) => subtema.slug);
  for (let i = 0; i < sobrantes && orden.length > 0; i++) {
    const slug = orden[i % orden.length]!;
    extras.set(slug, (extras.get(slug) ?? 0) + 1);
  }
  return extras;
}

function referencia(grupo: Grupo): SubtemaRef {
  return {
    temaSlug: grupo.tema.slug,
    subtemaSlug: grupo.subtema.slug,
    nombre: grupo.subtema.nombre,
    diasEstimados: grupo.subtema.diasEstimados,
  };
}

interface Textos {
  tipo: TipoDia;
  enlaces: Partial<Record<TipoBloque, Enlace[] | undefined>>;
  opcionales: Enlace[];
  autoevaluacion: boolean;
  temaSlug: string | null;
  subtemaSlug: string | null;
  clave: string;
  titulo: string;
  objetivo: string;
  queEstudiar: string;
  queHacer: string;
  dificultad: Dificultad;
  instrucciones: Partial<Record<TipoBloque, string>>;
  titulos: Partial<Record<TipoBloque, string>>;
}

function textosDeUnidad(unidad: Unidad): Textos {
  if (unidad.tipo === "estudio") {
    const { tema, subtema, k, total } = unidad;
    const tramo = total > 1 ? ` (día ${k} de ${total})` : "";
    return {
      tipo: "estudio",
      enlaces: {
        teoria: subtema.teoria,
        ejemplos: subtema.ejemplos,
        practica: subtema.practica,
      },
      opcionales: k === total ? (subtema.opcionales ?? []) : [],
      autoevaluacion: Boolean(tema.sinEvaluacion),
      temaSlug: tema.slug,
      subtemaSlug: subtema.slug,
      clave: `${subtema.slug}#${k}`,
      titulo: subtema.nombre,
      objetivo: `Comprender y practicar «${subtema.nombre}»${tramo}.`,
      queEstudiar: `${tema.nombre} › ${subtema.nombre}`,
      queHacer:
        "Estudia la teoría con los videos y materiales de tu acompañamiento, analiza un ejercicio resuelto y resuelve los ejercicios básicos; si te sobra tiempo, sigue con los adicionales.",
      dificultad: subtema.dificultad,
      instrucciones: {
        teoria: `Estudia la teoría de «${subtema.nombre}» con los videos y materiales de tu acompañamiento.`,
        ejemplos: `Analiza un ejercicio resuelto de «${subtema.nombre}»: identifica qué se hace en cada paso y por qué.`,
        practica: `Resuelve los ejercicios básicos de «${subtema.nombre}»; si terminas, continúa con los ejercicios adicionales.`,
      },
      titulos: {},
    };
  }
  if (unidad.tipo === "refuerzo") {
    const { prerrequisito, para, k, total } = unidad;
    const nombre = prerrequisito.nombre;
    const tramo = total > 1 ? ` (día ${k} de ${total})` : "";
    return {
      tipo: "refuerzo",
      enlaces: { teoria: prerrequisito.enlaces },
      opcionales: [],
      autoevaluacion: false,
      temaSlug: prerrequisito.slug,
      subtemaSlug: null,
      clave: `${prerrequisito.slug}#${k}`,
      titulo: `Refuerzo: ${nombre}`,
      objetivo: `Reforzar «${nombre}» antes de empezar «${para.nombre}»${tramo}.`,
      queEstudiar: `Refuerzo de prerrequisito: ${nombre}`,
      queHacer: `Repasa la teoría de «${nombre}» en los materiales de tu acompañamiento y resuelve ejercicios básicos de ese tema para llegar preparado a «${para.nombre}».`,
      dificultad: 2,
      instrucciones: {
        teoria: `Repasa la teoría de «${nombre}» con los videos y materiales de tu acompañamiento.`,
        ejemplos: `Analiza un ejercicio resuelto de «${nombre}».`,
        practica: `Resuelve ejercicios básicos de «${nombre}».`,
      },
      titulos: {},
    };
  }
  const { tema } = unidad;
  if (unidad.tipo === "evaluacion") {
    return {
      tipo: "evaluacion",
      enlaces: {},
      opcionales: [],
      autoevaluacion: false,
      temaSlug: tema.slug,
      subtemaSlug: null,
      clave: tema.slug,
      titulo: `Evaluación: ${tema.nombre}`,
      objetivo: `Medir tu dominio de «${tema.nombre}» en condiciones de examen.`,
      queEstudiar: `${tema.nombre} (todos sus subtemas)`,
      queHacer: `Practica con exámenes de años anteriores sobre ${tema.nombre}: con tiempo limitado y sin consultar tus apuntes. Luego registra tu nota, tus errores y los temas a reforzar.`,
      dificultad: 2,
      instrucciones: {
        evaluacion: `Practica con exámenes de años anteriores sobre ${tema.nombre}, con tiempo limitado y sin consultar tus apuntes.`,
      },
      titulos: { evaluacion: "Examen" },
    };
  }
  return {
    tipo: "correccion",
    enlaces: {},
    opcionales: [],
    autoevaluacion: false,
    temaSlug: tema.slug,
    subtemaSlug: null,
    clave: tema.slug,
    titulo: `Corrección: ${tema.nombre}`,
    objetivo: `Entender cada error del examen de «${tema.nombre}».`,
    queEstudiar: `Tus errores del examen de ${tema.nombre}`,
    queHacer:
      "Revisa los errores cometidos y programa un repaso de los subtemas donde fallaste.",
    dificultad: 2,
    instrucciones: {
      practica:
        "Rehaz cada ejercicio que fallaste usando los ejercicios resueltos de tu acompañamiento como guía.",
    },
    titulos: { practica: "Corrección" },
  };
}

function textosSinUnidad(
  asignacion: Asignacion,
  ruta: Ruta,
  ordinalRepaso: number,
): Textos {
  if (asignacion.tipo === "simulacro") {
    const queHacer =
      "Completa el simulacro que tienes disponible en tu acompañamiento, con el tiempo real del examen.";
    return {
      tipo: "simulacro",
      enlaces: {},
      opcionales: [],
      autoevaluacion: false,
      temaSlug: null,
      subtemaSlug: null,
      clave: "final",
      titulo: "Simulacro",
      objetivo: "Comprobar tu preparación con un examen completo.",
      queEstudiar: `Toda la ruta: ${ruta.nombre}`,
      queHacer,
      dificultad: 2,
      instrucciones: { evaluacion: queHacer },
      titulos: { evaluacion: "Simulacro" },
    };
  }
  if (asignacion.tipo === "correccion-final") {
    return {
      tipo: "correccion",
      enlaces: {},
      opcionales: [],
      autoevaluacion: false,
      temaSlug: null,
      subtemaSlug: null,
      clave: "final",
      titulo: "Corrección del simulacro",
      objetivo: "Convertir los errores del simulacro en un plan de repaso.",
      queEstudiar: "Tus errores del simulacro",
      queHacer:
        "Revisa los errores cometidos en el simulacro y programa un repaso de los temas a reforzar.",
      dificultad: 2,
      instrucciones: {
        practica:
          "Rehaz cada ejercicio que fallaste usando los ejercicios resueltos de tu acompañamiento como guía.",
      },
      titulos: { practica: "Corrección" },
    };
  }
  return {
    tipo: "repaso",
    enlaces: {},
    opcionales: [],
    autoevaluacion: false,
    temaSlug: null,
    subtemaSlug: null,
    clave: `rep-${ordinalRepaso}`,
    titulo: "Repaso",
    objetivo:
      "Consolidar lo estudiado con recuperación activa y repaso espaciado, sin teoría nueva.",
    queEstudiar: "Temas ya estudiados",
    queHacer:
      "Haz recuperación activa de lo estudiado y repasa los subtemas programados. Hoy no hay teoría nueva.",
    dificultad: 2,
    instrucciones: {},
    titulos: {},
  };
}

const TITULOS_BLOQUE: Record<TipoBloque, string> = {
  recuperar: "Recuperar",
  teoria: "Teoría",
  ejemplos: "Ejemplos resueltos",
  practica: "Práctica",
  evaluacion: "Examen",
  descanso: "Descanso",
  repaso: "Repaso",
  cierre: "Cierre",
  opcional: "Opcional",
};

function construirBloques(
  rutaSlug: string,
  textos: Textos,
  minutosPorDia: number,
  nombresRepaso: string[],
): Bloque[] {
  const { pesos, residuo } = repartoDelDia(textos.tipo, textos.dificultad);
  const total = minutosDelDia(textos.tipo, minutosPorDia);
  const bloques = repartirMinutos(total, pesos, residuo).map(
    ([tipo, minutos]) => {
      let instruccion = textos.instrucciones[tipo];
      if (tipo === "recuperar") {
        instruccion =
          "Sin mirar tus apuntes, escribe lo que recuerdas de lo que estudiaste antes; luego compáralo con tus notas.";
      } else if (tipo === "descanso") {
        instruccion = `Pausa de ${minutos} minutos sin pantallas: camina, estira el cuerpo, toma agua.`;
      } else if (tipo === "repaso") {
        instruccion =
          nombresRepaso.length > 0
            ? `Repaso espaciado: ${nombresRepaso.map((n) => `«${n}»`).join(", ")}. Resuelve de memoria un ejercicio básico de cada uno.`
            : "Repasa tus apuntes y los errores que registraste en días anteriores.";
      } else if (tipo === "cierre") {
        instruccion =
          "Revisa la lista de cierre de sesión y registra tus errores o dificultades.";
      }
      const bloque: Bloque = {
        id: `${rutaSlug}:${textos.tipo}:${textos.clave}:${tipo}`,
        tipo,
        titulo: textos.titulos[tipo] ?? TITULOS_BLOQUE[tipo],
        instruccion: instruccion ?? "",
        minutos,
      };
      if (
        textos.subtemaSlug &&
        (tipo === "teoria" || tipo === "ejemplos" || tipo === "practica")
      ) {
        bloque.subtemaSlug = textos.subtemaSlug;
      }
      const enlaces = textos.enlaces[tipo];
      if (enlaces && enlaces.length > 0) bloque.enlaces = enlaces;
      return bloque;
    },
  );
  if (textos.opcionales.length > 0) {
    bloques.push({
      id: `${rutaSlug}:${textos.tipo}:${textos.clave}:opcional`,
      tipo: "opcional",
      titulo: TITULOS_BLOQUE.opcional,
      instruccion:
        "Si tu curso lo pide: elige solo los módulos que tu universidad incluye en el sílabo. No suma tiempo ni cuenta para tu avance.",
      minutos: 0,
      enlaces: textos.opcionales,
      opcional: true,
    });
  }
  return bloques;
}

/**
 * Genera el plan de una ruta. Pura: misma entrada, misma salida.
 * Lanza RangeError si la configuración es inválida (ver erroresConfig).
 */
export function generarPlan(ruta: Ruta, config: ConfigPlan): Plan {
  const errores = erroresConfig(config);
  if (errores.length > 0) throw new RangeError(errores.join(" "));

  const horizonte = config.horizonteDias;
  const esLigero = (n: number) =>
    config.diaLigeroCada > 0 && n % config.diaLigeroCada === 0;

  // 0. Si la duración supera lo que el contenido necesita, el plan se estira:
  //    primero se reservan simulacro + corrección (si la ruta tiene
  //    evaluaciones) y el resto son días de estudio extra (repartirExtras).
  let libresTotales = 0;
  for (let n = 1; n <= horizonte; n++) if (!esLigero(n)) libresTotales++;
  const necesarios = construirGrupos(ruta, config, new Map()).reduce(
    (t, g) => t + g.unidades.length,
    0,
  );
  const tieneEvaluaciones = ruta.temas.some((t) => !t.sinEvaluacion);
  let sobrantes = Math.max(libresTotales - necesarios, 0);
  if (tieneEvaluaciones) sobrantes = Math.max(sobrantes - 2, 0);
  const extras = repartirExtras(ruta, sobrantes);

  // 1. Colocar los grupos de contenido sin comprimir nada.
  const asignaciones: Asignacion[] = [];
  for (let n = 1; n <= horizonte; n++) {
    asignaciones[n] = { tipo: "repaso" };
  }
  const fueraDelHorizonte: SubtemaRef[] = [];
  let cursor = 1;
  let desbordado = false;
  for (const grupo of construirGrupos(ruta, config, extras)) {
    if (desbordado) {
      fueraDelHorizonte.push(referencia(grupo));
      continue;
    }
    let disponibles = 0;
    for (let n = cursor; n <= horizonte; n++) {
      if (!esLigero(n)) disponibles++;
    }
    if (disponibles < grupo.unidades.length) {
      desbordado = true;
      fueraDelHorizonte.push(referencia(grupo));
      continue;
    }
    for (const unidad of grupo.unidades) {
      while (esLigero(cursor)) cursor++;
      asignaciones[cursor] = { tipo: "unidad", unidad };
      cursor++;
    }
  }

  // 2. Días libres al final: simulacro + corrección si todo cupo; el resto, repaso.
  const libres: number[] = [];
  for (let n = cursor; n <= horizonte; n++) {
    if (!esLigero(n)) libres.push(n);
  }
  if (!desbordado && tieneEvaluaciones && libres.length >= 2) {
    asignaciones[libres[libres.length - 2]!] = { tipo: "simulacro" };
    asignaciones[libres[libres.length - 1]!] = { tipo: "correccion-final" };
  }

  // 3. Repaso espaciado: d+1, d+3, d+7, d+14 desde el último día de estudio.
  const repasos: Array<Array<{ slug: string; nombre: string; dia: number }>> =
    [];
  for (let n = 1; n <= horizonte; n++) repasos[n] = [];
  for (let n = 1; n <= horizonte; n++) {
    const asignacion = asignaciones[n]!;
    if (asignacion.tipo !== "unidad" || asignacion.unidad.tipo !== "estudio") {
      continue;
    }
    const { subtema, k, total } = asignacion.unidad;
    if (k !== total) continue;
    for (const desplazamiento of DESPLAZAMIENTOS_REPASO) {
      const destino = n + desplazamiento;
      if (destino <= horizonte) {
        repasos[destino]!.push({
          slug: subtema.slug,
          nombre: subtema.nombre,
          dia: n,
        });
      }
    }
  }

  // 4. Construir los días.
  const textosPorDia: Textos[] = [];
  let ordinalRepaso = 0;
  for (let n = 1; n <= horizonte; n++) {
    const asignacion = asignaciones[n]!;
    if (asignacion.tipo === "repaso") ordinalRepaso++;
    textosPorDia[n] =
      asignacion.tipo === "unidad"
        ? textosDeUnidad(asignacion.unidad)
        : textosSinUnidad(asignacion, ruta, ordinalRepaso);
  }

  const dias: Dia[] = [];
  for (let n = 1; n <= horizonte; n++) {
    const textos = textosPorDia[n]!;
    const programados = repasos[n]!;
    const siguiente = n < horizonte ? textosPorDia[n + 1]! : null;
    dias.push({
      numero: n,
      fecha: sumarDias(config.fechaInicio, n - 1),
      tipo: textos.tipo,
      temaSlug: textos.temaSlug,
      subtemaSlug: textos.subtemaSlug,
      titulo: textos.titulo,
      objetivo: textos.objetivo,
      queEstudiar: textos.queEstudiar,
      queHacer: textos.queHacer,
      repaso: programados.map(
        (r) => `Repasa «${r.nombre}» (lo estudiaste el día ${r.dia}).`,
      ),
      repasoSlugs: programados.map((r) => r.slug),
      bloques: construirBloques(
        ruta.slug,
        textos,
        config.minutosPorDia,
        programados.map((r) => r.nombre),
      ),
      cierre: textos.autoevaluacion
        ? [...CIERRE_SESION, AUTOEVALUACION]
        : [...CIERRE_SESION],
      siguientePaso: siguiente
        ? `Día ${n + 1}: ${siguiente.titulo}.`
        : (ruta.mensajeFinal ??
          "Fin del horizonte: revisa tu progreso y, si aún tienes temas pendientes, extiende la ruta."),
    });
  }

  return { dias, fueraDelHorizonte };
}
