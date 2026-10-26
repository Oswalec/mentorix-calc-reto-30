// Acciones puras sobre el Estado: cada una devuelve un Estado nuevo (o un Error
// de validación para mostrar al estudiante). Ninguna cambia el dominio salvo
// declararDominio: completar bloques NO es dominar.
import { erroresConfig } from "../plan/generador";
import type { ConfigPlan } from "../tipos";
import {
  progresoInicial,
  type Estado,
  type Evaluacion,
  type NivelDominio,
  type ProgresoRuta,
  type RegistroDificultad,
} from "./estado";

function conRuta(
  estado: Estado,
  rutaSlug: string,
  cambio: (progreso: ProgresoRuta) => ProgresoRuta,
): Estado {
  const progreso = estado.rutas[rutaSlug];
  if (!progreso) throw new Error(`La ruta ${rutaSlug} no está iniciada.`);
  return {
    ...estado,
    rutas: { ...estado.rutas, [rutaSlug]: cambio(progreso) },
  };
}

/** Activa una ruta; si es nueva la inicia con `config`, si ya existía conserva su progreso. */
export function activarRuta(
  estado: Estado,
  rutaSlug: string,
  config: ConfigPlan,
): Estado {
  const errores = erroresConfig(config);
  if (errores.length > 0) throw new RangeError(errores.join(" "));
  const existente = estado.rutas[rutaSlug];
  return {
    ...estado,
    rutaActiva: rutaSlug,
    rutas: {
      ...estado.rutas,
      [rutaSlug]: existente ?? progresoInicial(config),
    },
  };
}

export function actualizarConfig(
  estado: Estado,
  rutaSlug: string,
  config: ConfigPlan,
): Estado {
  const errores = erroresConfig(config);
  if (errores.length > 0) throw new RangeError(errores.join(" "));
  return conRuta(estado, rutaSlug, (p) => ({ ...p, config }));
}

export function marcarBloque(
  estado: Estado,
  rutaSlug: string,
  bloqueId: string,
  hecho: boolean,
  ahoraISO: string,
): Estado {
  return conRuta(estado, rutaSlug, (p) => {
    const completados = { ...p.completados };
    if (hecho) completados[bloqueId] = ahoraISO;
    else delete completados[bloqueId];
    return { ...p, completados };
  });
}

export function declararDominio(
  estado: Estado,
  rutaSlug: string,
  subtemaSlug: string,
  nivel: NivelDominio,
  evidencia: string,
  fecha: string,
): Estado | Error {
  if (nivel === "dominado" && evidencia.trim() === "") {
    return new Error(
      "Para marcar un subtema como dominado escribe la evidencia, por ejemplo el resultado de un examen.",
    );
  }
  return conRuta(estado, rutaSlug, (p) => ({
    ...p,
    dominio: {
      ...p.dominio,
      [subtemaSlug]: { nivel, evidencia: evidencia.trim(), fecha },
    },
  }));
}

export function registrarDificultad(
  estado: Estado,
  rutaSlug: string,
  dificultad: RegistroDificultad,
): Estado | Error {
  if (dificultad.texto.trim() === "") {
    return new Error("Describe la dificultad o el error antes de guardarlo.");
  }
  return conRuta(estado, rutaSlug, (p) => ({
    ...p,
    dificultades: [
      ...p.dificultades,
      { ...dificultad, texto: dificultad.texto.trim() },
    ],
  }));
}

export function resolverDificultad(
  estado: Estado,
  rutaSlug: string,
  id: string,
  resuelta: boolean,
): Estado {
  return conRuta(estado, rutaSlug, (p) => ({
    ...p,
    dificultades: p.dificultades.map((d) =>
      d.id === id ? { ...d, resuelta } : d,
    ),
  }));
}

/** Guarda el resultado de un examen externo; reemplaza el del mismo día. */
export function registrarEvaluacion(
  estado: Estado,
  rutaSlug: string,
  evaluacion: Evaluacion,
): Estado | Error {
  const { nota, notaMaxima } = evaluacion;
  if (nota !== null && (!Number.isFinite(nota) || nota < 0)) {
    return new Error("La nota debe ser un número mayor o igual a 0.");
  }
  if (
    notaMaxima !== null &&
    (!Number.isFinite(notaMaxima) || notaMaxima <= 0)
  ) {
    return new Error("La nota máxima debe ser un número mayor que 0.");
  }
  if (nota !== null && notaMaxima !== null && nota > notaMaxima) {
    return new Error("La nota no puede ser mayor que la nota máxima.");
  }
  return conRuta(estado, rutaSlug, (p) => ({
    ...p,
    evaluaciones: [
      ...p.evaluaciones.filter((e) => e.diaNumero !== evaluacion.diaNumero),
      evaluacion,
    ].sort((a, b) => a.diaNumero - b.diaNumero),
  }));
}

/** Texto vacío borra la reflexión del día. */
export function guardarReflexion(
  estado: Estado,
  rutaSlug: string,
  diaNumero: number,
  texto: string,
): Estado {
  return conRuta(estado, rutaSlug, (p) => {
    const reflexiones = { ...p.reflexiones };
    if (texto.trim() === "") delete reflexiones[String(diaNumero)];
    else reflexiones[String(diaNumero)] = texto;
    return { ...p, reflexiones };
  });
}

export function marcarRespaldo(estado: Estado, fecha: string): Estado {
  return { ...estado, ultimoRespaldo: fecha };
}
