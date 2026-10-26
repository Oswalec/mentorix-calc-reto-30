// Acceso a localStorage, siempre envuelto en try/catch (modo privado, cuota llena,
// almacenamiento bloqueado). Nunca lanza: degrada a "sin almacenamiento".
import {
  CLAVE_ALMACEN,
  CLAVE_DANADA,
  estadoInicial,
  migrar,
  type Estado,
} from "./estado";
import { validarEstado } from "./validar";

export interface Carga {
  estado: Estado;
  /** Texto crudo guardado que no pasó la validación; null si todo está bien. */
  corrupto: string | null;
}

export function obtenerAlmacen(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function cargarEstado(
  almacen: Storage | null = obtenerAlmacen(),
): Carga {
  if (!almacen) return { estado: estadoInicial(), corrupto: null };
  let crudo: string | null;
  try {
    crudo = almacen.getItem(CLAVE_ALMACEN);
  } catch {
    return { estado: estadoInicial(), corrupto: null };
  }
  if (crudo === null) return { estado: estadoInicial(), corrupto: null };
  let resultado: Estado | Error;
  try {
    resultado = validarEstado(migrar(JSON.parse(crudo)));
  } catch {
    resultado = new Error("JSON inválido");
  }
  if (resultado instanceof Error) {
    try {
      almacen.setItem(CLAVE_DANADA, crudo);
    } catch {
      // sin espacio: el texto crudo sigue en `corrupto` para exportarlo
    }
    return { estado: estadoInicial(), corrupto: crudo };
  }
  return { estado: resultado, corrupto: null };
}

/** Devuelve false si no se pudo guardar (sin almacenamiento o cuota llena). */
export function guardarEstado(
  estado: Estado,
  almacen: Storage | null = obtenerAlmacen(),
): boolean {
  if (!almacen) return false;
  try {
    almacen.setItem(CLAVE_ALMACEN, JSON.stringify(estado));
    return true;
  } catch {
    return false;
  }
}
