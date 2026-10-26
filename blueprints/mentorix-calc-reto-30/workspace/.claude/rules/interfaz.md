---
description: Convenciones de islas Preact, páginas Astro y estilos
paths:
  - "src/components/**"
  - "src/pages/**"
  - "src/layouts/**"
  - "src/styles/**"
---

# Interfaz

- Cada página es `src/pages/<seccion>/index.astro` con `<Base titulo="…" seccion="…">`, una `h1` estática y la isla `client:only="preact"` con `<p slot="fallback">Cargando…</p>`.
- Cada isla exporta `function Nombre()` (para pruebas) y `export default function IslaNombre()` que la envuelve en `<LimiteErrores origen="nombre">`.
- Lee estado con los signals de `src/lib/progreso/store.ts`; escribe solo con `actualizar((e) => accion(e, …))`.
- Enlaces internos: `enlace("hoy/")` y `enlaceDia(n)`; en `.astro`, `import.meta.env.BASE_URL`. Nunca un `href="/…"` escrito a mano: `npm run build` lo rechaza.
- Cada campo tiene `<label for>` o `aria-label`; mensajes de error en `role="alert"`, confirmaciones en `role="status"`.
- Objetivos táctiles de 44px mínimo (`.boton`, casillas de bloque). Foco visible con `:focus-visible` (ya en `global.css`).
- Colores solo con `var(--token)`; estados vacíos siempre con texto (nunca una lista vacía muda).
- Tipos de día: clase `tipo-<tipo>` fija `--color-tipo` (estudio=primary, refuerzo=accent, evaluación/simulacro=danger, corrección=warning, repaso=success). Siempre acompaña el color con texto.
