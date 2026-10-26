---
description: Convenciones de pruebas Vitest
paths:
  - "tests/**"
---

# Pruebas

- Unitarias en `tests/unit/*.test.ts`; de componentes en `tests/componentes/*.test.tsx`; datos compartidos en `tests/fixtures/`.
- Entorno `happy-dom` para todo (ver `vitest.config.ts`); `tests/setup.ts` desmonta y vacía `localStorage` después de cada prueba.
- Pruebas de componentes: en `beforeEach` llama `recargarEstado()` y fija `fechaHoy.value` (nunca dependas del reloj).
- Busca por rol y nombre accesible (`getByRole`, `getByLabelText`); nada de selectores CSS salvo `classList`/`dataset` documentados.
- Nunca `it.skip`, `it.only` ni `describe.skip`: el gate exige 0 omitidas.
- Fechas fijas en formato `YYYY-MM-DD`; la ruta de prueba del ejemplo trabajado está en `tests/fixtures/ruta-prueba.ts`.
