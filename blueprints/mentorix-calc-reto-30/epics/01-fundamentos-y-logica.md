# Epic 01: Fundamentos y lógica

> Existe un sitio Astro que construye y se verifica, con tokens de diseño y layout, las cuatro rutas de contenido, el generador del plan, los ajustes y todo el modelo de progreso probado.

| | |
|---|---|
| **Epic id** | `01-fundamentos-y-logica` |
| **Tasks** | `E1-T1` … `E1-T7` (pasos 1–7 del blueprint) |
| **Depends on** | nada — empieza aquí (después de §10 Bootstrap) |
| **Unlocks** | `02-interfaz-y-despliegue` |
| **Parallel with** | ninguno (el epic 2 consume sus contratos) |

No necesitas ningún otro archivo para completar este epic. Todo lo de abajo se repite aquí a propósito; cada tarea trae el contenido completo de sus archivos.

---

## Stack

Astro (salida estática, `base: "/mentorix-calc-reto-30"`, `trailingSlash: "always"`) · islas Preact 10 con `client:only="preact"` · `@preact/signals` · TypeScript estricto · CSS propio con tokens · Vitest + happy-dom + `@testing-library/preact` · Prettier + `prettier-plugin-astro` · GitHub Pages vía GitHub Actions · sin base de datos (progreso en `localStorage`, clave `mentorix-reto:v1`) · sin auth.
Package manager: `npm`. Runtime fijado en `.nvmrc` (`24`). Las versiones de dependencias están en `package-lock.json`: léelo, nunca adivines una versión. No hay variables de entorno.

| Task | Command |
|---|---|
| Instalar | `npm install --no-audit --no-fund` (ya lo hizo §10 Bootstrap) |
| Dev | `npm run dev` — http://localhost:4321/mentorix-calc-reto-30/ |
| Typecheck | `npm run check` |
| Test (todas) | `npm test` |
| Test (un archivo) | `npm test -- tests/unit/generador.test.ts` |
| Build + verificación de `dist/` | `npm run build` (ejecuta `node scripts/verificar-dist.mjs`) |
| Formato | `npm run format` · comprobar: `npm run format:check` |
| Servicios locales | ninguno — no hay base de datos ni contenedores |

**Gate:** `npm run check && npm test && npm run format:check` (y `npm run build` en las tareas que construyen) pasa antes de marcar cualquier tarea como hecha.

**Antes de la primera tarea**, desde la raíz del proyecto ya se ejecutó §10 Bootstrap del blueprint: copió `workspace/` (configs, `CLAUDE.md`, `.claude/`), creó el repo git con identidad local, instaló dependencias e hizo el primer commit. Si no se ejecutó, ejecuta exactamente este bloque (es seguro repetirlo):

```bash
node -e "require('node:fs').cpSync('blueprints/mentorix-calc-reto-30/workspace', '.', { recursive: true, force: false, errorOnExist: false })"
test -d .git || git init -b main
git config user.name >/dev/null || git config user.name "Mentorix Builder"
git config user.email >/dev/null || git config user.email "builder@mentorix.local"
npm install --no-audit --no-fund
git rev-parse --verify HEAD >/dev/null 2>&1 || { git add -A && git commit -m "chore: andamiaje inicial desde el blueprint"; }
npm run format:check
```

Los archivos de `workspace/` (`package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `tests/setup.ts`, `.prettierrc`, `.prettierignore`, `.gitignore`, `.gitattributes`, `.nvmrc`, `scripts/verificar-dist.mjs`) ya están en la raíz y **ninguna tarea los edita**.

## Directory subtree

Solo las partes que toca este epic:

```
src/
  pages/index.astro              # NUEVO en E1-T1, reemplazado en E1-T2
  styles/tokens.css              # NUEVO E1-T2 — única fuente de colores y medidas
  styles/global.css              # NUEVO E1-T2 — incluye ya las clases de las islas del epic 2
  layouts/Base.astro             # NUEVO E1-T2 — head, tema inline, navegación
  lib/tipos.ts                   # NUEVO E1-T3 — tipos del dominio
  lib/fechas.ts                  # NUEVO E1-T4 — YYYY-MM-DD sin zonas horarias
  lib/plan/minutos.ts            # NUEVO E1-T4
  lib/plan/generador.ts          # NUEVO E1-T4 — generarPlan, erroresConfig
  lib/plan/ajustes.ts            # NUEVO E1-T5
  lib/progreso/estado.ts         # NUEVO E1-T6
  lib/progreso/validar.ts        # NUEVO E1-T6
  lib/progreso/almacen.ts        # NUEVO E1-T6
  lib/progreso/acciones.ts       # NUEVO E1-T6
  lib/progreso/respaldo.ts       # NUEVO E1-T7
  lib/progreso/derivados.ts      # NUEVO E1-T7
  components/LimiteErrores.tsx   # NUEVO E1-T7
  data/rutas/index.ts            # NUEVO E1-T3 (2 rutas), reemplazado en E1-T5 (4 rutas)
  data/rutas/calculo-diferencial.ts      # NUEVO E1-T3
  data/rutas/calculo-integral.ts         # NUEVO E1-T3
  data/rutas/calculo-multivariable.ts    # NUEVO E1-T5
  data/rutas/ecuaciones-diferenciales.ts # NUEVO E1-T5
tests/
  setup.ts                       # existe (workspace/), solo lectura
  fixtures/ruta-prueba.ts        # NUEVO E1-T4 — ruta del ejemplo trabajado
  unit/humo.test.tsx             # NUEVO E1-T1
  unit/tokens.test.ts            # NUEVO E1-T2
  unit/rutas.test.ts             # NUEVO E1-T3
  unit/generador.test.ts         # NUEVO E1-T4
  unit/ajustes.test.ts           # NUEVO E1-T5
  unit/progreso.test.ts          # NUEVO E1-T6
  unit/respaldo.test.ts          # NUEVO E1-T7
  unit/derivados.test.ts         # NUEVO E1-T7
```

Todo lo que está fuera de este subárbol queda fuera de alcance. Si una tarea parece requerir editar otro archivo, detente y repórtalo.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| `Ruta` / `Tema` / `Subtema` | `slug`, `nombre`, `descripcion`, `temas`, `prerrequisitos`, `subtemas`, `diasEstimados` (entero ≥ 1), `dificultad` (1–3) | slugs kebab-case, únicos en todo el catálogo, inmutables; `final` reservado |
| `ConfigPlan` | `fechaInicio` (YYYY-MM-DD), `horizonteDias` (7–120), `minutosPorDia` (múltiplo de 5, 60–360), `diaLigeroCada` (0–30), `refuerzos` (`{ temaSlug, dias 1–7 }`) | `configInicial` = 30 días, 120 min, ligero cada 7, sin refuerzos |
| `Dia` / `Bloque` | `numero`, `fecha`, `tipo`, `temaSlug`, `subtemaSlug`, `titulo`, `objetivo`, `queEstudiar`, `queHacer`, `repaso`, `repasoSlugs`, `bloques`, `cierre`, `siguientePaso`; bloque `id`, `tipo`, `titulo`, `instruccion`, `minutos`, `subtemaSlug?` | ID de bloque `${ruta}:${tipoDia}:${clave}:${tipoBloque}`, sin fechas |
| `Estado` (localStorage `mentorix-reto:v1`) | `version: 1`, `rutaActiva`, `ultimoRespaldo`, `rutas[slug] = { config, completados, evaluaciones, dificultades, dominio, reflexiones }` | datos inválidos → copia en `mentorix-reto:v1:danado`, nunca se borran |

**Ejemplo trabajado** (ruta `prueba`: `t1` = a (2 días, dif. 1) + b (1 día, dif. 3); `t2` (prerrequisito `t1`) = c (3 días, dif. 2); inicio 2026-03-01, 14 días, 120 min, ligero cada 7): días = estudio:a#1, estudio:a#2, estudio:b#1, evaluacion:t1, correccion:t1, estudio:c#1, repaso:rep-1, estudio:c#2, estudio:c#3, evaluacion:t2, correccion:t2, simulacro:final, correccion:final, repaso:rep-2; repasos 3:[a] 4:[b] 5:[a] 6:[b] 9:[a] 10:[b,c] 12:[c]; 80 bloques; con 7 días, `c` va a `fueraDelHorizonte`.

## Contracts

**Consumed** — ya existe, no lo reconstruyas:

| From | Interface | Guarantee |
|---|---|---|
| `workspace/` (§10 Bootstrap) | `package.json` scripts `check`, `test`, `build`, `format`, `format:check` | `build` = `astro build && node scripts/verificar-dist.mjs` |
| `workspace/` | `vitest.config.ts` + `tests/setup.ts` | happy-dom, JSX de Preact, `localStorage` limpio tras cada prueba, `?raw` de CSS en `src/styles/` |

**Produced** — el epic 2 depende exactamente de estas firmas:

| Export | Signature | Used by |
|---|---|---|
| `src/data/rutas/index.ts` → `rutas`, `buscarRuta`, `buscarTema` | `Ruta[]`, `(slug: string) => Ruta \| undefined`, `(slug: string) => Tema \| undefined` | `02-interfaz-y-despliegue` |
| `src/lib/fechas.ts` → `formatearFecha`, `hoyLocal`, `numeroDelDia`, `sumarDias`, `diferenciaDias`, `esFechaValida` | `(fecha: string) => string`, `(ahora?: Date) => string`, `(inicio, hoy) => number`, … | `02` |
| `src/lib/plan/generador.ts` → `generarPlan`, `erroresConfig` | `(ruta, config, catalogo?) => Plan` (RangeError si inválida), `(config) => string[]` | `02` |
| `src/lib/plan/ajustes.ts` → `configInicial`, `cambiarDuracion`, `extenderHorizonte`, `fijarRefuerzo`, `prerrequisitosDeRuta` | `ConfigPlan` puras; RangeError fuera de rango | `02` |
| `src/lib/progreso/estado.ts` → `Estado`, `estadoInicial`, `CLAVE_ALMACEN`, `NIVELES_DOMINIO`, … | — | `02` |
| `src/lib/progreso/almacen.ts` → `cargarEstado`, `guardarEstado` | `(almacen?) => { estado, corrupto }`, `(estado, almacen?) => boolean` | `02` (store) |
| `src/lib/progreso/acciones.ts` → `activarRuta`, `actualizarConfig`, `marcarBloque`, `declararDominio`, `registrarDificultad`, `resolverDificultad`, `registrarEvaluacion`, `guardarReflexion`, `marcarRespaldo` | `(estado, …) => Estado` o `Estado \| Error` | `02` |
| `src/lib/progreso/respaldo.ts` → `leerRespaldo`, `serializarRespaldo`, `describirResumen`, `nombreArchivoRespaldo`, `necesitaRecordatorio`, `descargarTexto` | — | `02` |
| `src/lib/progreso/derivados.ts` → `estadoDelDia`, `posicionDelDia`, `progresoGlobal`, `temasEstudiados`, `repasosPendientes`, `dificultadesAbiertas`, `resumenDominio` | puras | `02` |
| `src/components/LimiteErrores.tsx` → `LimiteErrores` | `<LimiteErrores origen="…">{children}</LimiteErrores>` | `02` |
| `src/layouts/Base.astro` | props `titulo: string`, `seccion?: "hoy" \| "calendario" \| "progreso" \| "ajustes"` | `02` |

## Conventions that bite in this area

- **Imports relativos sin extensión** (`../fechas`), sin alias; `../../src/data/rutas` resuelve a `index.ts`. Así lo resuelven igual Vite (build), Vitest y `astro check`.
- **Fechas solo con `src/lib/fechas.ts`.** `new Date("2026-03-01")` se interpreta en UTC y corre el día en Perú.
- **`generarPlan` es pura** y no usa el reloj. Los textos y el orden de días están fijados por `tests/unit/generador.test.ts`.
- **Completar ≠ dominar:** `marcarBloque` nunca toca `dominio`.
- **Una sola `h1` por página**, en el `.astro`.

Reglas completas: `CLAUDE.md`. Reglas por área: `.claude/rules/rutas-datos.md`, `.claude/rules/logica-plan-progreso.md`, `.claude/rules/pruebas.md`, `.claude/rules/interfaz.md` — todos en la raíz del proyecto desde §10 Bootstrap.

---

## Tasks

Listadas en el mismo orden que `tasks.json`. Ese orden es el orden de construcción: trabaja de arriba abajo y no reordenes por prioridad.

### `E1-T1` — Andamiaje: página mínima, prueba de humo y build verificado

**Depends on:** nada · **Priority:** p0 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 1

Los archivos de configuración (`package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `tests/setup.ts`, `.prettierrc`, `.prettierignore`, `.gitignore`, `.gitattributes`, `.nvmrc`, `scripts/verificar-dist.mjs`) ya están en la raíz: los copió §10 Bootstrap desde `workspace/`, que también ejecutó `npm install` y el primer commit. **No los edites.** Este paso crea la primera página y la primera prueba, y comprueba que toda la cadena (tipos, Vitest con happy-dom y JSX de Preact, build estático con la base de GitHub Pages, verificación de `dist/` y formato) funciona de punta a punta. Antes de Verify ejecuta `npm run format`.

**Files**
- `src/pages/index.astro` — nuevo
- `tests/unit/humo.test.tsx` — nuevo

Contenido exacto de cada archivo:

#### `src/pages/index.astro` — nuevo

```astro
---
const inicio = import.meta.env.BASE_URL;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mentorix Calc — Reto de Estudio de 30 Días</title>
  </head>
  <body>
    <main>
      <h1>Mentorix Calc — Reto de Estudio de 30 Días</h1>
      <p>
        <a href={inicio}>Inicio</a>
      </p>
    </main>
  </body>
</html>
```

#### `tests/unit/humo.test.tsx` — nuevo

```tsx
import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";

describe("entorno de pruebas", () => {
  it("corre en happy-dom con localStorage disponible", () => {
    expect(typeof document).toBe("object");
    window.localStorage.setItem("humo", "ok");
    expect(window.localStorage.getItem("humo")).toBe("ok");
  });

  it("renderiza JSX de Preact", () => {
    render(<p>Hola, Mentorix</p>);
    expect(screen.getByText("Hola, Mentorix")).toBeTruthy();
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** `npm run build` runs **THE SYSTEM SHALL** write `dist/index.html` containing `href="/mentorix-calc-reto-30/"` and `scripts/verificar-dist.mjs` SHALL print `verificar-dist: OK` (every internal href/src starts with `/mentorix-calc-reto-30/`).
2. **WHEN** `npm test` runs **THE SYSTEM SHALL** pass `tests/unit/humo.test.tsx`, which writes and reads `localStorage` in happy-dom and renders Preact JSX.
3. **WHEN** `npm run check` runs **THE SYSTEM SHALL** report 0 errors with TypeScript strict.
4. **WHEN** `npm run format:check` runs with the bundle present in `blueprints/` **THE SYSTEM SHALL** exit 0, because `.prettierignore` excludes `blueprints/`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm run check
npm test
npm run build
test -f dist/index.html
grep -q 'href="/mentorix-calc-reto-30/"' dist/index.html
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T1: Andamiaje: página mínima, prueba de humo y build verificado"
git tag step-01-andamiaje
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E1-T2` — Tokens de diseño, layout con navegación y modo claro/oscuro

**Depends on:** `E1-T1` · **Priority:** p0 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 2

Crea los tokens de §7 (claro, oscuro por `prefers-color-scheme` bajo `:root:not([data-theme="light"])` y forzado por `:root[data-theme="dark"]`), los estilos globales (incluye ya las clases que usarán las islas de los pasos 8–13), el layout `Base.astro` con fuentes autoalojadas, script inline que aplica el tema guardado (`mentorix-tema`) antes del primer pintado, enlace «Saltar al contenido», conmutador de tema y navegación (inferior en móvil, lateral desde 960px) con los cuatro enlaces bajo la base. Reemplaza `src/pages/index.astro` para usar `Base`. La prueba de tokens comprueba cada valor de §7 en ambos modos y el contraste AA. Ejecuta `npm run format` antes de Verify.

**Files**
- `src/styles/tokens.css` — nuevo
- `src/styles/global.css` — nuevo
- `src/layouts/Base.astro` — nuevo
- `src/pages/index.astro` — reemplaza (contenido completo)
- `tests/unit/tokens.test.ts` — nuevo

Contenido exacto de cada archivo:

#### `src/styles/tokens.css` — nuevo

```css
/* Tokens de diseño: única fuente de colores, tipografía, radios y espaciado. */
:root {
  color-scheme: light;
  --bg: #f6f8f7;
  --surface: #ffffff;
  --surface-2: #eef3f1;
  --text: #0f1f1c;
  --text-muted: #5b6b67;
  --primary: #0f766e;
  --primary-contrast: #ffffff;
  --accent: #d97706;
  --success: #15803d;
  --warning: #b45309;
  --danger: #b91c1c;
  --border: #d6e0dd;

  --font-titulos: "Fraunces Variable", Georgia, serif;
  --font-texto:
    "Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif;
  --texto-base: 16px;
  --escala-1: 1.25rem;
  --escala-2: 1.5625rem;
  --escala-3: 1.953rem;
  --escala-4: 2.441rem;

  --radio-tarjeta: 14px;
  --radio-boton: 10px;
  --sombra-1: 0 1px 2px rgb(15 31 28 / 0.06), 0 2px 8px rgb(15 31 28 / 0.06);
  --sombra-2: 0 4px 16px rgb(15 31 28 / 0.1);

  --e-1: 4px;
  --e-2: 8px;
  --e-3: 12px;
  --e-4: 16px;
  --e-5: 24px;
  --e-6: 32px;
  --e-7: 48px;

  --transicion: 180ms ease-out;
  --ancho-max: 960px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --bg: #0b1513;
    --surface: #12201d;
    --surface-2: #1a2c28;
    --text: #e7f0ee;
    --text-muted: #9db0ab;
    --primary: #2dd4bf;
    --primary-contrast: #04201c;
    --accent: #fbbf24;
    --success: #4ade80;
    --warning: #fbbf24;
    --danger: #f87171;
    --border: #24413b;
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0b1513;
  --surface: #12201d;
  --surface-2: #1a2c28;
  --text: #e7f0ee;
  --text-muted: #9db0ab;
  --primary: #2dd4bf;
  --primary-contrast: #04201c;
  --accent: #fbbf24;
  --success: #4ade80;
  --warning: #fbbf24;
  --danger: #f87171;
  --border: #24413b;
}
```

