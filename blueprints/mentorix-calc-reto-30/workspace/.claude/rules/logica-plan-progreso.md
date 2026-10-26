---
description: Reglas del generador del plan y del modelo de progreso
paths:
  - "src/lib/**"
---

# Lógica del plan y del progreso

- `generarPlan(ruta, config, catalogo)` es pura. El algoritmo está fijado por `tests/unit/generador.test.ts`: si cambias el orden de días, los minutos o un texto, esa prueba debe cambiar en el mismo commit y con una razón.
- ID de bloque: `${rutaSlug}:${tipoDia}:${clave}:${tipoBloque}`; `clave` = `subtema#k`, `prerrequisito#k`, `temaSlug`, `rep-n` o `final`. Nunca incluyas la fecha en un ID.
- Minutos: `max(floor(total*peso/500)*5, 5)` y el residuo al bloque designado; la suma es exactamente el total.
- Repaso espaciado: d+1, d+3, d+7, d+14 desde el último día de estudio del subtema, solo dentro del horizonte.
- Fechas: solo `src/lib/fechas.ts` (`sumarDias`, `diferenciaDias`, `hoyLocal`, `numeroDelDia`). Nunca `new Date("AAAA-MM-DD")`.
- El `Estado` tiene `version: 1`. Si cambias su forma: sube `VERSION_ESTADO`, amplía `migrar()` y `validarEstado()`, y agrega una prueba con datos v1.
- Las acciones de `acciones.ts` devuelven un `Estado` nuevo (o `Error` por datos del usuario); nunca mutan el anterior.
- Solo `declararDominio` cambia `dominio`, y «dominado» exige `evidencia` no vacía.
- `localStorage` solo en `almacen.ts`, con try/catch. Datos inválidos: copia a `mentorix-reto:v1:danado`, nunca `removeItem`.
