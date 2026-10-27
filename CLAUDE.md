# Mentorix Calc — Reto de Estudio de 30 Días

Guía de estudio y seguimiento personal (sitio estático) para estudiantes de Cálculo del acompañamiento Mentorix Calc: cada día dice qué estudiar y cómo usar los recursos que ya tienen. Sin cuentas: el progreso vive en `localStorage`.

## Comandos

Todos se ejecutan desde la raíz del proyecto, en Git Bash (Windows) o Linux.

| Tarea | Comando |
|---|---|
| Instalar (local) | `npm install --no-audit --no-fund` |
| Instalar (CI) | `npm ci` |
| Servidor de desarrollo | `npm run dev` — http://localhost:4321/mentorix-calc-reto-30/ |
| Revisar tipos (estricto) | `npm run check` |
| Pruebas (todas) | `npm test` |
| Una prueba | `npm test -- tests/unit/generador.test.ts` |
| Construir + verificar `dist/` | `npm run build` (incluye `node scripts/verificar-dist.mjs`) |
| Verificar workflow (desde el paso 14) | `node scripts/verificar-workflow.mjs` |
| Formato | `npm run format` · comprobar: `npm run format:check` |

**Gate:** `npm run check && npm test && npm run build && npm run format:check` debe salir 0 antes de marcar una tarea como hecha. Ejecuta `npm run format` antes del gate si escribiste archivos a mano.

Node está fijado en `.nvmrc` (24). Las versiones de dependencias están en `package-lock.json`: léelo, nunca adivines una versión. No hay variables de entorno.

## Stack

Astro (salida estática, `base: /mentorix-calc-reto-30`) · islas Preact `client:only="preact"` · @preact/signals · TypeScript estricto · CSS propio con tokens · Vitest + happy-dom + Testing Library · Prettier · GitHub Pages vía Actions.

## Arquitectura

**Camino de un dato.** `src/data/rutas/*.ts` (contenido, con enlaces de `src/data/skool.ts`) → `src/lib/plan/generador.ts` (`generarPlan`, función pura) → `src/lib/progreso/store.ts` (signals: `estado`, `planActivo`, `hoyNumero`) → islas en `src/components/*.tsx` → páginas `src/pages/**/index.astro`. Toda escritura pasa por `actualizar(cambio)` del store, que llama a una acción pura de `src/lib/progreso/acciones.ts` y guarda con `src/lib/progreso/almacen.ts` bajo la clave `mentorix-reto:v1`.

**Fronteras.**

| Capa | Puede importar de | Nunca |
|---|---|---|
| `src/data/rutas/**` | tipos de `src/lib/tipos.ts` y `src/data/skool.ts` | lógica, componentes, `window` |
| `src/lib/plan/**`, `src/lib/fechas.ts` | `src/lib/tipos.ts` | `window`, `localStorage`, `Date.now()` dentro de `generarPlan` |
| `src/lib/progreso/**` (salvo `store.ts`) | `src/lib/plan`, `src/lib/fechas.ts` | Preact, signals |
| `src/lib/progreso/store.ts` | todo `src/lib`, `src/data` | componentes |
| `src/components/**` | `src/lib`, `src/data`, otros componentes | `localStorage` directo (salvo `LimiteErrores.tsx`) |
| `src/pages/**`, `src/layouts/**` | componentes, estilos | lógica de negocio |
| `scripts/*.mjs` | solo módulos `node:` | importar de `src/` |

**Dónde vive cada cosa.**

| Tema | Única fuente |
|---|---|
| Tipos del dominio | `src/lib/tipos.ts` |
| Algoritmo del plan, IDs de bloque, textos del día | `src/lib/plan/generador.ts` |
| Minutos por bloque | `src/lib/plan/minutos.ts` |
| Forma del progreso y su versión | `src/lib/progreso/estado.ts` (+ `validar.ts`) |
| Prefijo `/mentorix-calc-reto-30` | `astro.config.mjs` (`base`); `scripts/verificar-dist.mjs` lo comprueba |
| Colores, tipografía, radios, espaciado | `src/styles/tokens.css` |
| Enlaces internos en islas | `enlace()` / `enlaceDia()` de `src/lib/enlaces.ts` |

## Reglas de código