#### `src/styles/global.css` — nuevo

```css
/* Estilos globales. Solo usa tokens de tokens.css: ningún hex fuera de ese archivo. */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: var(--texto-base);
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-texto);
  line-height: 1.55;
  overflow-x: hidden;
}

h1,
h2,
h3 {
  font-family: var(--font-titulos);
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 var(--e-3);
}

h1 {
  font-size: var(--escala-3);
}

h2 {
  font-size: var(--escala-2);
}

h3 {
  font-size: var(--escala-1);
}

a {
  color: var(--primary);
}

:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}

.saltar {
  position: absolute;
  left: var(--e-2);
  top: -100px;
  background: var(--surface);
  color: var(--text);
  padding: var(--e-2) var(--e-4);
  border-radius: var(--radio-boton);
  z-index: 100;
}

.saltar:focus {
  top: var(--e-2);
}

.contenido {
  max-width: var(--ancho-max);
  margin: 0 auto;
  padding: var(--e-7) var(--e-4) calc(var(--e-7) + 64px);
}

.tarjeta {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radio-tarjeta);
  box-shadow: var(--sombra-1);
  padding: var(--e-5);
  margin-bottom: var(--e-4);
}

.boton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--e-2);
  min-height: 44px;
  padding: var(--e-2) var(--e-4);
  border-radius: var(--radio-boton);
  border: 1px solid var(--primary);
  background: var(--primary);
  color: var(--primary-contrast);
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--transicion);
}

.boton--secundario {
  background: transparent;
  color: var(--primary);
}

.boton--peligro {
  background: var(--danger);
  border-color: var(--danger);
  color: var(--primary-contrast);
}

.texto-tenue {
  color: var(--text-muted);
}

.campo {
  display: grid;
  gap: var(--e-1);
  margin-bottom: var(--e-4);
}

.campo input,
.campo select,
.campo textarea {
  font: inherit;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radio-boton);
  padding: var(--e-2) var(--e-3);
  min-height: 44px;
}

fieldset {
  border: 1px solid var(--border);
  border-radius: var(--radio-boton);
  margin: 0 0 var(--e-4);
  padding: var(--e-3) var(--e-4);
}

legend {
  font-weight: 600;
  padding: 0 var(--e-1);
}

.opcion-ruta {
  display: flex;
  gap: var(--e-3);
  align-items: flex-start;
  padding: var(--e-3);
  margin-bottom: var(--e-2);
  border: 1px solid var(--border);
  border-radius: var(--radio-boton);
  background: var(--surface-2);
  cursor: pointer;
}

.opcion-ruta input {
  margin-top: 6px;
  width: 20px;
  height: 20px;
  accent-color: var(--primary);
}

.insignia {
  display: inline-block;
  padding: 2px var(--e-2);
  border-radius: 999px;
  border: 1px solid var(--color-tipo, var(--border));
  color: var(--text);
  font-size: 0.8125rem;
  font-weight: 600;
}

.guia {
  border-left: 4px solid var(--color-tipo, var(--primary));
  padding-left: var(--e-3);
}

.bloques {
  list-style: none;
  margin: 0;
  padding: 0;
}

.bloques li {
  padding: var(--e-3) 0;
  border-bottom: 1px solid var(--border);
}

.bloques label {
  display: flex;
  gap: var(--e-3);
  align-items: center;
  min-height: 44px;
  cursor: pointer;
}

.bloques input,
.tabla-dominio input[type="checkbox"] {
  width: 22px;
  height: 22px;
  accent-color: var(--primary);
}

.calendario {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--e-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.calendario__dia a {
  display: block;
  height: 100%;
  padding: var(--e-3);
  border: 1px solid var(--border);
  border-top: 4px solid var(--color-tipo, var(--border));
  border-radius: var(--radio-boton);
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
  font-size: 0.875rem;
}

.calendario__dia[data-estado="Hoy"] a {
  outline: 2px solid var(--primary);
}

.calendario__dia[data-estado="Completado"] a {
  background: var(--surface-2);
}

.tabla-dominio {
  overflow-x: auto;
  margin-bottom: var(--e-4);
}

.tabla-dominio table {
  width: 100%;
  border-collapse: collapse;
}

.tabla-dominio th,
.tabla-dominio td {
  text-align: left;
  padding: var(--e-2);
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}

.tabla-dominio select,
.tabla-dominio input[type="text"] {
  font: inherit;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radio-boton);
  padding: var(--e-1) var(--e-2);
  min-height: 40px;
  max-width: 100%;
}

progress {
  width: 100%;
  height: 12px;
  accent-color: var(--primary);
}

.tipo-estudio {
  --color-tipo: var(--primary);
}

.tipo-refuerzo {
  --color-tipo: var(--accent);
}

.tipo-evaluacion,
.tipo-simulacro {
  --color-tipo: var(--danger);
}

.tipo-correccion {
  --color-tipo: var(--warning);
}

.tipo-repaso {
  --color-tipo: var(--success);
}

.navegacion {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: var(--surface);
  border-top: 1px solid var(--border);
}

.navegacion__lista {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
}

.navegacion__enlace {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-height: 56px;
  padding: var(--e-2) var(--e-1);
  color: var(--text-muted);
  font-size: 0.8125rem;
  text-decoration: none;
}

.navegacion__enlace[aria-current="page"] {
  color: var(--primary);
  font-weight: 600;
}

.navegacion__marca {
  display: none;
}

.conmutador-tema {
  position: fixed;
  top: var(--e-3);
  right: var(--e-3);
  z-index: 60;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radio-boton);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  cursor: pointer;
}

@media (min-width: 960px) {
  .navegacion {
    top: 0;
    right: auto;
    width: 220px;
    border-top: 0;
    border-right: 1px solid var(--border);
    padding: var(--e-5) var(--e-3);
  }

  .navegacion__marca {
    display: block;
    font-family: var(--font-titulos);
    font-weight: 600;
    color: var(--text);
    text-decoration: none;
    margin-bottom: var(--e-5);
  }

  .navegacion__lista {
    grid-template-columns: 1fr;
    gap: var(--e-1);
  }

  .navegacion__enlace {
    flex-direction: row;
    justify-content: flex-start;
    gap: var(--e-3);
    min-height: 44px;
    padding: var(--e-2) var(--e-3);
    border-radius: var(--radio-boton);
    font-size: 1rem;
  }

  .contenido {
    margin-left: 220px;
    padding: var(--e-6) var(--e-6) var(--e-7);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

#### `src/layouts/Base.astro` — nuevo

```astro
---
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "../styles/tokens.css";
import "../styles/global.css";

interface Props {
  titulo: string;
  seccion?: "hoy" | "calendario" | "progreso" | "ajustes";
}

