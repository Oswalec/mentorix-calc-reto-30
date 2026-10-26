// Estado global de las islas (Preact Signals). Única puerta de escritura: actualizar().
import { computed, signal } from "@preact/signals";
import { buscarRuta, rutas } from "../../data/rutas";
import { hoyLocal, numeroDelDia } from "../fechas";
import { generarPlan } from "../plan/generador";
import { cargarEstado, guardarEstado } from "./almacen";
import { estadoInicial, type Estado } from "./estado";

export const estado = signal<Estado>(estadoInicial());
/** Texto crudo de datos guardados que no pasaron la validación. */
export const datosDanados = signal<string | null>(null);
/** true si el último guardado falló (modo privado o almacenamiento lleno). */
export const guardadoFallido = signal(false);
/** Fecha local de hoy; las pruebas la fijan para no depender del reloj. */
export const fechaHoy = signal(hoyLocal());

/** Lee localStorage de nuevo. Se llama al cargar el módulo y en las pruebas. */
export function recargarEstado(): void {
  const carga = cargarEstado();
  estado.value = carga.estado;
  datosDanados.value = carga.corrupto;
  guardadoFallido.value = false;
}

export function actualizar(cambio: (actual: Estado) => Estado): void {
  const nuevo = cambio(estado.value);
  estado.value = nuevo;
  guardadoFallido.value = !guardarEstado(nuevo);
}

/** Identificador corto y único para dificultades y evaluaciones. */
export function nuevoId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const rutaActiva = computed(() => {
  const slug = estado.value.rutaActiva;
  return slug ? (buscarRuta(slug) ?? null) : null;
});

export const progresoActivo = computed(() => {
  const ruta = rutaActiva.value;
  return ruta ? (estado.value.rutas[ruta.slug] ?? null) : null;
});

export const planActivo = computed(() => {
  const ruta = rutaActiva.value;
  const progreso = progresoActivo.value;
  return ruta && progreso ? generarPlan(ruta, progreso.config, rutas) : null;
});

/** Número de día de hoy dentro del plan activo (puede ser < 1 o > horizonte). */
export const hoyNumero = computed(() => {
  const progreso = progresoActivo.value;
  return progreso
    ? numeroDelDia(progreso.config.fechaInicio, fechaHoy.value)
    : 1;
});

recargarEstado();
