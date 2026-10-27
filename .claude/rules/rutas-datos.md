---
description: Convenciones de los archivos de rutas (contenido de estudio)
paths:
  - "src/data/rutas/**"
---

# Datos de rutas

- Un archivo por ruta, exporta una constante `Ruta` en camelCase (`calculoIntegral`) y se registra en el arreglo `rutas` de `src/data/rutas/index.ts`.
- `slug` en kebab-case (`^[a-z0-9]+(-[a-z0-9]+)*$`), único en todo el catálogo (rutas, temas y subtemas). `final` está reservado: ningún tema se llama así.
- **Nunca renombres un `slug` publicado.** Los bloques completados se guardan como `ruta:tipo:subtema#k:bloque`; renombrar deja huérfano el progreso. Corregir `nombre` es seguro.
- Quitar un subtema publicado es seguro (los completados quedan huérfanos y se ignoran), pero avísalo en el commit.
- `diasEstimados`: entero ≥ 1. `dificultad`: 1, 2 o 3. Nada de decimales ni de 0.
- Cada ruta es independiente: `prerrequisitos` son objetos `{ slug, nombre, enlaces }` que apuntan a la Introducción o a cursos de apoyo de Skool, **nunca** a temas de otra ruta. Su `slug` es único en el catálogo y no choca con temas ni subtemas.
- `horizonteBase` (duración intensiva para la que está pensada la ruta) y `minutosBase` (múltiplo de 5). Diferencial e Integral deben caber completos en 30 días: lo comprueba `tests/unit/generador.test.ts`.
- Enlaces: solo a lecciones de la comunidad en Skool, creados con `leccion()` / `cursoCompleto()` de `src/data/skool.ts` (`teoria`, `ejemplos`, `practica`, `opcionales`). Nunca enunciados, fórmulas ni contenido copiado. Los días de evaluación **no** llevan enlaces: el estudiante practica con exámenes de años anteriores.
- `opcionales`: módulos que se ofrecen como bloque aparte (no suma minutos ni avance). `sinEvaluacion: true` en temas de nivelación (sin examen ni corrección).
- Después de editar: `npm test -- tests/unit/rutas.test.ts` y `npm test`.
