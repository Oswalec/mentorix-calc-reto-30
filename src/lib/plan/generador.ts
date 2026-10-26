// Generador del plan: función pura, fuente de verdad del calendario.
// Especificación completa en blueprint §4 «Algoritmo del plan».
import { esFechaValida, sumarDias } from "../fechas";
import type {
  Bloque,
  ConfigPlan,
  Dia,
  Dificultad,
  Plan,
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

type Unidad =
  | { tipo: "estudio"; tema: Tema; subtema: Subtema; k: number }
  | {
      tipo: "refuerzo";
      prerrequisito: string;
      nombre: string;
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
    config.horizonteDias < 7 ||
    config.horizonteDias > 120
  ) {
    errores.push("La duración debe ser un número entero entre 7 y 120 días.");
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

function nombreDeTema(slug: string, catalogo: Ruta[]): string {
  for (const ruta of catalogo) {
    const tema = ruta.temas.find((t) => t.slug === slug);
    if (tema) return tema.nombre;
  }
  return slug;
}

function construirGrupos(
  ruta: Ruta,
  config: ConfigPlan,
  catalogo: Ruta[],
): Grupo[] {
  const grupos: Grupo[] = [];
  const usados = new Set<string>();
  for (const tema of ruta.temas) {
    const refuerzos: Unidad[] = [];
    for (const prerrequisito of tema.prerrequisitos) {
      const refuerzo = config.refuerzos.find(
        (r) => r.temaSlug === prerrequisito,
      );
      if (!refuerzo || refuerzo.dias < 1 || usados.has(prerrequisito)) continue;
      usados.add(prerrequisito);
      const nombre = nombreDeTema(prerrequisito, catalogo);
      for (let k = 1; k <= refuerzo.dias; k++) {
        refuerzos.push({
          tipo: "refuerzo",
          prerrequisito,
          nombre,
          para: tema,
          k,
          total: refuerzo.dias,
        });
      }
    }
    tema.subtemas.forEach((subtema, indice) => {
      const unidades: Unidad[] = indice === 0 ? [...refuerzos] : [];
      for (let k = 1; k <= subtema.diasEstimados; k++) {
        unidades.push({ tipo: "estudio", tema, subtema, k });
      }
      if (indice === tema.subtemas.length - 1) {
        unidades.push({ tipo: "evaluacion", tema });
        unidades.push({ tipo: "correccion", tema });
      }
      grupos.push({ tema, subtema, unidades });
    });
  }
  return grupos;
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
    const { tema, subtema, k } = unidad;
    const dias = subtema.diasEstimados;
    const tramo = dias > 1 ? ` (día ${k} de ${dias})` : "";
    return {
      tipo: "estudio",
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
    const { prerrequisito, nombre, para, k, total } = unidad;
    const tramo = total > 1 ? ` (día ${k} de ${total})` : "";
    return {
      tipo: "refuerzo",
      temaSlug: prerrequisito,
      subtemaSlug: null,
      clave: `${prerrequisito}#${k}`,
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
      temaSlug: tema.slug,
      subtemaSlug: null,
      clave: tema.slug,
      titulo: `Evaluación: ${tema.nombre}`,
      objetivo: `Medir tu dominio de «${tema.nombre}» en condiciones de examen.`,
      queEstudiar: `${tema.nombre} (todos sus subtemas)`,
      queHacer: `Realiza un examen de años anteriores sobre ${tema.nombre}, con tiempo limitado y sin consultar tus apuntes. Registra tu nota y tus errores.`,
      dificultad: 2,
      instrucciones: {
        evaluacion: `Realiza un examen de años anteriores sobre ${tema.nombre}, con tiempo limitado y sin consultar tus apuntes.`,
      },
      titulos: { evaluacion: "Examen" },
    };
  }
  return {
    tipo: "correccion",
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
};

function construirBloques(
  rutaSlug: string,
  textos: Textos,
  minutosPorDia: number,
  nombresRepaso: string[],
): Bloque[] {
  const { pesos, residuo } = repartoDelDia(textos.tipo, textos.dificultad);
  const total = minutosDelDia(textos.tipo, minutosPorDia);
  return repartirMinutos(total, pesos, residuo).map(([tipo, minutos]) => {
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
    return bloque;
  });
}

/**
 * Genera el plan de una ruta. Pura: misma entrada, misma salida.
 * `catalogo` sirve para nombrar temas prerrequisito de otras rutas.
 * Lanza RangeError si la configuración es inválida (ver erroresConfig).
 */
export function generarPlan(
  ruta: Ruta,
  config: ConfigPlan,
  catalogo: Ruta[] = [ruta],
): Plan {
  const errores = erroresConfig(config);
  if (errores.length > 0) throw new RangeError(errores.join(" "));

  const horizonte = config.horizonteDias;
  const esLigero = (n: number) =>
    config.diaLigeroCada > 0 && n % config.diaLigeroCada === 0;

  // 1. Colocar los grupos de contenido sin comprimir nada.
  const asignaciones: Asignacion[] = [];
  for (let n = 1; n <= horizonte; n++) {
    asignaciones[n] = { tipo: "repaso" };
  }
  const fueraDelHorizonte: SubtemaRef[] = [];
  let cursor = 1;
  let desbordado = false;
  for (const grupo of construirGrupos(ruta, config, [ruta, ...catalogo])) {
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
  if (!desbordado && libres.length >= 2) {
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
    const { subtema, k } = asignacion.unidad;
    if (k !== subtema.diasEstimados) continue;
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
      cierre: [...CIERRE_SESION],
      siguientePaso: siguiente
        ? `Día ${n + 1}: ${siguiente.titulo}.`
        : "Fin del horizonte: revisa tu progreso y, si aún tienes temas pendientes, extiende la ruta.",
    });
  }

  return { dias, fueraDelHorizonte };
}
