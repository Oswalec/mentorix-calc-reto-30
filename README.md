# Mentorix Calc — Reto de Estudio de 30 Días

Guía de estudio y seguimiento personal para los estudiantes del acompañamiento
Mentorix Calc. Cada día responde una pregunta: **¿qué debo hacer hoy para
avanzar en mi preparación para el examen y cómo uso los recursos que ya tengo?**

La app orienta, organiza y da seguimiento. **No** contiene ejercicios,
solucionarios, videos ni simulacros: todo eso vive en los materiales del
acompañamiento, y la guía solo los programa.

Sitio publicado: https://oswalec.github.io/mentorix-calc-reto-30/

## Para el estudiante

- Tu progreso se guarda **solo en este navegador** (localStorage). No hay
  cuentas.
- Exporta un respaldo desde **Ajustes → Exportar progreso** al menos una vez por
  semana. Para cambiar de celular o computadora, importa ese archivo en
  **Ajustes → Archivo de respaldo (.json)**.
- Completar bloques no es lo mismo que dominar un tema: el dominio lo declaras
  tú en **Progreso**, y «Dominado» exige escribir la evidencia.

## Para el docente: cómo editar las rutas

Las rutas son archivos TypeScript en `src/data/rutas/`:

| Archivo                       | Ruta                     |
| ----------------------------- | ------------------------ |
| `calculo-diferencial.ts`      | Cálculo Diferencial      |
| `calculo-integral.ts`         | Cálculo Integral         |
| `calculo-multivariable.ts`    | Cálculo Multivariable    |
| `ecuaciones-diferenciales.ts` | Ecuaciones Diferenciales |

Cada ruta tiene temas y cada tema tiene subtemas. Por cada subtema defines:

- `slug`: identificador en minúsculas con guiones (`regla-de-la-cadena`).
- `nombre`: el texto que ve el estudiante.
- `diasEstimados`: días de estudio, entero de 1 en adelante. El plan **nunca**
  lo reduce; si no cabe, el subtema pasa a «Para después del horizonte».
- `dificultad`: `1` baja, `2` media, `3` alta. La alta da más minutos a Práctica.

Cada tema puede declarar `prerrequisitos`: slugs de temas de esta u otra ruta
(por ejemplo, Integral pide `derivadas`).

**Regla de oro: nunca renombres un `slug` que ya publicaste.** El progreso de
los estudiantes se guarda por slug; si lo cambias, sus casillas marcadas de ese
subtema quedan huérfanas (no se rompe nada, pero se pierden). Corregir el
`nombre` sí es seguro.

### Añadir una ruta nueva

1. Copia uno de los archivos de `src/data/rutas/` con otro nombre y edítalo.
2. Regístralo en `src/data/rutas/index.ts`, dentro del arreglo `rutas`.
3. Ejecuta `npm test`: una prueba valida todas las rutas (slugs únicos,
   prerrequisitos existentes, `diasEstimados` enteros ≥ 1, dificultad 1–3).
4. Si la prueba de `tests/unit/ajustes.test.ts` que lista las rutas falla,
   agrega el slug nuevo a su lista esperada.

## Comandos

| Tarea                  | Comando                |
| ---------------------- | ---------------------- |
| Instalar               | `npm install`          |
| Servidor de desarrollo | `npm run dev`          |
| Revisar tipos          | `npm run check`        |
| Pruebas                | `npm test`             |
| Construir + verificar  | `npm run build`        |
| Formato                | `npm run format`       |

## Publicar

Cada `git push` a `main` construye y publica el sitio con GitHub Actions
(`.github/workflows/deploy.yml`). La primera vez, en GitHub: **Settings → Pages →
Build and deployment → Source: GitHub Actions**.