1. **Imports relativos sin extensión** (`../lib/fechas`), sin alias. Los scripts `.mjs` no importan de `src/`.
2. **Islas siempre `client:only="preact"`** con `<p slot="fallback">…</p>`; cada isla exporta por defecto un envoltorio con `<LimiteErrores origen="…">`.
3. **Una sola `h1` por página, en el `.astro`**; las islas empiezan en `h2`.
4. **`generarPlan` es pura:** misma entrada, misma salida. Nada de fechas del reloj ni aleatoriedad dentro.
5. **Fechas como `YYYY-MM-DD`** con `src/lib/fechas.ts`. Prohibido `new Date("YYYY-MM-DD")` y `toLocaleDateString` en lógica.
6. **Acciones puras devuelven `Estado` o `Error`**; nunca lanzan por datos del usuario (sí por errores de programación).
7. **`localStorage` siempre dentro de try/catch** (solo en `almacen.ts` y `LimiteErrores.tsx`).
8. **Ningún hex fuera de `tokens.css`**; los componentes usan `var(--token)`.
9. **Textos de UI en español (Perú)**; identificadores en español sin tildes.
10. **Componentes ≤ 450 líneas;** si crece, extrae subcomponentes en el mismo archivo o en otro.

## Sistema de diseño

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--bg` | `#F6F8F7` | `#0B1513` | fondo de página |
| `--surface` | `#FFFFFF` | `#12201D` | tarjetas |
| `--surface-2` | `#EEF3F1` | `#1A2C28` | opciones, días completados |
| `--text` | `#0F1F1C` | `#E7F0EE` | texto |
| `--text-muted` | `#5B6B67` | `#9DB0AB` | texto secundario |
| `--primary` | `#0F766E` | `#2DD4BF` | botones, enlaces, foco, días de estudio |
| `--primary-contrast` | `#FFFFFF` | `#04201C` | texto sobre primary |
| `--accent` | `#D97706` | `#FBBF24` | días de refuerzo |
| `--success` | `#15803D` | `#4ADE80` | días de repaso |
| `--warning` | `#B45309` | `#FBBF24` | días de corrección |
| `--danger` | `#B91C1C` | `#F87171` | evaluación, simulacro, borrar |
| `--border` | `#D6E0DD` | `#24413B` | bordes |

- **Tipo:** títulos Fraunces Variable 600; texto Inter Variable 16px/1.55; escala 1.25 (`--escala-1..4`).
- **Espaciado:** base 4px — `--e-1..7` = 4, 8, 12, 16, 24, 32, 48. **Radio:** 14px tarjetas, 10px botones.
- **Movimiento:** 180ms `ease-out`; `prefers-reduced-motion` lo anula.
- **Layout:** móvil primero; navegación inferior fija; barra lateral de 220px desde 960px; ancho máx. 960px; sin scroll horizontal a 360px.
- **Modo oscuro:** sigue al sistema; `data-theme` en `<html>` lo fuerza (`mentorix-tema` en localStorage).

## Entorno

Este proyecto no usa variables de entorno ni archivos `.env`.

## Reglas por área

| Archivo | Aplica a |
|---|---|
| `.claude/rules/rutas-datos.md` | `src/data/rutas/**` |
| `.claude/rules/logica-plan-progreso.md` | `src/lib/**` |
| `.claude/rules/interfaz.md` | `src/components/**`, `src/pages/**`, `src/layouts/**`, `src/styles/**` |
| `.claude/rules/pruebas.md` | `tests/**` |

Skill del proyecto: `agregar-o-editar-ruta` (`.claude/skills/agregar-o-editar-ruta/SKILL.md`).

## Orden de construcción

`blueprints/mentorix-calc-reto-30/tasks.json` decide la siguiente tarea; `blueprints/mentorix-calc-reto-30/epics/` explica cómo. Cada tarea termina con commit y tag `step-NN-<slug>`.

## No negociable

1. Nunca renombres un `slug` publicado (ruta, tema o subtema): rompe los completados guardados.
2. Nunca agregues contenido matemático, ejercicios, solucionarios, videos ni simulacros a la app: solo se programan como actividades externas y se **enlazan** las lecciones de Skool (nunca en días de evaluación).
3. Completar bloques nunca cambia el dominio; solo `declararDominio`, y «dominado» exige evidencia.
4. `generarPlan` nunca reduce `diasEstimados`: lo que no cabe va a `fueraDelHorizonte`; con más días que la base, el plan se estira (simulacro + `repartirExtras`).
5. Nunca borres datos guardados que no validan: se copian a `mentorix-reto:v1:danado` y se ofrecen para descargar.
6. Nunca agregues servicios con cuenta, servidor, analítica ni dependencias sin justificarlo en el commit.
7. Nunca marques una tarea hecha con un gate en rojo, ni edites un comando Verify para que pase.
8. Cada asignatura es una ruta independiente: ningún prerrequisito apunta a otra ruta.
