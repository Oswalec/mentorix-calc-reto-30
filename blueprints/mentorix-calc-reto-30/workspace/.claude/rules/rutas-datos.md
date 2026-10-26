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
- `prerrequisitos`: slugs de temas existentes; si el tema está en la misma ruta, debe aparecer antes.
- Solo nombres de temas: nunca enunciados, fórmulas, ejercicios ni enlaces a material.
- Después de editar: `npm test -- tests/unit/rutas.test.ts` y `npm test`.
