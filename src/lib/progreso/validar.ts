// Validador manual del estado (sin dependencias). Se usa al cargar y al importar.
import { esFechaValida } from "../fechas";
import { erroresConfig } from "../plan/generador";
import type { ConfigPlan } from "../tipos";
import { NIVELES_DOMINIO, type Estado } from "./estado";

type Objeto = Record<string, unknown>;

function esObjeto(x: unknown): x is Objeto {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function esNumeroONulo(x: unknown): boolean {
  return x === null || (typeof x === "number" && Number.isFinite(x));
}

function errorConfig(x: unknown): string | null {
  if (!esObjeto(x)) return "config no es un objeto";
  if (typeof x.fechaInicio !== "string") return "config.fechaInicio";
  for (const campo of ["horizonteDias", "minutosPorDia", "diaLigeroCada"]) {
    if (typeof x[campo] !== "number") return `config.${campo}`;
  }
  if (!Array.isArray(x.refuerzos)) return "config.refuerzos";
  for (const r of x.refuerzos) {
    if (
      !esObjeto(r) ||
      typeof r.temaSlug !== "string" ||
      typeof r.dias !== "number"
    ) {
      return "config.refuerzos[]";
    }
  }
  const errores = erroresConfig(x as unknown as ConfigPlan);
  return errores.length > 0 ? errores.join(" ") : null;
}

function errorProgreso(x: unknown): string | null {
  if (!esObjeto(x)) return "no es un objeto";
  const config = errorConfig(x.config);
  if (config) return config;
  if (
    !esObjeto(x.completados) ||
    !Object.values(x.completados).every((v) => typeof v === "string")
  ) {
    return "completados";
  }
  if (!Array.isArray(x.evaluaciones)) return "evaluaciones";
  for (const e of x.evaluaciones) {
    if (
      !esObjeto(e) ||
      typeof e.id !== "string" ||
      typeof e.diaNumero !== "number" ||
      !(e.temaSlug === null || typeof e.temaSlug === "string") ||
      typeof e.fecha !== "string" ||
      !esFechaValida(e.fecha) ||
      !esNumeroONulo(e.nota) ||
      !esNumeroONulo(e.notaMaxima) ||
      typeof e.errores !== "string" ||
      !Array.isArray(e.temasAReforzar) ||
      !e.temasAReforzar.every((t) => typeof t === "string")
    ) {
      return "evaluaciones[]";
    }
  }
  if (!Array.isArray(x.dificultades)) return "dificultades";
  for (const d of x.dificultades) {
    if (
      !esObjeto(d) ||
      typeof d.id !== "string" ||
      typeof d.fecha !== "string" ||
      !(d.subtemaSlug === null || typeof d.subtemaSlug === "string") ||
      typeof d.texto !== "string" ||
      typeof d.resuelta !== "boolean"
    ) {
      return "dificultades[]";
    }
  }
  if (!esObjeto(x.dominio)) return "dominio";
  for (const d of Object.values(x.dominio)) {
    if (
      !esObjeto(d) ||
      !NIVELES_DOMINIO.includes(d.nivel as never) ||
      typeof d.evidencia !== "string" ||
      typeof d.fecha !== "string" ||
      (d.nivel === "dominado" && d.evidencia.trim() === "")
    ) {
      return "dominio{}";
    }
  }
  if (
    !esObjeto(x.reflexiones) ||
    !Object.values(x.reflexiones).every((v) => typeof v === "string")
  ) {
    return "reflexiones";
  }
  return null;
}

export function validarEstado(x: unknown): Estado | Error {
  if (!esObjeto(x)) return new Error("El progreso no es un objeto JSON.");
  if (x.version !== 1) {
    return new Error(`Versión de progreso no soportada: ${String(x.version)}.`);
  }
  if (!(x.rutaActiva === null || typeof x.rutaActiva === "string")) {
    return new Error("Campo inválido: rutaActiva.");
  }
  if (!(
    x.ultimoRespaldo === null ||
    (typeof x.ultimoRespaldo === "string" && esFechaValida(x.ultimoRespaldo))
  )) {
    return new Error("Campo inválido: ultimoRespaldo.");
  }
  if (!esObjeto(x.rutas)) return new Error("Campo inválido: rutas.");
  for (const [slug, progreso] of Object.entries(x.rutas)) {
    const error = errorProgreso(progreso);
    if (error) return new Error(`Campo inválido en rutas.${slug}: ${error}.`);
  }
  return x as unknown as Estado;
}
