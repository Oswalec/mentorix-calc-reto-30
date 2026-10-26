# Epic 02: Interfaz y despliegue

> Existen las seis páginas interactivas (Inicio, Hoy, Día, Calendario, Progreso, Ajustes) sobre la lógica del epic 01, más el workflow de GitHub Pages y el README del docente.

| | |
|---|---|
| **Epic id** | `02-interfaz-y-despliegue` |
| **Tasks** | `E2-T1` … `E2-T7` (pasos 8–14 del blueprint) |
| **Depends on** | `01-fundamentos-y-logica` |
| **Unlocks** | nada — es el último epic; después va la lista de lanzamiento del blueprint §20.1 |
| **Parallel with** | ninguno |

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
  lib/progreso/store.ts          # NUEVO E2-T1 — signals globales, actualizar(), recargarEstado(), nuevoId()
  lib/enlaces.ts                 # NUEVO E2-T1 — enlace(), enlaceDia()
  components/Inicio.tsx          # NUEVO E2-T1
  components/GuiaDia.tsx         # NUEVO E2-T2, reemplazado en E2-T4 y E2-T6
  components/Calendario.tsx      # NUEVO E2-T3
  components/FormularioEvaluacion.tsx  # NUEVO E2-T4
  components/DiarioDificultades.tsx    # NUEVO E2-T4
  components/Progreso.tsx        # NUEVO E2-T5
  components/RecordatorioRespaldo.tsx  # NUEVO E2-T6
  components/Ajustes.tsx         # NUEVO E2-T6
  components/LimiteErrores.tsx   # existe (E1-T7), solo lectura
  pages/index.astro              # existe (E1-T2), reemplazado en E2-T1
  pages/hoy/index.astro          # NUEVO E2-T2
  pages/dia/index.astro          # NUEVO E2-T2
  pages/calendario/index.astro   # NUEVO E2-T3
  pages/progreso/index.astro     # NUEVO E2-T5
  pages/ajustes/index.astro      # NUEVO E2-T6
  lib/**, data/**, styles/**, layouts/**  # existen (epic 01), solo lectura
.github/workflows/deploy.yml     # NUEVO E2-T7
scripts/verificar-workflow.mjs   # NUEVO E2-T7
README.md                        # NUEVO E2-T7
tests/componentes/
  inicio.test.tsx                # NUEVO E2-T1
  guia-dia.test.tsx              # NUEVO E2-T2
  calendario.test.tsx            # NUEVO E2-T3
  evaluaciones.test.tsx          # NUEVO E2-T4
  progreso.test.tsx              # NUEVO E2-T5
  ajustes.test.tsx               # NUEVO E2-T6
```

Todo lo que está fuera de este subárbol queda fuera de alcance. Si una tarea parece requerir editar otro archivo, detente y repórtalo.

## Data model touched here

| Entity | Fields this epic adds or reads | Notes |
|---|---|---|
| `Estado` (localStorage `mentorix-reto:v1`) | lee todo; escribe solo vía `actualizar((e) => accion(e, …))` | `rutaActiva`, `ultimoRespaldo`, `rutas[slug]` |
| `ProgresoRuta` | `config`, `completados` (bloqueId → ISO), `evaluaciones`, `dificultades`, `dominio`, `reflexiones` (clave `String(diaNumero)`) | completar ≠ dominar; «dominado» exige evidencia |
| `Plan` | `dias[]`, `fueraDelHorizonte[]` — se recalcula con `generarPlan(ruta, config, rutas)` | nunca se guarda |

Datos de referencia que usan las pruebas: con `calculo-diferencial`, inicio 2026-03-01 y 30 días, el día 1 es «Dominio y rango de funciones reales» (7 bloques: Recuperar 10, Teoría 30, Ejemplos resueltos 15, Práctica 45, Descanso 5, Repaso 10, Cierre 5), el día 2 «Gráficas de funciones elementales y transformaciones» (día 1 de 2), el día 7 es repaso, los días de estudio de «Funciones» son 1–6, 8 y 9, el día 10 es la evaluación de «Funciones», y no caben desde «Reglas de derivación» en adelante.

## Contracts

**Consumed** — ya existe (epic 01), no lo reconstruyas:

| From | Interface | Guarantee |
|---|---|---|
| `01-fundamentos-y-logica` | `rutas`, `buscarRuta`, `buscarTema` (`src/data/rutas/index.ts`) | 4 rutas registradas |
| `01` | `generarPlan(ruta, config, catalogo?) => Plan`, `erroresConfig(config) => string[]` | pura; RangeError si config inválida |
| `01` | `configInicial`, `extenderHorizonte`, `fijarRefuerzo`, `prerrequisitosDeRuta` | RangeError fuera de rango |
| `01` | `cargarEstado`, `guardarEstado`, acciones de `acciones.ts`, `leerRespaldo`, `serializarRespaldo`, `describirResumen`, `nombreArchivoRespaldo`, `necesitaRecordatorio`, `descargarTexto`, derivados de `derivados.ts` | acciones devuelven `Estado` o `Error` |
| `01` | `LimiteErrores` (`src/components/LimiteErrores.tsx`), `Base.astro` (`titulo`, `seccion`) | — |

**Produced** — el sitio final:

| Export | Signature | Used by |
|---|---|---|
| `src/lib/progreso/store.ts` → `estado`, `datosDanados`, `guardadoFallido`, `fechaHoy`, `rutaActiva`, `progresoActivo`, `planActivo`, `hoyNumero`, `actualizar`, `recargarEstado`, `nuevoId` | signals / `(cambio: (e: Estado) => Estado) => void` | todas las islas y sus pruebas |
| `src/components/*.tsx` | cada isla exporta `function Nombre()` y `export default function IslaNombre()` envuelta en `LimiteErrores` | páginas `.astro` |
| `src/components/GuiaDia.tsx` → `ETIQUETAS_TIPO` | `Record<TipoDia, string>` | `Calendario.tsx` |
| `src/components/RecordatorioRespaldo.tsx` → `exportarProgreso` | `() => void` | `Ajustes.tsx` |

## Conventions that bite in this area

- **Islas `client:only="preact"`** con `<p slot="fallback">…</p>`: el contenido depende de `localStorage`, que no existe en el build.
- **Una `h1` estática por página** en el `.astro`; las islas empiezan en `h2`.
- **Enlaces de islas con `enlace()`/`enlaceDia()`**: en pruebas la base es `/`, en el build `/mentorix-calc-reto-30/`.
- **Pruebas de componentes:** en `beforeEach` limpia `localStorage`, llama `recargarEstado()` y fija `fechaHoy.value`.
- **Cada control con etiqueta accesible** (las pruebas buscan por rol y nombre); errores en `role="alert"`, confirmaciones en `role="status"`.
- **Ningún hex en componentes:** solo clases de `global.css` y `var(--token)`.

Reglas completas: `CLAUDE.md`. Reglas por área: `.claude/rules/interfaz.md`, `.claude/rules/pruebas.md`, `.claude/rules/logica-plan-progreso.md` — en la raíz del proyecto desde §10 Bootstrap.

---

## Tasks

Listadas en el mismo orden que `tasks.json`. Ese orden es el orden de construcción: trabaja de arriba abajo y no reordenes por prioridad.

### `E2-T1` — Store, enlaces e isla de Inicio

**Depends on:** `E1-T2`, `E1-T7` · **Priority:** p0 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 8

Crea el store global con `@preact/signals` (única puerta de escritura: `actualizar`), los helpers de enlaces con la base del sitio y la isla de Inicio: sin ruta activa muestra las cuatro rutas y la configuración inicial (fecha = hoy, 30 días, 120 minutos); con ruta activa muestra el resumen y «Ir a Hoy»; con datos dañados ofrece descargarlos y empezar de nuevo. Reemplaza `src/pages/index.astro` para montar la isla con `client:only="preact"`. La prueba también cubre `LimiteErrores` (paso 7). Ejecuta `npm run format` antes de Verify.

**Files**
- `src/lib/progreso/store.ts` — nuevo
- `src/lib/enlaces.ts` — nuevo
- `src/components/Inicio.tsx` — nuevo
- `src/pages/index.astro` — reemplaza (contenido completo)
- `tests/componentes/inicio.test.tsx` — nuevo

Contenido exacto de cada archivo:

#### `src/lib/progreso/store.ts` — nuevo

```ts
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
```

#### `src/lib/enlaces.ts` — nuevo

```ts
/** Enlace interno con la base del sitio: enlace("hoy/") → "/mentorix-calc-reto-30/hoy/". */
export function enlace(ruta: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  return base + ruta.replace(/^\//, "");
}

/** Enlace al detalle de un día: /dia/?n=<numero>. */
export function enlaceDia(numero: number): string {
  return `${enlace("dia/")}?n=${numero}`;
}
```

#### `src/components/Inicio.tsx` — nuevo

```tsx
import { useState } from "preact/hooks";
import { rutas } from "../data/rutas";
import { enlace } from "../lib/enlaces";
import { configInicial } from "../lib/plan/ajustes";
import { erroresConfig } from "../lib/plan/generador";
import { activarRuta } from "../lib/progreso/acciones";
import { progresoGlobal } from "../lib/progreso/derivados";
import { descargarTexto } from "../lib/progreso/respaldo";
import {
  actualizar,
  datosDanados,
  fechaHoy,
  hoyNumero,
  planActivo,
  progresoActivo,
  rutaActiva,
} from "../lib/progreso/store";
import { LimiteErrores } from "./LimiteErrores";

function AvisoDatosDanados() {
  const crudo = datosDanados.value;
  if (crudo === null) return null;
  return (
    <section class="tarjeta" role="alert">
      <h2>No pudimos leer tu progreso guardado</h2>
      <p>
        Los datos de este navegador están dañados. No los borramos: descárgalos
        y empieza de nuevo, o importa un respaldo desde Ajustes.
      </p>
      <p>
        <button
          class="boton boton--secundario"
          type="button"
          onClick={() =>
            descargarTexto(`mentorix-reto-danado-${fechaHoy.value}.json`, crudo)
          }
        >
          Descargar datos dañados
        </button>{" "}
        <button
          class="boton"
          type="button"
          onClick={() => (datosDanados.value = null)}
        >
          Empezar de nuevo
        </button>
      </p>
    </section>
  );
}

function ElegirRuta() {
  const [rutaSlug, setRutaSlug] = useState(rutas[0]!.slug);
  const [fechaInicio, setFechaInicio] = useState(fechaHoy.value);
  const [horizonte, setHorizonte] = useState("30");
  const [minutos, setMinutos] = useState("120");
  const [errores, setErrores] = useState<string[]>([]);

  function empezar(evento: Event) {
    evento.preventDefault();
    const config = {
      ...configInicial(fechaInicio),
      horizonteDias: Number(horizonte),
      minutosPorDia: Number(minutos),
    };
    const encontrados = erroresConfig(config);
    setErrores(encontrados);
    if (encontrados.length === 0) {
      actualizar((e) => activarRuta(e, rutaSlug, config));
    }
  }

  return (
    <form class="tarjeta" onSubmit={empezar} noValidate>
      <h2>Empieza tu reto de estudio</h2>
      <fieldset>
        <legend>Elige tu ruta</legend>
        {rutas.map((ruta) => (
          <label key={ruta.slug} class="opcion-ruta">
            <input
              type="radio"
              name="ruta"
              value={ruta.slug}
              checked={rutaSlug === ruta.slug}
              onChange={() => setRutaSlug(ruta.slug)}
            />
            <span>
              <strong>{ruta.nombre}</strong>
              <br />
              <span class="texto-tenue">{ruta.descripcion}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <div class="campo">
        <label for="fecha-inicio">Fecha de inicio</label>
        <input
          id="fecha-inicio"
          type="date"
          value={fechaInicio}
          onInput={(e) => setFechaInicio(e.currentTarget.value)}
        />
      </div>
      <div class="campo">
        <label for="horizonte">Duración del reto (días)</label>
        <input
          id="horizonte"
          type="number"
          min={7}
          max={120}
          value={horizonte}
          onInput={(e) => setHorizonte(e.currentTarget.value)}
        />
      </div>
      <div class="campo">
        <label for="minutos">Minutos de estudio por día</label>
        <input
          id="minutos"
          type="number"
          min={60}
          max={360}
          step={5}
          value={minutos}
          onInput={(e) => setMinutos(e.currentTarget.value)}
        />
      </div>
      {errores.length > 0 && (
        <ul role="alert">
          {errores.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <button class="boton" type="submit">
        Empezar mi reto
      </button>
    </form>
  );
}

function Resumen() {
  const ruta = rutaActiva.value!;
  const progreso = progresoActivo.value!;
  const plan = planActivo.value!;
  const n = hoyNumero.value;
  const horizonte = progreso.config.horizonteDias;
  const avance = progresoGlobal(plan, progreso.completados);
  let situacion = `Día ${n} de ${horizonte}`;
  if (n < 1) situacion = `Tu reto empieza el ${progreso.config.fechaInicio}`;
  if (n > horizonte) situacion = "Terminaste el horizonte de tu reto";
  return (
    <section class="tarjeta">
      <p class="texto-tenue">Tu ruta</p>
      <h2>{ruta.nombre}</h2>
      <p>{situacion}</p>
      <p>{avance.porcentaje}% de las actividades completadas</p>
      <a class="boton" href={enlace("hoy/")}>
        Ir a Hoy
      </a>
    </section>
  );
}

export function Inicio() {
  return (
    <>
      <AvisoDatosDanados />
      {rutaActiva.value ? <Resumen /> : <ElegirRuta />}
    </>
  );
}

export default function IslaInicio() {
  return (
    <LimiteErrores origen="inicio">
      <Inicio />
    </LimiteErrores>
  );
}
```

#### `src/pages/index.astro` — reemplaza (contenido completo)

```astro
---
import Base from "../layouts/Base.astro";
import IslaInicio from "../components/Inicio";
---

<Base titulo="Inicio">
  <h1>Mentorix Calc — Reto de Estudio de 30 Días</h1>
  <p class="texto-tenue">
    Tu guía diaria: qué estudiar hoy y cómo usar los recursos de tu
    acompañamiento.
  </p>
  <IslaInicio client:only="preact">
    <p slot="fallback">Cargando tu reto…</p>
  </IslaInicio>
  <noscript>
    <p>Esta guía necesita JavaScript activado para guardar tu progreso.</p>
  </noscript>
</Base>
```

#### `tests/componentes/inicio.test.tsx` — nuevo

```tsx
import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Inicio } from "../../src/components/Inicio";
import { LimiteErrores } from "../../src/components/LimiteErrores";
import { CLAVE_ALMACEN } from "../../src/lib/progreso/estado";
import {
  datosDanados,
  estado,
  fechaHoy,
  recargarEstado,
} from "../../src/lib/progreso/store";

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-01";
});

describe("Inicio", () => {
  it("sin ruta activa muestra las cuatro rutas y la configuración inicial", () => {
    render(<Inicio />);
    for (const nombre of [
      "Cálculo Diferencial",
      "Cálculo Integral",
      "Cálculo Multivariable",
      "Ecuaciones Diferenciales",
    ]) {
      expect(
        screen.getByRole("radio", { name: new RegExp(nombre) }),
      ).toBeTruthy();
    }
    expect(
      (screen.getByLabelText("Fecha de inicio") as HTMLInputElement).value,
    ).toBe("2026-03-01");
    expect(
      (screen.getByLabelText("Duración del reto (días)") as HTMLInputElement)
        .value,
    ).toBe("30");
    expect(
      (screen.getByLabelText("Minutos de estudio por día") as HTMLInputElement)
        .value,
    ).toBe("120");
  });

  it("al empezar guarda la ruta en localStorage y muestra el resumen", () => {
    render(<Inicio />);
    fireEvent.click(screen.getByRole("radio", { name: /Cálculo Integral/ }));
    fireEvent.click(screen.getByRole("button", { name: "Empezar mi reto" }));
    expect(estado.value.rutaActiva).toBe("calculo-integral");
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);
    expect(guardado.rutas["calculo-integral"].config).toEqual({
      fechaInicio: "2026-03-01",
      horizonteDias: 30,
      minutosPorDia: 120,
      diaLigeroCada: 7,
      refuerzos: [],
    });
    expect(screen.getByText("Día 1 de 30")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ir a Hoy" })).toBeTruthy();
  });

  it("no empieza con una duración fuera de 7..120 y explica por qué", () => {
    render(<Inicio />);
    fireEvent.input(screen.getByLabelText("Duración del reto (días)"), {
      target: { value: "200" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Empezar mi reto" }));
    expect(estado.value.rutaActiva).toBeNull();
    expect(screen.getByRole("alert").textContent).toContain("entre 7 y 120");
  });

  it("con datos dañados ofrece descargarlos y empezar de nuevo sin borrarlos", () => {
    window.localStorage.setItem(CLAVE_ALMACEN, "{roto");
    recargarEstado();
    render(<Inicio />);
    expect(datosDanados.value).toBe("{roto");
    expect(
      screen.getByRole("button", { name: "Descargar datos dañados" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Empezar de nuevo" }));
    expect(datosDanados.value).toBeNull();
    expect(window.localStorage.getItem("mentorix-reto:v1:danado")).toBe(
      "{roto",
    );
  });
});

describe("LimiteErrores", () => {
  it("muestra un mensaje amable y el botón Exportar respaldo si una isla falla", () => {
    const consola = vi.spyOn(console, "error").mockImplementation(() => {});
    function Rota(): never {
      throw new Error("fallo de prueba");
    }
    render(
      <LimiteErrores origen="prueba">
        <Rota />
      </LimiteErrores>,
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "Algo salió mal en esta sección",
    );
    expect(
      screen.getByRole("button", { name: "Exportar respaldo" }),
    ).toBeTruthy();
    expect(
      consola.mock.calls.some((args) =>
        String(args[0]).includes('"origen":"prueba"'),
      ),
    ).toBe(true);
    consola.mockRestore();
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** Inicio renders with no active route **THE SYSTEM SHALL** show four radio options named after the four routes and the fields «Fecha de inicio» (today), «Duración del reto (días)» (30) and «Minutos de estudio por día» (120).
2. **WHEN** the student picks «Cálculo Integral» and presses «Empezar mi reto» **THE SYSTEM SHALL** save `rutaActiva: "calculo-integral"` with the default config under `mentorix-reto:v1` and show «Día 1 de 30» and the link «Ir a Hoy».
3. **WHEN** the duration is 200 **THE SYSTEM SHALL** not start the route and SHALL show an alert containing «entre 7 y 120».
4. **WHEN** the stored progress is corrupt **THE SYSTEM SHALL** offer «Descargar datos dañados» and «Empezar de nuevo» while keeping the raw text in `mentorix-reto:v1:danado`.
5. **WHEN** a child of `LimiteErrores` throws **THE SYSTEM SHALL** show «Algo salió mal en esta sección» with the button «Exportar respaldo» and log a JSON line containing `"origen":"prueba"` with `console.error`.
6. **WHEN** `npm run build` runs **THE SYSTEM SHALL** emit an `astro-island` in `dist/index.html` and `verificar-dist.mjs` SHALL print `verificar-dist: OK`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/componentes/inicio.test.tsx
npm test
npm run check
npm run build
grep -q '<astro-island' dist/index.html
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T1: Store, enlaces e isla de Inicio"
git tag step-08-inicio
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E2-T2` — Isla GuiaDia con los siete apartados y páginas Hoy y Día

**Depends on:** `E2-T1` · **Priority:** p0 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 9

Crea la guía del día (mismo componente para `/hoy/`, que usa la fecha de hoy, y `/dia/?n=<numero>`, que lee el parámetro): cabecera con día, fecha y tipo; Objetivo del día, Qué estudiar, Qué hacer, Repaso, Tiempo sugerido por bloque (una casilla por bloque con su ID estable y un contador `aria-live`), Cierre de sesión (lista + «Registrar dificultad» + «Reflexión del día») y Siguiente paso. Casos borde: antes del inicio muestra el día 1 con aviso; después del horizonte invita a extender; un `n` inexistente muestra «Ese día no existe en tu plan». Ejecuta `npm run format` antes de Verify.

**Files**
- `src/components/GuiaDia.tsx` — nuevo
- `src/pages/hoy/index.astro` — nuevo
- `src/pages/dia/index.astro` — nuevo
- `tests/componentes/guia-dia.test.tsx` — nuevo

Contenido exacto de cada archivo:

#### `src/components/GuiaDia.tsx` — nuevo

```tsx
import { useState } from "preact/hooks";
import { enlace, enlaceDia } from "../lib/enlaces";
import { formatearFecha } from "../lib/fechas";
import {
  guardarReflexion,
  marcarBloque,
  registrarDificultad,
} from "../lib/progreso/acciones";
import {
  actualizar,
  fechaHoy,
  hoyNumero,
  nuevoId,
  planActivo,
  progresoActivo,
  rutaActiva,
} from "../lib/progreso/store";
import type { Dia, Ruta, TipoDia } from "../lib/tipos";
import { LimiteErrores } from "./LimiteErrores";

export const ETIQUETAS_TIPO: Record<TipoDia, string> = {
  estudio: "Estudio",
  refuerzo: "Refuerzo",
  evaluacion: "Evaluación",
  correccion: "Corrección",
  repaso: "Repaso",
  simulacro: "Simulacro",
};

interface Props {
  /** Día a mostrar. Si falta, se usa `?n=` (si leerUrl) o el día de hoy. */
  numero?: number;
  leerUrl?: boolean;
}

function RegistrarDificultad({ ruta, dia }: { ruta: Ruta; dia: Dia }) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [subtema, setSubtema] = useState(dia.subtemaSlug ?? "");
  const [mensaje, setMensaje] = useState("");

  function guardar(evento: Event) {
    evento.preventDefault();
    let error: Error | null = null;
    actualizar((e) => {
      const r = registrarDificultad(e, ruta.slug, {
        id: nuevoId(),
        fecha: fechaHoy.value,
        subtemaSlug: subtema === "" ? null : subtema,
        texto,
        resuelta: false,
      });
      if (r instanceof Error) {
        error = r;
        return e;
      }
      return r;
    });
    if (error) {
      setMensaje((error as Error).message);
      return;
    }
    setTexto("");
    setAbierto(false);
    setMensaje("Dificultad registrada.");
  }

  return (
    <div>
      {!abierto && (
        <button
          class="boton boton--secundario"
          type="button"
          onClick={() => setAbierto(true)}
        >
          Registrar dificultad
        </button>
      )}
      {abierto && (
        <form onSubmit={guardar}>
          <div class="campo">
            <label for={`dificultad-${dia.numero}`}>
              Describe la dificultad o el error
            </label>
            <textarea
              id={`dificultad-${dia.numero}`}
              value={texto}
              onInput={(e) => setTexto(e.currentTarget.value)}
            />
          </div>
          <div class="campo">
            <label for={`subtema-${dia.numero}`}>Subtema relacionado</label>
            <select
              id={`subtema-${dia.numero}`}
              value={subtema}
              onChange={(e) => setSubtema(e.currentTarget.value)}
            >
              <option value="">Ninguno en particular</option>
              {ruta.temas
                .flatMap((t) => t.subtemas)
                .map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.nombre}
                  </option>
                ))}
            </select>
          </div>
          <button class="boton" type="submit">
            Guardar dificultad
          </button>
        </form>
      )}
      <p role="status">{mensaje}</p>
    </div>
  );
}

function Reflexion({ ruta, dia }: { ruta: Ruta; dia: Dia }) {
  const guardada = progresoActivo.value?.reflexiones[String(dia.numero)] ?? "";
  const [texto, setTexto] = useState(guardada);
  const [mensaje, setMensaje] = useState("");
  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault();
        actualizar((e) => guardarReflexion(e, ruta.slug, dia.numero, texto));
        setMensaje("Reflexión guardada.");
      }}
    >
      <div class="campo">
        <label for={`reflexion-${dia.numero}`}>Reflexión del día</label>
        <textarea
          id={`reflexion-${dia.numero}`}
          value={texto}
          onInput={(e) => setTexto(e.currentTarget.value)}
        />
      </div>
      <button class="boton boton--secundario" type="submit">
        Guardar reflexión
      </button>
      <p role="status">{mensaje}</p>
    </form>
  );
}

function numeroPedido(props: Props): number | null {
  if (props.numero !== undefined) return props.numero;
  if (props.leerUrl) {
    const n = Number(new URLSearchParams(window.location.search).get("n"));
    return Number.isInteger(n) ? n : NaN;
  }
  return null;
}

export function GuiaDia(props: Props) {
  const ruta = rutaActiva.value;
  const progreso = progresoActivo.value;
  const plan = planActivo.value;
  if (!ruta || !progreso || !plan) {
    return (
      <section class="tarjeta">
        <h2>Todavía no eliges una ruta</h2>
        <a class="boton" href={enlace("")}>
          Elegir mi ruta
        </a>
      </section>
    );
  }

  const horizonte = plan.dias.length;
  const pedido = numeroPedido(props);
  let n = pedido ?? hoyNumero.value;
  let aviso = "";
  if (pedido === null && n < 1) {
    aviso = `Tu reto empieza el ${formatearFecha(progreso.config.fechaInicio)}. Esto es lo que harás el día 1.`;
    n = 1;
  }
  if (pedido === null && n > horizonte) {
    return (
      <section class="tarjeta">
        <h2>Terminaste los {horizonte} días de tu reto</h2>
        <p>Revisa tu progreso o extiende la ruta para seguir estudiando.</p>
        <a class="boton" href={enlace("ajustes/")}>
          Extender la ruta
        </a>
      </section>
    );
  }
  const dia = plan.dias[n - 1];
  if (!dia) {
    return (
      <section class="tarjeta">
        <h2>Ese día no existe en tu plan</h2>
        <a class="boton" href={enlace("calendario/")}>
          Ir al calendario
        </a>
      </section>
    );
  }

  const completados = progreso.completados;
  const hechos = dia.bloques.filter((b) => b.id in completados).length;
  const totalMinutos = dia.bloques.reduce((t, b) => t + b.minutos, 0);

  return (
    <article class={`guia tipo-${dia.tipo}`}>
      {aviso && <p class="tarjeta">{aviso}</p>}
      <header class="tarjeta">
        <p class="texto-tenue">
          {ruta.nombre} ·{" "}
          <span class="insignia">{ETIQUETAS_TIPO[dia.tipo]}</span>
        </p>
        <h2>
          Día {dia.numero} · {formatearFecha(dia.fecha)}
        </h2>
        <p>{dia.titulo}</p>
      </header>

      <section class="tarjeta">
        <h3>Objetivo del día</h3>
        <p>{dia.objetivo}</p>
        <h3>Qué estudiar</h3>
        <p>{dia.queEstudiar}</p>
        <h3>Qué hacer</h3>
        <p>{dia.queHacer}</p>
        <h3>Repaso</h3>
        {dia.repaso.length > 0 ? (
          <ul>
            {dia.repaso.map((texto) => (
              <li key={texto}>{texto}</li>
            ))}
          </ul>
        ) : (
          <p>Hoy no hay repasos programados.</p>
        )}
      </section>

      <section class="tarjeta">
        <h3>Tiempo sugerido por bloque</h3>
        <p class="texto-tenue">Total: {totalMinutos} min</p>
        <ul class="bloques">
          {dia.bloques.map((bloque) => (
            <li key={bloque.id}>
              <label>
                <input
                  type="checkbox"
                  checked={bloque.id in completados}
                  onChange={(e) => {
                    const hecho = e.currentTarget.checked;
                    actualizar((estado) =>
                      marcarBloque(
                        estado,
                        ruta.slug,
                        bloque.id,
                        hecho,
                        new Date().toISOString(),
                      ),
                    );
                  }}
                />
                <strong>
                  {bloque.titulo} · {bloque.minutos} min
                </strong>
              </label>
              <p class="texto-tenue">{bloque.instruccion}</p>
            </li>
          ))}
        </ul>
        <p aria-live="polite">
          {hechos} de {dia.bloques.length} bloques completados
        </p>
      </section>

      <section class="tarjeta">
        <h3>Cierre de sesión</h3>
        <ul>
          {dia.cierre.map((texto) => (
            <li key={texto}>{texto}</li>
          ))}
        </ul>
        <RegistrarDificultad ruta={ruta} dia={dia} />
        <Reflexion key={dia.numero} ruta={ruta} dia={dia} />
      </section>

      <section class="tarjeta">
        <h3>Siguiente paso</h3>
        <p>{dia.siguientePaso}</p>
        {dia.numero < horizonte && (
          <a href={enlaceDia(dia.numero + 1)}>Ver el día {dia.numero + 1}</a>
        )}
      </section>
    </article>
  );
}

export default function IslaGuiaDia(props: Props) {
  return (
    <LimiteErrores origen="guia-dia">
      <GuiaDia {...props} />
    </LimiteErrores>
  );
}
```

#### `src/pages/hoy/index.astro` — nuevo

```astro
---
import Base from "../../layouts/Base.astro";
import IslaGuiaDia from "../../components/GuiaDia";
---

<Base titulo="Hoy" seccion="hoy">
  <h1>Tu guía de hoy</h1>
  <IslaGuiaDia client:only="preact">
    <p slot="fallback">Cargando tu guía de hoy…</p>
  </IslaGuiaDia>
</Base>
```

#### `src/pages/dia/index.astro` — nuevo

```astro
---
import Base from "../../layouts/Base.astro";
import IslaGuiaDia from "../../components/GuiaDia";
---

<Base titulo="Detalle del día" seccion="calendario">
  <h1>Detalle del día</h1>
  <IslaGuiaDia client:only="preact" leerUrl>
    <p slot="fallback">Cargando el día…</p>
  </IslaGuiaDia>
</Base>
```

#### `tests/componentes/guia-dia.test.tsx` — nuevo

```tsx
import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { GuiaDia } from "../../src/components/GuiaDia";
import { configInicial } from "../../src/lib/plan/ajustes";
import { activarRuta } from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN } from "../../src/lib/progreso/estado";
import {
  actualizar,
  estado,
  fechaHoy,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-01";
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
});

const guardado = () => JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);

describe("GuiaDia", () => {
  it("muestra los siete apartados del día de hoy", () => {
    render(<GuiaDia />);
    for (const titulo of [
      "Objetivo del día",
      "Qué estudiar",
      "Qué hacer",
      "Repaso",
      "Tiempo sugerido por bloque",
      "Cierre de sesión",
      "Siguiente paso",
    ]) {
      expect(screen.getByRole("heading", { name: titulo })).toBeTruthy();
    }
    expect(
      screen.getByText(
        "Comprender y practicar «Dominio y rango de funciones reales».",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Hoy no hay repasos programados.")).toBeTruthy();
    expect(screen.getAllByRole("checkbox")).toHaveLength(7);
  });

  it("marcar un bloque lo guarda con su ID estable y actualiza el contador", () => {
    render(<GuiaDia />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Teoría · 30 min" }));
    expect(Object.keys(guardado().rutas[RUTA].completados)).toEqual([
      "calculo-diferencial:estudio:dominio-y-rango#1:teoria",
    ]);
    expect(screen.getByText("1 de 7 bloques completados")).toBeTruthy();
    expect(guardado().rutas[RUTA].dominio).toEqual({});
  });

  it("registra una dificultad y rechaza una vacía", () => {
    render(<GuiaDia />);
    fireEvent.click(
      screen.getByRole("button", { name: "Registrar dificultad" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Guardar dificultad" }));
    expect(estado.value.rutas[RUTA]!.dificultades).toHaveLength(0);
    expect(
      screen.getByText("Describe la dificultad o el error antes de guardarlo."),
    ).toBeTruthy();
    fireEvent.input(
      screen.getByLabelText("Describe la dificultad o el error"),
      {
        target: { value: "No entiendo el dominio de raíces" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "Guardar dificultad" }));
    const dificultades = guardado().rutas[RUTA].dificultades;
    expect(dificultades).toHaveLength(1);
    expect(dificultades[0].subtemaSlug).toBe("dominio-y-rango");
    expect(dificultades[0].resuelta).toBe(false);
  });

  it("guarda la reflexión del día", () => {
    render(<GuiaDia />);
    fireEvent.input(screen.getByLabelText("Reflexión del día"), {
      target: { value: "Hoy entendí el dominio" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar reflexión" }));
    expect(guardado().rutas[RUTA].reflexiones).toEqual({
      "1": "Hoy entendí el dominio",
    });
  });

  it("muestra cualquier día por número y avisa si no existe", () => {
    const { unmount } = render(<GuiaDia numero={2} />);
    expect(
      screen.getByText(
        "Comprender y practicar «Gráficas de funciones elementales y transformaciones» (día 1 de 2).",
      ),
    ).toBeTruthy();
    unmount();
    render(<GuiaDia numero={99} />);
    expect(
      screen.getByRole("heading", { name: "Ese día no existe en tu plan" }),
    ).toBeTruthy();
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** GuiaDia renders day 1 of `calculo-diferencial` starting `2026-03-01` **THE SYSTEM SHALL** show the headings «Objetivo del día», «Qué estudiar», «Qué hacer», «Repaso», «Tiempo sugerido por bloque», «Cierre de sesión» and «Siguiente paso», the objective «Comprender y practicar «Dominio y rango de funciones reales».» and 7 checkboxes.
2. **WHEN** the checkbox «Teoría · 30 min» is clicked **THE SYSTEM SHALL** save `calculo-diferencial:estudio:dominio-y-rango#1:teoria` in `completados`, show «1 de 7 bloques completados» and leave `dominio` empty.
3. **WHEN** «Guardar dificultad» is pressed with a blank description **THE SYSTEM SHALL** save nothing and show «Describe la dificultad o el error antes de guardarlo.»; with text it SHALL save one open difficulty linked to `dominio-y-rango`.
4. **WHEN** «Guardar reflexión» is pressed **THE SYSTEM SHALL** save the text under key `"1"` in `reflexiones`.
5. **WHEN** GuiaDia receives `numero={2}` **THE SYSTEM SHALL** show day 2, and with `numero={99}` it SHALL show «Ese día no existe en tu plan».
6. **WHEN** `npm run build` runs **THE SYSTEM SHALL** write `dist/hoy/index.html` and `dist/dia/index.html` and `verificar-dist.mjs` SHALL print `verificar-dist: OK`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/componentes/guia-dia.test.tsx
npm test
npm run check
npm run build
test -f dist/hoy/index.html
test -f dist/dia/index.html
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T2: Isla GuiaDia con los siete apartados y páginas Hoy y Día"
git tag step-09-guia-dia
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E2-T3` — Calendario y «Para después del horizonte»

**Depends on:** `E2-T2` · **Priority:** p1 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 10

Crea la rejilla de días (cada uno enlaza a `/dia/?n=` y muestra fecha, tipo y estado: «Hoy», «Completado», «En curso», «Próximo» o «Pendiente», en `data-estado`) y la sección «Para después del horizonte» con los subtemas que no caben, los días de estudio que faltan y los botones «Extender 7 días» y «Extender 14 días». Ejecuta `npm run format` antes de Verify.

**Files**
- `src/components/Calendario.tsx` — nuevo
- `src/pages/calendario/index.astro` — nuevo
- `tests/componentes/calendario.test.tsx` — nuevo

Contenido exacto de cada archivo:

#### `src/components/Calendario.tsx` — nuevo

```tsx
import { useState } from "preact/hooks";
import { enlace, enlaceDia } from "../lib/enlaces";
import { formatearFecha } from "../lib/fechas";
import { extenderHorizonte } from "../lib/plan/ajustes";
import { actualizarConfig } from "../lib/progreso/acciones";
import { estadoDelDia, posicionDelDia } from "../lib/progreso/derivados";
import {
  actualizar,
  hoyNumero,
  planActivo,
  progresoActivo,
  rutaActiva,
} from "../lib/progreso/store";
import type { Dia } from "../lib/tipos";
import { ETIQUETAS_TIPO } from "./GuiaDia";
import { LimiteErrores } from "./LimiteErrores";

export function etiquetaEstado(
  dia: Dia,
  completados: Record<string, string>,
  hoy: number,
): string {
  const posicion = posicionDelDia(dia.numero, hoy);
  const estado = estadoDelDia(dia, completados);
  if (posicion === "hoy") return "Hoy";
  if (estado === "completado") return "Completado";
  if (estado === "parcial") return "En curso";
  return posicion === "futuro" ? "Próximo" : "Pendiente";
}

export function Calendario() {
  const [error, setError] = useState("");
  const ruta = rutaActiva.value;
  const progreso = progresoActivo.value;
  const plan = planActivo.value;
  if (!ruta || !progreso || !plan) {
    return (
      <section class="tarjeta">
        <h2>Todavía no eliges una ruta</h2>
        <a class="boton" href={enlace("")}>
          Elegir mi ruta
        </a>
      </section>
    );
  }

  function extender(dias: number) {
    try {
      const config = extenderHorizonte(progreso!.config, dias);
      actualizar((e) => actualizarConfig(e, ruta!.slug, config));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const pendientes = plan.fueraDelHorizonte;
  const diasPendientes = pendientes.reduce((t, s) => t + s.diasEstimados, 0);

  return (
    <>
      <section class="tarjeta">
        <h2>
          {ruta.nombre} — {plan.dias.length} días
        </h2>
        <ol class="calendario">
          {plan.dias.map((dia) => {
            const etiqueta = etiquetaEstado(
              dia,
              progreso.completados,
              hoyNumero.value,
            );
            return (
              <li
                key={dia.numero}
                class={`calendario__dia tipo-${dia.tipo}`}
                data-estado={etiqueta}
              >
                <a href={enlaceDia(dia.numero)}>
                  <strong>Día {dia.numero}</strong>
                  <span class="texto-tenue">
                    {" "}
                    · {formatearFecha(dia.fecha)}
                  </span>
                  <br />
                  <span>{ETIQUETAS_TIPO[dia.tipo]}</span> ·{" "}
                  <span>{etiqueta}</span>
                  <br />
                  <span class="texto-tenue">{dia.titulo}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </section>

      <section class="tarjeta">
        <h2>Para después del horizonte</h2>
        {pendientes.length === 0 ? (
          <p>Todo tu contenido cabe en el horizonte actual.</p>
        ) : (
          <>
            <p>
              Estos subtemas no caben completos en tu plan. Nada se comprime:
              necesitas {diasPendientes} días de estudio más (sin contar
              evaluaciones ni días de repaso).
            </p>
            <ul>
              {pendientes.map((s) => (
                <li key={s.subtemaSlug}>
                  {s.nombre} ({s.diasEstimados}{" "}
                  {s.diasEstimados === 1 ? "día" : "días"})
                </li>
              ))}
            </ul>
          </>
        )}
        <p>
          <button class="boton" type="button" onClick={() => extender(7)}>
            Extender 7 días
          </button>{" "}
          <button class="boton" type="button" onClick={() => extender(14)}>
            Extender 14 días
          </button>
        </p>
        <p role="alert">{error}</p>
      </section>
    </>
  );
}

export default function IslaCalendario() {
  return (
    <LimiteErrores origen="calendario">
      <Calendario />
    </LimiteErrores>
  );
}
```

#### `src/pages/calendario/index.astro` — nuevo

```astro
---
import Base from "../../layouts/Base.astro";
import IslaCalendario from "../../components/Calendario";
---

<Base titulo="Calendario" seccion="calendario">
  <h1>Calendario</h1>
  <IslaCalendario client:only="preact">
    <p slot="fallback">Cargando tu calendario…</p>
  </IslaCalendario>
</Base>
```

#### `tests/componentes/calendario.test.tsx` — nuevo

```tsx
import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { Calendario } from "../../src/components/Calendario";
import { configInicial } from "../../src/lib/plan/ajustes";
import { activarRuta, marcarBloque } from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN } from "../../src/lib/progreso/estado";
import {
  actualizar,
  fechaHoy,
  planActivo,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-02";
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
});

const dias = () =>
  screen
    .getAllByRole("listitem")
    .filter((li) => li.classList.contains("calendario__dia"));

describe("Calendario", () => {
  it("muestra un día por cada día del horizonte con su tipo y estado", () => {
    for (const bloque of planActivo.value!.dias[0]!.bloques) {
      actualizar((e) =>
        marcarBloque(e, RUTA, bloque.id, true, "2026-03-01T10:00:00.000Z"),
      );
    }
    render(<Calendario />);
    const items = dias();
    expect(items).toHaveLength(30);
    expect(items[0]!.dataset.estado).toBe("Completado");
    expect(items[1]!.dataset.estado).toBe("Hoy");
    expect(items[2]!.dataset.estado).toBe("Próximo");
    expect(items[6]!.textContent).toContain("Repaso");
    expect(
      screen.getByRole("link", { name: /^Día 3 / }).getAttribute("href"),
    ).toBe("/dia/?n=3");
  });

  it("lista lo que no cabe en «Para después del horizonte»", () => {
    render(<Calendario />);
    expect(
      screen.getByRole("heading", { name: "Para después del horizonte" }),
    ).toBeTruthy();
    expect(screen.getByText("Reglas de derivación (2 días)")).toBeTruthy();
    expect(screen.getByText("Problemas de optimización (2 días)")).toBeTruthy();
  });

  it("extiende 14 días y guarda el nuevo horizonte", () => {
    render(<Calendario />);
    fireEvent.click(screen.getByRole("button", { name: "Extender 14 días" }));
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);
    expect(guardado.rutas[RUTA].config.horizonteDias).toBe(44);
    expect(dias()).toHaveLength(44);
  });

  it("no extiende más allá de 120 días y lo explica", () => {
    actualizar((e) =>
      activarRuta({ ...e, rutas: {} }, RUTA, {
        ...configInicial("2026-03-01"),
        horizonteDias: 115,
      }),
    );
    render(<Calendario />);
    fireEvent.click(screen.getByRole("button", { name: "Extender 7 días" }));
    expect(screen.getByRole("alert").textContent).toBe(
      "La duración debe estar entre 7 y 120 días.",
    );
    expect(dias()).toHaveLength(115);
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** the calendar renders a 30-day plan with day 1 completed and today being day 2 **THE SYSTEM SHALL** show 30 days whose `data-estado` is «Completado» for day 1, «Hoy» for day 2 and «Próximo» for day 3, with day 7 labelled «Repaso».
2. **WHEN** a day is listed **THE SYSTEM SHALL** link it to `/dia/?n=<numero>` built with the site base.
3. **WHEN** subtopics do not fit **THE SYSTEM SHALL** list them under «Para después del horizonte», for example «Reglas de derivación (2 días)».
4. **WHEN** «Extender 14 días» is pressed **THE SYSTEM SHALL** save `horizonteDias: 44` and render 44 days.
5. **WHEN** an extension would exceed 120 days **THE SYSTEM SHALL** keep the plan unchanged and show «La duración debe estar entre 7 y 120 días.».

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/componentes/calendario.test.tsx
npm test
npm run check
npm run build
test -f dist/calendario/index.html
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T3: Calendario y «Para después del horizonte»"
git tag step-10-calendario
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E2-T4` — Exámenes externos y diario de dificultades

**Depends on:** `E2-T2` · **Priority:** p1 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 11

Crea el formulario de resultado de examen externo (nota, nota máxima opcional, errores identificados, temas a reforzar; uno por día, se reemplaza al volver a guardar) y el diario de dificultades (abiertas primero, casilla «Resuelta»). Reemplaza `src/components/GuiaDia.tsx` para mostrar el formulario solo en días `evaluacion` o `simulacro`. El diario se monta en Progreso (paso 12). Ejecuta `npm run format` antes de Verify.

**Files**
- `src/components/FormularioEvaluacion.tsx` — nuevo
- `src/components/DiarioDificultades.tsx` — nuevo
- `src/components/GuiaDia.tsx` — reemplaza (contenido completo)
- `tests/componentes/evaluaciones.test.tsx` — nuevo

Contenido exacto de cada archivo:

#### `src/components/FormularioEvaluacion.tsx` — nuevo

```tsx
import { useState } from "preact/hooks";
import { registrarEvaluacion } from "../lib/progreso/acciones";
import {
  actualizar,
  fechaHoy,
  nuevoId,
  progresoActivo,
} from "../lib/progreso/store";
import type { Dia, Ruta } from "../lib/tipos";

function aNumero(texto: string): number | null {
  return texto.trim() === "" ? null : Number(texto);
}

/** Resultado de un examen externo; solo se muestra en días de evaluación o simulacro. */
export function FormularioEvaluacion({ ruta, dia }: { ruta: Ruta; dia: Dia }) {
  const previa = progresoActivo.value?.evaluaciones.find(
    (e) => e.diaNumero === dia.numero,
  );
  const [nota, setNota] = useState(previa?.nota?.toString() ?? "");
  const [notaMaxima, setNotaMaxima] = useState(
    previa?.notaMaxima?.toString() ?? "",
  );
  const [errores, setErrores] = useState(previa?.errores ?? "");
  const [temas, setTemas] = useState<string[]>(previa?.temasAReforzar ?? []);
  const [mensaje, setMensaje] = useState("");
  const [fallo, setFallo] = useState("");

  function guardar(evento: Event) {
    evento.preventDefault();
    let error: Error | null = null;
    actualizar((e) => {
      const r = registrarEvaluacion(e, ruta.slug, {
        id: previa?.id ?? nuevoId(),
        diaNumero: dia.numero,
        temaSlug: dia.temaSlug,
        fecha: fechaHoy.value,
        nota: aNumero(nota),
        notaMaxima: aNumero(notaMaxima),
        errores: errores.trim(),
        temasAReforzar: temas,
      });
      if (r instanceof Error) {
        error = r;
        return e;
      }
      return r;
    });
    if (error) {
      setFallo((error as Error).message);
      setMensaje("");
    } else {
      setFallo("");
      setMensaje("Resultado guardado.");
    }
  }

  return (
    <section class="tarjeta">
      <h3>Resultado de tu examen</h3>
      <p class="texto-tenue">
        Registra la nota del examen que hiciste con tus recursos. Esto no cambia
        tu dominio: eso lo declaras tú en Progreso.
      </p>
      <form onSubmit={guardar} noValidate>
        <div class="campo">
          <label for={`nota-${dia.numero}`}>Nota obtenida</label>
          <input
            id={`nota-${dia.numero}`}
            type="number"
            min={0}
            step="any"
            value={nota}
            onInput={(e) => setNota(e.currentTarget.value)}
          />
        </div>
        <div class="campo">
          <label for={`nota-maxima-${dia.numero}`}>
            Nota máxima (opcional)
          </label>
          <input
            id={`nota-maxima-${dia.numero}`}
            type="number"
            min={1}
            step="any"
            value={notaMaxima}
            onInput={(e) => setNotaMaxima(e.currentTarget.value)}
          />
        </div>
        <div class="campo">
          <label for={`errores-${dia.numero}`}>Errores identificados</label>
          <textarea
            id={`errores-${dia.numero}`}
            value={errores}
            onInput={(e) => setErrores(e.currentTarget.value)}
          />
        </div>
        <fieldset>
          <legend>Temas a reforzar</legend>
          {ruta.temas.map((tema) => (
            <label key={tema.slug}>
              <input
                type="checkbox"
                checked={temas.includes(tema.slug)}
                onChange={(e) => {
                  const marcado = e.currentTarget.checked;
                  setTemas((actuales) =>
                    marcado
                      ? [...actuales, tema.slug]
                      : actuales.filter((t) => t !== tema.slug),
                  );
                }}
              />{" "}
              {tema.nombre}
            </label>
          ))}
        </fieldset>
        <button class="boton" type="submit">
          Guardar resultado
        </button>
      </form>
      {fallo && <p role="alert">{fallo}</p>}
      <p role="status">{mensaje}</p>
    </section>
  );
}
```

#### `src/components/DiarioDificultades.tsx` — nuevo

```tsx
import { formatearFecha } from "../lib/fechas";
import { resolverDificultad } from "../lib/progreso/acciones";
import { actualizar, progresoActivo } from "../lib/progreso/store";
import type { Ruta } from "../lib/tipos";

/** Diario de dificultades y errores: abiertas primero, cada una se puede marcar resuelta. */
export function DiarioDificultades({ ruta }: { ruta: Ruta }) {
  const dificultades = progresoActivo.value?.dificultades ?? [];
  const nombres = new Map(
    ruta.temas.flatMap((t) => t.subtemas).map((s) => [s.slug, s.nombre]),
  );
  const ordenadas = [
    ...dificultades.filter((d) => !d.resuelta),
    ...dificultades.filter((d) => d.resuelta),
  ];
  return (
    <section class="tarjeta">
      <h2>Diario de dificultades y errores</h2>
      {ordenadas.length === 0 ? (
        <p>
          Aún no registras dificultades. Puedes hacerlo desde el cierre de cada
          día.
        </p>
      ) : (
        <ul>
          {ordenadas.map((d) => (
            <li key={d.id}>
              <label>
                <input
                  type="checkbox"
                  checked={d.resuelta}
                  aria-label={`Resuelta: ${d.texto}`}
                  onChange={(e) => {
                    const resuelta = e.currentTarget.checked;
                    actualizar((estado) =>
                      resolverDificultad(estado, ruta.slug, d.id, resuelta),
                    );
                  }}
                />{" "}
                {d.texto}
              </label>
              <p class="texto-tenue">
                {formatearFecha(d.fecha)}
                {d.subtemaSlug
                  ? ` · ${nombres.get(d.subtemaSlug) ?? d.subtemaSlug}`
                  : ""}
                {d.resuelta ? " · Resuelta" : " · Abierta"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

#### `src/components/GuiaDia.tsx` — reemplaza (contenido completo)

```tsx
import { useState } from "preact/hooks";
import { enlace, enlaceDia } from "../lib/enlaces";
import { formatearFecha } from "../lib/fechas";
import {
  guardarReflexion,
  marcarBloque,
  registrarDificultad,
} from "../lib/progreso/acciones";
import {
  actualizar,
  fechaHoy,
  hoyNumero,
  nuevoId,
  planActivo,
  progresoActivo,
  rutaActiva,
} from "../lib/progreso/store";
import type { Dia, Ruta, TipoDia } from "../lib/tipos";
import { FormularioEvaluacion } from "./FormularioEvaluacion";
import { LimiteErrores } from "./LimiteErrores";

export const ETIQUETAS_TIPO: Record<TipoDia, string> = {
  estudio: "Estudio",
  refuerzo: "Refuerzo",
  evaluacion: "Evaluación",
  correccion: "Corrección",
  repaso: "Repaso",
  simulacro: "Simulacro",
};

interface Props {
  /** Día a mostrar. Si falta, se usa `?n=` (si leerUrl) o el día de hoy. */
  numero?: number;
  leerUrl?: boolean;
}

function RegistrarDificultad({ ruta, dia }: { ruta: Ruta; dia: Dia }) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [subtema, setSubtema] = useState(dia.subtemaSlug ?? "");
  const [mensaje, setMensaje] = useState("");

  function guardar(evento: Event) {
    evento.preventDefault();
    let error: Error | null = null;
    actualizar((e) => {
      const r = registrarDificultad(e, ruta.slug, {
        id: nuevoId(),
        fecha: fechaHoy.value,
        subtemaSlug: subtema === "" ? null : subtema,
        texto,
        resuelta: false,
      });
      if (r instanceof Error) {
        error = r;
        return e;
      }
      return r;
    });
    if (error) {
      setMensaje((error as Error).message);
      return;
    }
    setTexto("");
    setAbierto(false);
    setMensaje("Dificultad registrada.");
  }

  return (
    <div>
      {!abierto && (
        <button
          class="boton boton--secundario"
          type="button"
          onClick={() => setAbierto(true)}
        >
          Registrar dificultad
        </button>
      )}
      {abierto && (
        <form onSubmit={guardar}>
          <div class="campo">
            <label for={`dificultad-${dia.numero}`}>
              Describe la dificultad o el error
            </label>
            <textarea
              id={`dificultad-${dia.numero}`}
              value={texto}
              onInput={(e) => setTexto(e.currentTarget.value)}
            />
          </div>
          <div class="campo">
            <label for={`subtema-${dia.numero}`}>Subtema relacionado</label>
            <select
              id={`subtema-${dia.numero}`}
              value={subtema}
              onChange={(e) => setSubtema(e.currentTarget.value)}
            >
              <option value="">Ninguno en particular</option>
              {ruta.temas
                .flatMap((t) => t.subtemas)
                .map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.nombre}
                  </option>
                ))}
            </select>
          </div>
          <button class="boton" type="submit">
            Guardar dificultad
          </button>
        </form>
      )}
      <p role="status">{mensaje}</p>
    </div>
  );
}

function Reflexion({ ruta, dia }: { ruta: Ruta; dia: Dia }) {
  const guardada = progresoActivo.value?.reflexiones[String(dia.numero)] ?? "";
  const [texto, setTexto] = useState(guardada);
  const [mensaje, setMensaje] = useState("");
  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault();
        actualizar((e) => guardarReflexion(e, ruta.slug, dia.numero, texto));
        setMensaje("Reflexión guardada.");
      }}
    >
      <div class="campo">
        <label for={`reflexion-${dia.numero}`}>Reflexión del día</label>
        <textarea
          id={`reflexion-${dia.numero}`}
          value={texto}
          onInput={(e) => setTexto(e.currentTarget.value)}
        />
      </div>
      <button class="boton boton--secundario" type="submit">
        Guardar reflexión
      </button>
      <p role="status">{mensaje}</p>
    </form>
  );
}

function numeroPedido(props: Props): number | null {
  if (props.numero !== undefined) return props.numero;
  if (props.leerUrl) {
    const n = Number(new URLSearchParams(window.location.search).get("n"));
    return Number.isInteger(n) ? n : NaN;
  }
  return null;
}

export function GuiaDia(props: Props) {
  const ruta = rutaActiva.value;
  const progreso = progresoActivo.value;
  const plan = planActivo.value;
  if (!ruta || !progreso || !plan) {
    return (
      <section class="tarjeta">
        <h2>Todavía no eliges una ruta</h2>
        <a class="boton" href={enlace("")}>
          Elegir mi ruta
        </a>
      </section>
    );
  }

  const horizonte = plan.dias.length;
  const pedido = numeroPedido(props);
  let n = pedido ?? hoyNumero.value;
  let aviso = "";
  if (pedido === null && n < 1) {
    aviso = `Tu reto empieza el ${formatearFecha(progreso.config.fechaInicio)}. Esto es lo que harás el día 1.`;
    n = 1;
  }
  if (pedido === null && n > horizonte) {
    return (
      <section class="tarjeta">
        <h2>Terminaste los {horizonte} días de tu reto</h2>
        <p>Revisa tu progreso o extiende la ruta para seguir estudiando.</p>
        <a class="boton" href={enlace("ajustes/")}>
          Extender la ruta
        </a>
      </section>
    );
  }
  const dia = plan.dias[n - 1];
  if (!dia) {
    return (
      <section class="tarjeta">
        <h2>Ese día no existe en tu plan</h2>
        <a class="boton" href={enlace("calendario/")}>
          Ir al calendario
        </a>
      </section>
    );
  }

  const completados = progreso.completados;
  const hechos = dia.bloques.filter((b) => b.id in completados).length;
  const totalMinutos = dia.bloques.reduce((t, b) => t + b.minutos, 0);

  return (
    <article class={`guia tipo-${dia.tipo}`}>
      {aviso && <p class="tarjeta">{aviso}</p>}
      <header class="tarjeta">
        <p class="texto-tenue">
          {ruta.nombre} ·{" "}
          <span class="insignia">{ETIQUETAS_TIPO[dia.tipo]}</span>
        </p>
        <h2>
          Día {dia.numero} · {formatearFecha(dia.fecha)}
        </h2>
        <p>{dia.titulo}</p>
      </header>

      <section class="tarjeta">
        <h3>Objetivo del día</h3>
        <p>{dia.objetivo}</p>
        <h3>Qué estudiar</h3>
        <p>{dia.queEstudiar}</p>
        <h3>Qué hacer</h3>
        <p>{dia.queHacer}</p>
        <h3>Repaso</h3>
        {dia.repaso.length > 0 ? (
          <ul>
            {dia.repaso.map((texto) => (
              <li key={texto}>{texto}</li>
            ))}
          </ul>
        ) : (
          <p>Hoy no hay repasos programados.</p>
        )}
      </section>

      {(dia.tipo === "evaluacion" || dia.tipo === "simulacro") && (
        <FormularioEvaluacion key={dia.numero} ruta={ruta} dia={dia} />
      )}

      <section class="tarjeta">
        <h3>Tiempo sugerido por bloque</h3>
        <p class="texto-tenue">Total: {totalMinutos} min</p>
        <ul class="bloques">
          {dia.bloques.map((bloque) => (
            <li key={bloque.id}>
              <label>
                <input
                  type="checkbox"
                  checked={bloque.id in completados}
                  onChange={(e) => {
                    const hecho = e.currentTarget.checked;
                    actualizar((estado) =>
                      marcarBloque(
                        estado,
                        ruta.slug,
                        bloque.id,
                        hecho,
                        new Date().toISOString(),
                      ),
                    );
                  }}
                />
                <strong>
                  {bloque.titulo} · {bloque.minutos} min
                </strong>
              </label>
              <p class="texto-tenue">{bloque.instruccion}</p>
            </li>
          ))}
        </ul>
        <p aria-live="polite">
          {hechos} de {dia.bloques.length} bloques completados
        </p>
      </section>

      <section class="tarjeta">
        <h3>Cierre de sesión</h3>
        <ul>
          {dia.cierre.map((texto) => (
            <li key={texto}>{texto}</li>
          ))}
        </ul>
        <RegistrarDificultad ruta={ruta} dia={dia} />
        <Reflexion key={dia.numero} ruta={ruta} dia={dia} />
      </section>

      <section class="tarjeta">
        <h3>Siguiente paso</h3>
        <p>{dia.siguientePaso}</p>
        {dia.numero < horizonte && (
          <a href={enlaceDia(dia.numero + 1)}>Ver el día {dia.numero + 1}</a>
        )}
      </section>
    </article>
  );
}

export default function IslaGuiaDia(props: Props) {
  return (
    <LimiteErrores origen="guia-dia">
      <GuiaDia {...props} />
    </LimiteErrores>
  );
}
```

#### `tests/componentes/evaluaciones.test.tsx` — nuevo

```tsx
import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { buscarRuta } from "../../src/data/rutas";
import { DiarioDificultades } from "../../src/components/DiarioDificultades";
import { GuiaDia } from "../../src/components/GuiaDia";
import { configInicial } from "../../src/lib/plan/ajustes";
import {
  activarRuta,
  registrarDificultad,
} from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN, type Estado } from "../../src/lib/progreso/estado";
import {
  actualizar,
  fechaHoy,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";
// Con 30 días y día ligero cada 7, el examen de «Funciones» cae el día 10.
const DIA_EVALUACION = 10;

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-10";
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
});

const guardado = () => JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);

describe("Evaluaciones externas", () => {
  it("solo aparece el formulario en días de evaluación o simulacro", () => {
    const { unmount } = render(<GuiaDia numero={1} />);
    expect(
      screen.queryByRole("heading", { name: "Resultado de tu examen" }),
    ).toBeNull();
    unmount();
    render(<GuiaDia numero={DIA_EVALUACION} />);
    expect(
      screen.getByRole("heading", { name: "Resultado de tu examen" }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Realiza un examen de años anteriores sobre Funciones, con tiempo limitado y sin consultar tus apuntes. Registra tu nota y tus errores.",
      ),
    ).toBeTruthy();
  });

  it("guarda nota, nota máxima, errores y temas a reforzar", () => {
    render(<GuiaDia numero={DIA_EVALUACION} />);
    fireEvent.input(screen.getByLabelText("Nota obtenida"), {
      target: { value: "15" },
    });
    fireEvent.input(screen.getByLabelText("Nota máxima (opcional)"), {
      target: { value: "20" },
    });
    fireEvent.input(screen.getByLabelText("Errores identificados"), {
      target: { value: "Olvidé restringir el dominio" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Funciones" }));
    fireEvent.click(screen.getByRole("button", { name: "Guardar resultado" }));
    const [evaluacion] = guardado().rutas[RUTA].evaluaciones;
    expect(evaluacion).toMatchObject({
      diaNumero: 10,
      temaSlug: "funciones",
      fecha: "2026-03-10",
      nota: 15,
      notaMaxima: 20,
      errores: "Olvidé restringir el dominio",
      temasAReforzar: ["funciones"],
    });
    expect(screen.getByText("Resultado guardado.")).toBeTruthy();
  });

  it("rechaza una nota mayor que la nota máxima sin guardar nada", () => {
    render(<GuiaDia numero={DIA_EVALUACION} />);
    fireEvent.input(screen.getByLabelText("Nota obtenida"), {
      target: { value: "25" },
    });
    fireEvent.input(screen.getByLabelText("Nota máxima (opcional)"), {
      target: { value: "20" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar resultado" }));
    expect(screen.getByRole("alert").textContent).toBe(
      "La nota no puede ser mayor que la nota máxima.",
    );
    expect(guardado().rutas[RUTA].evaluaciones).toEqual([]);
  });
});

describe("Diario de dificultades", () => {
  const ruta = buscarRuta(RUTA)!;

  it("muestra un estado vacío cuando no hay dificultades", () => {
    render(<DiarioDificultades ruta={ruta} />);
    expect(
      screen.getByText(
        "Aún no registras dificultades. Puedes hacerlo desde el cierre de cada día.",
      ),
    ).toBeTruthy();
  });

  it("lista las abiertas primero y permite marcarlas como resueltas", () => {
    for (const [id, texto, resuelta] of [
      ["d1", "Me confundo con la composición", true],
      ["d2", "No sé cuándo usar valor absoluto", false],
    ] as const) {
      actualizar(
        (e) =>
          registrarDificultad(e, RUTA, {
            id,
            fecha: "2026-03-02",
            subtemaSlug: "operaciones-y-composicion",
            texto,
            resuelta,
          }) as Estado,
      );
    }
    render(<DiarioDificultades ruta={ruta} />);
    const casillas = screen.getAllByRole("checkbox");
    expect(casillas[0]!.getAttribute("aria-label")).toBe(
      "Resuelta: No sé cuándo usar valor absoluto",
    );
    fireEvent.click(casillas[0]!);
    expect(
      guardado().rutas[RUTA].dificultades.map(
        (d: { id: string; resuelta: boolean }) => [d.id, d.resuelta],
      ),
    ).toEqual([
      ["d1", true],
      ["d2", true],
    ]);
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** GuiaDia shows a study day **THE SYSTEM SHALL** not render «Resultado de tu examen», and on day 10 of a 30-day `calculo-diferencial` plan (exam on «Funciones») it SHALL render it.
2. **WHEN** grade 15, maximum 20, an error text and the topic «Funciones» are saved **THE SYSTEM SHALL** store one evaluation with `diaNumero: 10`, `temaSlug: "funciones"`, `nota: 15`, `notaMaxima: 20` and `temasAReforzar: ["funciones"]`, and show «Resultado guardado.».
3. **WHEN** the grade 25 exceeds the maximum 20 **THE SYSTEM SHALL** show the alert «La nota no puede ser mayor que la nota máxima.» and store no evaluation.
4. **WHEN** the difficulty journal has no entries **THE SYSTEM SHALL** show «Aún no registras dificultades. Puedes hacerlo desde el cierre de cada día.».
5. **WHEN** the journal lists entries **THE SYSTEM SHALL** show open ones first and the checkbox «Resuelta: <texto>» SHALL save `resuelta: true`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/componentes/evaluaciones.test.tsx
npm test
npm run check
npm run build
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T4: Exámenes externos y diario de dificultades"
git tag step-11-evaluaciones-dificultades
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E2-T5` — Página Progreso con dominio declarado

**Depends on:** `E2-T4` · **Priority:** p1 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 12

Crea la página de progreso con tarjetas separadas: «Avance de actividades» (bloques completados / totales del plan), «Temas estudiados», «Pendientes de repaso», el diario de dificultades (paso 11), «Resultados de exámenes» y «Dominio declarado» (tabla editable por subtema: nivel + evidencia + Guardar; «Dominado» exige evidencia). Ejecuta `npm run format` antes de Verify.

**Files**
- `src/components/Progreso.tsx` — nuevo
- `src/pages/progreso/index.astro` — nuevo
- `tests/componentes/progreso.test.tsx` — nuevo

Contenido exacto de cada archivo:

#### `src/components/Progreso.tsx` — nuevo

```tsx
import { useState } from "preact/hooks";
import { buscarTema } from "../data/rutas";
import { enlace } from "../lib/enlaces";
import { declararDominio } from "../lib/progreso/acciones";
import {
  progresoGlobal,
  repasosPendientes,
  resumenDominio,
  temasEstudiados,
} from "../lib/progreso/derivados";
import { NIVELES_DOMINIO, type NivelDominio } from "../lib/progreso/estado";
import {
  actualizar,
  fechaHoy,
  hoyNumero,
  planActivo,
  progresoActivo,
  rutaActiva,
} from "../lib/progreso/store";
import type { Ruta, Subtema } from "../lib/tipos";
import { DiarioDificultades } from "./DiarioDificultades";
import { LimiteErrores } from "./LimiteErrores";

export const ETIQUETAS_NIVEL: Record<NivelDominio, string> = {
  "sin-evaluar": "Sin evaluar",
  "en-progreso": "En progreso",
  inseguro: "Inseguro",
  dominado: "Dominado",
};

function FilaDominio({ ruta, subtema }: { ruta: Ruta; subtema: Subtema }) {
  const actual = progresoActivo.value?.dominio[subtema.slug];
  const [nivel, setNivel] = useState<NivelDominio>(
    actual?.nivel ?? "sin-evaluar",
  );
  const [evidencia, setEvidencia] = useState(actual?.evidencia ?? "");
  const [error, setError] = useState("");

  function guardar() {
    let fallo: Error | null = null;
    actualizar((e) => {
      const r = declararDominio(
        e,
        ruta.slug,
        subtema.slug,
        nivel,
        evidencia,
        fechaHoy.value,
      );
      if (r instanceof Error) {
        fallo = r;
        return e;
      }
      return r;
    });
    setError(fallo ? (fallo as Error).message : "");
  }

  return (
    <tr>
      <th scope="row">{subtema.nombre}</th>
      <td>
        <select
          aria-label={`Nivel de ${subtema.nombre}`}
          value={nivel}
          onChange={(e) => setNivel(e.currentTarget.value as NivelDominio)}
        >
          {NIVELES_DOMINIO.map((n) => (
            <option key={n} value={n}>
              {ETIQUETAS_NIVEL[n]}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="text"
          aria-label={`Evidencia de ${subtema.nombre}`}
          value={evidencia}
          onInput={(e) => setEvidencia(e.currentTarget.value)}
        />
        {error && <p role="alert">{error}</p>}
      </td>
      <td>
        <button
          class="boton boton--secundario"
          type="button"
          aria-label={`Guardar dominio de ${subtema.nombre}`}
          onClick={guardar}
        >
          Guardar
        </button>
      </td>
    </tr>
  );
}

export function Progreso() {
  const ruta = rutaActiva.value;
  const progreso = progresoActivo.value;
  const plan = planActivo.value;
  if (!ruta || !progreso || !plan) {
    return (
      <section class="tarjeta">
        <h2>Todavía no eliges una ruta</h2>
        <a class="boton" href={enlace("")}>
          Elegir mi ruta
        </a>
      </section>
    );
  }

  const avance = progresoGlobal(plan, progreso.completados);
  const estudiados = temasEstudiados(ruta, plan, progreso.completados);
  const pendientes = repasosPendientes(
    plan,
    progreso.completados,
    hoyNumero.value,
  );
  const subtemas = new Map(
    ruta.temas.flatMap((t) => t.subtemas).map((s) => [s.slug, s.nombre]),
  );
  const dominio = resumenDominio(ruta, progreso);

  return (
    <>
      <section class="tarjeta">
        <h2>Avance de actividades</h2>
        <p>
          {avance.completados} de {avance.total} bloques completados (
          {avance.porcentaje}%)
        </p>
        <progress max={avance.total} value={avance.completados} />
        <p class="texto-tenue">
          Completar bloques no significa dominar: tu dominio lo declaras tú, más
          abajo.
        </p>
      </section>

      <section class="tarjeta">
        <h2>Temas estudiados</h2>
        {estudiados.length === 0 ? (
          <p>Todavía no completas todos los días de estudio de ningún tema.</p>
        ) : (
          <ul>
            {estudiados.map((slug) => (
              <li key={slug}>{buscarTema(slug)?.nombre ?? slug}</li>
            ))}
          </ul>
        )}
      </section>

      <section class="tarjeta">
        <h2>Pendientes de repaso</h2>
        {pendientes.length === 0 ? (
          <p>No tienes repasos pendientes.</p>
        ) : (
          <ul>
            {pendientes.map((p) => (
              <li key={`${p.subtemaSlug}-${p.diaNumero}`}>
                {subtemas.get(p.subtemaSlug) ?? p.subtemaSlug} (programado el
                día {p.diaNumero})
              </li>
            ))}
          </ul>
        )}
      </section>

      <DiarioDificultades ruta={ruta} />

      <section class="tarjeta">
        <h2>Resultados de exámenes</h2>
        {progreso.evaluaciones.length === 0 ? (
          <p>Aún no registras resultados de exámenes.</p>
        ) : (
          <ul>
            {progreso.evaluaciones.map((e) => {
              const tema = e.temaSlug
                ? (buscarTema(e.temaSlug)?.nombre ?? e.temaSlug)
                : "Simulacro";
              const nota =
                e.nota === null
                  ? "Sin nota"
                  : e.notaMaxima === null
                    ? `${e.nota}`
                    : `${e.nota}/${e.notaMaxima}`;
              return (
                <li key={e.id}>
                  <strong>
                    Día {e.diaNumero} · {tema} · {nota}
                  </strong>
                  {e.errores && <p>{e.errores}</p>}
                  {e.temasAReforzar.length > 0 && (
                    <p class="texto-tenue">
                      Reforzar:{" "}
                      {e.temasAReforzar
                        .map((t) => buscarTema(t)?.nombre ?? t)
                        .join(", ")}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section class="tarjeta">
        <h2>Dominio declarado</h2>
        <p class="texto-tenue">
          Solo tú cambias tu dominio. Para marcar «Dominado» escribe la
          evidencia, por ejemplo la nota de un examen.
        </p>
        <p>
          {NIVELES_DOMINIO.map(
            (n) => `${ETIQUETAS_NIVEL[n]}: ${dominio[n]}`,
          ).join(" · ")}
        </p>
        {ruta.temas.map((tema) => (
          <div key={tema.slug} class="tabla-dominio">
            <h3>{tema.nombre}</h3>
            <table>
              <thead>
                <tr>
                  <th scope="col">Subtema</th>
                  <th scope="col">Nivel</th>
                  <th scope="col">Evidencia</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {tema.subtemas.map((s) => (
                  <FilaDominio key={s.slug} ruta={ruta} subtema={s} />
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>
    </>
  );
}

export default function IslaProgreso() {
  return (
    <LimiteErrores origen="progreso">
      <Progreso />
    </LimiteErrores>
  );
}
```

#### `src/pages/progreso/index.astro` — nuevo

```astro
---
import Base from "../../layouts/Base.astro";
import IslaProgreso from "../../components/Progreso";
---

<Base titulo="Progreso" seccion="progreso">
  <h1>Tu progreso</h1>
  <IslaProgreso client:only="preact">
    <p slot="fallback">Cargando tu progreso…</p>
  </IslaProgreso>
</Base>
```

#### `tests/componentes/progreso.test.tsx` — nuevo

```tsx
import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { Progreso } from "../../src/components/Progreso";
import { configInicial } from "../../src/lib/plan/ajustes";
import {
  activarRuta,
  marcarBloque,
  registrarEvaluacion,
} from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN, type Estado } from "../../src/lib/progreso/estado";
import {
  actualizar,
  fechaHoy,
  planActivo,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";
// Días de estudio de «Funciones» con 30 días y día ligero cada 7.
const DIAS_FUNCIONES = [1, 2, 3, 4, 5, 6, 8, 9];

function completarDias(...numeros: number[]) {
  for (const n of numeros) {
    for (const bloque of planActivo.value!.dias[n - 1]!.bloques) {
      actualizar((e) =>
        marcarBloque(e, RUTA, bloque.id, true, "2026-03-01T10:00:00.000Z"),
      );
    }
  }
}

const guardado = () => JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-03";
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
});

describe("Progreso", () => {
  it("separa el avance de actividades del dominio declarado", () => {
    completarDias(1);
    render(<Progreso />);
    expect(
      screen.getByRole("heading", { name: "Avance de actividades" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Dominio declarado" }),
    ).toBeTruthy();
    expect(screen.getByText(/^7 de \d+ bloques completados/)).toBeTruthy();
    expect(
      (
        screen.getByLabelText(
          "Nivel de Dominio y rango de funciones reales",
        ) as HTMLSelectElement
      ).value,
    ).toBe("sin-evaluar");
  });

  it("lista temas estudiados y repasos pendientes hasta hoy", () => {
    completarDias(...DIAS_FUNCIONES);
    render(<Progreso />);
    const estudiados = screen
      .getByRole("heading", { name: "Temas estudiados" })
      .closest("section")!;
    expect(estudiados.textContent).toContain("Funciones");
    expect(screen.getByText("No tienes repasos pendientes.")).toBeTruthy();
  });

  it("muestra como pendiente el repaso de un día pasado sin marcar", () => {
    render(<Progreso />);
    expect(
      screen.getByText(
        "Dominio y rango de funciones reales (programado el día 2)",
      ),
    ).toBeTruthy();
  });

  it("exige evidencia para declarar «Dominado» y la guarda cuando existe", () => {
    render(<Progreso />);
    const nombre = "Dominio y rango de funciones reales";
    fireEvent.change(screen.getByLabelText(`Nivel de ${nombre}`), {
      target: { value: "dominado" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: `Guardar dominio de ${nombre}` }),
    );
    expect(screen.getByRole("alert").textContent).toContain("evidencia");
    expect(guardado().rutas[RUTA].dominio).toEqual({});
    fireEvent.input(screen.getByLabelText(`Evidencia de ${nombre}`), {
      target: { value: "18/20 en el examen del día 10" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: `Guardar dominio de ${nombre}` }),
    );
    expect(guardado().rutas[RUTA].dominio["dominio-y-rango"]).toEqual({
      nivel: "dominado",
      evidencia: "18/20 en el examen del día 10",
      fecha: "2026-03-03",
    });
  });

  it("muestra los resultados de exámenes registrados", () => {
    actualizar(
      (e) =>
        registrarEvaluacion(e, RUTA, {
          id: "e1",
          diaNumero: 10,
          temaSlug: "funciones",
          fecha: "2026-03-10",
          nota: 15,
          notaMaxima: 20,
          errores: "Dominio de raíces",
          temasAReforzar: ["funciones"],
        }) as Estado,
    );
    render(<Progreso />);
    expect(screen.getByText("Día 10 · Funciones · 15/20")).toBeTruthy();
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** Progreso renders with day 1 completed **THE SYSTEM SHALL** show the separate headings «Avance de actividades» and «Dominio declarado», the text «7 de <total> bloques completados» and the level «sin-evaluar» for «Dominio y rango de funciones reales».
2. **WHEN** every study day of «Funciones» is completed **THE SYSTEM SHALL** list «Funciones» under «Temas estudiados» and show «No tienes repasos pendientes.».
3. **WHEN** today is day 3 and the day 2 review block is not marked **THE SYSTEM SHALL** list «Dominio y rango de funciones reales (programado el día 2)».
4. **WHEN** «Dominado» is saved without evidence **THE SYSTEM SHALL** show an alert mentioning «evidencia» and save nothing; with evidence it SHALL save `{ nivel: "dominado", evidencia, fecha }`.
5. **WHEN** an evaluation of day 10 on «Funciones» with 15/20 exists **THE SYSTEM SHALL** show «Día 10 · Funciones · 15/20».

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/componentes/progreso.test.tsx
npm test
npm run check
npm run build
test -f dist/progreso/index.html
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T5: Página Progreso con dominio declarado"
git tag step-12-progreso
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E2-T6` — Página Ajustes, respaldo, importar y reiniciar

**Depends on:** `E2-T4` · **Priority:** p1 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 13

Crea Ajustes (cambiar ruta conservando el progreso de cada una; fecha, duración, minutos y día ligero; extender +7/+14/personalizado; refuerzos de prerrequisitos; exportar; importar con resumen y confirmación; reiniciar con confirmación) y el recordatorio de respaldo (visible en Hoy y Ajustes si hay progreso y no se exportó nunca o hace 7 días o más). Reemplaza `src/components/GuiaDia.tsx` para mostrar el recordatorio. Ejecuta `npm run format` antes de Verify.

**Files**
- `src/components/RecordatorioRespaldo.tsx` — nuevo
- `src/components/Ajustes.tsx` — nuevo
- `src/pages/ajustes/index.astro` — nuevo
- `src/components/GuiaDia.tsx` — reemplaza (contenido completo)
- `tests/componentes/ajustes.test.tsx` — nuevo

Contenido exacto de cada archivo:

#### `src/components/RecordatorioRespaldo.tsx` — nuevo

```tsx
import { marcarRespaldo } from "../lib/progreso/acciones";
import {
  descargarTexto,
  necesitaRecordatorio,
  nombreArchivoRespaldo,
  serializarRespaldo,
} from "../lib/progreso/respaldo";
import { actualizar, estado, fechaHoy } from "../lib/progreso/store";

/** Descarga mentorix-reto-AAAA-MM-DD.json y anota la fecha del respaldo. */
export function exportarProgreso(): void {
  const hoy = fechaHoy.value;
  actualizar((e) => marcarRespaldo(e, hoy));
  descargarTexto(nombreArchivoRespaldo(hoy), serializarRespaldo(estado.value));
}

/** Aviso visible si hay progreso y no se exporta un respaldo hace 7 días o más. */
export function RecordatorioRespaldo() {
  if (!necesitaRecordatorio(estado.value, fechaHoy.value)) return null;
  const nunca = estado.value.ultimoRespaldo === null;
  return (
    <aside class="tarjeta" role="status">
      <p>
        {nunca
          ? "Aún no guardas un respaldo de tu progreso."
          : "Hace 7 días o más que no guardas un respaldo de tu progreso."}{" "}
        Tu avance vive solo en este navegador: si borras sus datos o cambias de
        dispositivo, lo pierdes.
      </p>
      <button class="boton" type="button" onClick={exportarProgreso}>
        Exportar ahora
      </button>
    </aside>
  );
}
```

#### `src/components/Ajustes.tsx` — nuevo

```tsx
import { useState } from "preact/hooks";
import { rutas } from "../data/rutas";
import { enlace } from "../lib/enlaces";
import {
  configInicial,
  extenderHorizonte,
  fijarRefuerzo,
  prerrequisitosDeRuta,
} from "../lib/plan/ajustes";
import { erroresConfig } from "../lib/plan/generador";
import { activarRuta, actualizarConfig } from "../lib/progreso/acciones";
import { estadoInicial, type Estado } from "../lib/progreso/estado";
import {
  describirResumen,
  leerRespaldo,
  type ResumenRespaldo,
} from "../lib/progreso/respaldo";
import {
  actualizar,
  fechaHoy,
  progresoActivo,
  rutaActiva,
} from "../lib/progreso/store";
import type { ConfigPlan, Ruta } from "../lib/tipos";
import { LimiteErrores } from "./LimiteErrores";
import { exportarProgreso, RecordatorioRespaldo } from "./RecordatorioRespaldo";

function CambiarRuta() {
  const [slug, setSlug] = useState(rutaActiva.value?.slug ?? rutas[0]!.slug);
  return (
    <section class="tarjeta">
      <h2>Ruta</h2>
      <div class="campo">
        <label for="ajustes-ruta">Ruta activa</label>
        <select
          id="ajustes-ruta"
          value={slug}
          onChange={(e) => setSlug(e.currentTarget.value)}
        >
          {rutas.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>
      <p class="texto-tenue">
        Cada ruta guarda su propio progreso: volver a una ruta no lo borra.
      </p>
      <button
        class="boton"
        type="button"
        onClick={() =>
          actualizar((e) => activarRuta(e, slug, configInicial(fechaHoy.value)))
        }
      >
        Cambiar de ruta
      </button>
    </section>
  );
}

function Plan({ ruta, config }: { ruta: Ruta; config: ConfigPlan }) {
  const [fecha, setFecha] = useState(config.fechaInicio);
  const [horizonte, setHorizonte] = useState(String(config.horizonteDias));
  const [minutos, setMinutos] = useState(String(config.minutosPorDia));
  const [ligero, setLigero] = useState(String(config.diaLigeroCada));
  const [extra, setExtra] = useState("21");
  const [errores, setErrores] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");

  function aplicar(nueva: ConfigPlan, texto: string) {
    const encontrados = erroresConfig(nueva);
    setErrores(encontrados);
    if (encontrados.length > 0) {
      setMensaje("");
      return;
    }
    actualizar((e) => actualizarConfig(e, ruta.slug, nueva));
    setHorizonte(String(nueva.horizonteDias));
    setMensaje(texto);
  }

  function extender(dias: number) {
    try {
      aplicar(
        extenderHorizonte(config, dias),
        `Ruta extendida a ${config.horizonteDias + dias} días.`,
      );
    } catch (e) {
      setErrores([(e as Error).message]);
      setMensaje("");
    }
  }

  return (
    <section class="tarjeta">
      <h2>Tu plan</h2>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          aplicar(
            {
              ...config,
              fechaInicio: fecha,
              horizonteDias: Number(horizonte),
              minutosPorDia: Number(minutos),
              diaLigeroCada: Number(ligero),
            },
            "Cambios guardados. Tus bloques completados se conservan.",
          );
        }}
      >
        <div class="campo">
          <label for="ajustes-fecha">Fecha de inicio</label>
          <input
            id="ajustes-fecha"
            type="date"
            value={fecha}
            onInput={(e) => setFecha(e.currentTarget.value)}
          />
        </div>
        <div class="campo">
          <label for="ajustes-horizonte">Duración del reto (días)</label>
          <input
            id="ajustes-horizonte"
            type="number"
            min={7}
            max={120}
            value={horizonte}
            onInput={(e) => setHorizonte(e.currentTarget.value)}
          />
        </div>
        <div class="campo">
          <label for="ajustes-minutos">Minutos de estudio por día</label>
          <input
            id="ajustes-minutos"
            type="number"
            min={60}
            max={360}
            step={5}
            value={minutos}
            onInput={(e) => setMinutos(e.currentTarget.value)}
          />
        </div>
        <div class="campo">
          <label for="ajustes-ligero">Día ligero cada (días, 0 = nunca)</label>
          <input
            id="ajustes-ligero"
            type="number"
            min={0}
            max={30}
            value={ligero}
            onInput={(e) => setLigero(e.currentTarget.value)}
          />
        </div>
        <button class="boton" type="submit">
          Guardar cambios
        </button>
      </form>

      <h3>Extender la ruta</h3>
      <p>
        <button
          class="boton boton--secundario"
          type="button"
          onClick={() => extender(7)}
        >
          Extender 7 días
        </button>{" "}
        <button
          class="boton boton--secundario"
          type="button"
          onClick={() => extender(14)}
        >
          Extender 14 días
        </button>
      </p>
      <div class="campo">
        <label for="ajustes-extra">Días extra (duración personalizada)</label>
        <input
          id="ajustes-extra"
          type="number"
          min={1}
          value={extra}
          onInput={(e) => setExtra(e.currentTarget.value)}
        />
      </div>
      <button
        class="boton boton--secundario"
        type="button"
        onClick={() => extender(Number(extra))}
      >
        Extender
      </button>
      {errores.length > 0 && (
        <ul role="alert">
          {errores.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <p role="status">{mensaje}</p>
    </section>
  );
}

function Refuerzos({ ruta, config }: { ruta: Ruta; config: ConfigPlan }) {
  const disponibles = prerrequisitosDeRuta(ruta, rutas);
  const [dias, setDias] = useState<Record<string, string>>(
    Object.fromEntries(
      disponibles.map((p) => [
        p.temaSlug,
        String(
          config.refuerzos.find((r) => r.temaSlug === p.temaSlug)?.dias ?? 0,
        ),
      ]),
    ),
  );
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  function guardar() {
    try {
      let nueva = config;
      for (const p of disponibles) {
        nueva = fijarRefuerzo(nueva, p.temaSlug, Number(dias[p.temaSlug]));
      }
      actualizar((e) => actualizarConfig(e, ruta.slug, nueva));
      setError("");
      setMensaje("Refuerzos guardados.");
    } catch (e) {
      setError((e as Error).message);
      setMensaje("");
    }
  }

  if (disponibles.length === 0) return null;
  return (
    <section class="tarjeta">
      <h2>Reforzar prerrequisitos</h2>
      <p class="texto-tenue">
        Agrega días de refuerzo de un tema antes del tema que lo necesita (0 a 7
        días).
      </p>
      {disponibles.map((p) => (
        <div class="campo" key={p.temaSlug}>
          <label for={`refuerzo-${p.temaSlug}`}>
            Días de refuerzo de {p.nombre}
          </label>
          <input
            id={`refuerzo-${p.temaSlug}`}
            type="number"
            min={0}
            max={7}
            value={dias[p.temaSlug]}
            onInput={(e) => {
              const valor = e.currentTarget.value;
              setDias((d) => ({ ...d, [p.temaSlug]: valor }));
            }}
          />
          <span class="texto-tenue">
            Lo necesitas para: {p.requeridoPor.join(", ")}
          </span>
        </div>
      ))}
      <button class="boton" type="button" onClick={guardar}>
        Guardar refuerzos
      </button>
      {error && <p role="alert">{error}</p>}
      <p role="status">{mensaje}</p>
    </section>
  );
}

function Respaldo() {
  const [pendiente, setPendiente] = useState<{
    estado: Estado;
    resumen: ResumenRespaldo;
  } | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function elegirArchivo(evento: Event) {
    const archivo = (evento.currentTarget as HTMLInputElement).files?.[0];
    if (!archivo) return;
    const resultado = leerRespaldo(await archivo.text());
    if (resultado instanceof Error) {
      setError(resultado.message);
      setPendiente(null);
      return;
    }
    setError("");
    setPendiente(resultado);
  }

  return (
    <section class="tarjeta">
      <h2>Respaldo</h2>
      <p>
        Tu progreso vive solo en este navegador. Exporta un respaldo para
        cambiar de dispositivo o por si borras los datos del navegador.
      </p>
      <button class="boton" type="button" onClick={exportarProgreso}>
        Exportar progreso
      </button>
      <div class="campo">
        <label for="ajustes-importar">Archivo de respaldo (.json)</label>
        <input
          id="ajustes-importar"
          type="file"
          accept="application/json,.json"
          onChange={elegirArchivo}
        />
      </div>
      {error && <p role="alert">{error}</p>}
      {pendiente && (
        <div>
          <p>Este respaldo contiene: {describirResumen(pendiente.resumen)}.</p>
          <p>Importarlo reemplaza todo tu progreso actual.</p>
          <button
            class="boton"
            type="button"
            onClick={() => {
              const importado = pendiente.estado;
              actualizar(() => importado);
              setPendiente(null);
              setMensaje("Progreso importado.");
            }}
          >
            Reemplazar mi progreso
          </button>{" "}
          <button
            class="boton boton--secundario"
            type="button"
            onClick={() => setPendiente(null)}
          >
            Cancelar
          </button>
        </div>
      )}
      <p role="status">{mensaje}</p>
    </section>
  );
}

function Reiniciar() {
  const [confirmando, setConfirmando] = useState(false);
  return (
    <section class="tarjeta">
      <h2>Reiniciar</h2>
      {!confirmando ? (
        <button
          class="boton boton--secundario"
          type="button"
          onClick={() => setConfirmando(true)}
        >
          Reiniciar todo
        </button>
      ) : (
        <div>
          <p>
            Esto borra todo tu progreso de este navegador. Exporta un respaldo
            antes si quieres conservarlo.
          </p>
          <button
            class="boton boton--peligro"
            type="button"
            onClick={() => {
              actualizar(() => estadoInicial());
              setConfirmando(false);
            }}
          >
            Sí, borrar mi progreso
          </button>{" "}
          <button
            class="boton boton--secundario"
            type="button"
            onClick={() => setConfirmando(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </section>
  );
}

export function Ajustes() {
  const ruta = rutaActiva.value;
  const progreso = progresoActivo.value;
  return (
    <>
      <RecordatorioRespaldo />
      {ruta && progreso ? (
        <>
          <CambiarRuta />
          <Plan
            key={`${ruta.slug}-${progreso.config.horizonteDias}`}
            ruta={ruta}
            config={progreso.config}
          />
          <Refuerzos key={ruta.slug} ruta={ruta} config={progreso.config} />
        </>
      ) : (
        <section class="tarjeta">
          <h2>Todavía no eliges una ruta</h2>
          <a class="boton" href={enlace("")}>
            Elegir mi ruta
          </a>
        </section>
      )}
      <Respaldo />
      <Reiniciar />
    </>
  );
}

export default function IslaAjustes() {
  return (
    <LimiteErrores origen="ajustes">
      <Ajustes />
    </LimiteErrores>
  );
}
```

#### `src/pages/ajustes/index.astro` — nuevo

```astro
---
import Base from "../../layouts/Base.astro";
import IslaAjustes from "../../components/Ajustes";
---

<Base titulo="Ajustes" seccion="ajustes">
  <h1>Ajustes</h1>
  <IslaAjustes client:only="preact">
    <p slot="fallback">Cargando tus ajustes…</p>
  </IslaAjustes>
</Base>
```

#### `src/components/GuiaDia.tsx` — reemplaza (contenido completo)

```tsx
import { useState } from "preact/hooks";
import { enlace, enlaceDia } from "../lib/enlaces";
import { formatearFecha } from "../lib/fechas";
import {
  guardarReflexion,
  marcarBloque,
  registrarDificultad,
} from "../lib/progreso/acciones";
import {
  actualizar,
  fechaHoy,
  hoyNumero,
  nuevoId,
  planActivo,
  progresoActivo,
  rutaActiva,
} from "../lib/progreso/store";
import type { Dia, Ruta, TipoDia } from "../lib/tipos";
import { FormularioEvaluacion } from "./FormularioEvaluacion";
import { LimiteErrores } from "./LimiteErrores";
import { RecordatorioRespaldo } from "./RecordatorioRespaldo";

export const ETIQUETAS_TIPO: Record<TipoDia, string> = {
  estudio: "Estudio",
  refuerzo: "Refuerzo",
  evaluacion: "Evaluación",
  correccion: "Corrección",
  repaso: "Repaso",
  simulacro: "Simulacro",
};

interface Props {
  /** Día a mostrar. Si falta, se usa `?n=` (si leerUrl) o el día de hoy. */
  numero?: number;
  leerUrl?: boolean;
}

function RegistrarDificultad({ ruta, dia }: { ruta: Ruta; dia: Dia }) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [subtema, setSubtema] = useState(dia.subtemaSlug ?? "");
  const [mensaje, setMensaje] = useState("");

  function guardar(evento: Event) {
    evento.preventDefault();
    let error: Error | null = null;
    actualizar((e) => {
      const r = registrarDificultad(e, ruta.slug, {
        id: nuevoId(),
        fecha: fechaHoy.value,
        subtemaSlug: subtema === "" ? null : subtema,
        texto,
        resuelta: false,
      });
      if (r instanceof Error) {
        error = r;
        return e;
      }
      return r;
    });
    if (error) {
      setMensaje((error as Error).message);
      return;
    }
    setTexto("");
    setAbierto(false);
    setMensaje("Dificultad registrada.");
  }

  return (
    <div>
      {!abierto && (
        <button
          class="boton boton--secundario"
          type="button"
          onClick={() => setAbierto(true)}
        >
          Registrar dificultad
        </button>
      )}
      {abierto && (
        <form onSubmit={guardar}>
          <div class="campo">
            <label for={`dificultad-${dia.numero}`}>
              Describe la dificultad o el error
            </label>
            <textarea
              id={`dificultad-${dia.numero}`}
              value={texto}
              onInput={(e) => setTexto(e.currentTarget.value)}
            />
          </div>
          <div class="campo">
            <label for={`subtema-${dia.numero}`}>Subtema relacionado</label>
            <select
              id={`subtema-${dia.numero}`}
              value={subtema}
              onChange={(e) => setSubtema(e.currentTarget.value)}
            >
              <option value="">Ninguno en particular</option>
              {ruta.temas
                .flatMap((t) => t.subtemas)
                .map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.nombre}
                  </option>
                ))}
            </select>
          </div>
          <button class="boton" type="submit">
            Guardar dificultad
          </button>
        </form>
      )}
      <p role="status">{mensaje}</p>
    </div>
  );
}

function Reflexion({ ruta, dia }: { ruta: Ruta; dia: Dia }) {
  const guardada = progresoActivo.value?.reflexiones[String(dia.numero)] ?? "";
  const [texto, setTexto] = useState(guardada);
  const [mensaje, setMensaje] = useState("");
  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault();
        actualizar((e) => guardarReflexion(e, ruta.slug, dia.numero, texto));
        setMensaje("Reflexión guardada.");
      }}
    >
      <div class="campo">
        <label for={`reflexion-${dia.numero}`}>Reflexión del día</label>
        <textarea
          id={`reflexion-${dia.numero}`}
          value={texto}
          onInput={(e) => setTexto(e.currentTarget.value)}
        />
      </div>
      <button class="boton boton--secundario" type="submit">
        Guardar reflexión
      </button>
      <p role="status">{mensaje}</p>
    </form>
  );
}

function numeroPedido(props: Props): number | null {
  if (props.numero !== undefined) return props.numero;
  if (props.leerUrl) {
    const n = Number(new URLSearchParams(window.location.search).get("n"));
    return Number.isInteger(n) ? n : NaN;
  }
  return null;
}

export function GuiaDia(props: Props) {
  const ruta = rutaActiva.value;
  const progreso = progresoActivo.value;
  const plan = planActivo.value;
  if (!ruta || !progreso || !plan) {
    return (
      <section class="tarjeta">
        <h2>Todavía no eliges una ruta</h2>
        <a class="boton" href={enlace("")}>
          Elegir mi ruta
        </a>
      </section>
    );
  }

  const horizonte = plan.dias.length;
  const pedido = numeroPedido(props);
  let n = pedido ?? hoyNumero.value;
  let aviso = "";
  if (pedido === null && n < 1) {
    aviso = `Tu reto empieza el ${formatearFecha(progreso.config.fechaInicio)}. Esto es lo que harás el día 1.`;
    n = 1;
  }
  if (pedido === null && n > horizonte) {
    return (
      <section class="tarjeta">
        <h2>Terminaste los {horizonte} días de tu reto</h2>
        <p>Revisa tu progreso o extiende la ruta para seguir estudiando.</p>
        <a class="boton" href={enlace("ajustes/")}>
          Extender la ruta
        </a>
      </section>
    );
  }
  const dia = plan.dias[n - 1];
  if (!dia) {
    return (
      <section class="tarjeta">
        <h2>Ese día no existe en tu plan</h2>
        <a class="boton" href={enlace("calendario/")}>
          Ir al calendario
        </a>
      </section>
    );
  }

  const completados = progreso.completados;
  const hechos = dia.bloques.filter((b) => b.id in completados).length;
  const totalMinutos = dia.bloques.reduce((t, b) => t + b.minutos, 0);

  return (
    <article class={`guia tipo-${dia.tipo}`}>
      <RecordatorioRespaldo />
      {aviso && <p class="tarjeta">{aviso}</p>}
      <header class="tarjeta">
        <p class="texto-tenue">
          {ruta.nombre} ·{" "}
          <span class="insignia">{ETIQUETAS_TIPO[dia.tipo]}</span>
        </p>
        <h2>
          Día {dia.numero} · {formatearFecha(dia.fecha)}
        </h2>
        <p>{dia.titulo}</p>
      </header>

      <section class="tarjeta">
        <h3>Objetivo del día</h3>
        <p>{dia.objetivo}</p>
        <h3>Qué estudiar</h3>
        <p>{dia.queEstudiar}</p>
        <h3>Qué hacer</h3>
        <p>{dia.queHacer}</p>
        <h3>Repaso</h3>
        {dia.repaso.length > 0 ? (
          <ul>
            {dia.repaso.map((texto) => (
              <li key={texto}>{texto}</li>
            ))}
          </ul>
        ) : (
          <p>Hoy no hay repasos programados.</p>
        )}
      </section>

      {(dia.tipo === "evaluacion" || dia.tipo === "simulacro") && (
        <FormularioEvaluacion key={dia.numero} ruta={ruta} dia={dia} />
      )}

      <section class="tarjeta">
        <h3>Tiempo sugerido por bloque</h3>
        <p class="texto-tenue">Total: {totalMinutos} min</p>
        <ul class="bloques">
          {dia.bloques.map((bloque) => (
            <li key={bloque.id}>
              <label>
                <input
                  type="checkbox"
                  checked={bloque.id in completados}
                  onChange={(e) => {
                    const hecho = e.currentTarget.checked;
                    actualizar((estado) =>
                      marcarBloque(
                        estado,
                        ruta.slug,
                        bloque.id,
                        hecho,
                        new Date().toISOString(),
                      ),
                    );
                  }}
                />
                <strong>
                  {bloque.titulo} · {bloque.minutos} min
                </strong>
              </label>
              <p class="texto-tenue">{bloque.instruccion}</p>
            </li>
          ))}
        </ul>
        <p aria-live="polite">
          {hechos} de {dia.bloques.length} bloques completados
        </p>
      </section>

      <section class="tarjeta">
        <h3>Cierre de sesión</h3>
        <ul>
          {dia.cierre.map((texto) => (
            <li key={texto}>{texto}</li>
          ))}
        </ul>
        <RegistrarDificultad ruta={ruta} dia={dia} />
        <Reflexion key={dia.numero} ruta={ruta} dia={dia} />
      </section>

      <section class="tarjeta">
        <h3>Siguiente paso</h3>
        <p>{dia.siguientePaso}</p>
        {dia.numero < horizonte && (
          <a href={enlaceDia(dia.numero + 1)}>Ver el día {dia.numero + 1}</a>
        )}
      </section>
    </article>
  );
}

export default function IslaGuiaDia(props: Props) {
  return (
    <LimiteErrores origen="guia-dia">
      <GuiaDia {...props} />
    </LimiteErrores>
  );
}
```

#### `tests/componentes/ajustes.test.tsx` — nuevo

```tsx
import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Ajustes } from "../../src/components/Ajustes";
import { GuiaDia } from "../../src/components/GuiaDia";
import { configInicial } from "../../src/lib/plan/ajustes";
import { activarRuta, marcarBloque } from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN, estadoInicial } from "../../src/lib/progreso/estado";
import { serializarRespaldo } from "../../src/lib/progreso/respaldo";
import {
  actualizar,
  estado,
  fechaHoy,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";
const BLOQUE = "calculo-diferencial:estudio:dominio-y-rango#1:teoria";

const guardado = () => JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-10";
  URL.createObjectURL = vi.fn(() => "blob:respaldo");
  URL.revokeObjectURL = vi.fn();
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
  actualizar((e) =>
    marcarBloque(e, RUTA, BLOQUE, true, "2026-03-01T10:00:00.000Z"),
  );
});

describe("Ajustes", () => {
  it("cambia la duración y conserva los bloques completados", () => {
    render(<Ajustes />);
    fireEvent.input(screen.getByLabelText("Duración del reto (días)"), {
      target: { value: "45" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(guardado().rutas[RUTA].config.horizonteDias).toBe(45);
    expect(Object.keys(guardado().rutas[RUTA].completados)).toEqual([BLOQUE]);
  });

  it("rechaza minutos que no son múltiplo de 5", () => {
    render(<Ajustes />);
    fireEvent.input(screen.getByLabelText("Minutos de estudio por día"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(screen.getByRole("alert").textContent).toContain("múltiplo de 5");
    expect(guardado().rutas[RUTA].config.minutosPorDia).toBe(120);
  });

  it("guarda días de refuerzo de un prerrequisito", () => {
    render(<Ajustes />);
    fireEvent.input(screen.getByLabelText("Días de refuerzo de Límites"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar refuerzos" }));
    expect(guardado().rutas[RUTA].config.refuerzos).toEqual([
      { temaSlug: "limites", dias: 2 },
    ]);
  });

  it("exporta el respaldo y anota la fecha, lo que apaga el recordatorio", () => {
    render(<GuiaDia />);
    expect(
      screen.getByText(/Aún no guardas un respaldo de tu progreso/),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Exportar ahora" }));
    expect(estado.value.ultimoRespaldo).toBe("2026-03-10");
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText(/Aún no guardas un respaldo de tu progreso/),
    ).toBeNull();
  });

  it("importa un respaldo válido solo después de confirmar", async () => {
    render(<Ajustes />);
    const otro = activarRuta(
      estadoInicial(),
      "calculo-integral",
      configInicial("2026-04-01"),
    );
    const archivo = new File([serializarRespaldo(otro)], "respaldo.json", {
      type: "application/json",
    });
    const entrada = screen.getByLabelText("Archivo de respaldo (.json)");
    Object.defineProperty(entrada, "files", { value: [archivo] });
    fireEvent.change(entrada);
    expect(
      await screen.findByText(
        "Este respaldo contiene: 1 ruta · 0 bloques completados · 0 evaluaciones · 0 dificultades.",
      ),
    ).toBeTruthy();
    expect(estado.value.rutaActiva).toBe(RUTA);
    fireEvent.click(
      screen.getByRole("button", { name: "Reemplazar mi progreso" }),
    );
    expect(guardado().rutaActiva).toBe("calculo-integral");
  });

  it("rechaza un archivo inválido sin tocar el progreso", async () => {
    render(<Ajustes />);
    const entrada = screen.getByLabelText("Archivo de respaldo (.json)");
    Object.defineProperty(entrada, "files", {
      value: [new File(["no es json"], "malo.json")],
    });
    fireEvent.change(entrada);
    expect((await screen.findByRole("alert")).textContent).toBe(
      "El archivo no es un respaldo válido: no es JSON.",
    );
    expect(guardado().rutaActiva).toBe(RUTA);
  });

  it("reinicia todo solo tras confirmar", () => {
    render(<Ajustes />);
    fireEvent.click(screen.getByRole("button", { name: "Reiniciar todo" }));
    expect(guardado().rutaActiva).toBe(RUTA);
    fireEvent.click(
      screen.getByRole("button", { name: "Sí, borrar mi progreso" }),
    );
    expect(guardado()).toEqual(estadoInicial());
  });
});
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** the duration is changed to 45 and «Guardar cambios» is pressed **THE SYSTEM SHALL** save `horizonteDias: 45` and keep the completed block `calculo-diferencial:estudio:dominio-y-rango#1:teoria`.
2. **WHEN** the minutes are 123 **THE SYSTEM SHALL** show an alert containing «múltiplo de 5» and keep 120.
3. **WHEN** «Días de refuerzo de Límites» is set to 2 and saved **THE SYSTEM SHALL** store `refuerzos: [{ temaSlug: "limites", dias: 2 }]`.
4. **WHEN** there is progress and no backup **THE SYSTEM SHALL** show the reminder in Hoy, and «Exportar ahora» SHALL download the file once, set `ultimoRespaldo` to today and hide the reminder.
5. **WHEN** a valid backup file is chosen **THE SYSTEM SHALL** show «Este respaldo contiene: …» and replace the progress only after «Reemplazar mi progreso»; an invalid file SHALL show «El archivo no es un respaldo válido: no es JSON.» and change nothing.
6. **WHEN** «Reiniciar todo» and then «Sí, borrar mi progreso» are pressed **THE SYSTEM SHALL** save the initial state, and not before the confirmation.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
npm test -- tests/componentes/ajustes.test.tsx
npm test
npm run check
npm run build
test -f dist/ajustes/index.html
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T6: Página Ajustes, respaldo, importar y reiniciar"
git tag step-13-ajustes-respaldo
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

### `E2-T7` — Workflow de GitHub Pages y README del docente

**Depends on:** `E2-T3`, `E2-T5`, `E2-T6` · **Priority:** p1 — metadato para recortes de alcance, no un orden de ejecución · **Paso del blueprint:** 14

Crea el workflow de despliegue a GitHub Pages (mismos comandos que el gate §20.1), un verificador estructural del workflow que corre sin red ni dependencias (sangría con espacios y líneas obligatorias en orden; no es un parser YAML completo y lo dice) y el README para el docente (cómo editar y añadir rutas sin renombrar slugs, comandos, cómo publicar). Hacer push y activar Pages requiere la cuenta: va en la lista de lanzamiento de §20.1, no aquí. Ejecuta `npm run format` antes de Verify.

**Files**
- `.github/workflows/deploy.yml` — nuevo
- `scripts/verificar-workflow.mjs` — nuevo
- `README.md` — nuevo

Contenido exacto de cada archivo:

#### `.github/workflows/deploy.yml` — nuevo

```yaml
name: Desplegar en GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run format:check
      - run: npm run check
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

#### `scripts/verificar-workflow.mjs` — nuevo

```js
// Comprobación estructural (sin red y sin dependencias) del workflow de despliegue.
// No es un parser YAML completo: verifica indentación con espacios y que las
// líneas obligatorias existan, en este orden. Sale con código 1 si algo falta.
import { readFileSync } from "node:fs";

const RUTA = ".github/workflows/deploy.yml";
const OBLIGATORIAS_EN_ORDEN = [
  "name: Desplegar en GitHub Pages",
  "branches: [main]",
  "pages: write",
  "id-token: write",
  "- uses: actions/checkout@v7",
  "- uses: actions/setup-node@v7",
  "node-version-file: .nvmrc",
  "- run: npm ci",
  "- run: npm run format:check",
  "- run: npm run check",
  "- run: npm test",
  "- run: npm run build",
  "- uses: actions/configure-pages@v6",
  "- uses: actions/upload-pages-artifact@v5",
  "path: dist",
  "needs: build",
  "uses: actions/deploy-pages@v5",
];

const problemas = [];
let texto = "";
try {
  texto = readFileSync(RUTA, "utf8");
} catch {
  problemas.push(`no existe ${RUTA}`);
}

if (texto) {
  const lineas = texto.split("\n");
  lineas.forEach((linea, i) => {
    if (linea.includes("\t")) problemas.push(`línea ${i + 1}: usa tabulador`);
    const sangria = linea.length - linea.trimStart().length;
    if (linea.trim() !== "" && sangria % 2 !== 0) {
      problemas.push(`línea ${i + 1}: sangría impar`);
    }
  });
  const limpias = lineas.map((l) => l.trim());
  let desde = 0;
  for (const requerida of OBLIGATORIAS_EN_ORDEN) {
    const indice = limpias.indexOf(requerida, desde);
    if (indice === -1) {
      problemas.push(`falta (o está fuera de orden): ${requerida}`);
    } else {
      desde = indice + 1;
    }
  }
}

if (problemas.length > 0) {
  for (const problema of problemas) console.error(problema);
  process.exit(1);
}
console.log("verificar-workflow: OK");
```

#### `README.md` — nuevo

```markdown
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
```

**Acceptance**

Copiadas del arreglo `acceptance` de esta tarea en `tasks.json` (idénticas salvo el énfasis markdown). Cada una la decide un comando de abajo.

1. **WHEN** `node scripts/verificar-workflow.mjs` runs **THE SYSTEM SHALL** print `verificar-workflow: OK` because `.github/workflows/deploy.yml` uses space indentation and contains, in order, checkout@v7, setup-node@v7 with `.nvmrc`, `npm ci`, `npm run format:check`, `npm run check`, `npm test`, `npm run build`, configure-pages@v6, upload-pages-artifact@v5 with `path: dist` and deploy-pages@v5.
2. **WHEN** `npm run build` runs **THE SYSTEM SHALL** write the six pages `dist/index.html`, `dist/hoy/index.html`, `dist/dia/index.html`, `dist/calendario/index.html`, `dist/progreso/index.html` and `dist/ajustes/index.html`, and `verificar-dist.mjs` SHALL print `verificar-dist: OK`.
3. **WHEN** the README is read by `grep` **THE SYSTEM SHALL** contain `src/data/rutas/index.ts` and the rule «nunca renombres un `slug`».
4. **WHEN** `npm run format:check` runs **THE SYSTEM SHALL** exit 0 including `.github/workflows/deploy.yml`.

**Verify** — cada comando, en orden, desde la raíz del proyecto. Cada uno sale 0 cuando la tarea es correcta.

```bash
node scripts/verificar-workflow.mjs
npm test
npm run check
npm run build
test -f dist/index.html
test -f dist/hoy/index.html
test -f dist/dia/index.html
test -f dist/calendario/index.html
test -f dist/progreso/index.html
test -f dist/ajustes/index.html
grep -q 'src/data/rutas/index.ts' README.md
grep -qi 'nunca renombres un `slug`' README.md
npm run format:check
```

**Checkpoint**

```bash
git add -A && git commit -m "E2-T7: Workflow de GitHub Pages y README del docente"
git tag step-14-despliegue
```

Ejecuta ambos después de que el último comando de Verify salga 0 y antes de empezar la siguiente tarea. El tag es el punto de retorno: si la siguiente tarea sale mal, `git reset --hard` a este tag.

---

## Epic acceptance

El epic está hecho cuando todas sus tareas están `done` **y**:

1. **WHEN** `npm run build` runs **THE SYSTEM SHALL** write the six pages `dist/index.html`, `dist/hoy/index.html`, `dist/dia/index.html`, `dist/calendario/index.html`, `dist/progreso/index.html` and `dist/ajustes/index.html` and print `verificar-dist: OK`.
2. **WHEN** `npm test` runs **THE SYSTEM SHALL** pass every test in `tests/unit/` and `tests/componentes/` with 0 failed and 0 skipped.
3. **WHEN** `node scripts/verificar-workflow.mjs` runs **THE SYSTEM SHALL** print `verificar-workflow: OK`.

```bash
npm run check && npm test && npm run format:check
npm run build
node scripts/verificar-workflow.mjs
```

Después de este epic sigue la lista de lanzamiento del blueprint §20.1 (push, activar GitHub Pages, pasadas manuales): requiere la cuenta del docente y no es un gate de construcción.

## Pitfalls

- **`client:load` en vez de `client:only`** — el build intentaría renderizar sin `localStorage` y mostraría un estado vacío que luego parpadea.
- **Varias `h1`** — la página ya tiene la suya; las islas usan `h2`/`h3`.
- **Componentes que leen `localStorage` directo** — usa el store; solo `LimiteErrores` exporta el texto crudo.
- **Pruebas que dependen del reloj** — fija `fechaHoy.value`.
- **Hacer push o activar Pages dentro de una tarea** — requiere cuenta; va en §20.1.

## Before moving on

- [ ] Cada tarea de este epic está `done` en `tasks.json`; ninguna queda `in_progress`.
- [ ] Pasó cada comando de `verify` de cada tarea, no solo el primero.
- [ ] Ningún comando de `verify` se editó ni se omitió.
- [ ] Cada tarea tiene su tag (`git tag -l 'step-*'` lista también `step-08-inicio` … `step-14-despliegue`).
- [ ] El gate pasa desde la raíz del proyecto.
- [ ] Cada contrato «Produced» existe con la firma indicada.
- [ ] Ningún archivo fuera del subárbol fue modificado.
- [ ] `.env.example`: no aplica — el proyecto no usa variables de entorno.
- [ ] Un commit por tarea, con prefijo del id de tarea, seguido de su tag.