const { titulo, seccion } = Astro.props;
const base = import.meta.env.BASE_URL;
const enlaces = [
  {
    id: "hoy",
    texto: "Hoy",
    href: `${base}hoy/`,
    icono: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3",
  },
  {
    id: "calendario",
    texto: "Calendario",
    href: `${base}calendario/`,
    icono: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4",
  },
  {
    id: "progreso",
    texto: "Progreso",
    href: `${base}progreso/`,
    icono: "M4 20V10M10 20V4M16 20v-8M2 20h20",
  },
  {
    id: "ajustes",
    texto: "Ajustes",
    href: `${base}ajustes/`,
    icono: "M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6",
  },
];
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%278%27 fill=%27%230f766e%27/%3E%3Ctext x=%2716%27 y=%2722%27 font-size=%2716%27 text-anchor=%27middle%27 fill=%27white%27 font-family=%27Georgia%27%3EM%3C/text%3E%3C/svg%3E"
    />
    <title>{titulo} · Mentorix Calc — Reto de 30 Días</title>
    <script is:inline>
      (function () {
        try {
          var tema = localStorage.getItem("mentorix-tema");
          if (tema === "light" || tema === "dark") {
            document.documentElement.setAttribute("data-theme", tema);
          }
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <a class="saltar" href="#contenido">
      Saltar al contenido
    </a>
    <button
      class="conmutador-tema"
      type="button"
      data-conmutador-tema
      aria-label="Cambiar entre modo claro y oscuro"
    >
      <span aria-hidden="true">◐</span>
    </button>
    <nav class="navegacion" aria-label="Navegación principal">
      <a class="navegacion__marca" href={base}>
        Mentorix Calc
      </a>
      <ul class="navegacion__lista">
        {enlaces.map((enlace) => (
          <li>
            <a
              class="navegacion__enlace"
              href={enlace.href}
              aria-current={seccion === enlace.id ? "page" : undefined}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d={enlace.icono} />
              </svg>
              <span>{enlace.texto}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
    <main id="contenido" class="contenido">
      <slot />
    </main>
    <script is:inline>
      (function () {
        var boton = document.querySelector("[data-conmutador-tema]");
        if (!boton) return;
        boton.addEventListener("click", function () {
          var raiz = document.documentElement;
          var actual = raiz.getAttribute("data-theme");
          if (!actual) {
            actual = window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";
          }
          var siguiente = actual === "dark" ? "light" : "dark";
          raiz.setAttribute("data-theme", siguiente);
          try {
            localStorage.setItem("mentorix-tema", siguiente);
          } catch (e) {}
        });
      })();
    </script>
  </body>
</html>
```

#### `src/pages/index.astro` — reemplaza (contenido completo)

```astro
---
import Base from "../layouts/Base.astro";
---

<Base titulo="Inicio">
  <h1>Mentorix Calc — Reto de Estudio de 30 Días</h1>
  <p class="texto-tenue">
    Tu guía diaria: qué estudiar hoy y cómo usar los recursos de tu
    acompañamiento.
  </p>
</Base>
```

#### `tests/unit/tokens.test.ts` — nuevo

```ts
import { describe, expect, it } from "vitest";
import tokens from "../../src/styles/tokens.css?raw";

const CLARO: Record<string, string> = {
  "--bg": "#f6f8f7",
  "--surface": "#ffffff",
  "--surface-2": "#eef3f1",
  "--text": "#0f1f1c",
  "--text-muted": "#5b6b67",
  "--primary": "#0f766e",
  "--primary-contrast": "#ffffff",
  "--accent": "#d97706",
  "--success": "#15803d",
  "--warning": "#b45309",
  "--danger": "#b91c1c",
  "--border": "#d6e0dd",
};

const OSCURO: Record<string, string> = {
  "--bg": "#0b1513",
  "--surface": "#12201d",
  "--surface-2": "#1a2c28",
  "--text": "#e7f0ee",
  "--text-muted": "#9db0ab",
  "--primary": "#2dd4bf",
  "--primary-contrast": "#04201c",
  "--accent": "#fbbf24",
  "--success": "#4ade80",
  "--warning": "#fbbf24",
  "--danger": "#f87171",
  "--border": "#24413b",
};

function luminancia(hex: string): number {
  const canales = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * canales[0]! + 0.7152 * canales[1]! + 0.0722 * canales[2]!;
}

function contraste(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1! + 0.05) / (l2! + 0.05);
}

function bloque(selector: string): string {
  const inicio = tokens.indexOf(selector);
  expect(inicio, selector).toBeGreaterThanOrEqual(0);
  return tokens.slice(inicio, tokens.indexOf("}", inicio));
}

describe("tokens de diseño", () => {
  it("declara cada token claro en :root", () => {
    const raiz = bloque(":root {");
    for (const [nombre, valor] of Object.entries(CLARO)) {
      expect(raiz).toContain(`${nombre}: ${valor};`);
    }
  });

  it("declara cada token oscuro para el sistema y para el conmutador", () => {
    for (const selector of [
      ':root:not([data-theme="light"]) {',
      ':root[data-theme="dark"] {',
    ]) {
      const oscuro = bloque(selector);
      for (const [nombre, valor] of Object.entries(OSCURO)) {
        expect(oscuro).toContain(`${nombre}: ${valor};`);
      }
    }
  });

  it("cumple contraste AA (4.5:1) en los pares de texto de ambos modos", () => {
    const pares: [string, string][] = [
      ["--text", "--bg"],
      ["--text", "--surface"],
      ["--text-muted", "--bg"],
      ["--text-muted", "--surface"],
      ["--primary-contrast", "--primary"],
      ["--primary", "--surface"],
      ["--danger", "--surface"],
      ["--warning", "--surface"],
      ["--success", "--surface"],
    ];
    for (const paleta of [CLARO, OSCURO]) {
      for (const [texto, fondo] of pares) {
        expect(
          contraste(paleta[texto]!, paleta[fondo]!),
          `${texto} sobre ${fondo}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** `npm test -- tests/unit/tokens.test.ts` runs **THE SYSTEM SHALL** find every light token of §7 in `:root` and every dark token in both `:root:not([data-theme="light"])` and `:root[data-theme="dark"]`.
2. **WHEN** the same test computes WCAG contrast **THE SYSTEM SHALL** measure at least 4.5:1 for text/bg, text/surface, text-muted/bg, text-muted/surface, primary-contrast/primary, primary/surface, danger/surface, warning/surface and success/surface in both modes.
3. **WHEN** `npm run build` runs **THE SYSTEM SHALL** emit in `dist/index.html` the inline theme script (`mentorix-tema`) and the four navigation links `/mentorix-calc-reto-30/hoy/`, `/mentorix-calc-reto-30/calendario/`, `/mentorix-calc-reto-30/progreso/` and `/mentorix-calc-reto-30/ajustes/`, and `verificar-dist.mjs` SHALL print `verificar-dist: OK`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/unit/tokens.test.ts
npm test
npm run check
npm run build
grep -q 'mentorix-tema' dist/index.html
grep -q 'href="/mentorix-calc-reto-30/hoy/"' dist/index.html
grep -q 'href="/mentorix-calc-reto-30/calendario/"' dist/index.html
grep -q 'href="/mentorix-calc-reto-30/progreso/"' dist/index.html
grep -q 'href="/mentorix-calc-reto-30/ajustes/"' dist/index.html
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T2: Tokens de diseño, layout con navegación y modo claro/oscuro"
git tag step-02-tokens-layout
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E1-T3` — Tipos, registro de rutas, Diferencial e Integral

**Depends on:** `E1-T1` · **Priority:** p0 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 3

Crea los tipos del dominio de §4, el registro de rutas (en este paso con **dos** rutas: Cálculo Diferencial y Cálculo Integral; el paso 5 agrega las otras dos) y la prueba que valida todo el catálogo registrado: slugs en kebab-case y únicos en todo el catálogo, prerrequisitos existentes (y anteriores si son de la misma ruta), `diasEstimados` entero ≥ 1, `dificultad` ∈ {1, 2, 3}, ningún tema llamado `final`. Ejecuta `npm run format` antes de Verify.

**Files**
- `src/lib/tipos.ts` — nuevo
- `src/data/rutas/index.ts` — nuevo
- `src/data/rutas/calculo-diferencial.ts` — nuevo
- `src/data/rutas/calculo-integral.ts` — nuevo
- `tests/unit/rutas.test.ts` — nuevo

Contenido exacto de cada archivo:

#### `src/lib/tipos.ts` — nuevo

```ts
// Tipos del dominio. Única fuente de las formas de rutas, planes y bloques.

/** 1 = baja, 2 = media, 3 = alta. */
export type Dificultad = 1 | 2 | 3;

export interface Subtema {
  /** Identificador estable. Nunca se renombra una vez publicado. */
  slug: string;
  nombre: string;
  /** Días de estudio que consume. Entero >= 1. El plan nunca lo reduce. */
  diasEstimados: number;
  dificultad: Dificultad;
}

export interface Tema {
  slug: string;
  nombre: string;
  /** Slugs de temas (de esta u otra ruta) que conviene dominar antes. */
  prerrequisitos: string[];
  subtemas: Subtema[];
}

export interface Ruta {
  slug: string;
  nombre: string;
  descripcion: string;
  temas: Tema[];
}

export interface Refuerzo {
  /** Slug de un tema que algún tema de la ruta declara como prerrequisito. */
  temaSlug: string;
  /** Días de refuerzo, entero 1..7. */
  dias: number;
}

export interface ConfigPlan {
  /** Fecha local YYYY-MM-DD del día 1. */
  fechaInicio: string;
  /** Entero 7..120. */
  horizonteDias: number;
  /** Múltiplo de 5 entre 60 y 360. */
  minutosPorDia: number;
  /** Cada cuántos días hay un día ligero de repaso. 0 = nunca. */
  diaLigeroCada: number;
  refuerzos: Refuerzo[];
}

export type TipoDia =
  "estudio" | "refuerzo" | "evaluacion" | "correccion" | "repaso" | "simulacro";

export type TipoBloque =
  | "recuperar"
  | "teoria"
  | "ejemplos"
  | "practica"
  | "evaluacion"
  | "descanso"
  | "repaso"
  | "cierre";

export interface Bloque {
  /** `${rutaSlug}:${tipoDia}:${clave}:${tipoBloque}` — ver generador.ts. */
  id: string;
  tipo: TipoBloque;
  titulo: string;
  instruccion: string;
  minutos: number;
  subtemaSlug?: string;
}

export interface Dia {
  /** 1..horizonteDias */
  numero: number;
  /** YYYY-MM-DD */
  fecha: string;
  tipo: TipoDia;
  /** Tema estudiado, reforzado o evaluado; null en repaso, simulacro y su corrección. */
  temaSlug: string | null;
  /** Subtema estudiado; solo en días de estudio. */
  subtemaSlug: string | null;
  /** Título corto para el calendario. */
  titulo: string;
  objetivo: string;
  queEstudiar: string;
  queHacer: string;
  /** Textos de repaso espaciado programados para este día. */
  repaso: string[];
  /** Slugs de los subtemas cuyo repaso espaciado cae en este día. */
  repasoSlugs: string[];
  bloques: Bloque[];
  cierre: string[];
  siguientePaso: string;
}

export interface SubtemaRef {
  temaSlug: string;
  subtemaSlug: string;
  nombre: string;
  diasEstimados: number;
}

export interface Plan {
  dias: Dia[];
  fueraDelHorizonte: SubtemaRef[];
}
```

#### `src/data/rutas/index.ts` — nuevo

```ts
// Registro de rutas. Para añadir una ruta: crea su archivo en esta carpeta
// y agrégala a `rutas` (el orden de este arreglo es el orden en Inicio).
import type { Ruta, Tema } from "../../lib/tipos";
import { calculoDiferencial } from "./calculo-diferencial";
import { calculoIntegral } from "./calculo-integral";

export const rutas: Ruta[] = [calculoDiferencial, calculoIntegral];

export function buscarRuta(slug: string): Ruta | undefined {
  return rutas.find((ruta) => ruta.slug === slug);
}

export function buscarTema(slug: string): Tema | undefined {
  for (const ruta of rutas) {
    const tema = ruta.temas.find((t) => t.slug === slug);
    if (tema) return tema;
  }
  return undefined;
}
```

#### `src/data/rutas/calculo-diferencial.ts` — nuevo

```ts
import type { Ruta } from "../../lib/tipos";

export const calculoDiferencial: Ruta = {
  slug: "calculo-diferencial",
  nombre: "Cálculo Diferencial",
  descripcion:
    "Funciones, límites, continuidad, derivadas y sus aplicaciones, en el orden de un primer curso universitario.",
  temas: [
    {
      slug: "funciones",
      nombre: "Funciones",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "dominio-y-rango",
          nombre: "Dominio y rango de funciones reales",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "graficas-funciones-elementales",
          nombre: "Gráficas de funciones elementales y transformaciones",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "operaciones-y-composicion",
          nombre: "Operaciones y composición de funciones",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "funciones-inversas",
          nombre: "Funciones inyectivas e inversas",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "exponenciales-y-logaritmicas",
          nombre: "Funciones exponenciales y logarítmicas",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "funciones-trigonometricas",
          nombre: "Funciones trigonométricas y sus inversas",
          diasEstimados: 2,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "limites",
      nombre: "Límites",
      prerrequisitos: ["funciones"],
      subtemas: [
        {
          slug: "nocion-de-limite",
          nombre: "Noción intuitiva de límite y límites laterales",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "limites-algebraicos",
          nombre: "Cálculo algebraico de límites e indeterminaciones",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "limites-trigonometricos",
          nombre: "Límites trigonométricos notables",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "limites-al-infinito",
          nombre: "Límites infinitos, límites al infinito y asíntotas",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "definicion-epsilon-delta",
          nombre: "Definición formal de límite (épsilon-delta)",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "continuidad",
      nombre: "Continuidad",
      prerrequisitos: ["limites"],
      subtemas: [
        {
          slug: "continuidad-en-un-punto",
          nombre: "Continuidad en un punto y en un intervalo",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "tipos-de-discontinuidad",
          nombre: "Tipos de discontinuidad",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "teorema-valor-intermedio",
          nombre: "Teorema del valor intermedio",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "derivadas",
      nombre: "Derivadas",
      prerrequisitos: ["limites", "continuidad"],
      subtemas: [
        {
          slug: "definicion-de-derivada",
          nombre: "Definición de derivada y recta tangente",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "reglas-de-derivacion",
          nombre: "Reglas de derivación",
          diasEstimados: 2,
          dificultad: 1,
        },
        {
          slug: "regla-de-la-cadena",
          nombre: "Regla de la cadena",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "derivadas-trascendentes",
          nombre:
            "Derivadas de funciones exponenciales, logarítmicas y trigonométricas",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "derivacion-implicita",
          nombre: "Derivación implícita y logarítmica",
          diasEstimados: 1,
          dificultad: 3,
        },
        {
          slug: "derivadas-orden-superior",
          nombre: "Derivadas de orden superior",
          diasEstimados: 1,
          dificultad: 1,
        },
      ],
    },
    {
      slug: "aplicaciones-derivada",
      nombre: "Aplicaciones de la derivada",
      prerrequisitos: ["derivadas"],
      subtemas: [
        {
          slug: "razones-relacionadas",
          nombre: "Razones de cambio relacionadas",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "maximos-y-minimos",
          nombre: "Máximos y mínimos absolutos",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "teorema-valor-medio",
          nombre: "Teoremas de Rolle y del valor medio",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "criterios-primera-segunda",
          nombre:
            "Monotonía, concavidad y criterios de la primera y segunda derivada",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "trazado-de-curvas",
          nombre: "Trazado de curvas",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "optimizacion",
          nombre: "Problemas de optimización",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "regla-de-lhopital",
          nombre: "Regla de L'Hôpital",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
  ],
};
```

#### `src/data/rutas/calculo-integral.ts` — nuevo

```ts
import type { Ruta } from "../../lib/tipos";

export const calculoIntegral: Ruta = {
  slug: "calculo-integral",
  nombre: "Cálculo Integral",
  descripcion:
    "Integral indefinida y técnicas, integral definida y Teorema Fundamental, aplicaciones e integrales impropias.",
  temas: [
    {
      slug: "integral-indefinida",
      nombre: "Integral indefinida y técnicas de integración",
      prerrequisitos: ["derivadas"],
      subtemas: [
        {
          slug: "antiderivadas",
          nombre: "Antiderivadas e integrales inmediatas",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "sustitucion",
          nombre: "Integración por sustitución",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "por-partes",
          nombre: "Integración por partes",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "integrales-trigonometricas",
          nombre: "Integrales trigonométricas",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "sustitucion-trigonometrica",
          nombre: "Sustitución trigonométrica",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "fracciones-parciales",
          nombre: "Integración por fracciones parciales",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "integral-definida",
      nombre: "Integral definida y Teorema Fundamental del Cálculo",
      prerrequisitos: ["integral-indefinida"],
      subtemas: [
        {
          slug: "sumas-de-riemann",
          nombre: "Sumas de Riemann y definición de integral definida",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "propiedades-integral-definida",
          nombre: "Propiedades de la integral definida",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "teorema-fundamental",
          nombre: "Teorema Fundamental del Cálculo",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "cambio-de-variable-definida",
          nombre: "Cambio de variable en la integral definida",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "aplicaciones-integral",
      nombre: "Aplicaciones de la integral",
      prerrequisitos: ["integral-definida"],
      subtemas: [
        {
          slug: "area-entre-curvas",
          nombre: "Área entre curvas",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "volumenes-discos-arandelas",
          nombre: "Volúmenes de sólidos de revolución: discos y arandelas",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "volumenes-capas-cilindricas",
          nombre: "Volúmenes por capas cilíndricas",
          diasEstimados: 1,
          dificultad: 3,
        },
        {
          slug: "longitud-de-arco",
          nombre: "Longitud de arco y área de superficie de revolución",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "trabajo-y-centroides",
          nombre: "Trabajo, presión y centros de masa",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "integrales-impropias",
      nombre: "Integrales impropias",
      prerrequisitos: ["integral-definida", "limites"],
      subtemas: [
        {
          slug: "impropias-limites-infinitos",
          nombre: "Integrales con límites de integración infinitos",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "impropias-discontinuas",
          nombre: "Integrales con integrando discontinuo",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "criterios-de-convergencia",
          nombre: "Criterios de comparación y convergencia",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
  ],
};
```

#### `tests/unit/rutas.test.ts` — nuevo

```ts
import { describe, expect, it } from "vitest";
import { buscarRuta, buscarTema, rutas } from "../../src/data/rutas";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const temas = rutas.flatMap((ruta) => ruta.temas);
const subtemas = temas.flatMap((tema) => tema.subtemas);

function duplicados(valores: string[]): string[] {
  return valores.filter((valor, i) => valores.indexOf(valor) !== i);
}

describe("catálogo de rutas", () => {
  it("tiene al menos una ruta, y cada ruta y cada tema tienen contenido", () => {
    expect(rutas.length).toBeGreaterThan(0);
    for (const ruta of rutas) {
      expect(ruta.temas.length, ruta.slug).toBeGreaterThan(0);
      expect(ruta.nombre.trim(), ruta.slug).not.toBe("");
      expect(ruta.descripcion.trim(), ruta.slug).not.toBe("");
    }
    for (const tema of temas) {
      expect(tema.subtemas.length, tema.slug).toBeGreaterThan(0);
    }
  });

  it("usa slugs en kebab-case, únicos en todo el catálogo", () => {
    const todos = [
      ...rutas.map((r) => r.slug),
      ...temas.map((t) => t.slug),
      ...subtemas.map((s) => s.slug),
    ];
    for (const slug of todos) expect(slug).toMatch(SLUG);
    expect(duplicados(rutas.map((r) => r.slug))).toEqual([]);
    expect(duplicados(temas.map((t) => t.slug))).toEqual([]);
    expect(duplicados(subtemas.map((s) => s.slug))).toEqual([]);
  });

  it("reserva la clave «final»: ningún tema se llama así", () => {
    expect(temas.map((t) => t.slug)).not.toContain("final");
  });

  it("solo declara prerrequisitos que existen y que se estudian antes en su ruta", () => {
    for (const ruta of rutas) {
      ruta.temas.forEach((tema, indice) => {
        for (const prerrequisito of tema.prerrequisitos) {
          expect(buscarTema(prerrequisito), prerrequisito).toBeDefined();
          expect(prerrequisito).not.toBe(tema.slug);
          const posicion = ruta.temas.findIndex(
            (t) => t.slug === prerrequisito,
          );
          if (posicion >= 0) expect(posicion).toBeLessThan(indice);
        }
      });
    }
  });

  it("usa diasEstimados enteros >= 1 y dificultad 1, 2 o 3", () => {
    for (const subtema of subtemas) {
      expect(Number.isInteger(subtema.diasEstimados), subtema.slug).toBe(true);
      expect(subtema.diasEstimados, subtema.slug).toBeGreaterThanOrEqual(1);
      expect([1, 2, 3], subtema.slug).toContain(subtema.dificultad);
    }
  });

  it("encuentra rutas y temas por slug", () => {
    const primera = rutas[0]!;
    expect(buscarRuta(primera.slug)).toBe(primera);
    expect(buscarRuta("no-existe")).toBeUndefined();
    expect(buscarTema(primera.temas[0]!.slug)).toBe(primera.temas[0]);
    expect(buscarTema("no-existe")).toBeUndefined();
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** `npm test -- tests/unit/rutas.test.ts` runs **THE SYSTEM SHALL** confirm that every registered route, topic and subtopic slug is kebab-case and unique across the whole catalog and that no topic slug is `final`.
2. **WHEN** the same test checks prerequisites **THE SYSTEM SHALL** find every prerequisite slug in the catalog and, when it belongs to the same route, positioned before the topic that requires it.
3. **WHEN** the same test checks subtopics **THE SYSTEM SHALL** find `diasEstimados` as an integer >= 1 and `dificultad` in {1, 2, 3} for every subtopic.
4. **WHEN** `buscarRuta` or `buscarTema` receives an unknown slug **THE SYSTEM SHALL** return `undefined`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/unit/rutas.test.ts
npm test
npm run check
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T3: Tipos, registro de rutas, Diferencial e Integral"
git tag step-03-rutas-base
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E1-T4` — Generador del plan puro, fechas locales y reparto de minutos

**Depends on:** `E1-T3` · **Priority:** p0 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 4

Implementa exactamente el algoritmo de §4 (grupos atómicos, días ligeros, colocación sin compresión, simulacro y corrección final, repaso espaciado d+1/d+3/d+7/d+14, regla de minutos, IDs estables y textos). La prueba fija el ejemplo trabajado de §4 con la ruta de `tests/fixtures/ruta-prueba.ts`. Ejecuta `npm run format` antes de Verify.

**Files**
- `src/lib/fechas.ts` — nuevo
- `src/lib/plan/minutos.ts` — nuevo
- `src/lib/plan/generador.ts` — nuevo
- `tests/fixtures/ruta-prueba.ts` — nuevo
- `tests/unit/generador.test.ts` — nuevo

Contenido exacto de cada archivo:

#### `src/lib/fechas.ts` — nuevo

```ts
// Fechas locales como cadenas YYYY-MM-DD. Sin zonas horarias: la aritmética
// se hace en UTC sobre días calendario, así que "hoy" nunca se corre.

const DIA_MS = 86_400_000;
const PATRON = /^(\d{4})-(\d{2})-(\d{2})$/;
const DIAS_SEMANA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

function aMilisegundos(fecha: string): number {
  const partes = PATRON.exec(fecha);
  if (!partes) throw new RangeError(`Fecha inválida: ${fecha}`);
  const [anio, mes, dia] = [
    Number(partes[1]),
    Number(partes[2]),
    Number(partes[3]),
  ];
  const ms = Date.UTC(anio, mes - 1, dia);
  const control = new Date(ms);
  if (
    control.getUTCFullYear() !== anio ||
    control.getUTCMonth() !== mes - 1 ||
    control.getUTCDate() !== dia
  ) {
    throw new RangeError(`Fecha inválida: ${fecha}`);
  }
  return ms;
}

function aCadena(ms: number): string {
  const d = new Date(ms);
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dia = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${mes}-${dia}`;
}

export function esFechaValida(fecha: string): boolean {
  try {
    aMilisegundos(fecha);
    return true;
  } catch {
    return false;
  }
}

export function sumarDias(fecha: string, dias: number): string {
  return aCadena(aMilisegundos(fecha) + dias * DIA_MS);
}

/** Días calendario de `desde` a `hasta` (negativo si `hasta` es anterior). */
export function diferenciaDias(desde: string, hasta: string): number {
  return Math.round((aMilisegundos(hasta) - aMilisegundos(desde)) / DIA_MS);
}

/** Fecha local del dispositivo, como YYYY-MM-DD. */
export function hoyLocal(ahora: Date = new Date()): string {
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

/** Número de día del plan que corresponde a `hoy` (1 = fechaInicio). */
export function numeroDelDia(fechaInicio: string, hoy: string): number {
  return diferenciaDias(fechaInicio, hoy) + 1;
}

/** "dom 1 mar 2026" — sin Intl, para que no dependa del idioma del navegador. */
export function formatearFecha(fecha: string): string {
  const d = new Date(aMilisegundos(fecha));
  return `${DIAS_SEMANA[d.getUTCDay()]} ${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
```

#### `src/lib/plan/minutos.ts` — nuevo

```ts
// Reparto de minutos por bloque. Regla única:
//   m = floor(total * peso / 500) * 5   (múltiplo de 5 hacia abajo)
//   m = max(m, 5)                        (ningún bloque queda en 0)
//   el residuo (total - suma) se suma al bloque `residuo`.
// La suma siempre es exactamente `total`.
import type { Dificultad, TipoBloque, TipoDia } from "../tipos";

export type Pesos = ReadonlyArray<readonly [TipoBloque, number]>;

interface Reparto {
  pesos: Pesos;
  residuo: TipoBloque;
}

const ESTUDIO: Pesos = [
  ["recuperar", 10],
  ["teoria", 25],
  ["ejemplos", 15],
  ["practica", 30],
  ["descanso", 5],
  ["repaso", 10],
  ["cierre", 5],
];

/** Dificultad 3: 5 puntos pasan de Recuperar a Práctica. */
const ESTUDIO_DIFICIL: Pesos = [
  ["recuperar", 5],
  ["teoria", 25],
  ["ejemplos", 15],
  ["practica", 35],
  ["descanso", 5],
  ["repaso", 10],
  ["cierre", 5],
];

const EVALUACION: Pesos = [
  ["recuperar", 10],
  ["evaluacion", 65],
  ["descanso", 5],
  ["repaso", 10],
  ["cierre", 10],
];

const CORRECCION: Pesos = [
  ["recuperar", 10],
  ["practica", 50],
  ["descanso", 5],
  ["repaso", 25],
  ["cierre", 10],
];

const LIGERO: Pesos = [
  ["recuperar", 30],
  ["repaso", 50],
  ["descanso", 10],
  ["cierre", 10],
];

export function repartoDelDia(
  tipo: TipoDia,
  dificultad: Dificultad = 2,
): Reparto {
  switch (tipo) {
    case "estudio":
      return {
        pesos: dificultad === 3 ? ESTUDIO_DIFICIL : ESTUDIO,
        residuo: "practica",
      };
    case "refuerzo":
      return { pesos: ESTUDIO, residuo: "practica" };
    case "evaluacion":
    case "simulacro":
      return { pesos: EVALUACION, residuo: "evaluacion" };
    case "correccion":
      return { pesos: CORRECCION, residuo: "practica" };
    case "repaso":
      return { pesos: LIGERO, residuo: "repaso" };
  }
}

/** Minutos totales del día: los días de repaso son ligeros (la mitad, múltiplo de 5). */
export function minutosDelDia(tipo: TipoDia, minutosPorDia: number): number {
  return tipo === "repaso" ? Math.floor(minutosPorDia / 10) * 5 : minutosPorDia;
}

export function repartirMinutos(
  total: number,
  pesos: Pesos,
  residuo: TipoBloque,
): Array<[TipoBloque, number]> {
  const reparto = pesos.map(([tipo, peso]): [TipoBloque, number] => [
    tipo,
    Math.max(Math.floor((total * peso) / 500) * 5, 5),
  ]);
  const suma = reparto.reduce(
    (acumulado, [, minutos]) => acumulado + minutos,
    0,
  );
  const destino = reparto.find(([tipo]) => tipo === residuo);
  if (!destino)
    throw new Error(`El bloque residuo ${residuo} no está en los pesos`);
  destino[1] += total - suma;
  return reparto;
}
```

#### `src/lib/plan/generador.ts` — nuevo

```ts
// Generador del plan: función pura, fuente de verdad del calendario.
// Especificación completa en blueprint §4 «Algoritmo del plan».
import { esFechaValida, sumarDias } from "../fechas";
import type {
  Bloque,
  ConfigPlan,
  Dia,
  Dificultad,
  Plan,
  Ruta,
  Subtema,
  SubtemaRef,
  Tema,
  TipoBloque,
  TipoDia,
} from "../tipos";
import { minutosDelDia, repartirMinutos, repartoDelDia } from "./minutos";

export const DESPLAZAMIENTOS_REPASO = [1, 3, 7, 14] as const;

export const CIERRE_SESION = [
  "Marca los bloques que completaste.",
  "Registra los errores o dificultades que encontraste.",
  "Escribe en una frase qué aprendiste hoy.",
];

type Unidad =
  | { tipo: "estudio"; tema: Tema; subtema: Subtema; k: number }
  | {
      tipo: "refuerzo";
      prerrequisito: string;
      nombre: string;
      para: Tema;
      k: number;
      total: number;
    }
  | { tipo: "evaluacion" | "correccion"; tema: Tema };

interface Grupo {
  tema: Tema;
  subtema: Subtema;
  unidades: Unidad[];
}

type Asignacion =
  | { tipo: "unidad"; unidad: Unidad }
  | { tipo: "repaso" }
  | { tipo: "simulacro" }
  | { tipo: "correccion-final" };

/** Devuelve la lista de errores de la configuración; vacía si es válida. */
export function erroresConfig(config: ConfigPlan): string[] {
  const errores: string[] = [];
  if (!esFechaValida(config.fechaInicio)) {
    errores.push("La fecha de inicio debe tener el formato AAAA-MM-DD.");
  }
  if (
    !Number.isInteger(config.horizonteDias) ||
    config.horizonteDias < 7 ||
    config.horizonteDias > 120
  ) {
    errores.push("La duración debe ser un número entero entre 7 y 120 días.");
  }
  if (
    !Number.isInteger(config.minutosPorDia) ||
    config.minutosPorDia % 5 !== 0 ||
    config.minutosPorDia < 60 ||
    config.minutosPorDia > 360
  ) {
    errores.push(
      "Los minutos por día deben ser un múltiplo de 5 entre 60 y 360.",
    );
  }
  if (
    !Number.isInteger(config.diaLigeroCada) ||
    config.diaLigeroCada < 0 ||
    config.diaLigeroCada > 30
  ) {
    errores.push("El día ligero debe ser un entero entre 0 y 30.");
  }
  for (const refuerzo of config.refuerzos) {
    if (
      !Number.isInteger(refuerzo.dias) ||
      refuerzo.dias < 1 ||
      refuerzo.dias > 7
    ) {
      errores.push(
        `El refuerzo de ${refuerzo.temaSlug} debe durar entre 1 y 7 días.`,
      );
    }
  }
  return errores;
}

function nombreDeTema(slug: string, catalogo: Ruta[]): string {
  for (const ruta of catalogo) {
    const tema = ruta.temas.find((t) => t.slug === slug);
    if (tema) return tema.nombre;
  }
  return slug;
}

function construirGrupos(
  ruta: Ruta,
  config: ConfigPlan,
  catalogo: Ruta[],
): Grupo[] {
  const grupos: Grupo[] = [];
  const usados = new Set<string>();
  for (const tema of ruta.temas) {
    const refuerzos: Unidad[] = [];
    for (const prerrequisito of tema.prerrequisitos) {
      const refuerzo = config.refuerzos.find(
        (r) => r.temaSlug === prerrequisito,
      );
      if (!refuerzo || refuerzo.dias < 1 || usados.has(prerrequisito)) continue;
      usados.add(prerrequisito);
      const nombre = nombreDeTema(prerrequisito, catalogo);
      for (let k = 1; k <= refuerzo.dias; k++) {
        refuerzos.push({
          tipo: "refuerzo",
          prerrequisito,
          nombre,
          para: tema,
          k,
          total: refuerzo.dias,
        });
      }
    }
    tema.subtemas.forEach((subtema, indice) => {
      const unidades: Unidad[] = indice === 0 ? [...refuerzos] : [];
      for (let k = 1; k <= subtema.diasEstimados; k++) {
        unidades.push({ tipo: "estudio", tema, subtema, k });
      }
      if (indice === tema.subtemas.length - 1) {
        unidades.push({ tipo: "evaluacion", tema });
        unidades.push({ tipo: "correccion", tema });
      }
      grupos.push({ tema, subtema, unidades });
    });
  }
  return grupos;
}

function referencia(grupo: Grupo): SubtemaRef {
  return {
    temaSlug: grupo.tema.slug,
    subtemaSlug: grupo.subtema.slug,
    nombre: grupo.subtema.nombre,
    diasEstimados: grupo.subtema.diasEstimados,
  };
}

interface Textos {
  tipo: TipoDia;
  temaSlug: string | null;
  subtemaSlug: string | null;
  clave: string;
  titulo: string;
  objetivo: string;
  queEstudiar: string;
  queHacer: string;
  dificultad: Dificultad;
  instrucciones: Partial<Record<TipoBloque, string>>;
  titulos: Partial<Record<TipoBloque, string>>;
}

function textosDeUnidad(unidad: Unidad): Textos {
  if (unidad.tipo === "estudio") {
    const { tema, subtema, k } = unidad;
    const dias = subtema.diasEstimados;
    const tramo = dias > 1 ? ` (día ${k} de ${dias})` : "";
    return {
      tipo: "estudio",
      temaSlug: tema.slug,
      subtemaSlug: subtema.slug,
      clave: `${subtema.slug}#${k}`,
      titulo: subtema.nombre,
      objetivo: `Comprender y practicar «${subtema.nombre}»${tramo}.`,
      queEstudiar: `${tema.nombre} › ${subtema.nombre}`,
      queHacer:
        "Estudia la teoría con los videos y materiales de tu acompañamiento, analiza un ejercicio resuelto y resuelve los ejercicios básicos; si te sobra tiempo, sigue con los adicionales.",
      dificultad: subtema.dificultad,
      instrucciones: {
        teoria: `Estudia la teoría de «${subtema.nombre}» con los videos y materiales de tu acompañamiento.`,
        ejemplos: `Analiza un ejercicio resuelto de «${subtema.nombre}»: identifica qué se hace en cada paso y por qué.`,
        practica: `Resuelve los ejercicios básicos de «${subtema.nombre}»; si terminas, continúa con los ejercicios adicionales.`,
      },
      titulos: {},
    };
  }
  if (unidad.tipo === "refuerzo") {
    const { prerrequisito, nombre, para, k, total } = unidad;
    const tramo = total > 1 ? ` (día ${k} de ${total})` : "";
    return {
      tipo: "refuerzo",
      temaSlug: prerrequisito,
      subtemaSlug: null,
      clave: `${prerrequisito}#${k}`,
      titulo: `Refuerzo: ${nombre}`,
      objetivo: `Reforzar «${nombre}» antes de empezar «${para.nombre}»${tramo}.`,
      queEstudiar: `Refuerzo de prerrequisito: ${nombre}`,
      queHacer: `Repasa la teoría de «${nombre}» en los materiales de tu acompañamiento y resuelve ejercicios básicos de ese tema para llegar preparado a «${para.nombre}».`,
      dificultad: 2,
      instrucciones: {
        teoria: `Repasa la teoría de «${nombre}» con los videos y materiales de tu acompañamiento.`,
        ejemplos: `Analiza un ejercicio resuelto de «${nombre}».`,
        practica: `Resuelve ejercicios básicos de «${nombre}».`,
      },
      titulos: {},
    };
  }
  const { tema } = unidad;
  if (unidad.tipo === "evaluacion") {
    return {
      tipo: "evaluacion",
      temaSlug: tema.slug,
      subtemaSlug: null,
      clave: tema.slug,
      titulo: `Evaluación: ${tema.nombre}`,
      objetivo: `Medir tu dominio de «${tema.nombre}» en condiciones de examen.`,
      queEstudiar: `${tema.nombre} (todos sus subtemas)`,
      queHacer: `Realiza un examen de años anteriores sobre ${tema.nombre}, con tiempo limitado y sin consultar tus apuntes. Registra tu nota y tus errores.`,
      dificultad: 2,
      instrucciones: {
        evaluacion: `Realiza un examen de años anteriores sobre ${tema.nombre}, con tiempo limitado y sin consultar tus apuntes.`,
      },
      titulos: { evaluacion: "Examen" },
    };
  }
  return {
    tipo: "correccion",
    temaSlug: tema.slug,
    subtemaSlug: null,
    clave: tema.slug,
    titulo: `Corrección: ${tema.nombre}`,
    objetivo: `Entender cada error del examen de «${tema.nombre}».`,
    queEstudiar: `Tus errores del examen de ${tema.nombre}`,
    queHacer:
      "Revisa los errores cometidos y programa un repaso de los subtemas donde fallaste.",
    dificultad: 2,
    instrucciones: {
      practica:
        "Rehaz cada ejercicio que fallaste usando los ejercicios resueltos de tu acompañamiento como guía.",
    },
    titulos: { practica: "Corrección" },
  };
}

function textosSinUnidad(
  asignacion: Asignacion,
  ruta: Ruta,
  ordinalRepaso: number,
): Textos {
  if (asignacion.tipo === "simulacro") {
    const queHacer =
      "Completa el simulacro que tienes disponible en tu acompañamiento, con el tiempo real del examen.";
    return {
      tipo: "simulacro",
      temaSlug: null,
      subtemaSlug: null,
      clave: "final",
      titulo: "Simulacro",
      objetivo: "Comprobar tu preparación con un examen completo.",
      queEstudiar: `Toda la ruta: ${ruta.nombre}`,
      queHacer,
      dificultad: 2,
      instrucciones: { evaluacion: queHacer },
      titulos: { evaluacion: "Simulacro" },
    };
  }
  if (asignacion.tipo === "correccion-final") {
    return {
      tipo: "correccion",
      temaSlug: null,
      subtemaSlug: null,
      clave: "final",
      titulo: "Corrección del simulacro",
      objetivo: "Convertir los errores del simulacro en un plan de repaso.",
      queEstudiar: "Tus errores del simulacro",
      queHacer:
        "Revisa los errores cometidos en el simulacro y programa un repaso de los temas a reforzar.",
      dificultad: 2,
      instrucciones: {
        practica:
          "Rehaz cada ejercicio que fallaste usando los ejercicios resueltos de tu acompañamiento como guía.",
      },
      titulos: { practica: "Corrección" },
    };
  }
  return {
    tipo: "repaso",
    temaSlug: null,
    subtemaSlug: null,
    clave: `rep-${ordinalRepaso}`,
    titulo: "Repaso",
    objetivo:
      "Consolidar lo estudiado con recuperación activa y repaso espaciado, sin teoría nueva.",
    queEstudiar: "Temas ya estudiados",
    queHacer:
      "Haz recuperación activa de lo estudiado y repasa los subtemas programados. Hoy no hay teoría nueva.",
    dificultad: 2,
    instrucciones: {},
    titulos: {},
  };
}

const TITULOS_BLOQUE: Record<TipoBloque, string> = {
  recuperar: "Recuperar",
  teoria: "Teoría",
  ejemplos: "Ejemplos resueltos",
  practica: "Práctica",
  evaluacion: "Examen",
  descanso: "Descanso",
  repaso: "Repaso",
  cierre: "Cierre",
};

function construirBloques(
  rutaSlug: string,
  textos: Textos,
  minutosPorDia: number,
  nombresRepaso: string[],
): Bloque[] {
  const { pesos, residuo } = repartoDelDia(textos.tipo, textos.dificultad);
  const total = minutosDelDia(textos.tipo, minutosPorDia);
  return repartirMinutos(total, pesos, residuo).map(([tipo, minutos]) => {
    let instruccion = textos.instrucciones[tipo];
    if (tipo === "recuperar") {
      instruccion =
        "Sin mirar tus apuntes, escribe lo que recuerdas de lo que estudiaste antes; luego compáralo con tus notas.";
    } else if (tipo === "descanso") {
      instruccion = `Pausa de ${minutos} minutos sin pantallas: camina, estira el cuerpo, toma agua.`;
    } else if (tipo === "repaso") {
      instruccion =
        nombresRepaso.length > 0
          ? `Repaso espaciado: ${nombresRepaso.map((n) => `«${n}»`).join(", ")}. Resuelve de memoria un ejercicio básico de cada uno.`
          : "Repasa tus apuntes y los errores que registraste en días anteriores.";
    } else if (tipo === "cierre") {
      instruccion =
        "Revisa la lista de cierre de sesión y registra tus errores o dificultades.";
    }
    const bloque: Bloque = {
      id: `${rutaSlug}:${textos.tipo}:${textos.clave}:${tipo}`,
      tipo,
      titulo: textos.titulos[tipo] ?? TITULOS_BLOQUE[tipo],
      instruccion: instruccion ?? "",
      minutos,
    };
    if (
      textos.subtemaSlug &&
      (tipo === "teoria" || tipo === "ejemplos" || tipo === "practica")
    ) {
      bloque.subtemaSlug = textos.subtemaSlug;
    }
    return bloque;
  });
}

/**
 * Genera el plan de una ruta. Pura: misma entrada, misma salida.
 * `catalogo` sirve para nombrar temas prerrequisito de otras rutas.
 * Lanza RangeError si la configuración es inválida (ver erroresConfig).
 */
export function generarPlan(
  ruta: Ruta,
  config: ConfigPlan,
  catalogo: Ruta[] = [ruta],
): Plan {
  const errores = erroresConfig(config);
  if (errores.length > 0) throw new RangeError(errores.join(" "));

  const horizonte = config.horizonteDias;
  const esLigero = (n: number) =>
    config.diaLigeroCada > 0 && n % config.diaLigeroCada === 0;

  // 1. Colocar los grupos de contenido sin comprimir nada.
  const asignaciones: Asignacion[] = [];
  for (let n = 1; n <= horizonte; n++) {
    asignaciones[n] = { tipo: "repaso" };
  }
  const fueraDelHorizonte: SubtemaRef[] = [];
  let cursor = 1;
  let desbordado = false;
  for (const grupo of construirGrupos(ruta, config, [ruta, ...catalogo])) {
    if (desbordado) {
      fueraDelHorizonte.push(referencia(grupo));
      continue;
    }
    let disponibles = 0;
    for (let n = cursor; n <= horizonte; n++) {
      if (!esLigero(n)) disponibles++;
    }
    if (disponibles < grupo.unidades.length) {
      desbordado = true;
      fueraDelHorizonte.push(referencia(grupo));
      continue;
    }
    for (const unidad of grupo.unidades) {
      while (esLigero(cursor)) cursor++;
      asignaciones[cursor] = { tipo: "unidad", unidad };
      cursor++;
    }
  }

  // 2. Días libres al final: simulacro + corrección si todo cupo; el resto, repaso.
  const libres: number[] = [];
  for (let n = cursor; n <= horizonte; n++) {
    if (!esLigero(n)) libres.push(n);
  }
  if (!desbordado && libres.length >= 2) {
    asignaciones[libres[libres.length - 2]!] = { tipo: "simulacro" };
    asignaciones[libres[libres.length - 1]!] = { tipo: "correccion-final" };
  }

  // 3. Repaso espaciado: d+1, d+3, d+7, d+14 desde el último día de estudio.
  const repasos: Array<Array<{ slug: string; nombre: string; dia: number }>> =
    [];
  for (let n = 1; n <= horizonte; n++) repasos[n] = [];
  for (let n = 1; n <= horizonte; n++) {
    const asignacion = asignaciones[n]!;
    if (asignacion.tipo !== "unidad" || asignacion.unidad.tipo !== "estudio") {
      continue;
    }
    const { subtema, k } = asignacion.unidad;
    if (k !== subtema.diasEstimados) continue;
    for (const desplazamiento of DESPLAZAMIENTOS_REPASO) {
      const destino = n + desplazamiento;
      if (destino <= horizonte) {
        repasos[destino]!.push({
          slug: subtema.slug,
          nombre: subtema.nombre,
          dia: n,
        });
      }
    }
  }

  // 4. Construir los días.
  const textosPorDia: Textos[] = [];
  let ordinalRepaso = 0;
  for (let n = 1; n <= horizonte; n++) {
    const asignacion = asignaciones[n]!;
    if (asignacion.tipo === "repaso") ordinalRepaso++;
    textosPorDia[n] =
      asignacion.tipo === "unidad"
        ? textosDeUnidad(asignacion.unidad)
        : textosSinUnidad(asignacion, ruta, ordinalRepaso);
  }

  const dias: Dia[] = [];
  for (let n = 1; n <= horizonte; n++) {
    const textos = textosPorDia[n]!;
    const programados = repasos[n]!;
    const siguiente = n < horizonte ? textosPorDia[n + 1]! : null;
    dias.push({
      numero: n,
      fecha: sumarDias(config.fechaInicio, n - 1),
      tipo: textos.tipo,
      temaSlug: textos.temaSlug,
      subtemaSlug: textos.subtemaSlug,
      titulo: textos.titulo,
      objetivo: textos.objetivo,
      queEstudiar: textos.queEstudiar,
      queHacer: textos.queHacer,
      repaso: programados.map(
        (r) => `Repasa «${r.nombre}» (lo estudiaste el día ${r.dia}).`,
      ),
      repasoSlugs: programados.map((r) => r.slug),
      bloques: construirBloques(
        ruta.slug,
        textos,
        config.minutosPorDia,
        programados.map((r) => r.nombre),
      ),
      cierre: [...CIERRE_SESION],
      siguientePaso: siguiente
        ? `Día ${n + 1}: ${siguiente.titulo}.`
        : "Fin del horizonte: revisa tu progreso y, si aún tienes temas pendientes, extiende la ruta.",
    });
  }

  return { dias, fueraDelHorizonte };
}
```

#### `tests/fixtures/ruta-prueba.ts` — nuevo

```ts
import type { Ruta } from "../../src/lib/tipos";

// Ruta de prueba del ejemplo trabajado (blueprint §4).
export const rutaPrueba: Ruta = {
  slug: "prueba",
  nombre: "Ruta de prueba",
  descripcion: "Ruta mínima para pruebas.",
  temas: [
    {
      slug: "t1",
      nombre: "Tema uno",
      prerrequisitos: [],
      subtemas: [
        { slug: "a", nombre: "Subtema A", diasEstimados: 2, dificultad: 1 },
        { slug: "b", nombre: "Subtema B", diasEstimados: 1, dificultad: 3 },
      ],
    },
    {
      slug: "t2",
      nombre: "Tema dos",
      prerrequisitos: ["t1"],
      subtemas: [
        { slug: "c", nombre: "Subtema C", diasEstimados: 3, dificultad: 2 },
      ],
    },
  ],
};
```

#### `tests/unit/generador.test.ts` — nuevo

```ts
import { describe, expect, it } from "vitest";
import { rutas } from "../../src/data/rutas";
import {
  diferenciaDias,
  esFechaValida,
  formatearFecha,
  hoyLocal,
  numeroDelDia,
  sumarDias,
} from "../../src/lib/fechas";
import { erroresConfig, generarPlan } from "../../src/lib/plan/generador";
import {
  minutosDelDia,
  repartirMinutos,
  repartoDelDia,
} from "../../src/lib/plan/minutos";
import type { ConfigPlan, TipoDia } from "../../src/lib/tipos";
import { rutaPrueba } from "../fixtures/ruta-prueba";

const base: ConfigPlan = {
  fechaInicio: "2026-03-01",
  horizonteDias: 14,
  minutosPorDia: 120,
  diaLigeroCada: 7,
  refuerzos: [],
};

const claves = (config: ConfigPlan) =>
  generarPlan(rutaPrueba, config).dias.map((d) =>
    d.bloques[0]!.id.split(":").slice(1, 3).join(":"),
  );

describe("fechas locales", () => {
  it("suma días y cruza meses y años bisiestos", () => {
    expect(sumarDias("2026-03-01", 13)).toBe("2026-03-14");
    expect(sumarDias("2028-02-28", 1)).toBe("2028-02-29");
    expect(sumarDias("2026-12-31", 1)).toBe("2027-01-01");
    expect(diferenciaDias("2026-03-01", "2026-03-14")).toBe(13);
    expect(numeroDelDia("2026-03-01", "2026-03-01")).toBe(1);
    expect(numeroDelDia("2026-03-01", "2026-02-28")).toBe(0);
  });

  it("rechaza fechas imposibles y formatea sin depender del idioma", () => {
    expect(esFechaValida("2026-02-30")).toBe(false);
    expect(esFechaValida("2026-3-1")).toBe(false);
    expect(() => sumarDias("2026-13-01", 1)).toThrow(RangeError);
    expect(formatearFecha("2026-03-01")).toBe("dom 1 mar 2026");
    expect(hoyLocal(new Date(2026, 2, 5, 23, 59))).toBe("2026-03-05");
  });
});

describe("minutos por bloque", () => {
  const reparto = (tipo: TipoDia, dificultad: 1 | 2 | 3, minutos: number) => {
    const { pesos, residuo } = repartoDelDia(tipo, dificultad);
    return Object.fromEntries(
      repartirMinutos(minutosDelDia(tipo, minutos), pesos, residuo),
    );
  };

  it("reparte 120 minutos de estudio con el residuo en Práctica", () => {
    expect(reparto("estudio", 1, 120)).toEqual({
      recuperar: 10,
      teoria: 30,
      ejemplos: 15,
      practica: 45,
      descanso: 5,
      repaso: 10,
      cierre: 5,
    });
    expect(reparto("estudio", 3, 120)).toEqual({
      recuperar: 5,
      teoria: 30,
      ejemplos: 15,
      practica: 50,
      descanso: 5,
      repaso: 10,
      cierre: 5,
    });
  });

  it("reparte los días de evaluación, corrección y repaso ligero", () => {
    expect(reparto("evaluacion", 2, 120)).toEqual({
      recuperar: 10,
      evaluacion: 85,
      descanso: 5,
      repaso: 10,
      cierre: 10,
    });
    expect(reparto("correccion", 2, 120)).toEqual({
      recuperar: 10,
      practica: 65,
      descanso: 5,
      repaso: 30,
      cierre: 10,
    });
    expect(reparto("repaso", 2, 120)).toEqual({
      recuperar: 15,
      repaso: 35,
      descanso: 5,
      cierre: 5,
    });
  });

  it("suma exactamente el total, en múltiplos de 5 y sin bloques en 0, de 60 a 360", () => {
    const tipos: TipoDia[] = [
      "estudio",
      "refuerzo",
      "evaluacion",
      "correccion",
      "repaso",
      "simulacro",
    ];
    for (let minutos = 60; minutos <= 360; minutos += 5) {
      for (const tipo of tipos) {
        for (const dificultad of [1, 2, 3] as const) {
          const total = minutosDelDia(tipo, minutos);
          const { pesos, residuo } = repartoDelDia(tipo, dificultad);
          const valores = repartirMinutos(total, pesos, residuo).map(
            ([, m]) => m,
          );
          expect(valores.reduce((a, b) => a + b, 0)).toBe(total);
          for (const m of valores) {
            expect(m).toBeGreaterThanOrEqual(5);
            expect(m % 5).toBe(0);
          }
        }
      }
    }
  });
});

describe("generarPlan — ejemplo trabajado", () => {
  it("ordena estudio, hitos, días ligeros, simulacro y corrección final", () => {
    expect(claves(base)).toEqual([
      "estudio:a#1",
      "estudio:a#2",
      "estudio:b#1",
      "evaluacion:t1",
      "correccion:t1",
      "estudio:c#1",
      "repaso:rep-1",
      "estudio:c#2",
      "estudio:c#3",
      "evaluacion:t2",
      "correccion:t2",
      "simulacro:final",
      "correccion:final",
      "repaso:rep-2",
    ]);
    const plan = generarPlan(rutaPrueba, base);
    expect(plan.fueraDelHorizonte).toEqual([]);
    expect(plan.dias.map((d) => d.fecha)[13]).toBe("2026-03-14");
    expect(plan.dias[0]!.objetivo).toBe(
      "Comprender y practicar «Subtema A» (día 1 de 2).",
    );
    expect(plan.dias[2]!.objetivo).toBe("Comprender y practicar «Subtema B».");
    expect(plan.dias[3]!.queHacer).toBe(
      "Realiza un examen de años anteriores sobre Tema uno, con tiempo limitado y sin consultar tus apuntes. Registra tu nota y tus errores.",
    );
    expect(plan.dias[11]!.queHacer).toBe(
      "Completa el simulacro que tienes disponible en tu acompañamiento, con el tiempo real del examen.",
    );
    expect(plan.dias[0]!.siguientePaso).toBe("Día 2: Subtema A.");
    expect(plan.dias[13]!.siguientePaso).toBe(
      "Fin del horizonte: revisa tu progreso y, si aún tienes temas pendientes, extiende la ruta.",
    );
  });

  it("programa el repaso espaciado en d+1, d+3, d+7 y d+14 dentro del horizonte", () => {
    const plan = generarPlan(rutaPrueba, base);
    const porDia = Object.fromEntries(
      plan.dias
        .filter((d) => d.repasoSlugs.length > 0)
        .map((d) => [d.numero, d.repasoSlugs]),
    );
    expect(porDia).toEqual({
      3: ["a"],
      4: ["b"],
      5: ["a"],
      6: ["b"],
      9: ["a"],
      10: ["b", "c"],
      12: ["c"],
    });
    expect(plan.dias[9]!.repaso).toEqual([
      "Repasa «Subtema B» (lo estudiaste el día 3).",
      "Repasa «Subtema C» (lo estudiaste el día 9).",
    ]);
  });

  it("usa IDs de bloque estables y suma minutosPorDia en cada día no ligero", () => {
    const plan = generarPlan(rutaPrueba, base);
    expect(plan.dias[0]!.bloques.map((b) => b.id)).toEqual([
      "prueba:estudio:a#1:recuperar",
      "prueba:estudio:a#1:teoria",
      "prueba:estudio:a#1:ejemplos",
      "prueba:estudio:a#1:practica",
      "prueba:estudio:a#1:descanso",
      "prueba:estudio:a#1:repaso",
      "prueba:estudio:a#1:cierre",
    ]);
    for (const dia of plan.dias) {
      const suma = dia.bloques.reduce((a, b) => a + b.minutos, 0);
      expect(suma).toBe(dia.tipo === "repaso" ? 60 : 120);
    }
    const ids = plan.dias.flatMap((d) => d.bloques.map((b) => b.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("conserva los IDs al cambiar la fecha de inicio", () => {
    const antes = generarPlan(rutaPrueba, base);
    const despues = generarPlan(rutaPrueba, {
      ...base,
      fechaInicio: "2026-05-20",
    });
    expect(despues.dias.map((d) => d.bloques.map((b) => b.id))).toEqual(
      antes.dias.map((d) => d.bloques.map((b) => b.id)),
    );
    expect(despues.dias[0]!.fecha).toBe("2026-05-20");
  });

  it("no comprime: lo que no cabe en 7 días va a fueraDelHorizonte", () => {
    const plan = generarPlan(rutaPrueba, { ...base, horizonteDias: 7 });
    expect(claves({ ...base, horizonteDias: 7 })).toEqual([
      "estudio:a#1",
      "estudio:a#2",
      "estudio:b#1",
      "evaluacion:t1",
      "correccion:t1",
      "repaso:rep-1",
      "repaso:rep-2",
    ]);
    expect(plan.fueraDelHorizonte).toEqual([
      {
        temaSlug: "t2",
        subtemaSlug: "c",
        nombre: "Subtema C",
        diasEstimados: 3,
      },
    ]);
  });

  it("inserta los días de refuerzo de un prerrequisito antes del tema que lo pide", () => {
    const config = { ...base, refuerzos: [{ temaSlug: "t1", dias: 2 }] };
    expect(claves(config)).toEqual([
      "estudio:a#1",
      "estudio:a#2",
      "estudio:b#1",
      "evaluacion:t1",
      "correccion:t1",
      "refuerzo:t1#1",
      "repaso:rep-1",
      "refuerzo:t1#2",
      "estudio:c#1",
      "estudio:c#2",
      "estudio:c#3",
      "evaluacion:t2",
      "correccion:t2",
      "repaso:rep-2",
    ]);
    expect(generarPlan(rutaPrueba, config).dias[5]!.objetivo).toBe(
      "Reforzar «Tema uno» antes de empezar «Tema dos» (día 1 de 2).",
    );
  });

  it("rechaza configuraciones inválidas con RangeError", () => {
    expect(erroresConfig(base)).toEqual([]);
    expect(() =>
      generarPlan(rutaPrueba, { ...base, horizonteDias: 6 }),
    ).toThrow(RangeError);
    expect(() =>
      generarPlan(rutaPrueba, { ...base, minutosPorDia: 123 }),
    ).toThrow(RangeError);
    expect(() =>
      generarPlan(rutaPrueba, { ...base, fechaInicio: "2026-02-30" }),
    ).toThrow(RangeError);
  });
});

describe("generarPlan — rutas reales", () => {
  it("genera 30 días válidos para cada ruta sin perder subtemas", () => {
    for (const ruta of rutas) {
      const plan = generarPlan(ruta, { ...base, horizonteDias: 30 }, rutas);
      expect(plan.dias).toHaveLength(30);
      const programados = new Set(
        plan.dias.flatMap((d) => (d.subtemaSlug ? [d.subtemaSlug] : [])),
      );
      const fuera = new Set(plan.fueraDelHorizonte.map((s) => s.subtemaSlug));
      for (const subtema of ruta.temas.flatMap((t) => t.subtemas)) {
        expect(
          programados.has(subtema.slug) !== fuera.has(subtema.slug),
          subtema.slug,
        ).toBe(true);
      }
    }
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** `generarPlan` runs on the test route with start `2026-03-01`, horizon 14, 120 minutes and a light day every 7 **THE SYSTEM SHALL** produce, in order, `estudio:a#1, estudio:a#2, estudio:b#1, evaluacion:t1, correccion:t1, estudio:c#1, repaso:rep-1, estudio:c#2, estudio:c#3, evaluacion:t2, correccion:t2, simulacro:final, correccion:final, repaso:rep-2` with day 14 dated `2026-03-14`.
2. **WHEN** a subtopic finishes on day d **THE SYSTEM SHALL** schedule its review on days d+1, d+3, d+7 and d+14 that fall within the horizon, giving `repasoSlugs` 3:[a] 4:[b] 5:[a] 6:[b] 9:[a] 10:[b,c] 12:[c] in the test route.
3. **WHEN** minutes are split for 120 minutes **THE SYSTEM SHALL** give study days of difficulty 1-2 the blocks 10/30/15/45/5/10/5, difficulty 3 the blocks 5/30/15/50/5/10/5, and every day exactly `minutosPorDia` (60 on light review days) in multiples of 5 with no block under 5, for every total from 60 to 360.
4. **WHEN** the horizon is 7 days **THE SYSTEM SHALL** not compress any subtopic and SHALL return `fueraDelHorizonte` = `[{ temaSlug: "t2", subtemaSlug: "c", nombre: "Subtema C", diasEstimados: 3 }]`.
5. **WHEN** only `fechaInicio` changes **THE SYSTEM SHALL** keep every block id identical, ids having the form `${rutaSlug}:${tipoDia}:${clave}:${tipoBloque}` such as `prueba:estudio:a#1:teoria`.
6. **WHEN** the config has a 6-day horizon, 123 minutes or the date `2026-02-30` **THE SYSTEM SHALL** throw `RangeError`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/unit/generador.test.ts
npm test
npm run check
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T4: Generador del plan puro, fechas locales y reparto de minutos"
git tag step-04-generador-plan
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E1-T5` — Ajustes del plan y catálogo completo de cuatro rutas

**Depends on:** `E1-T4` · **Priority:** p0 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 5

Crea las funciones puras de ajuste (configuración inicial, cambiar duración 7–120, extender, fijar/quitar refuerzos 0–7 y listar los prerrequisitos de una ruta, incluso de otras rutas) y completa el catálogo con Cálculo Multivariable y Ecuaciones Diferenciales, cuyos prerrequisitos cruzan rutas (por eso llegan junto con los refuerzos). Reemplaza `src/data/rutas/index.ts` con las cuatro rutas. La prueba de rutas del paso 3 valida automáticamente las dos nuevas. Ejecuta `npm run format` antes de Verify.

**Files**
- `src/lib/plan/ajustes.ts` — nuevo
- `src/data/rutas/calculo-multivariable.ts` — nuevo
- `src/data/rutas/ecuaciones-diferenciales.ts` — nuevo
- `src/data/rutas/index.ts` — reemplaza (contenido completo)
- `tests/unit/ajustes.test.ts` — nuevo

Contenido exacto de cada archivo:

#### `src/lib/plan/ajustes.ts` — nuevo

```ts
// Ajustes del plan: funciones puras sobre ConfigPlan. Nunca tocan el progreso:
// como los IDs de bloque no dependen de fechas, los completados se conservan.
import type { ConfigPlan, Ruta } from "../tipos";

export const HORIZONTE_MIN = 7;
export const HORIZONTE_MAX = 120;
export const REFUERZO_MAX = 7;

export function configInicial(fechaInicio: string): ConfigPlan {
  return {
    fechaInicio,
    horizonteDias: 30,
    minutosPorDia: 120,
    diaLigeroCada: 7,
    refuerzos: [],
  };
}

export function cambiarDuracion(
  config: ConfigPlan,
  horizonteDias: number,
): ConfigPlan {
  if (
    !Number.isInteger(horizonteDias) ||
    horizonteDias < HORIZONTE_MIN ||
    horizonteDias > HORIZONTE_MAX
  ) {
    throw new RangeError(
      `La duración debe estar entre ${HORIZONTE_MIN} y ${HORIZONTE_MAX} días.`,
    );
  }
  return { ...config, horizonteDias };
}

export function extenderHorizonte(
  config: ConfigPlan,
  diasExtra: number,
): ConfigPlan {
  if (!Number.isInteger(diasExtra) || diasExtra < 1) {
    throw new RangeError("La extensión debe ser de al menos 1 día.");
  }
  return cambiarDuracion(config, config.horizonteDias + diasExtra);
}

/** `dias` = 0 quita el refuerzo; 1..7 lo crea o lo reemplaza. */
export function fijarRefuerzo(
  config: ConfigPlan,
  temaSlug: string,
  dias: number,
): ConfigPlan {
  if (!Number.isInteger(dias) || dias < 0 || dias > REFUERZO_MAX) {
    throw new RangeError(
      `El refuerzo debe durar entre 0 y ${REFUERZO_MAX} días.`,
    );
  }
  const otros = config.refuerzos.filter((r) => r.temaSlug !== temaSlug);
  return {
    ...config,
    refuerzos: dias === 0 ? otros : [...otros, { temaSlug, dias }],
  };
}

export interface PrerrequisitoDisponible {
  temaSlug: string;
  nombre: string;
  /** Nombres de los temas de la ruta que lo declaran como prerrequisito. */
  requeridoPor: string[];
}

/** Prerrequisitos que la ruta declara, en orden de primera aparición. */
export function prerrequisitosDeRuta(
  ruta: Ruta,
  catalogo: Ruta[],
): PrerrequisitoDisponible[] {
  const resultado: PrerrequisitoDisponible[] = [];
  for (const tema of ruta.temas) {
    for (const slug of tema.prerrequisitos) {
      let entrada = resultado.find((p) => p.temaSlug === slug);
      if (!entrada) {
        const nombre =
          catalogo.flatMap((r) => r.temas).find((t) => t.slug === slug)
            ?.nombre ?? slug;
        entrada = { temaSlug: slug, nombre, requeridoPor: [] };
        resultado.push(entrada);
      }
      entrada.requeridoPor.push(tema.nombre);
    }
  }
  return resultado;
}
```

#### `src/data/rutas/calculo-multivariable.ts` — nuevo

```ts
import type { Ruta } from "../../lib/tipos";

export const calculoMultivariable: Ruta = {
  slug: "calculo-multivariable",
  nombre: "Cálculo Multivariable",
  descripcion:
    "Funciones de varias variables, derivadas parciales, extremos con Lagrange e integrales dobles y triples.",
  temas: [
    {
      slug: "funciones-varias-variables",
      nombre: "Funciones de varias variables",
      prerrequisitos: ["funciones"],
      subtemas: [
        {
          slug: "dominio-varias-variables",
          nombre: "Dominio y rango de funciones de varias variables",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "curvas-de-nivel",
          nombre: "Curvas y superficies de nivel",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "superficies-cuadricas",
          nombre: "Superficies cuádricas",
          diasEstimados: 2,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "limites-continuidad-varias",
      nombre: "Límites y continuidad en varias variables",
      prerrequisitos: ["funciones-varias-variables", "limites"],
      subtemas: [
        {
          slug: "limites-varias-variables",
          nombre: "Límites de funciones de varias variables",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "continuidad-varias-variables",
          nombre: "Continuidad en varias variables",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "derivadas-parciales",
      nombre: "Derivadas parciales y diferenciabilidad",
      prerrequisitos: ["limites-continuidad-varias", "derivadas"],
      subtemas: [
        {
          slug: "calculo-derivadas-parciales",
          nombre: "Cálculo de derivadas parciales",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "plano-tangente-diferencial",
          nombre: "Plano tangente, diferenciabilidad y diferencial total",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "regla-cadena-varias",
          nombre: "Regla de la cadena en varias variables",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "gradiente-direccional",
          nombre: "Gradiente y derivada direccional",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "extremos-lagrange",
      nombre: "Extremos y multiplicadores de Lagrange",
      prerrequisitos: ["derivadas-parciales"],
      subtemas: [
        {
          slug: "puntos-criticos-hessiana",
          nombre: "Puntos críticos y criterio de la hessiana",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "extremos-absolutos-regiones",
          nombre: "Extremos absolutos en regiones cerradas y acotadas",
          diasEstimados: 1,
          dificultad: 3,
        },
        {
          slug: "multiplicadores-lagrange",
          nombre: "Multiplicadores de Lagrange",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "integrales-dobles",
      nombre: "Integrales dobles",
      prerrequisitos: ["integral-definida"],
      subtemas: [
        {
          slug: "dobles-rectangulos",
          nombre: "Integrales dobles sobre rectángulos e integrales iteradas",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "dobles-regiones-generales",
          nombre: "Integrales dobles sobre regiones generales",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "dobles-polares",
          nombre: "Integrales dobles en coordenadas polares",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "aplicaciones-dobles",
          nombre: "Aplicaciones: área, masa y centro de masa",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "integrales-triples",
      nombre: "Integrales triples",
      prerrequisitos: ["integrales-dobles"],
      subtemas: [
        {
          slug: "triples-rectangulares",
          nombre: "Integrales triples en coordenadas rectangulares",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "triples-cilindricas",
          nombre: "Integrales triples en coordenadas cilíndricas",
          diasEstimados: 1,
          dificultad: 3,
        },
        {
          slug: "triples-esfericas",
          nombre: "Integrales triples en coordenadas esféricas",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "cambio-de-variables-jacobiano",
          nombre: "Cambio de variables y jacobiano",
          diasEstimados: 1,
          dificultad: 3,
        },
      ],
    },
  ],
};
```

#### `src/data/rutas/ecuaciones-diferenciales.ts` — nuevo

```ts
import type { Ruta } from "../../lib/tipos";

export const ecuacionesDiferenciales: Ruta = {
  slug: "ecuaciones-diferenciales",
  nombre: "Ecuaciones Diferenciales",
  descripcion:
    "EDO de primer orden y sus aplicaciones, EDO lineales de orden superior, transformada de Laplace y sistemas.",
  temas: [
    {
      slug: "edo-primer-orden",
      nombre: "EDO de primer orden",
      prerrequisitos: ["integral-indefinida"],
      subtemas: [
        {
          slug: "conceptos-basicos-edo",
          nombre:
            "Conceptos básicos: orden, solución y problema de valor inicial",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "variables-separables",
          nombre: "Ecuaciones de variables separables",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "edo-homogeneas",
          nombre: "Ecuaciones homogéneas",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "edo-exactas",
          nombre: "Ecuaciones exactas y factor integrante",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "edo-lineales-primer-orden",
          nombre: "Ecuaciones lineales de primer orden",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "bernoulli",
          nombre: "Ecuación de Bernoulli",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "aplicaciones-primer-orden",
      nombre: "Aplicaciones de primer orden",
      prerrequisitos: ["edo-primer-orden"],
      subtemas: [
        {
          slug: "crecimiento-decaimiento",
          nombre: "Crecimiento y decaimiento exponencial",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "ley-enfriamiento",
          nombre: "Ley de enfriamiento de Newton",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "mezclas",
          nombre: "Problemas de mezclas",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "circuitos-rl-rc",
          nombre: "Circuitos RL y RC",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "edo-orden-superior",
      nombre: "EDO lineales de orden superior",
      prerrequisitos: ["edo-primer-orden"],
      subtemas: [
        {
          slug: "homogeneas-coeficientes-constantes",
          nombre: "Ecuaciones homogéneas con coeficientes constantes",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "coeficientes-indeterminados",
          nombre: "Método de coeficientes indeterminados",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "variacion-de-parametros",
          nombre: "Variación de parámetros",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "cauchy-euler",
          nombre: "Ecuación de Cauchy-Euler",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "aplicaciones-orden-superior",
          nombre: "Aplicaciones: sistemas masa-resorte",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "transformada-laplace",
      nombre: "Transformada de Laplace",
      prerrequisitos: ["integrales-impropias", "edo-orden-superior"],
      subtemas: [
        {
          slug: "definicion-laplace",
          nombre: "Definición y propiedades de la transformada de Laplace",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "transformada-inversa",
          nombre: "Transformada inversa de Laplace",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "teoremas-traslacion",
          nombre: "Teoremas de traslación y función escalón unitario",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "laplace-valor-inicial",
          nombre: "Solución de problemas de valor inicial con Laplace",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "sistemas-edo",
      nombre: "Sistemas de EDO",
      prerrequisitos: ["edo-orden-superior"],
      subtemas: [
        {
          slug: "sistemas-eliminacion",
          nombre: "Sistemas lineales por el método de eliminación",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "sistemas-valores-propios",
          nombre: "Método de valores y vectores propios",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "sistemas-laplace",
          nombre: "Sistemas resueltos con transformada de Laplace",
          diasEstimados: 1,
          dificultad: 3,
        },
      ],
    },
  ],
};
```

#### `src/data/rutas/index.ts` — reemplaza (contenido completo)

```ts
// Registro de rutas. Para añadir una ruta: crea su archivo en esta carpeta
// y agrégala a `rutas` (el orden de este arreglo es el orden en Inicio).
import type { Ruta, Tema } from "../../lib/tipos";
import { calculoDiferencial } from "./calculo-diferencial";
import { calculoIntegral } from "./calculo-integral";
import { calculoMultivariable } from "./calculo-multivariable";
import { ecuacionesDiferenciales } from "./ecuaciones-diferenciales";

export const rutas: Ruta[] = [
  calculoDiferencial,
  calculoIntegral,
  calculoMultivariable,
  ecuacionesDiferenciales,
];

export function buscarRuta(slug: string): Ruta | undefined {
  return rutas.find((ruta) => ruta.slug === slug);
}

export function buscarTema(slug: string): Tema | undefined {
  for (const ruta of rutas) {
    const tema = ruta.temas.find((t) => t.slug === slug);
    if (tema) return tema;
  }
  return undefined;
}
```

#### `tests/unit/ajustes.test.ts` — nuevo

```ts
import { describe, expect, it } from "vitest";
import { buscarRuta, rutas } from "../../src/data/rutas";
import {
  cambiarDuracion,
  configInicial,
  extenderHorizonte,
  fijarRefuerzo,
  prerrequisitosDeRuta,
} from "../../src/lib/plan/ajustes";
import { generarPlan } from "../../src/lib/plan/generador";
import { rutaPrueba } from "../fixtures/ruta-prueba";

const corta = { ...configInicial("2026-03-01"), horizonteDias: 7 };

describe("ajustes del plan", () => {
  it("parte de 30 días, 120 minutos, día ligero cada 7 y sin refuerzos", () => {
    expect(configInicial("2026-03-01")).toEqual({
      fechaInicio: "2026-03-01",
      horizonteDias: 30,
      minutosPorDia: 120,
      diaLigeroCada: 7,
      refuerzos: [],
    });
  });

  it("extiende +7 días: lo pendiente entra al plan y los días ya hechos conservan sus IDs", () => {
    const antes = generarPlan(rutaPrueba, corta);
    const extendida = extenderHorizonte(corta, 7);
    expect(extendida.horizonteDias).toBe(14);
    const despues = generarPlan(rutaPrueba, extendida);
    expect(antes.fueraDelHorizonte.map((s) => s.subtemaSlug)).toEqual(["c"]);
    expect(despues.fueraDelHorizonte).toEqual([]);
    for (let i = 0; i < 5; i++) {
      expect(despues.dias[i]!.bloques.map((b) => b.id)).toEqual(
        antes.dias[i]!.bloques.map((b) => b.id),
      );
    }
  });

  it("acepta duraciones de 7 a 120 días y rechaza el resto", () => {
    expect(cambiarDuracion(corta, 45).horizonteDias).toBe(45);
    expect(cambiarDuracion(corta, 120).horizonteDias).toBe(120);
    expect(() => cambiarDuracion(corta, 6)).toThrow(RangeError);
    expect(() => cambiarDuracion(corta, 121)).toThrow(RangeError);
    expect(() => cambiarDuracion(corta, 30.5)).toThrow(RangeError);
    expect(() =>
      extenderHorizonte({ ...corta, horizonteDias: 115 }, 7),
    ).toThrow(RangeError);
    expect(() => extenderHorizonte(corta, 0)).toThrow(RangeError);
  });

  it("crea, reemplaza y quita refuerzos de prerrequisitos", () => {
    const con = fijarRefuerzo(corta, "t1", 2);
    expect(con.refuerzos).toEqual([{ temaSlug: "t1", dias: 2 }]);
    expect(fijarRefuerzo(con, "t1", 3).refuerzos).toEqual([
      { temaSlug: "t1", dias: 3 },
    ]);
    expect(fijarRefuerzo(con, "t1", 0).refuerzos).toEqual([]);
    expect(() => fijarRefuerzo(corta, "t1", 8)).toThrow(RangeError);
  });

  it("lista los prerrequisitos de una ruta, incluso de otras rutas", () => {
    const edo = buscarRuta("ecuaciones-diferenciales")!;
    expect(
      prerrequisitosDeRuta(edo, rutas).map((p) => [
        p.temaSlug,
        p.nombre,
        p.requeridoPor,
      ]),
    ).toEqual([
      [
        "integral-indefinida",
        "Integral indefinida y técnicas de integración",
        ["EDO de primer orden"],
      ],
      [
        "edo-primer-orden",
        "EDO de primer orden",
        ["Aplicaciones de primer orden", "EDO lineales de orden superior"],
      ],
      [
        "integrales-impropias",
        "Integrales impropias",
        ["Transformada de Laplace"],
      ],
      [
        "edo-orden-superior",
        "EDO lineales de orden superior",
        ["Transformada de Laplace", "Sistemas de EDO"],
      ],
    ]);
  });

  it("registra las cuatro rutas del acompañamiento en este orden", () => {
    expect(rutas.map((r) => r.slug)).toEqual([
      "calculo-diferencial",
      "calculo-integral",
      "calculo-multivariable",
      "ecuaciones-diferenciales",
    ]);
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** `configInicial("2026-03-01")` runs **THE SYSTEM SHALL** return horizon 30, 120 minutes, a light day every 7 and no reinforcements.
2. **WHEN** a 7-day test plan is extended by 7 days **THE SYSTEM SHALL** set the horizon to 14, empty `fueraDelHorizonte` and keep the block ids of days 1-5 unchanged.
3. **WHEN** the duration is set to 6, 121 or 30.5 days, or an extension goes past 120 days or adds 0 days **THE SYSTEM SHALL** throw `RangeError`.
4. **WHEN** `prerrequisitosDeRuta` runs on `ecuaciones-diferenciales` **THE SYSTEM SHALL** list `integral-indefinida`, `edo-primer-orden`, `integrales-impropias` and `edo-orden-superior` in that order, with their names and the topics that require them.
5. **WHEN** `npm test` runs **THE SYSTEM SHALL** register exactly `calculo-diferencial`, `calculo-integral`, `calculo-multivariable` and `ecuaciones-diferenciales`, in that order, all passing the catalog validation.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/unit/ajustes.test.ts
npm test -- tests/unit/rutas.test.ts
npm test
npm run check
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T5: Ajustes del plan y catálogo completo de cuatro rutas"
git tag step-05-ajustes-catalogo
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E1-T6` — Progreso: modelo, validador, almacén y acciones

**Depends on:** `E1-T5` · **Priority:** p0 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 6

Crea la forma versionada del progreso de §4 (clave `mentorix-reto:v1`), el validador manual sin dependencias, el acceso a `localStorage` siempre dentro de try/catch (los datos que no validan se copian a `mentorix-reto:v1:danado` y nunca se borran) y las acciones puras. Regla central: **completar bloques no cambia el dominio**; solo `declararDominio` lo cambia, y «dominado» exige evidencia. Ejecuta `npm run format` antes de Verify.

**Files**
- `src/lib/progreso/estado.ts` — nuevo
- `src/lib/progreso/validar.ts` — nuevo
- `src/lib/progreso/almacen.ts` — nuevo
- `src/lib/progreso/acciones.ts` — nuevo
- `tests/unit/progreso.test.ts` — nuevo

Contenido exacto de cada archivo:

#### `src/lib/progreso/estado.ts` — nuevo

```ts
// Modelo de progreso guardado en localStorage bajo CLAVE_ALMACEN.
// Cambiar esta forma exige subir VERSION_ESTADO y ampliar migrar().
import type { ConfigPlan } from "../tipos";

export const CLAVE_ALMACEN = "mentorix-reto:v1";
/** Copia intacta de datos que no pasaron la validación. Nunca se borra sola. */
export const CLAVE_DANADA = "mentorix-reto:v1:danado";
export const VERSION_ESTADO = 1;

export type NivelDominio =
  "sin-evaluar" | "en-progreso" | "inseguro" | "dominado";

export const NIVELES_DOMINIO: NivelDominio[] = [
  "sin-evaluar",
  "en-progreso",
  "inseguro",
  "dominado",
];

export interface Evaluacion {
  id: string;
  diaNumero: number;
  /** Tema evaluado; null en el simulacro. */
  temaSlug: string | null;
  /** YYYY-MM-DD */
  fecha: string;
  nota: number | null;
  notaMaxima: number | null;
  errores: string;
  temasAReforzar: string[];
}

export interface RegistroDificultad {
  id: string;
  /** YYYY-MM-DD */
  fecha: string;
  subtemaSlug: string | null;
  texto: string;
  resuelta: boolean;
}

export interface DominioSubtema {
  nivel: NivelDominio;
  evidencia: string;
  /** YYYY-MM-DD */
  fecha: string;
}

export interface ProgresoRuta {
  config: ConfigPlan;
  /** bloqueId → instante ISO en que se marcó. */
  completados: Record<string, string>;
  evaluaciones: Evaluacion[];
  dificultades: RegistroDificultad[];
  /** subtemaSlug → dominio declarado por el estudiante. */
  dominio: Record<string, DominioSubtema>;
  /** String(diaNumero) → reflexión del día. */
  reflexiones: Record<string, string>;
}

export interface Estado {
  version: 1;
  rutaActiva: string | null;
  /** YYYY-MM-DD del último respaldo exportado; null si nunca. */
  ultimoRespaldo: string | null;
  rutas: Record<string, ProgresoRuta>;
}

export function estadoInicial(): Estado {
  return { version: 1, rutaActiva: null, ultimoRespaldo: null, rutas: {} };
}

export function progresoInicial(config: ConfigPlan): ProgresoRuta {
  return {
    config,
    completados: {},
    evaluaciones: [],
    dificultades: [],
    dominio: {},
    reflexiones: {},
  };
}

/**
 * Lleva datos guardados por versiones anteriores a la forma actual.
 * Hoy solo existe la versión 1: se devuelve tal cual y validarEstado decide.
 */
export function migrar(datos: unknown): unknown {
  return datos;
}
```

#### `src/lib/progreso/validar.ts` — nuevo

```ts
// Validador manual del estado (sin dependencias). Se usa al cargar y al importar.
import { esFechaValida } from "../fechas";
import { erroresConfig } from "../plan/generador";
import type { ConfigPlan } from "../tipos";
import { NIVELES_DOMINIO, type Estado } from "./estado";

type Objeto = Record<string, unknown>;

function esObjeto(x: unknown): x is Objeto {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function esNumeroONulo(x: unknown): boolean {
  return x === null || (typeof x === "number" && Number.isFinite(x));
}

function errorConfig(x: unknown): string | null {
  if (!esObjeto(x)) return "config no es un objeto";
  if (typeof x.fechaInicio !== "string") return "config.fechaInicio";
  for (const campo of ["horizonteDias", "minutosPorDia", "diaLigeroCada"]) {
    if (typeof x[campo] !== "number") return `config.${campo}`;
  }
  if (!Array.isArray(x.refuerzos)) return "config.refuerzos";
  for (const r of x.refuerzos) {
    if (
      !esObjeto(r) ||
      typeof r.temaSlug !== "string" ||
      typeof r.dias !== "number"
    ) {
      return "config.refuerzos[]";
    }
  }
  const errores = erroresConfig(x as unknown as ConfigPlan);
  return errores.length > 0 ? errores.join(" ") : null;
}

function errorProgreso(x: unknown): string | null {
  if (!esObjeto(x)) return "no es un objeto";
  const config = errorConfig(x.config);
  if (config) return config;
  if (
    !esObjeto(x.completados) ||
    !Object.values(x.completados).every((v) => typeof v === "string")
  ) {
    return "completados";
  }
  if (!Array.isArray(x.evaluaciones)) return "evaluaciones";
  for (const e of x.evaluaciones) {
    if (
      !esObjeto(e) ||
      typeof e.id !== "string" ||
      typeof e.diaNumero !== "number" ||
      !(e.temaSlug === null || typeof e.temaSlug === "string") ||
      typeof e.fecha !== "string" ||
      !esFechaValida(e.fecha) ||
      !esNumeroONulo(e.nota) ||
      !esNumeroONulo(e.notaMaxima) ||
      typeof e.errores !== "string" ||
      !Array.isArray(e.temasAReforzar) ||
      !e.temasAReforzar.every((t) => typeof t === "string")
    ) {
      return "evaluaciones[]";
    }
  }
  if (!Array.isArray(x.dificultades)) return "dificultades";
  for (const d of x.dificultades) {
    if (
      !esObjeto(d) ||
      typeof d.id !== "string" ||
      typeof d.fecha !== "string" ||
      !(d.subtemaSlug === null || typeof d.subtemaSlug === "string") ||
      typeof d.texto !== "string" ||
      typeof d.resuelta !== "boolean"
    ) {
      return "dificultades[]";
    }
  }
  if (!esObjeto(x.dominio)) return "dominio";
  for (const d of Object.values(x.dominio)) {
    if (
      !esObjeto(d) ||
      !NIVELES_DOMINIO.includes(d.nivel as never) ||
      typeof d.evidencia !== "string" ||
      typeof d.fecha !== "string" ||
      (d.nivel === "dominado" && d.evidencia.trim() === "")
    ) {
      return "dominio{}";
    }
  }
  if (
    !esObjeto(x.reflexiones) ||
    !Object.values(x.reflexiones).every((v) => typeof v === "string")
  ) {
    return "reflexiones";
  }
  return null;
}

export function validarEstado(x: unknown): Estado | Error {
  if (!esObjeto(x)) return new Error("El progreso no es un objeto JSON.");
  if (x.version !== 1) {
    return new Error(`Versión de progreso no soportada: ${String(x.version)}.`);
  }
  if (!(x.rutaActiva === null || typeof x.rutaActiva === "string")) {
    return new Error("Campo inválido: rutaActiva.");
  }
  if (!(
    x.ultimoRespaldo === null ||
    (typeof x.ultimoRespaldo === "string" && esFechaValida(x.ultimoRespaldo))
  )) {
    return new Error("Campo inválido: ultimoRespaldo.");
  }
  if (!esObjeto(x.rutas)) return new Error("Campo inválido: rutas.");
  for (const [slug, progreso] of Object.entries(x.rutas)) {
    const error = errorProgreso(progreso);
    if (error) return new Error(`Campo inválido en rutas.${slug}: ${error}.`);
  }
  return x as unknown as Estado;
}
```

#### `src/lib/progreso/almacen.ts` — nuevo

```ts
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
```

#### `src/lib/progreso/acciones.ts` — nuevo

```ts
// Acciones puras sobre el Estado: cada una devuelve un Estado nuevo (o un Error
// de validación para mostrar al estudiante). Ninguna cambia el dominio salvo
// declararDominio: completar bloques NO es dominar.
import { erroresConfig } from "../plan/generador";
import type { ConfigPlan } from "../tipos";
import {
  progresoInicial,
  type Estado,
  type Evaluacion,
  type NivelDominio,
  type ProgresoRuta,
  type RegistroDificultad,
} from "./estado";

function conRuta(
  estado: Estado,
  rutaSlug: string,
  cambio: (progreso: ProgresoRuta) => ProgresoRuta,
): Estado {
  const progreso = estado.rutas[rutaSlug];
  if (!progreso) throw new Error(`La ruta ${rutaSlug} no está iniciada.`);
  return {
    ...estado,
    rutas: { ...estado.rutas, [rutaSlug]: cambio(progreso) },
  };
}

/** Activa una ruta; si es nueva la inicia con `config`, si ya existía conserva su progreso. */
export function activarRuta(
  estado: Estado,
  rutaSlug: string,
  config: ConfigPlan,
): Estado {
  const errores = erroresConfig(config);
  if (errores.length > 0) throw new RangeError(errores.join(" "));
  const existente = estado.rutas[rutaSlug];
  return {
    ...estado,
    rutaActiva: rutaSlug,
    rutas: {
      ...estado.rutas,
      [rutaSlug]: existente ?? progresoInicial(config),
    },
  };
}

export function actualizarConfig(
  estado: Estado,
  rutaSlug: string,
  config: ConfigPlan,
): Estado {
  const errores = erroresConfig(config);
  if (errores.length > 0) throw new RangeError(errores.join(" "));
  return conRuta(estado, rutaSlug, (p) => ({ ...p, config }));
}

export function marcarBloque(
  estado: Estado,
  rutaSlug: string,
  bloqueId: string,
  hecho: boolean,
  ahoraISO: string,
): Estado {
  return conRuta(estado, rutaSlug, (p) => {
    const completados = { ...p.completados };
    if (hecho) completados[bloqueId] = ahoraISO;
    else delete completados[bloqueId];
    return { ...p, completados };
  });
}

export function declararDominio(
  estado: Estado,
  rutaSlug: string,
  subtemaSlug: string,
  nivel: NivelDominio,
  evidencia: string,
  fecha: string,
): Estado | Error {
  if (nivel === "dominado" && evidencia.trim() === "") {
    return new Error(
      "Para marcar un subtema como dominado escribe la evidencia, por ejemplo el resultado de un examen.",
    );
  }
  return conRuta(estado, rutaSlug, (p) => ({
    ...p,
    dominio: {
      ...p.dominio,
      [subtemaSlug]: { nivel, evidencia: evidencia.trim(), fecha },
    },
  }));
}

export function registrarDificultad(
  estado: Estado,
  rutaSlug: string,
  dificultad: RegistroDificultad,
): Estado | Error {
  if (dificultad.texto.trim() === "") {
    return new Error("Describe la dificultad o el error antes de guardarlo.");
  }
  return conRuta(estado, rutaSlug, (p) => ({
    ...p,
    dificultades: [
      ...p.dificultades,
      { ...dificultad, texto: dificultad.texto.trim() },
    ],
  }));
}

export function resolverDificultad(
  estado: Estado,
  rutaSlug: string,
  id: string,
  resuelta: boolean,
): Estado {
  return conRuta(estado, rutaSlug, (p) => ({
    ...p,
    dificultades: p.dificultades.map((d) =>
      d.id === id ? { ...d, resuelta } : d,
    ),
  }));
}

/** Guarda el resultado de un examen externo; reemplaza el del mismo día. */
export function registrarEvaluacion(
  estado: Estado,
  rutaSlug: string,
  evaluacion: Evaluacion,
): Estado | Error {
  const { nota, notaMaxima } = evaluacion;
  if (nota !== null && (!Number.isFinite(nota) || nota < 0)) {
    return new Error("La nota debe ser un número mayor o igual a 0.");
  }
  if (
    notaMaxima !== null &&
    (!Number.isFinite(notaMaxima) || notaMaxima <= 0)
  ) {
    return new Error("La nota máxima debe ser un número mayor que 0.");
  }
  if (nota !== null && notaMaxima !== null && nota > notaMaxima) {
    return new Error("La nota no puede ser mayor que la nota máxima.");
  }
  return conRuta(estado, rutaSlug, (p) => ({
    ...p,
    evaluaciones: [
      ...p.evaluaciones.filter((e) => e.diaNumero !== evaluacion.diaNumero),
      evaluacion,
    ].sort((a, b) => a.diaNumero - b.diaNumero),
  }));
}

/** Texto vacío borra la reflexión del día. */
export function guardarReflexion(
  estado: Estado,
  rutaSlug: string,
  diaNumero: number,
  texto: string,
): Estado {
  return conRuta(estado, rutaSlug, (p) => {
    const reflexiones = { ...p.reflexiones };
    if (texto.trim() === "") delete reflexiones[String(diaNumero)];
    else reflexiones[String(diaNumero)] = texto;
    return { ...p, reflexiones };
  });
}

export function marcarRespaldo(estado: Estado, fecha: string): Estado {
  return { ...estado, ultimoRespaldo: fecha };
}
```

#### `tests/unit/progreso.test.ts` — nuevo

```ts
import { describe, expect, it } from "vitest";
import {
  activarRuta,
  declararDominio,
  guardarReflexion,
  marcarBloque,
  registrarDificultad,
  registrarEvaluacion,
} from "../../src/lib/progreso/acciones";
import { cargarEstado, guardarEstado } from "../../src/lib/progreso/almacen";
import {
  CLAVE_ALMACEN,
  CLAVE_DANADA,
  estadoInicial,
  type Estado,
} from "../../src/lib/progreso/estado";
import { validarEstado } from "../../src/lib/progreso/validar";
import { configInicial } from "../../src/lib/plan/ajustes";

const config = configInicial("2026-03-01");
const conRuta = (): Estado => activarRuta(estadoInicial(), "prueba", config);

const almacenRoto: Storage = {
  length: 0,
  clear: () => undefined,
  key: () => null,
  removeItem: () => undefined,
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("QuotaExceededError");
  },
};

describe("almacén de progreso", () => {
  it("empieza vacío con la versión 1", () => {
    expect(cargarEstado(window.localStorage)).toEqual({
      estado: {
        version: 1,
        rutaActiva: null,
        ultimoRespaldo: null,
        rutas: {},
      },
      corrupto: null,
    });
  });

  it("guarda bajo la clave mentorix-reto:v1 y vuelve a cargar lo mismo", () => {
    const estado = marcarBloque(
      conRuta(),
      "prueba",
      "prueba:estudio:a#1:teoria",
      true,
      "2026-03-01T10:00:00.000Z",
    );
    expect(guardarEstado(estado, window.localStorage)).toBe(true);
    expect(window.localStorage.getItem("mentorix-reto:v1")).not.toBeNull();
    expect(cargarEstado(window.localStorage)).toEqual({
      estado,
      corrupto: null,
    });
  });

  it("no borra datos corruptos: los copia aparte y empieza limpio", () => {
    window.localStorage.setItem(CLAVE_ALMACEN, "{esto no es JSON");
    const carga = cargarEstado(window.localStorage);
    expect(carga.estado).toEqual(estadoInicial());
    expect(carga.corrupto).toBe("{esto no es JSON");
    expect(window.localStorage.getItem(CLAVE_DANADA)).toBe("{esto no es JSON");
    expect(window.localStorage.getItem(CLAVE_ALMACEN)).toBe("{esto no es JSON");
  });

  it("trata una versión desconocida como dato corrupto", () => {
    const crudo = JSON.stringify({ ...estadoInicial(), version: 2 });
    window.localStorage.setItem(CLAVE_ALMACEN, crudo);
    expect(cargarEstado(window.localStorage).corrupto).toBe(crudo);
  });

  it("sobrevive a un almacenamiento que lanza errores (modo privado)", () => {
    expect(cargarEstado(almacenRoto)).toEqual({
      estado: estadoInicial(),
      corrupto: null,
    });
    expect(guardarEstado(estadoInicial(), almacenRoto)).toBe(false);
    expect(cargarEstado(null).estado).toEqual(estadoInicial());
  });
});

describe("acciones y reglas de dominio", () => {
  it("marcar un bloque registra el completado y no cambia el dominio", () => {
    const estado = marcarBloque(
      conRuta(),
      "prueba",
      "prueba:estudio:a#1:practica",
      true,
      "2026-03-01T10:00:00.000Z",
    );
    const progreso = estado.rutas.prueba!;
    expect(progreso.completados).toEqual({
      "prueba:estudio:a#1:practica": "2026-03-01T10:00:00.000Z",
    });
    expect(progreso.dominio).toEqual({});
    const desmarcado = marcarBloque(
      estado,
      "prueba",
      "prueba:estudio:a#1:practica",
      false,
      "2026-03-01T11:00:00.000Z",
    );
    expect(desmarcado.rutas.prueba!.completados).toEqual({});
  });

  it("exige evidencia para declarar «dominado»", () => {
    const sinEvidencia = declararDominio(
      conRuta(),
      "prueba",
      "a",
      "dominado",
      "   ",
      "2026-03-05",
    );
    expect(sinEvidencia).toBeInstanceOf(Error);
    const conEvidencia = declararDominio(
      conRuta(),
      "prueba",
      "a",
      "dominado",
      "17/20 en el examen de años anteriores",
      "2026-03-05",
    );
    expect(conEvidencia).not.toBeInstanceOf(Error);
    expect((conEvidencia as Estado).rutas.prueba!.dominio.a).toEqual({
      nivel: "dominado",
      evidencia: "17/20 en el examen de años anteriores",
      fecha: "2026-03-05",
    });
    const inseguro = declararDominio(
      conRuta(),
      "prueba",
      "a",
      "inseguro",
      "",
      "2026-03-05",
    );
    expect(inseguro).not.toBeInstanceOf(Error);
  });

  it("valida notas, dificultades y reflexiones", () => {
    const evaluacion = {
      id: "e1",
      diaNumero: 4,
      temaSlug: "t1",
      fecha: "2026-03-04",
      nota: 21,
      notaMaxima: 20,
      errores: "",
      temasAReforzar: [],
    };
    expect(registrarEvaluacion(conRuta(), "prueba", evaluacion)).toBeInstanceOf(
      Error,
    );
    const valida = registrarEvaluacion(conRuta(), "prueba", {
      ...evaluacion,
      nota: 14,
    }) as Estado;
    expect(valida.rutas.prueba!.evaluaciones).toHaveLength(1);
    const vacia = registrarDificultad(conRuta(), "prueba", {
      id: "d1",
      fecha: "2026-03-02",
      subtemaSlug: null,
      texto: "  ",
      resuelta: false,
    });
    expect(vacia).toBeInstanceOf(Error);
    const reflexion = guardarReflexion(
      conRuta(),
      "prueba",
      3,
      "Entendí la regla",
    );
    expect(reflexion.rutas.prueba!.reflexiones).toEqual({
      "3": "Entendí la regla",
    });
    expect(
      guardarReflexion(reflexion, "prueba", 3, "").rutas.prueba!.reflexiones,
    ).toEqual({});
  });

  it("validarEstado rechaza un dominio «dominado» sin evidencia y una config inválida", () => {
    const base = conRuta();
    expect(validarEstado(base)).toBe(base);
    const sinEvidencia = structuredClone(base);
    sinEvidencia.rutas.prueba!.dominio.a = {
      nivel: "dominado",
      evidencia: "",
      fecha: "2026-03-05",
    };
    expect(validarEstado(sinEvidencia)).toBeInstanceOf(Error);
    const configMala = structuredClone(base);
    configMala.rutas.prueba!.config.horizonteDias = 500;
    expect(validarEstado(configMala)).toBeInstanceOf(Error);
    expect(validarEstado("texto")).toBeInstanceOf(Error);
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** a state with a completed block is saved and loaded again **THE SYSTEM SHALL** store it under `mentorix-reto:v1` and return an identical `Estado` with `corrupto: null`.
2. **WHEN** the stored text is not valid JSON or has `version: 2` **THE SYSTEM SHALL** return the initial state, return the raw text in `corrupto`, copy it to `mentorix-reto:v1:danado` and leave `mentorix-reto:v1` untouched.
3. **WHEN** `getItem` and `setItem` throw (private mode) **THE SYSTEM SHALL** return the initial state without throwing and `guardarEstado` SHALL return `false`.
4. **WHEN** a block is marked completed **THE SYSTEM SHALL** record its ISO timestamp in `completados` and leave `dominio` unchanged.
5. **WHEN** `declararDominio` receives level `dominado` with blank evidence **THE SYSTEM SHALL** return an `Error`, and `validarEstado` SHALL also reject a stored `dominado` without evidence.
6. **WHEN** a grade is greater than the maximum grade or a difficulty text is blank **THE SYSTEM SHALL** return an `Error` and save nothing.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/unit/progreso.test.ts
npm test
npm run check
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T6: Progreso: modelo, validador, almacén y acciones"
git tag step-06-progreso-almacen
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E1-T7` — Respaldo, derivados y límite de errores

**Depends on:** `E1-T6` · **Priority:** p0 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 7

Crea el respaldo JSON (nombre `mentorix-reto-AAAA-MM-DD.json`, lectura con validación y resumen, recordatorio a los 7 días), los derivados puros (estado y posición de un día, avance global, temas estudiados, repasos pendientes, dificultades abiertas, resumen de dominio — siempre separados del avance) y el componente `LimiteErrores` que usarán todas las islas (su prueba de componente llega en el paso 8, cuando existe el primer archivo `.tsx` de pruebas de componentes). Ejecuta `npm run format` antes de Verify.

**Files**
- `src/lib/progreso/respaldo.ts` — nuevo
- `src/lib/progreso/derivados.ts` — nuevo
- `src/components/LimiteErrores.tsx` — nuevo
- `tests/unit/respaldo.test.ts` — nuevo
- `tests/unit/derivados.test.ts` — nuevo

Contenido exacto de cada archivo:

#### `src/lib/progreso/respaldo.ts` — nuevo

```ts
// Exportar e importar el progreso como archivo JSON (único "sincronizador").
import { diferenciaDias } from "../fechas";
import { migrar, type Estado } from "./estado";
import { validarEstado } from "./validar";

export const DIAS_RECORDATORIO_RESPALDO = 7;

export interface ResumenRespaldo {
  rutas: number;
  rutaActiva: string | null;
  bloquesCompletados: number;
  evaluaciones: number;
  dificultades: number;
}

export function nombreArchivoRespaldo(fecha: string): string {
  return `mentorix-reto-${fecha}.json`;
}

export function serializarRespaldo(estado: Estado): string {
  return `${JSON.stringify(estado, null, 2)}\n`;
}

export function resumirEstado(estado: Estado): ResumenRespaldo {
  const progresos = Object.values(estado.rutas);
  return {
    rutas: progresos.length,
    rutaActiva: estado.rutaActiva,
    bloquesCompletados: progresos.reduce(
      (total, p) => total + Object.keys(p.completados).length,
      0,
    ),
    evaluaciones: progresos.reduce((t, p) => t + p.evaluaciones.length, 0),
    dificultades: progresos.reduce((t, p) => t + p.dificultades.length, 0),
  };
}

function plural(n: number, singular: string, varios: string): string {
  return `${n} ${n === 1 ? singular : varios}`;
}

export function describirResumen(resumen: ResumenRespaldo): string {
  return [
    plural(resumen.rutas, "ruta", "rutas"),
    plural(
      resumen.bloquesCompletados,
      "bloque completado",
      "bloques completados",
    ),
    plural(resumen.evaluaciones, "evaluación", "evaluaciones"),
    plural(resumen.dificultades, "dificultad", "dificultades"),
  ].join(" · ");
}

/** Lee el texto de un archivo de respaldo. Nunca lanza: devuelve Error. */
export function leerRespaldo(
  texto: string,
): { estado: Estado; resumen: ResumenRespaldo } | Error {
  let datos: unknown;
  try {
    datos = JSON.parse(texto);
  } catch {
    return new Error("El archivo no es un respaldo válido: no es JSON.");
  }
  const estado = validarEstado(migrar(datos));
  if (estado instanceof Error) {
    return new Error(`El archivo no es un respaldo válido. ${estado.message}`);
  }
  return { estado, resumen: resumirEstado(estado) };
}

function hayProgreso(estado: Estado): boolean {
  const r = resumirEstado(estado);
  return r.bloquesCompletados + r.evaluaciones + r.dificultades > 0;
}

/** true si hay progreso y nunca se exportó, o el último respaldo tiene 7 días o más. */
export function necesitaRecordatorio(estado: Estado, hoy: string): boolean {
  if (!hayProgreso(estado)) return false;
  if (estado.ultimoRespaldo === null) return true;
  return (
    diferenciaDias(estado.ultimoRespaldo, hoy) >= DIAS_RECORDATORIO_RESPALDO
  );
}

/** Descarga `texto` como archivo en el navegador. */
export function descargarTexto(nombre: string, texto: string): void {
  const blob = new Blob([texto], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}
```

#### `src/lib/progreso/derivados.ts` — nuevo

```ts
// Datos derivados (puros) del plan + progreso. El avance de actividades y el
// dominio declarado se calculan por separado y nunca se mezclan.
import type { Dia, Plan, Ruta } from "../tipos";
import {
  NIVELES_DOMINIO,
  type NivelDominio,
  type ProgresoRuta,
  type RegistroDificultad,
} from "./estado";

export type EstadoDia = "pendiente" | "parcial" | "completado";
export type PosicionDia = "pasado" | "hoy" | "futuro";

export function estadoDelDia(
  dia: Dia,
  completados: Record<string, string>,
): EstadoDia {
  const hechos = dia.bloques.filter((b) => b.id in completados).length;
  if (hechos === 0) return "pendiente";
  return hechos === dia.bloques.length ? "completado" : "parcial";
}

export function posicionDelDia(numero: number, hoyNumero: number): PosicionDia {
  if (numero === hoyNumero) return "hoy";
  return numero < hoyNumero ? "pasado" : "futuro";
}

export interface Avance {
  completados: number;
  total: number;
  porcentaje: number;
}

/** Bloques del plan actual completados / bloques totales del plan. */
export function progresoGlobal(
  plan: Plan,
  completados: Record<string, string>,
): Avance {
  const ids = plan.dias.flatMap((d) => d.bloques.map((b) => b.id));
  const hechos = ids.filter((id) => id in completados).length;
  return {
    completados: hechos,
    total: ids.length,
    porcentaje: ids.length === 0 ? 0 : Math.round((hechos * 100) / ids.length),
  };
}

/** Temas con al menos un día de estudio en el plan y todos esos días completados. */
export function temasEstudiados(
  ruta: Ruta,
  plan: Plan,
  completados: Record<string, string>,
): string[] {
  return ruta.temas
    .map((t) => t.slug)
    .filter((slug) => {
      const dias = plan.dias.filter(
        (d) => d.tipo === "estudio" && d.temaSlug === slug,
      );
      return (
        dias.length > 0 &&
        dias.every((d) => estadoDelDia(d, completados) === "completado")
      );
    });
}

export interface RepasoPendiente {
  subtemaSlug: string;
  diaNumero: number;
}

/** Repasos programados hasta hoy (inclusive) cuyo bloque Repaso no está marcado. */
export function repasosPendientes(
  plan: Plan,
  completados: Record<string, string>,
  hoyNumero: number,
): RepasoPendiente[] {
  const pendientes: RepasoPendiente[] = [];
  for (const dia of plan.dias) {
    if (dia.numero > hoyNumero) break;
    const bloque = dia.bloques.find((b) => b.tipo === "repaso");
    if (!bloque || bloque.id in completados) continue;
    for (const subtemaSlug of dia.repasoSlugs) {
      pendientes.push({ subtemaSlug, diaNumero: dia.numero });
    }
  }
  return pendientes;
}

export function dificultadesAbiertas(
  progreso: ProgresoRuta,
): RegistroDificultad[] {
  return progreso.dificultades.filter((d) => !d.resuelta);
}

/** Cuántos subtemas de la ruta hay en cada nivel declarado (sin declarar = sin-evaluar). */
export function resumenDominio(
  ruta: Ruta,
  progreso: ProgresoRuta,
): Record<NivelDominio, number> {
  const resumen = Object.fromEntries(
    NIVELES_DOMINIO.map((nivel) => [nivel, 0]),
  ) as Record<NivelDominio, number>;
  for (const subtema of ruta.temas.flatMap((t) => t.subtemas)) {
    resumen[progreso.dominio[subtema.slug]?.nivel ?? "sin-evaluar"] += 1;
  }
  return resumen;
}
```

#### `src/components/LimiteErrores.tsx` — nuevo

```tsx
import { Component, type ComponentChildren } from "preact";
import { hoyLocal } from "../lib/fechas";
import { CLAVE_ALMACEN } from "../lib/progreso/estado";
import {
  descargarTexto,
  nombreArchivoRespaldo,
} from "../lib/progreso/respaldo";

interface Props {
  /** Nombre de la isla, para el registro en consola. */
  origen: string;
  children: ComponentChildren;
}

interface EstadoLimite {
  error: Error | null;
}

/** Exporta el texto guardado tal cual, sin validarlo: sirve aunque esté dañado. */
function exportarCrudo(): void {
  let crudo: string | null = null;
  try {
    crudo = window.localStorage.getItem(CLAVE_ALMACEN);
  } catch {
    crudo = null;
  }
  descargarTexto(nombreArchivoRespaldo(hoyLocal()), crudo ?? "{}");
}

/** Límite de errores de cada isla: mensaje amable + «Exportar respaldo». */
export class LimiteErrores extends Component<Props, EstadoLimite> {
  override state: EstadoLimite = { error: null };

  static override getDerivedStateFromError(error: Error): EstadoLimite {
    return { error };
  }

  override componentDidCatch(error: Error): void {
    console.error(
      JSON.stringify({
        nivel: "error",
        origen: this.props.origen,
        mensaje: error.message,
        fecha: new Date().toISOString(),
      }),
    );
  }

  override render() {
    if (!this.state.error) return this.props.children;
    return (
      <section class="tarjeta" role="alert">
        <h2>Algo salió mal en esta sección</h2>
        <p>
          Tu progreso sigue guardado en este navegador. Descarga un respaldo por
          si acaso y vuelve a cargar la página.
        </p>
        <p>
          <button class="boton" type="button" onClick={exportarCrudo}>
            Exportar respaldo
          </button>{" "}
          <button
            class="boton boton--secundario"
            type="button"
            onClick={() => window.location.reload()}
          >
            Volver a cargar
          </button>
        </p>
      </section>
    );
  }
}
```

#### `tests/unit/respaldo.test.ts` — nuevo

```ts
import { describe, expect, it } from "vitest";
import { configInicial } from "../../src/lib/plan/ajustes";
import {
  activarRuta,
  marcarBloque,
  marcarRespaldo,
} from "../../src/lib/progreso/acciones";
import { estadoInicial } from "../../src/lib/progreso/estado";
import {
  describirResumen,
  leerRespaldo,
  necesitaRecordatorio,
  nombreArchivoRespaldo,
  serializarRespaldo,
} from "../../src/lib/progreso/respaldo";

const conAvance = marcarBloque(
  activarRuta(estadoInicial(), "prueba", configInicial("2026-03-01")),
  "prueba",
  "prueba:estudio:a#1:teoria",
  true,
  "2026-03-01T10:00:00.000Z",
);

describe("respaldo JSON", () => {
  it("nombra el archivo mentorix-reto-AAAA-MM-DD.json", () => {
    expect(nombreArchivoRespaldo("2026-03-08")).toBe(
      "mentorix-reto-2026-03-08.json",
    );
  });

  it("exporta e importa el mismo estado con su resumen", () => {
    const leido = leerRespaldo(serializarRespaldo(conAvance));
    expect(leido).not.toBeInstanceOf(Error);
    if (leido instanceof Error) return;
    expect(leido.estado).toEqual(conAvance);
    expect(describirResumen(leido.resumen)).toBe(
      "1 ruta · 1 bloque completado · 0 evaluaciones · 0 dificultades",
    );
  });

  it("rechaza archivos que no son JSON o que no pasan la validación", () => {
    expect(leerRespaldo("hola")).toBeInstanceOf(Error);
    expect(leerRespaldo(JSON.stringify({ version: 1 }))).toBeInstanceOf(Error);
    expect(
      leerRespaldo(JSON.stringify({ ...estadoInicial(), version: 9 })),
    ).toBeInstanceOf(Error);
  });

  it("recuerda exportar si hay avance y el último respaldo tiene 7 días o más", () => {
    expect(necesitaRecordatorio(estadoInicial(), "2026-03-10")).toBe(false);
    expect(necesitaRecordatorio(conAvance, "2026-03-10")).toBe(true);
    const respaldado = marcarRespaldo(conAvance, "2026-03-03");
    expect(necesitaRecordatorio(respaldado, "2026-03-09")).toBe(false);
    expect(necesitaRecordatorio(respaldado, "2026-03-10")).toBe(true);
  });
});
```

#### `tests/unit/derivados.test.ts` — nuevo

```ts
import { describe, expect, it } from "vitest";
import { configInicial } from "../../src/lib/plan/ajustes";
import { generarPlan } from "../../src/lib/plan/generador";
import { activarRuta } from "../../src/lib/progreso/acciones";
import {
  dificultadesAbiertas,
  estadoDelDia,
  posicionDelDia,
  progresoGlobal,
  repasosPendientes,
  resumenDominio,
  temasEstudiados,
} from "../../src/lib/progreso/derivados";
import { estadoInicial } from "../../src/lib/progreso/estado";
import { rutaPrueba } from "../fixtures/ruta-prueba";

const config = { ...configInicial("2026-03-01"), horizonteDias: 14 };
const plan = generarPlan(rutaPrueba, config);

function completar(...numeros: number[]): Record<string, string> {
  const completados: Record<string, string> = {};
  for (const n of numeros) {
    for (const bloque of plan.dias[n - 1]!.bloques) {
      completados[bloque.id] = "2026-03-01T10:00:00.000Z";
    }
  }
  return completados;
}

describe("derivados del progreso", () => {
  it("clasifica un día como pendiente, parcial o completado", () => {
    const dia = plan.dias[0]!;
    expect(estadoDelDia(dia, {})).toBe("pendiente");
    expect(estadoDelDia(dia, { [dia.bloques[0]!.id]: "x" })).toBe("parcial");
    expect(estadoDelDia(dia, completar(1))).toBe("completado");
    expect(posicionDelDia(3, 5)).toBe("pasado");
    expect(posicionDelDia(5, 5)).toBe("hoy");
    expect(posicionDelDia(6, 5)).toBe("futuro");
  });

  it("calcula el avance como bloques completados / bloques del plan", () => {
    expect(progresoGlobal(plan, {})).toEqual({
      completados: 0,
      total: 80,
      porcentaje: 0,
    });
    expect(progresoGlobal(plan, completar(1))).toEqual({
      completados: 7,
      total: 80,
      porcentaje: 9,
    });
  });

  it("marca un tema como estudiado solo con todos sus días de estudio completos", () => {
    expect(temasEstudiados(rutaPrueba, plan, completar(1, 2))).toEqual([]);
    expect(temasEstudiados(rutaPrueba, plan, completar(1, 2, 3))).toEqual([
      "t1",
    ]);
  });

  it("lista los repasos programados hasta hoy cuyo bloque Repaso no se marcó", () => {
    expect(repasosPendientes(plan, {}, 5)).toEqual([
      { subtemaSlug: "a", diaNumero: 3 },
      { subtemaSlug: "b", diaNumero: 4 },
      { subtemaSlug: "a", diaNumero: 5 },
    ]);
    expect(repasosPendientes(plan, completar(3), 5)).toEqual([
      { subtemaSlug: "b", diaNumero: 4 },
      { subtemaSlug: "a", diaNumero: 5 },
    ]);
  });

  it("resume el dominio declarado sin mirar los completados", () => {
    const progreso = activarRuta(estadoInicial(), "prueba", config).rutas
      .prueba!;
    const conDominio = {
      ...progreso,
      completados: completar(1, 2, 3),
      dominio: {
        a: {
          nivel: "dominado" as const,
          evidencia: "18/20",
          fecha: "2026-03-04",
        },
      },
      dificultades: [
        {
          id: "d1",
          fecha: "2026-03-02",
          subtemaSlug: "a",
          texto: "Confundo los signos",
          resuelta: false,
        },
        {
          id: "d2",
          fecha: "2026-03-02",
          subtemaSlug: null,
          texto: "Me faltó tiempo",
          resuelta: true,
        },
      ],
    };
    expect(resumenDominio(rutaPrueba, conDominio)).toEqual({
      "sin-evaluar": 2,
      "en-progreso": 0,
      inseguro: 0,
      dominado: 1,
    });
    expect(resumenDominio(rutaPrueba, { ...conDominio, dominio: {} })).toEqual({
      "sin-evaluar": 3,
      "en-progreso": 0,
      inseguro: 0,
      dominado: 0,
    });
    expect(dificultadesAbiertas(conDominio).map((d) => d.id)).toEqual(["d1"]);
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** a state is serialized and read back with `leerRespaldo` **THE SYSTEM SHALL** return the same state and the summary `1 ruta · 1 bloque completado · 0 evaluaciones · 0 dificultades`.
2. **WHEN** the backup text is not JSON, lacks fields or has `version: 9` **THE SYSTEM SHALL** return an `Error`.
3. **WHEN** there is progress and no backup, or the last backup is 7 or more days old **THE SYSTEM SHALL** report that a reminder is needed, and SHALL not report it at 6 days or with no progress.
4. **WHEN** day 1 of the test plan is fully completed **THE SYSTEM SHALL** compute `{ completados: 7, total: 80, porcentaje: 9 }`, and with day 3 completed by day 5 the pending reviews SHALL be `b` (day 4) and `a` (day 5).
5. **WHEN** the declared mastery is summarized **THE SYSTEM SHALL** count undeclared subtopics as `sin-evaluar` regardless of completed blocks.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/unit/respaldo.test.ts
npm test -- tests/unit/derivados.test.ts
npm test
npm run check
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E1-T7: Respaldo, derivados y límite de errores"
git tag step-07-respaldo-derivados
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

---

## Epic acceptance

El epic está hecho cuando todas sus tareas están `done` **y**:

1. **WHEN** `npm test` runs at the end of the epic **THE SYSTEM SHALL** pass every test in `tests/unit/` with 0 failed and 0 skipped.
2. **WHEN** `npm run build` runs **THE SYSTEM SHALL** print `verificar-dist: OK`, proving no internal link lost the `/mentorix-calc-reto-30/` base.

```bash
npm run check && npm test && npm run format:check
npm run build
```

## Pitfalls

- **Escribir `href="/hoy/"` a mano** — en `.astro` usa `import.meta.env.BASE_URL`; `npm run build` falla si un enlace interno no lleva la base.
- **`tokens.css?raw` vacío en pruebas** — ya está resuelto con `css.include` en `vitest.config.ts`; no lo quites ni muevas `tokens.css` fuera de `src/styles/`.
- **Cambiar el algoritmo "para que quepa"** — nunca reduzcas `diasEstimados`; lo que no cabe va a `fueraDelHorizonte`.
- **Borrar datos corruptos** — se copian a `mentorix-reto:v1:danado`; nunca `removeItem`.

## Before moving on

- [ ] Cada tarea de este epic está `done` en `tasks.json`; ninguna queda `in_progress`.
- [ ] Pasó cada comando de `verify` de cada tarea, no solo el primero.
- [ ] Ningún comando de `verify` se editó ni se omitió.
- [ ] Cada tarea tiene su tag (`git tag -l 'step-*'` lista `step-01-andamiaje` … `step-07-respaldo-derivados`).
- [ ] El gate pasa desde la raíz del proyecto.
- [ ] Cada contrato «Produced» existe con la firma indicada.
- [ ] Ningún archivo fuera del subárbol fue modificado.
- [ ] `.env.example`: no aplica — el proyecto no usa variables de entorno.
- [ ] Un commit por tarea, con prefijo del id de tarea, seguido de su tag.
