---
name: agregar-o-editar-ruta
description: Úsala cuando el docente pida agregar, editar o reordenar una ruta, un tema o un subtema (por ejemplo "agrega la ruta de Álgebra Lineal", "cambia los días de Regla de la cadena", "agrega un subtema a Límites"). Edita src/data/rutas/ sin romper el progreso guardado.
---

# Agregar o editar una ruta

## Cuándo usarla

- Agregar una ruta nueva (una asignatura).
- Agregar, quitar o reordenar temas o subtemas.
- Cambiar `diasEstimados`, `dificultad`, `nombre` o `prerrequisitos`.

## Pasos

1. Lee `.claude/rules/rutas-datos.md`.
2. Para una ruta nueva: copia `src/data/rutas/calculo-integral.ts` a `src/data/rutas/<slug>.ts`, cambia el nombre de la constante, el `slug`, `nombre`, `descripcion` y los temas.
3. Regístrala en el arreglo `rutas` de `src/data/rutas/index.ts` (el orden es el de la pantalla de inicio).
4. Agrega el slug nuevo a la lista esperada de la prueba «registra las … rutas» en `tests/unit/ajustes.test.ts`.
5. Para una edición: cambia solo `nombre`, `diasEstimados`, `dificultad`, el orden o `prerrequisitos`. **No cambies ningún `slug` existente.**
6. Ejecuta `npm run format`.

## Verify

```bash
npm test -- tests/unit/rutas.test.ts   # expect: exit 0 — slugs únicos, prerrequisitos válidos
npm test                               # expect: exit 0, 0 fallidas
npm run check                          # expect: exit 0, 0 errores
npm run build                          # expect: exit 0, "verificar-dist: OK"
```

## No hagas

- Renombrar un `slug` publicado: deja huérfanos los completados de los estudiantes.
- Escribir ejercicios, enunciados, fórmulas o enlaces a material dentro de los datos.
- Poner `diasEstimados` en 0 o con decimales para "que quepa": el plan nunca comprime.
