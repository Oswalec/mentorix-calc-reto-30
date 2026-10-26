# Mentorix Calc — Reto de Estudio de 30 Días — Blueprint

> Generado por The Architect el 2026-10-26
> Shape: saas-webapp (recortado: sin auth, sin pagos, sin servidor, sin base de datos remota) · `knowledge/shapes/saas-webapp.md`
> Runtime track: ts-node, variante sitio estático (Astro + islas Preact, npm) · `knowledge/runtime-tracks/ts-node.md`
> Modo de emisión: bundle
> Versión del blueprint: 1
> Versiones verificadas: 2026-10-26 — ver §11 para la procedencia de cada paquete

**Cómo usar este bundle.** Este archivo explica el *porqué*. `tasks.json` decide la siguiente tarea y `epics/01-fundamentos-y-logica.md` y `epics/02-interfaz-y-despliegue.md` explican el *cómo* de cada una (son autocontenidos). `workspace/` se copia a la raíz del proyecto una sola vez con el comando de §10 (no sobrescribe nada). Todos los comandos se ejecutan desde la raíz del proyecto `mentorix-calc-reto-30/`, con el bundle en `blueprints/mentorix-calc-reto-30/`, en Git Bash (Windows) o en Linux.

---

## 1. Project Overview & Non-Goals

### Vision

Mentorix Calc — Reto de Estudio de 30 Días es una guía de estudio y seguimiento personal para los estudiantes de Cálculo del acompañamiento Mentorix Calc del docente Oswaldo (cuenta GitHub `Oswalec`). Cada día responde una sola pregunta: **«¿Qué debo hacer hoy para avanzar en mi preparación para el examen y cómo debo utilizar los recursos que ya tengo?»**. El estudiante elige una de cuatro rutas (Cálculo Diferencial, Cálculo Integral, Cálculo Multivariable, Ecuaciones Diferenciales), fija su fecha de inicio y sus minutos diarios, y recibe un plan día por día con una metodología fija de siete bloques (Recuperar, Teoría, Ejemplos resueltos, Práctica, Descanso, Repaso, Cierre), repaso espaciado, días ligeros, hitos de evaluación con exámenes de años anteriores y un simulacro final.

La app **orienta, organiza y da seguimiento; no sustituye los materiales del acompañamiento**. No contiene ni un solo ejercicio, solución, video o fórmula: los exámenes y ejercicios aparecen únicamente como actividades programadas que el estudiante realiza con sus recursos externos («Resuelve los ejercicios básicos de…», «Realiza un examen de años anteriores sobre Funciones», «Completa el simulacro que tienes disponible en tu acompañamiento»). Treinta días son un horizonte de planificación, no una obligación de comprimir: el plan nunca recorta los días estimados de un subtema; lo que no cabe queda listado como «Para después del horizonte» y el estudiante puede extender su ruta.

### Users

| Persona | Qué viene a hacer | Frecuencia |
|---|---|---|
| Estudiante del acompañamiento (desde el celular, decenas a pocos cientos) | Abrir «Hoy», seguir los bloques del día con sus materiales, marcarlos, registrar dificultades y su reflexión | Diaria |
| Estudiante en día-hito | Registrar la nota de un examen de años anteriores o del simulacro, errores y temas a reforzar | Cada 5–12 días |
| Estudiante revisando su avance | Ver progreso de actividades, repasos pendientes y declarar su dominio por subtema con evidencia | Semanal |
| Docente (Oswaldo) | Editar las rutas en `src/data/rutas/` y publicar con un `git push` | Mensual |

### Goals — v1 scope

1. El estudiante elige una de las cuatro rutas, fecha de inicio, horizonte (7–120 días, 30 por defecto) y minutos por día (60–360, 120 por defecto), y obtiene un plan determinista de N días.
2. Cada día muestra los siete apartados: Objetivo del día, Qué estudiar, Qué hacer, Repaso, Tiempo sugerido por bloque, Cierre de sesión (checklist + registrar errores) y Siguiente paso.
3. El estudiante marca bloques completados, registra dificultades, reflexiones y resultados de exámenes externos, y todo persiste en `localStorage` bajo `mentorix-reto:v1`.
4. El plan se ajusta (duración, extensión +7/+14/personalizada, refuerzo de prerrequisitos, día ligero) sin perder lo completado, porque los IDs de bloque no dependen de fechas.
5. El progreso de actividades y el dominio declarado se muestran separados; el dominio solo cambia por declaración explícita, y «dominado» exige evidencia escrita.
6. Exportar e importar el progreso como JSON, con recordatorio si no se exporta hace 7 días o más.
7. Sitio estático en GitHub Pages, móvil primero, modo claro/oscuro, accesible (AA, teclado, foco visible).

### Non-Goals — explicitly out of scope for v1

| No se construye | Por qué no ahora | Se revisa cuando |
|---|---|---|
| Banco de ejercicios, ejercicios interactivos, solucionarios, videos propios, generador de preguntas, corrección automática | Requisito literal del docente: la app solo guía; el contenido vive en el acompañamiento | Nunca en este producto (decisión de alcance del docente) |
| Simulacros o exámenes dentro de la web | Duplicaría materiales que ya existen y cambiaría la naturaleza del producto | El docente decide ofrecer una plataforma de evaluación propia |
| Cuentas, login, panel del docente con el avance de cada alumno | Requiere servidor, base de datos y datos personales; el MVP valida primero el hábito diario | El docente necesita ver el avance de cada estudiante (ver §20.3 #1) |
| Sincronización entre dispositivos | Sin servidor no hay dónde sincronizar; exportar/importar cubre el cambio de dispositivo | Más del 20% de estudiantes reporta pérdida de progreso al cambiar de celular |
| Notificaciones push | Necesitan service worker, permisos y un servidor de envío | Se mida que los estudiantes abandonan por olvido |
| Pagos, analítica de terceros, IA | Cuestan cuentas, privacidad y dinero; nada del MVP los necesita | Exista un modelo de negocio o una pregunta concreta que la analítica responda |
| Servicio externo de errores (Sentry u otro) | Requiere cuenta; el MVP usa `console.error` estructurado + límite de errores | Aparecen reportes de fallos no reproducibles (ver §20.3 #2) |

**El constructor no debe implementar nada de esta tabla**, aunque parezca un agregado pequeño mientras trabaja en un paso vecino. Si un paso parece requerir un non-goal, es un defecto del blueprint: detente y repórtalo.

### Success metrics

| Métrica | Meta | Cómo se mide |
|---|---|---|
| Estudiantes que exportan un respaldo en su primera semana | ≥ 50% al 2027-03-31 | Encuesta del docente en el grupo del acompañamiento (no hay analítica: decisión de privacidad) |
| Estudiantes que llegan al día 30 con ≥ 70% de bloques completados | ≥ 30% al 2027-03-31 | Captura de la tarjeta «Avance de actividades» que el estudiante comparte con el docente |
| Reportes de pérdida de progreso | ≤ 2 por mes | Mensajes recibidos por el docente |
| Peso de la página «Hoy» | < 250 KB transferidos (sin fuentes en caché) | DevTools → Network sobre la URL publicada (checklist §20.1) |

---

## 2. Tech Stack

**Runtime track: ts-node (variante sitio estático).** Esta tabla nombra *elecciones*, no versiones. Cada versión vive en §11 y en ningún otro lugar.

Las versiones vienen del informe de `stack-researcher` y de `npm view` en vivo del 2026-10-26 (la autoridad). `knowledge/runtime-tracks/ts-node.md` es el respaldo para lo no resuelto; en este proyecto el informe resolvió todo.

| Capa | Elección | Por qué esto y no lo otro |
|---|---|---|
| Lenguaje / runtime | TypeScript estricto (`astro/tsconfigs/strict`) sobre Node 24 | El generador del plan es lógica con muchas formas de datos; los tipos atrapan errores antes de las pruebas. Node 24 es LTS y es lo que la máquina del docente ya tiene. Se descartó TypeScript 7: `@astrojs/check` solo acepta 5 o 6. |
| Framework | Astro con `output: 'static'`, `base: '/mentorix-calc-reto-30'`, `trailingSlash: 'always'` | Es la misma familia que el sitio de ejercicios del docente (que ya publica en GitHub Pages con base); salida 100% estática, sin servidor. Se descartó Next.js: añade un runtime de servidor que este producto no usa. |
| Islas interactivas | Preact (línea 10) vía `@astrojs/preact`, siempre `client:only="preact"` | 4 KB frente a ~45 KB de React; las pantallas leen `localStorage`, que no existe en el build, así que se renderizan solo en el cliente. Se eligió Preact 10 y no 11 porque `@testing-library/preact` no está probado con 11. |
| Estado | `@preact/signals` | Un solo `signal<Estado>` compartido por todas las islas de la página, sin contexto ni reducers; los derivados (`planActivo`, `hoyNumero`) son `computed`. |
| Styling | CSS propio con tokens en `:root` (`src/styles/tokens.css`, `global.css`) | Una docena de componentes no justifica Tailwind; los tokens dan modo oscuro con una regla. |
| Fuentes | `@fontsource-variable/fraunces` (títulos) y `@fontsource-variable/inter` (texto), autoalojadas | Sin Google Fonts en tiempo de ejecución: sin terceros, sin bloqueos y funciona en redes lentas. |
| Component layer | Componentes propios en `src/components/` | Ninguna librería de UI: los formularios son simples y así el bundle queda pequeño. |
| Database | NOT APPLICABLE — `localStorage` del navegador (clave `mentorix-reto:v1`) + exportar/importar JSON | Sin cuentas no hay a quién asociar datos en un servidor; el estudiante es dueño de su progreso. |
| ORM / data access | NOT APPLICABLE — `src/lib/progreso/almacen.ts` envuelve `localStorage` en try/catch | No hay base de datos. |
| Auth | NOT APPLICABLE — sin cuentas | Las cuentas son un non-goal de §1: el progreso pertenece al navegador del estudiante. |
| Background work | NOT APPLICABLE — no hay servidor ni tareas programadas | Todo ocurre en el navegador al abrir la página. |
| Payments | NOT APPLICABLE — producto gratuito del acompañamiento | Non-goal. |
| File storage | NOT APPLICABLE — el único archivo es el respaldo JSON que el navegador descarga | — |
| Email / notifications | NOT APPLICABLE — sin push (non-goal); recordatorio de respaldo dentro de la app | — |
| Pruebas | Vitest + happy-dom + `@testing-library/preact`, `astro check`, `scripts/verificar-dist.mjs` | Vitest comparte la configuración de Vite de Astro vía `getViteConfig`; happy-dom da `localStorage` y DOM sin navegador. Se descartó Playwright en el MVP: los flujos críticos son de una isla y se cubren con pruebas de componentes. |
| Formato | Prettier + `prettier-plugin-astro` | El track sugiere Biome, pero Biome no formatea `.astro` con la misma madurez y el proyecto hermano ya usa Prettier. |
| Hosting | GitHub Pages vía GitHub Actions (`.github/workflows/deploy.yml`) | Gratis, mismo flujo que el sitio de ejercicios del docente, sin cuentas nuevas. |
| Package manager | npm (con `package-lock.json`) | pnpm no está instalado en la máquina del docente; npm viene con Node. |

### Compatibility check

Revisado contra `knowledge/stack-compatibility.md` — sin combinaciones conocidas como malas. Las tres compatibilidades que importan quedaron fijadas y probadas: TypeScript en la línea 6 (peer de `@astrojs/check` 0.9.12: `^5 || ^6`); `vite` 8 como devDependency directa para que Astro 7 y Vitest 5 compartan una sola copia; y Vitest 5 con `environment: 'happy-dom'`, que el informe marcó como no verificado para 5.x y que la prueba de humo del paso 1 comprueba (renderiza JSX de Preact y usa `localStorage`). Antes de actualizar Astro de mayor, lee https://docs.astro.build/en/guides/upgrade-to/v7/ por si `base` cambia de comportamiento.

---

## 3. Directory Structure

```
mentorix-calc-reto-30/
  .claude/                         # configuración del agente (copiada de workspace/, §19)
    settings.json                  # permisos: cada comando Verify y del gate §20.1
    rules/                         # convenciones por área con `paths:` (§19.5)
      rutas-datos.md
      logica-plan-progreso.md
      interfaz.md
      pruebas.md
    skills/agregar-o-editar-ruta/SKILL.md   # flujo repetible del docente (§19.4)
  .github/workflows/deploy.yml     # build + deploy a GitHub Pages (paso 14)
  blueprints/mentorix-calc-reto-30/ # ESTE bundle: blueprint, tasks.json, epics/, workspace/ (ignorado por Prettier, tsc y Vitest)
  dist/                            # salida de `astro build` (ignorada por git)
  scripts/
    verificar-dist.mjs             # falla si un href/src interno de dist/**/*.html no empieza con /mentorix-calc-reto-30/ (workspace/)
    verificar-workflow.mjs         # comprobación estructural sin red de deploy.yml (paso 14)
  src/
    components/                    # islas Preact (.tsx); cada una exporta Nombre + default IslaNombre con LimiteErrores
      LimiteErrores.tsx            # límite de errores: mensaje amable + «Exportar respaldo» (paso 7)
      Inicio.tsx                   # elegir ruta + configuración, o resumen (paso 8)
      GuiaDia.tsx                  # los 7 apartados de un día; usado por /hoy/ y /dia/ (pasos 9, 11, 13)
      Calendario.tsx               # rejilla de N días + «Para después del horizonte» (paso 10)
      FormularioEvaluacion.tsx     # resultado de examen externo en días-hito (paso 11)
      DiarioDificultades.tsx       # lista de dificultades/errores con «resuelta» (paso 11)
      Progreso.tsx                 # avance, estudiados, repasos, exámenes, dominio (paso 12)
      RecordatorioRespaldo.tsx     # aviso de 7 días sin exportar + exportarProgreso() (paso 13)
      Ajustes.tsx                  # ruta, plan, extender, refuerzos, respaldo, reinicio (paso 13)
    data/rutas/                    # contenido editable por el docente
      index.ts                     # registro `rutas` + buscarRuta/buscarTema (pasos 3 y 5)
      calculo-diferencial.ts       # (paso 3)
      calculo-integral.ts          # (paso 3)
      calculo-multivariable.ts     # (paso 5)
      ecuaciones-diferenciales.ts  # (paso 5)
    layouts/Base.astro             # html, tema inline, navegación, conmutador claro/oscuro (paso 2)
    lib/
      tipos.ts                     # tipos del dominio (paso 3)
      fechas.ts                    # aritmética de fechas YYYY-MM-DD sin zonas horarias (paso 4)
      enlaces.ts                   # enlace()/enlaceDia() con la base del sitio (paso 8)
      plan/
        minutos.ts                 # reparto de minutos por bloque (paso 4)
        generador.ts               # generarPlan + erroresConfig (paso 4)
        ajustes.ts                 # configInicial, cambiarDuracion, extenderHorizonte, fijarRefuerzo, prerrequisitosDeRuta (paso 5)
      progreso/
        estado.ts                  # forma del Estado, claves, migrar() (paso 6)
        validar.ts                 # validarEstado manual (paso 6)
        almacen.ts                 # localStorage con try/catch (paso 6)
        acciones.ts                # acciones puras sobre el Estado (paso 6)
        respaldo.ts                # exportar/importar JSON, recordatorio (paso 7)
        derivados.ts               # estado del día, avance, repasos pendientes, dominio (paso 7)
        store.ts                   # signals globales + actualizar() (paso 8)
    pages/                         # una h1 estática + una isla client:only por página
      index.astro                  # / (pasos 1, 2, 8)
      hoy/index.astro              # /hoy/ (paso 9)
      dia/index.astro              # /dia/?n=N (paso 9)
      calendario/index.astro       # /calendario/ (paso 10)
      progreso/index.astro         # /progreso/ (paso 12)
      ajustes/index.astro          # /ajustes/ (paso 13)
    styles/
      tokens.css                   # única fuente de colores, tipos, radios, espaciado (paso 2)
      global.css                   # estilos globales y de componentes, solo con var(--token) (paso 2)
  tests/
    setup.ts                       # cleanup + localStorage.clear() tras cada prueba (workspace/)
    fixtures/ruta-prueba.ts        # ruta mínima del ejemplo trabajado de §4 (paso 4)
    unit/                          # humo, tokens, rutas, generador, ajustes, progreso, respaldo, derivados
    componentes/                   # inicio, guia-dia, calendario, evaluaciones, progreso, ajustes
  .gitattributes                   # * text=auto eol=lf (workspace/)
  .gitignore                       # node_modules/, dist/, .astro/, .env* (workspace/)
  .nvmrc                           # 24 (workspace/)
  .prettierignore                  # blueprints/, dist/, .astro/, node_modules/, package-lock.json, *.md (workspace/)
  .prettierrc                      # plugin astro, endOfLine lf (workspace/)
  AGENTS.md                        # puente para agentes que no leen CLAUDE.md (workspace/)
  CLAUDE.md                        # instrucciones del proyecto (workspace/)
  README.md                        # guía del docente: cómo editar rutas y publicar (paso 14)
  astro.config.mjs                 # site, base, trailingSlash, output, preact (workspace/)
  package.json                     # manifiesto completo con todas las dependencias (workspace/)
  package-lock.json                # lo genera `npm install` en §10 (nunca a mano)
  tsconfig.json                    # strict + jsx preact, excluye blueprints/ (workspace/)
  vitest.config.ts                 # getViteConfig + happy-dom + setupFiles (workspace/)
```

Todo archivo de este árbol tiene uno de dos orígenes: lo crea un paso de §9 (indicado entre paréntesis) o llega desde `workspace/` con la copia de §10. `.astro/` (tipos generados por Astro), `dist/`, `node_modules/` y `package-lock.json` los generan las herramientas.

**Reglas de frontera**

- `src/data/rutas/**` solo importa tipos de `src/lib/tipos.ts`.
- `src/lib/plan/**` y `src/lib/fechas.ts` no tocan `window`, `localStorage` ni el reloj dentro de `generarPlan`.
- `src/lib/progreso/**` (salvo `store.ts`) no importa Preact ni signals; `store.ts` es el único módulo con signals.
- Los componentes escriben solo con `actualizar(…)` del store; `localStorage` directo solo en `almacen.ts` y `LimiteErrores.tsx` (que exporta datos crudos aunque estén dañados).
- `scripts/*.mjs` solo importan módulos `node:`; nunca importan de `src/`.
- **Convención de resolución:** imports relativos sin extensión y sin alias. Está reconciliada contra todos los cargadores en la *Resolution convention matrix* de §19.6.

---

## 4. Data Model

No hay base de datos: hay **dos modelos**. El *contenido* (rutas) es código TypeScript versionado en git; el *progreso* es un JSON en `localStorage` del navegador. El *plan* no se guarda: se recalcula siempre con `generarPlan(ruta, config, catalogo)`, que es pura.

### Entities

**Ruta** — una asignatura; vive en `src/data/rutas/<slug>.ts`, la edita el docente.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `slug` | string | kebab-case, único en todo el catálogo, inmutable una vez publicado | prefijo de cada ID de bloque |
| `nombre` | string | no vacío | lo que ve el estudiante |
| `descripcion` | string | no vacío | texto de la tarjeta en Inicio |
| `temas` | Tema[] | ≥ 1 | orden = orden de estudio |

**Tema** — un bloque de varios días dentro de una ruta.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `slug` | string | kebab-case, único en todo el catálogo, ≠ `final` | clave de evaluación/corrección |
| `nombre` | string | no vacío | aparece en «Realiza un examen de años anteriores sobre <nombre>» |
| `prerrequisitos` | string[] | cada slug existe en el catálogo; si es de la misma ruta, aparece antes | puede ser de otra ruta (Integral → `derivadas`) |
| `subtemas` | Subtema[] | ≥ 1 | — |

**Subtema** — la unidad de estudio atómica.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `slug` | string | kebab-case, único en todo el catálogo, inmutable | clave del dominio declarado |
| `nombre` | string | no vacío | — |
| `diasEstimados` | number | entero ≥ 1 | el plan nunca lo reduce |
| `dificultad` | 1 \| 2 \| 3 | — | 3 mueve 5 puntos de Recuperar a Práctica |

**ConfigPlan** — configuración por ruta, guardada en el progreso.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `fechaInicio` | string | `YYYY-MM-DD` válida | día 1 |
| `horizonteDias` | number | entero 7..120, defecto 30 | N |
| `minutosPorDia` | number | múltiplo de 5 en 60..360, defecto 120 | total de un día no ligero |
| `diaLigeroCada` | number | entero 0..30, defecto 7; 0 = nunca | días n con `n % diaLigeroCada === 0` son de repaso |
| `refuerzos` | `{ temaSlug, dias }[]` | `dias` entero 1..7 | días de refuerzo de un prerrequisito |

**Estado** — todo el progreso, clave `mentorix-reto:v1`.

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `version` | 1 | literal | otra versión → dato corrupto (hasta que exista `migrar`) |
| `rutaActiva` | string \| null | — | slug de la ruta abierta |
| `ultimoRespaldo` | string \| null | `YYYY-MM-DD` | fecha del último exportar; alimenta el recordatorio |
| `rutas` | Record<rutaSlug, ProgresoRuta> | — | cada ruta conserva su progreso al cambiar de ruta |

**ProgresoRuta**

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `config` | ConfigPlan | pasa `erroresConfig` | — |
| `completados` | Record<bloqueId, string> | valor = instante ISO | marcar/desmarcar; IDs huérfanos se ignoran |
| `evaluaciones` | Evaluacion[] | una por `diaNumero` (reemplaza) | resultados de exámenes externos |
| `dificultades` | RegistroDificultad[] | `texto` no vacío | diario de dificultades/errores |
| `dominio` | Record<subtemaSlug, DominioSubtema> | `dominado` ⇒ `evidencia` no vacía | solo cambia por declaración explícita |
| `reflexiones` | Record<String(diaNumero), string> | texto vacío borra | reflexión del día |

**Evaluacion**: `id` (string), `diaNumero` (number), `temaSlug` (string \| null — null en el simulacro), `fecha` (`YYYY-MM-DD`), `nota` (number ≥ 0 \| null), `notaMaxima` (number > 0 \| null; `nota ≤ notaMaxima` si ambas), `errores` (string), `temasAReforzar` (string[] de slugs de tema).

**RegistroDificultad**: `id`, `fecha` (`YYYY-MM-DD`), `subtemaSlug` (string \| null), `texto` (no vacío), `resuelta` (boolean).

**DominioSubtema**: `nivel` (`'sin-evaluar' | 'en-progreso' | 'inseguro' | 'dominado'`), `evidencia` (string), `fecha` (`YYYY-MM-DD`).

### Relationships

- Ruta —(1:N)→ Tema —(1:N)→ Subtema. Borrar un subtema del código deja huérfanos sus `completados` y su `dominio`: se ignoran sin romper nada (riesgo §20.2 #2).
- Tema —(N:M)→ Tema vía `prerrequisitos` (también entre rutas).
- Estado —(1:N)→ ProgresoRuta (por slug). Cambiar de ruta no borra el progreso de la anterior; solo «Reiniciar todo» lo borra, tras confirmar.
- Bloque —(1:0..1)→ entrada en `completados`. El ID no contiene fechas, así que cambiar `fechaInicio` o el horizonte conserva los completados.

### Indexes

| Table | Index | Why |
|---|---|---|
| `completados` | clave = ID de bloque (objeto JSON) | consulta O(1) `bloqueId in completados` por cada casilla |
| `dominio` | clave = `subtemaSlug` | una fila de la tabla de dominio por subtema |
| `reflexiones` | clave = `String(diaNumero)` | la reflexión del día abierto |

### Schema

La forma exacta está en `src/lib/tipos.ts` (paso 3) y `src/lib/progreso/estado.ts` (paso 6), con contenido literal en esos pasos. Ejemplo de un `Estado` válido:

```json
{
  "version": 1,
  "rutaActiva": "calculo-diferencial",
  "ultimoRespaldo": null,
  "rutas": {
    "calculo-diferencial": {
      "config": {
        "fechaInicio": "2026-03-01",
        "horizonteDias": 30,
        "minutosPorDia": 120,
        "diaLigeroCada": 7,
        "refuerzos": []
      },
      "completados": {
        "calculo-diferencial:estudio:dominio-y-rango#1:teoria": "2026-03-01T10:00:00.000Z"
      },
      "evaluaciones": [],
      "dificultades": [],
      "dominio": {},
      "reflexiones": {}
    }
  }
}
```

### Algoritmo del plan — especificación exacta

`generarPlan(ruta, config, catalogo = [ruta]) → { dias: Dia[], fueraDelHorizonte: SubtemaRef[] }` (en `src/lib/plan/generador.ts`, paso 4). Lanza `RangeError` si `erroresConfig(config)` no está vacío. `catalogo` solo sirve para nombrar temas prerrequisito de otras rutas.

1. **Grupos.** Para cada tema T (en orden) y cada subtema S de T (en orden) se forma un grupo atómico de unidades:
   - si S es el primer subtema de T: primero, por cada prerrequisito P de T (en orden) que tenga un refuerzo `{ temaSlug: P, dias: d }` con d ≥ 1 y que no se haya usado antes en la ruta, d unidades `refuerzo` (P#1…P#d);
   - luego `S.diasEstimados` unidades `estudio` (S#1…S#k);
   - si S es el último subtema de T: una unidad `evaluacion` (T) y una `correccion` (T).
2. **Días ligeros.** El día n (1..N) es ligero si `diaLigeroCada > 0` y `n % diaLigeroCada === 0`; los ligeros son siempre `repaso` y no consumen unidades.
3. **Colocación sin compresión.** Con un cursor que empieza en 1: un grupo cabe si el número de días no ligeros entre el cursor y N es ≥ el número de unidades del grupo. Si cabe, cada unidad ocupa el siguiente día no ligero. Si no cabe, ese subtema y **todos** los siguientes (de todos los temas siguientes) van a `fueraDelHorizonte` como `{ temaSlug, subtemaSlug, nombre, diasEstimados }`, y no se coloca nada más.
4. **Días libres al final** (no ligeros, desde el cursor hasta N): si nada quedó fuera y hay ≥ 2, el penúltimo libre es `simulacro` y el último `correccion` (clave `final`); el resto, `repaso`. Si algo quedó fuera, todos los libres son `repaso` (no hay simulacro sin haber cubierto la ruta).
5. **Repaso espaciado.** Si el día d es el último día de estudio de S (k = diasEstimados), S se programa en los días d+1, d+3, d+7 y d+14 que sean ≤ N. Se recorre d de 1 a N, así que dentro de un día los repasos quedan en orden de día de estudio. Cada uno aparece en `repasoSlugs` y como texto `Repasa «<nombre>» (lo estudiaste el día <d>).` en `repaso`.
6. **Días de repaso** se numeran por orden de aparición: `rep-1`, `rep-2`, …
7. **Fechas:** `fecha = sumarDias(fechaInicio, numero - 1)`, aritmética UTC sobre `YYYY-MM-DD`.

**ID estable de bloque:** `${rutaSlug}:${tipoDia}:${clave}:${tipoBloque}` con `clave` = `${subtemaSlug}#${k}` (estudio), `${prerrequisito}#${k}` (refuerzo), `${temaSlug}` (evaluación/corrección de tema), `rep-${n}` (repaso) o `final` (simulacro y su corrección). Nunca incluye fechas.

**Bloques y minutos por tipo de día.** Regla única: `m = max(floor(total × peso / 500) × 5, 5)`; el residuo `total − Σm` se suma al bloque residuo; la suma es exactamente `total`. `total = minutosPorDia`, salvo en días `repaso`: `floor(minutosPorDia / 10) × 5`.

| Tipo de día | Bloques (orden) y pesos % | Residuo a |
|---|---|---|
| `estudio` dificultad 1–2, `refuerzo` | recuperar 10 · teoria 25 · ejemplos 15 · practica 30 · descanso 5 · repaso 10 · cierre 5 | practica |
| `estudio` dificultad 3 | recuperar 5 · teoria 25 · ejemplos 15 · practica 35 · descanso 5 · repaso 10 · cierre 5 | practica |
| `evaluacion`, `simulacro` | recuperar 10 · evaluacion 65 · descanso 5 · repaso 10 · cierre 10 | evaluacion |
| `correccion` | recuperar 10 · practica 50 · descanso 5 · repaso 25 · cierre 10 | practica |
| `repaso` (ligero) | recuperar 30 · repaso 50 · descanso 10 · cierre 10 | repaso |

Con 120 minutos: estudio 1–2 → 10/30/15/45/5/10/5; estudio 3 → 5/30/15/50/5/10/5; evaluación → 10/85/5/10/10; corrección → 10/65/5/30/10; repaso (60) → 15/35/5/5.

**Textos** (plantillas literales; nunca contenido matemático) — por tipo de día:

| Tipo | `titulo` | `objetivo` | `queHacer` |
|---|---|---|---|
| estudio | `<S>` | `Comprender y practicar «<S>»` + ` (día k de K)` si K > 1 + `.` | `Estudia la teoría con los videos y materiales de tu acompañamiento, analiza un ejercicio resuelto y resuelve los ejercicios básicos; si te sobra tiempo, sigue con los adicionales.` |
| refuerzo | `Refuerzo: <P>` | `Reforzar «<P>» antes de empezar «<T>»` + tramo + `.` | `Repasa la teoría de «<P>» en los materiales de tu acompañamiento y resuelve ejercicios básicos de ese tema para llegar preparado a «<T>».` |
| evaluacion | `Evaluación: <T>` | `Medir tu dominio de «<T>» en condiciones de examen.` | `Realiza un examen de años anteriores sobre <T>, con tiempo limitado y sin consultar tus apuntes. Registra tu nota y tus errores.` |
| correccion (tema) | `Corrección: <T>` | `Entender cada error del examen de «<T>».` | `Revisa los errores cometidos y programa un repaso de los subtemas donde fallaste.` |
| simulacro | `Simulacro` | `Comprobar tu preparación con un examen completo.` | `Completa el simulacro que tienes disponible en tu acompañamiento, con el tiempo real del examen.` |
| correccion (final) | `Corrección del simulacro` | `Convertir los errores del simulacro en un plan de repaso.` | `Revisa los errores cometidos en el simulacro y programa un repaso de los temas a reforzar.` |
| repaso | `Repaso` | `Consolidar lo estudiado con recuperación activa y repaso espaciado, sin teoría nueva.` | `Haz recuperación activa de lo estudiado y repasa los subtemas programados. Hoy no hay teoría nueva.` |

`siguientePaso` = `Día <n+1>: <titulo del día n+1>.`; el último día: `Fin del horizonte: revisa tu progreso y, si aún tienes temas pendientes, extiende la ruta.` `cierre` = `Marca los bloques que completaste.` · `Registra los errores o dificultades que encontraste.` · `Escribe en una frase qué aprendiste hoy.` Las instrucciones de cada bloque están literales en `generador.ts` (paso 4).

### Ejemplo trabajado (valores exactos que verifican las pruebas)

Ruta de prueba `prueba` (`tests/fixtures/ruta-prueba.ts`): tema `t1` «Tema uno» con `a` «Subtema A» (2 días, dificultad 1) y `b` «Subtema B» (1 día, dificultad 3); tema `t2` «Tema dos» (prerrequisito `t1`) con `c` «Subtema C» (3 días, dificultad 2). Config: `fechaInicio 2026-03-01`, horizonte 14, 120 min, día ligero cada 7, sin refuerzos.

| Día | Fecha | Tipo:clave | Repaso espaciado (`repasoSlugs`) | Minutos del día |
|---|---|---|---|---|
| 1 | 2026-03-01 | estudio:a#1 | — | 120 |
| 2 | 2026-03-02 | estudio:a#2 | — | 120 |
| 3 | 2026-03-03 | estudio:b#1 | a | 120 |
| 4 | 2026-03-04 | evaluacion:t1 | b | 120 |
| 5 | 2026-03-05 | correccion:t1 | a | 120 |
| 6 | 2026-03-06 | estudio:c#1 | b | 120 |
| 7 | 2026-03-07 | repaso:rep-1 | — | 60 |
| 8 | 2026-03-08 | estudio:c#2 | — | 120 |
| 9 | 2026-03-09 | estudio:c#3 | a | 120 |
| 10 | 2026-03-10 | evaluacion:t2 | b, c | 120 |
| 11 | 2026-03-11 | correccion:t2 | — | 120 |
| 12 | 2026-03-12 | simulacro:final | c | 120 |
| 13 | 2026-03-13 | correccion:final | — | 120 |
| 14 | 2026-03-14 | repaso:rep-2 | — | 60 |

`fueraDelHorizonte = []`. Bloques del día 1: `prueba:estudio:a#1:recuperar`, `…:teoria`, `…:ejemplos`, `…:practica`, `…:descanso`, `…:repaso`, `…:cierre`. El plan tiene **80** bloques (6 días de estudio × 7 + 3 de evaluación/simulacro × 5 + 3 de corrección × 5 + 2 de repaso × 4); completar el día 1 da `{ completados: 7, total: 80, porcentaje: 9 }`.

- **Horizonte 7** (sin compresión): estudio:a#1, estudio:a#2, estudio:b#1, evaluacion:t1, correccion:t1, repaso:rep-1, repaso:rep-2; `fueraDelHorizonte = [{ temaSlug: "t2", subtemaSlug: "c", nombre: "Subtema C", diasEstimados: 3 }]`. Extender +7 vuelve a la tabla de arriba y los días 1–5 conservan sus IDs.
- **Refuerzo `{ temaSlug: "t1", dias: 2 }`**: días 1–5 iguales, luego refuerzo:t1#1, repaso:rep-1, refuerzo:t1#2, estudio:c#1, estudio:c#2, estudio:c#3, evaluacion:t2, correccion:t2, repaso:rep-2 (sin simulacro: no sobraron días). Objetivo del día 6: `Reforzar «Tema uno» antes de empezar «Tema dos» (día 1 de 2).`

### Migrations

No hay migraciones de base de datos. El esquema de `localStorage` está versionado (`version: 1`). Regla para el futuro: subir `VERSION_ESTADO`, convertir en `migrar()` (que hoy devuelve los datos tal cual) y ampliar `validarEstado()` en el mismo commit, con una prueba que cargue un `Estado` v1 real. Datos que no validan nunca se borran: se copian a `mentorix-reto:v1:danado` y se ofrecen para descargar.

### Seed data

NOT APPLICABLE — no hay base de datos que sembrar. El contenido inicial son las cuatro rutas escritas en los pasos 3 y 5; las pruebas usan `tests/fixtures/ruta-prueba.ts`.

---

## 5. API Design

NOT APPLICABLE — sitio estático sin servidor ni endpoints HTTP propios. Los contratos internos (funciones puras de `src/lib/`) están en §4 y en el código literal de los pasos 3–7; la única "interfaz de datos" externa es el archivo de respaldo `mentorix-reto-AAAA-MM-DD.json`, que es un `Estado` (§4) serializado con 2 espacios y salto de línea final.

---

## 6. Frontend Architecture

### Routes

Todas bajo la base `/mentorix-calc-reto-30/` (con `/` final).

| Route | Page | Data source | Auth |
|---|---|---|---|
| `/` | Inicio: elegir ruta + configurar (fecha = hoy, 30 días, 120 min), o resumen + «Ir a Hoy» | `rutas` + store | público |
| `/hoy/` | Guía del día actual (calculado por fecha) | store (`planActivo`, `hoyNumero`) | público |
| `/dia/?n=<numero>` | Detalle de cualquier día (mismo componente que Hoy) | store + `?n=` | público |
| `/calendario/` | Rejilla de N días con estado y tipo + «Para después del horizonte» con «Extender» | store | público |
| `/progreso/` | Avance de actividades, temas estudiados, repasos pendientes, diario de dificultades, resultados de exámenes, dominio declarado (separado) | store + derivados | público |
| `/ajustes/` | Ruta, fecha, horizonte, minutos, día ligero, extender, refuerzos, exportar/importar, reiniciar | store | público |

### Rendering strategy

Todas las páginas son HTML estático generado por `astro build` (`output: 'static'`). El marco (layout, navegación, `h1`) es estático; el contenido de cada página es una isla Preact con `client:only="preact"`, porque depende de `localStorage`, que no existe en el build. Cada isla muestra `<p slot="fallback">Cargando…</p>` hasta montar. No hay caché ni revalidación: GitHub Pages sirve archivos.

### Component hierarchy

```
Base.astro (estático: <head> con script de tema inline, navegación, conmutador)
└─ pages/hoy/index.astro → <h1>Tu guía de hoy</h1>
   └─ IslaGuiaDia (client:only) → LimiteErrores → GuiaDia
      ├─ RecordatorioRespaldo
      ├─ cabecera (Día n · fecha · tipo)
      ├─ Objetivo / Qué estudiar / Qué hacer / Repaso
      ├─ FormularioEvaluacion (solo evaluacion o simulacro)
      ├─ Tiempo sugerido por bloque (casillas)
      ├─ Cierre de sesión → RegistrarDificultad + Reflexion
      └─ Siguiente paso
pages/progreso/index.astro → IslaProgreso → LimiteErrores → Progreso
   ├─ Avance de actividades │ Temas estudiados │ Pendientes de repaso
   ├─ DiarioDificultades │ Resultados de exámenes
   └─ Dominio declarado → FilaDominio × subtema
```

### State management

Un único `signal<Estado>` en `src/lib/progreso/store.ts`, cargado de `localStorage` al importar el módulo. Derivados `computed`: `rutaActiva`, `progresoActivo`, `planActivo` (llama a `generarPlan(ruta, config, rutas)`), `hoyNumero`. `fechaHoy` es un signal (las pruebas lo fijan). Toda escritura: `actualizar((e) => accion(e, …))`, que asigna el nuevo estado y lo guarda; si guardar falla, `guardadoFallido` pasa a `true`. El estado de formularios es local (`useState`). No se guarda en global: el plan (se recalcula), textos de formularios a medio escribir, el tema claro/oscuro (lo maneja el script inline con la clave `mentorix-tema`).

### Loading, empty, and error states

| Superficie | Cargando | Vacío | Error |
|---|---|---|---|
| Toda isla | `fallback` «Cargando…» | — | `LimiteErrores`: «Algo salió mal en esta sección» + «Exportar respaldo» + «Volver a cargar»; `console.error` con JSON `{nivel, origen, mensaje, fecha}` |
| Inicio / Hoy / Calendario / Progreso sin ruta | — | «Todavía no eliges una ruta» + «Elegir mi ruta» | — |
| Datos guardados corruptos | — | — | «No pudimos leer tu progreso guardado» + «Descargar datos dañados» + «Empezar de nuevo» |
| Hoy antes de la fecha de inicio | — | aviso «Tu reto empieza el …» y muestra el día 1 | — |
| Hoy después del horizonte | — | «Terminaste los N días de tu reto» + «Extender la ruta» | — |
| `/dia/?n=` inválido | — | «Ese día no existe en tu plan» + «Ir al calendario» | — |
| Repaso del día | — | «Hoy no hay repasos programados.» | — |
| Para después del horizonte | — | «Todo tu contenido cabe en el horizonte actual.» | «La duración debe estar entre 7 y 120 días.» |
| Temas estudiados / repasos / dificultades / exámenes | — | textos vacíos literales del paso 12 y 11 | — |
| Formularios | — | — | `role="alert"` con el mensaje de validación; confirmación en `role="status"` |
| Importar | — | — | «El archivo no es un respaldo válido…» sin tocar el progreso |

---

## 7. Design System

Valores del brief del docente; literales en `src/styles/tokens.css` (paso 2).

### Colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--primary` | `#0F766E` | `#2DD4BF` | botones, enlaces, foco, días de estudio |
| `--primary-contrast` (= primary-fg) | `#FFFFFF` | `#04201C` | texto sobre primary |
| `--bg` (= background) | `#F6F8F7` | `#0B1513` | página |
| `--surface` | `#FFFFFF` | `#12201D` | tarjetas, navegación |
| `--surface-2` | `#EEF3F1` | `#1A2C28` | opciones de ruta, días completados |
| `--border` | `#D6E0DD` | `#24413B` | bordes, divisores, inputs |
| `--text` (= fg) | `#0F1F1C` | `#E7F0EE` | texto |
| `--text-muted` (= fg-muted) | `#5B6B67` | `#9DB0AB` | texto secundario |
| `--danger` (= destructive) | `#B91C1C` | `#F87171` | evaluación, simulacro, borrar |
| `--success` | `#15803D` | `#4ADE80` | días de repaso |
| `--warning` | `#B45309` | `#FBBF24` | días de corrección |
| `--accent` | `#D97706` | `#FBBF24` | días de refuerzo |

Colores de tipo de día (`--color-tipo` vía clase `tipo-<tipo>`): estudio = primary, refuerzo = accent, evaluación/simulacro = danger, corrección = warning, repaso = success. El color siempre va acompañado de texto (etiqueta del tipo).

**Contraste:** todos los pares de texto cumplen WCAG 2.2 AA (4.5:1); `tests/unit/tokens.test.ts` (paso 2) los calcula en ambos modos: text/bg, text/surface, text-muted/bg, text-muted/surface, primary-contrast/primary, primary/surface, danger/surface, warning/surface, success/surface. Los tres más justos (calculados con la fórmula de luminancia relativa WCAG): `--warning` sobre `--surface` claro ≈ 5.0:1, `--primary-contrast` sobre `--primary` claro ≈ 5.5:1, `--text-muted` sobre `--bg` claro ≈ 5.3:1. `--accent` claro (`#D97706`, ≈ 3.2:1) solo se usa como borde de color, nunca para texto.

### Typography

| Role | Family | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| Display (`h1`) | Fraunces Variable | 1.953rem (31.25px) / 1.2 | 600 | 0 |
| Heading (`h2`, `h3`) | Fraunces Variable | 1.5625rem / 1.2 · 1.25rem / 1.2 | 600 | 0 |
| Body | Inter Variable | 16px / 1.55 | 400 (600 en botones) | 0 |
| Mono | NOT APPLICABLE — no se muestra código | — | — | — |

**Font loading:** autoalojadas con `@fontsource-variable/fraunces` e `@fontsource-variable/inter` importadas en `Base.astro`; Astro las copia a `dist/_astro/` con la base correcta; `font-display: swap` (valor por defecto de Fontsource). Respaldo: `Georgia, serif` y `system-ui, -apple-system, "Segoe UI", sans-serif`.

### Spacing, radius, elevation

- Espaciado base 4px: `--e-1..7` = 4, 8, 12, 16, 24, 32, 48 px.
- Radio: 14px tarjetas (`--radio-tarjeta`), 10px botones e inputs (`--radio-boton`), 999px insignias.
- Sombras: `--sombra-1: 0 1px 2px rgb(15 31 28 / 0.06), 0 2px 8px rgb(15 31 28 / 0.06)`; `--sombra-2: 0 4px 16px rgb(15 31 28 / 0.1)`.
- Ancho máx. de contenido 960px · breakpoint único 960px (navegación inferior fija → barra lateral de 220px) · sin scroll horizontal a 360px.

### Motion

Transiciones de 180ms `ease-out` (`--transicion`) solo en fondos de botón; ninguna animación de entrada. `@media (prefers-reduced-motion: reduce)` anula toda transición y animación.

### Component style

Sobrio y cálido de estudio: tarjetas blancas (o verde muy oscuro en modo oscuro) con borde fino y sombra suave, títulos en Fraunces con carácter editorial y texto en Inter legible a 16px. Un solo color de acción (teal) y colores de tipo de día solo como bordes/insignias. Si un componente nuevo necesita un color que no está en los tokens, no pertenece.

---

## 8. Authentication & Authorization

NOT APPLICABLE — no hay cuentas (non-goal §1): el progreso pertenece al navegador del estudiante y nunca sale de él salvo en el archivo de respaldo que él descarga. Revertir esta decisión está en §20.3 #1.

---

## 9. BUILD ORDER

**Esta es la sección que el blueprint existe para producir.** Un constructor que sigue §9 al pie de la letra y se detiene cuando cada gate queda en verde entrega el proyecto. Cada paso trae el **contenido completo** de cada archivo que crea o reemplaza: escríbelo tal cual (luego `npm run format` no debería cambiar nada), corre su Verify y haz su Checkpoint.

### The rules of a step

1. **Una sesión por paso.** Máximo 5 archivos y 2–6 criterios de aceptación por paso.
2. **Cada paso trae los cuatro campos:** `Do`, `Done when`, `Verify`, `Checkpoint`, en ese orden de ejecución. El Checkpoint (`git add -A && git commit …` + `git tag step-NN-<slug>`) va al final: ningún Verify depende de él.
3. **Los criterios son EARS** (**WHEN** `<disparador>` **THE SYSTEM SHALL** `<respuesta observable>`) y los decide un comando, en esta máquina, sin red.
4. **«Se ve bien» está prohibido.** Toda condición es un código de salida, un texto o un valor guardado.
5. **`Verify` es shell literal** que se ejecuta desde la raíz del proyecto en Git Bash o Linux; cada línea sale 0 cuando el paso es correcto, también bajo `set -e`. Ninguna línea de este blueprint espera un código distinto de 0.
6. **Un paso no está hecho hasta que su Verify pasa** y los Verify de los pasos anteriores siguen pasando (todos corren `npm test` y `npm run check` completos, y los pasos 1, 2 y 8–14 también `npm run build`).
7. **Checkpoint en cada paso.** Si un paso sale mal: `git reset --hard <tag del paso anterior>` (por ejemplo `step-03-rutas-base`) y reintenta; nunca depures hacia adelante.
8. **No te adelantes.** Si un paso se bloquea, detente y repórtalo.
9. **Ningún paso rompe un gate anterior.** No hay variables de entorno; los únicos requisitos nuevos de cada paso son sus propias pruebas.
10. **Ningún número derivado sin contar.** Las pruebas afirman propiedades o valores calculados a mano en §4 (ejemplo trabajado) y verificados al ejecutar este código; los Verify no cuentan pruebas.
11. **Antes de Verify, ejecuta `npm run format`** si escribiste archivos a mano; el contenido de este blueprint ya está formateado.
12. **El sitio construido se ejecuta desde el paso 1:** `npm run build` corre `node scripts/verificar-dist.mjs`, que abre cada `dist/**/*.html` y falla si un enlace interno pierde la base `/mentorix-calc-reto-30/`.
13. **Los archivos de `workspace/` (configuraciones) no se editan** en ningún paso.

### One step, one unit — the counting rule

> **Un paso de §9 = una tarea de `tasks.json` = un bloque de tarea en un epic.**

14 pasos → 14 tareas → 2 epics de 7 (el rango legal para 10–14 pasos es exactamente 2).

### Step map

| # | Step | Depends on | Touches | Gate |
|---|---|---|---|---|
| 1 | Andamiaje: página mínima, prueba de humo y build verificado | — | `src/pages/index.astro`<br>`tests/unit/humo.test.tsx` | `npm run check` |
| 2 | Tokens de diseño, layout con navegación y modo claro/oscuro | 1 | `src/styles/tokens.css`<br>`src/styles/global.css`<br>`src/layouts/Base.astro`<br>`src/pages/index.astro`<br>`tests/unit/tokens.test.ts` | `npm test -- tests/unit/tokens.test.ts` |
| 3 | Tipos, registro de rutas, Diferencial e Integral | 1 | `src/lib/tipos.ts`<br>`src/data/rutas/index.ts`<br>`src/data/rutas/calculo-diferencial.ts`<br>`src/data/rutas/calculo-integral.ts`<br>`tests/unit/rutas.test.ts` | `npm test -- tests/unit/rutas.test.ts` |
| 4 | Generador del plan puro, fechas locales y reparto de minutos | 3 | `src/lib/fechas.ts`<br>`src/lib/plan/minutos.ts`<br>`src/lib/plan/generador.ts`<br>`tests/fixtures/ruta-prueba.ts`<br>`tests/unit/generador.test.ts` | `npm test -- tests/unit/generador.test.ts` |
| 5 | Ajustes del plan y catálogo completo de cuatro rutas | 4 | `src/lib/plan/ajustes.ts`<br>`src/data/rutas/calculo-multivariable.ts`<br>`src/data/rutas/ecuaciones-diferenciales.ts`<br>`src/data/rutas/index.ts`<br>`tests/unit/ajustes.test.ts` | `npm test -- tests/unit/ajustes.test.ts` |
| 6 | Progreso: modelo, validador, almacén y acciones | 5 | `src/lib/progreso/estado.ts`<br>`src/lib/progreso/validar.ts`<br>`src/lib/progreso/almacen.ts`<br>`src/lib/progreso/acciones.ts`<br>`tests/unit/progreso.test.ts` | `npm test -- tests/unit/progreso.test.ts` |
| 7 | Respaldo, derivados y límite de errores | 6 | `src/lib/progreso/respaldo.ts`<br>`src/lib/progreso/derivados.ts`<br>`src/components/LimiteErrores.tsx`<br>`tests/unit/respaldo.test.ts`<br>`tests/unit/derivados.test.ts` | `npm test -- tests/unit/respaldo.test.ts` |
| 8 | Store, enlaces e isla de Inicio | 2, 7 | `src/lib/progreso/store.ts`<br>`src/lib/enlaces.ts`<br>`src/components/Inicio.tsx`<br>`src/pages/index.astro`<br>`tests/componentes/inicio.test.tsx` | `npm test -- tests/componentes/inicio.test.tsx` |
| 9 | Isla GuiaDia con los siete apartados y páginas Hoy y Día | 8 | `src/components/GuiaDia.tsx`<br>`src/pages/hoy/index.astro`<br>`src/pages/dia/index.astro`<br>`tests/componentes/guia-dia.test.tsx` | `npm test -- tests/componentes/guia-dia.test.tsx` |
| 10 | Calendario y «Para después del horizonte» | 9 | `src/components/Calendario.tsx`<br>`src/pages/calendario/index.astro`<br>`tests/componentes/calendario.test.tsx` | `npm test -- tests/componentes/calendario.test.tsx` |
| 11 | Exámenes externos y diario de dificultades | 9 | `src/components/FormularioEvaluacion.tsx`<br>`src/components/DiarioDificultades.tsx`<br>`src/components/GuiaDia.tsx`<br>`tests/componentes/evaluaciones.test.tsx` | `npm test -- tests/componentes/evaluaciones.test.tsx` |
| 12 | Página Progreso con dominio declarado | 11 | `src/components/Progreso.tsx`<br>`src/pages/progreso/index.astro`<br>`tests/componentes/progreso.test.tsx` | `npm test -- tests/componentes/progreso.test.tsx` |
| 13 | Página Ajustes, respaldo, importar y reiniciar | 11 | `src/components/RecordatorioRespaldo.tsx`<br>`src/components/Ajustes.tsx`<br>`src/pages/ajustes/index.astro`<br>`src/components/GuiaDia.tsx`<br>`tests/componentes/ajustes.test.tsx` | `npm test -- tests/componentes/ajustes.test.tsx` |
| 14 | Workflow de GitHub Pages y README del docente | 10, 12, 13 | `.github/workflows/deploy.yml`<br>`scripts/verificar-workflow.mjs`<br>`README.md` | `node scripts/verificar-workflow.mjs` |

Dos epics (14 pasos → exactamente 2): `epics/01-fundamentos-y-logica.md` = pasos 1–7 (`E1-T1`…`E1-T7`), `epics/02-interfaz-y-despliegue.md` = pasos 8–14 (`E2-T1`…`E2-T7`). Paralelizables: 2 y 3 (tras 1); 10 y 11 (tras 9); 12 y 13 (tras 11).

---

#### Step 1 — Andamiaje: página mínima, prueba de humo y build verificado

*Tarea `E1-T1` · epic `01-fundamentos-y-logica` · depende de: nada (empieza aquí)*

**Do**

Los archivos de configuración (`package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `tests/setup.ts`, `.prettierrc`, `.prettierignore`, `.gitignore`, `.gitattributes`, `.nvmrc`, `scripts/verificar-dist.mjs`) ya están en la raíz: los copió §10 Bootstrap desde `workspace/`, que también ejecutó `npm install` y el primer commit. **No los edites.** Este paso crea la primera página y la primera prueba, y comprueba que toda la cadena (tipos, Vitest con happy-dom y JSX de Preact, build estático con la base de GitHub Pages, verificación de `dist/` y formato) funciona de punta a punta. Antes de Verify ejecuta `npm run format`.

Archivos (Files touched): `src/pages/index.astro`, `tests/unit/humo.test.tsx`. Escríbelos con exactamente este contenido:

##### `src/pages/index.astro` — nuevo

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

##### `tests/unit/humo.test.tsx` — nuevo

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

**Done when**

- [ ] **WHEN** `npm run build` runs **THE SYSTEM SHALL** write `dist/index.html` containing `href="/mentorix-calc-reto-30/"` and `scripts/verificar-dist.mjs` SHALL print `verificar-dist: OK` (every internal href/src starts with `/mentorix-calc-reto-30/`).
- [ ] **WHEN** `npm test` runs **THE SYSTEM SHALL** pass `tests/unit/humo.test.tsx`, which writes and reads `localStorage` in happy-dom and renders Preact JSX.
- [ ] **WHEN** `npm run check` runs **THE SYSTEM SHALL** report 0 errors with TypeScript strict.
- [ ] **WHEN** `npm run format:check` runs with the bundle present in `blueprints/` **THE SYSTEM SHALL** exit 0, because `.prettierignore` excludes `blueprints/`.

**Verify**

```bash
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run build                                               # expect: exit 0 y la última línea «verificar-dist: OK»
test -f dist/index.html                                     # expect: exit 0 — el sitio construido existe
grep -q 'href="/mentorix-calc-reto-30/"' dist/index.html    # expect: exit 0 — el enlace usa la base de GitHub Pages
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 1: Andamiaje: página mínima, prueba de humo y build verificado"
git tag step-01-andamiaje
# rollback si el siguiente paso falla: git reset --hard step-01-andamiaje
```

---

#### Step 2 — Tokens de diseño, layout con navegación y modo claro/oscuro

*Tarea `E1-T2` · epic `01-fundamentos-y-logica` · depende de: paso 1*

**Do**

Crea los tokens de §7 (claro, oscuro por `prefers-color-scheme` bajo `:root:not([data-theme="light"])` y forzado por `:root[data-theme="dark"]`), los estilos globales (incluye ya las clases que usarán las islas de los pasos 8–13), el layout `Base.astro` con fuentes autoalojadas, script inline que aplica el tema guardado (`mentorix-tema`) antes del primer pintado, enlace «Saltar al contenido», conmutador de tema y navegación (inferior en móvil, lateral desde 960px) con los cuatro enlaces bajo la base. Reemplaza `src/pages/index.astro` para usar `Base`. La prueba de tokens comprueba cada valor de §7 en ambos modos y el contraste AA. Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro`, `tests/unit/tokens.test.ts`. Escríbelos con exactamente este contenido:

##### `src/styles/tokens.css` — nuevo

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

##### `src/styles/global.css` — nuevo

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

##### `src/layouts/Base.astro` — nuevo

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

##### `src/pages/index.astro` — reemplaza (contenido completo)

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

##### `tests/unit/tokens.test.ts` — nuevo

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

**Done when**

- [ ] **WHEN** `npm test -- tests/unit/tokens.test.ts` runs **THE SYSTEM SHALL** find every light token of §7 in `:root` and every dark token in both `:root:not([data-theme="light"])` and `:root[data-theme="dark"]`.
- [ ] **WHEN** the same test computes WCAG contrast **THE SYSTEM SHALL** measure at least 4.5:1 for text/bg, text/surface, text-muted/bg, text-muted/surface, primary-contrast/primary, primary/surface, danger/surface, warning/surface and success/surface in both modes.
- [ ] **WHEN** `npm run build` runs **THE SYSTEM SHALL** emit in `dist/index.html` the inline theme script (`mentorix-tema`) and the four navigation links `/mentorix-calc-reto-30/hoy/`, `/mentorix-calc-reto-30/calendario/`, `/mentorix-calc-reto-30/progreso/` and `/mentorix-calc-reto-30/ajustes/`, and `verificar-dist.mjs` SHALL print `verificar-dist: OK`.

**Verify**

```bash
npm test -- tests/unit/tokens.test.ts                       # expect: exit 0 — tokens claros y oscuros + contraste AA
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run build                                               # expect: exit 0 y la última línea «verificar-dist: OK»
grep -q 'mentorix-tema' dist/index.html                     # expect: exit 0 — script de tema inline en el <head>
grep -q 'href="/mentorix-calc-reto-30/hoy/"' dist/index.html # expect: exit 0
grep -q 'href="/mentorix-calc-reto-30/calendario/"' dist/index.html # expect: exit 0
grep -q 'href="/mentorix-calc-reto-30/progreso/"' dist/index.html # expect: exit 0
grep -q 'href="/mentorix-calc-reto-30/ajustes/"' dist/index.html # expect: exit 0
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 2: Tokens de diseño, layout con navegación y modo claro/oscuro"
git tag step-02-tokens-layout
# rollback si el siguiente paso falla: git reset --hard step-02-tokens-layout
```

---

#### Step 3 — Tipos, registro de rutas, Diferencial e Integral

*Tarea `E1-T3` · epic `01-fundamentos-y-logica` · depende de: paso 1*

**Do**

Crea los tipos del dominio de §4, el registro de rutas (en este paso con **dos** rutas: Cálculo Diferencial y Cálculo Integral; el paso 5 agrega las otras dos) y la prueba que valida todo el catálogo registrado: slugs en kebab-case y únicos en todo el catálogo, prerrequisitos existentes (y anteriores si son de la misma ruta), `diasEstimados` entero ≥ 1, `dificultad` ∈ {1, 2, 3}, ningún tema llamado `final`. Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/lib/tipos.ts`, `src/data/rutas/index.ts`, `src/data/rutas/calculo-diferencial.ts`, `src/data/rutas/calculo-integral.ts`, `tests/unit/rutas.test.ts`. Escríbelos con exactamente este contenido:

##### `src/lib/tipos.ts` — nuevo

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

##### `src/data/rutas/index.ts` — nuevo

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

##### `src/data/rutas/calculo-diferencial.ts` — nuevo

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

##### `src/data/rutas/calculo-integral.ts` — nuevo

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

##### `tests/unit/rutas.test.ts` — nuevo

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

**Done when**

- [ ] **WHEN** `npm test -- tests/unit/rutas.test.ts` runs **THE SYSTEM SHALL** confirm that every registered route, topic and subtopic slug is kebab-case and unique across the whole catalog and that no topic slug is `final`.
- [ ] **WHEN** the same test checks prerequisites **THE SYSTEM SHALL** find every prerequisite slug in the catalog and, when it belongs to the same route, positioned before the topic that requires it.
- [ ] **WHEN** the same test checks subtopics **THE SYSTEM SHALL** find `diasEstimados` as an integer >= 1 and `dificultad` in {1, 2, 3} for every subtopic.
- [ ] **WHEN** `buscarRuta` or `buscarTema` receives an unknown slug **THE SYSTEM SHALL** return `undefined`.

**Verify**

```bash
npm test -- tests/unit/rutas.test.ts                        # expect: exit 0 — catálogo válido
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 3: Tipos, registro de rutas, Diferencial e Integral"
git tag step-03-rutas-base
# rollback si el siguiente paso falla: git reset --hard step-03-rutas-base
```

---

#### Step 4 — Generador del plan puro, fechas locales y reparto de minutos

*Tarea `E1-T4` · epic `01-fundamentos-y-logica` · depende de: paso 3*

**Do**

Implementa exactamente el algoritmo de §4 (grupos atómicos, días ligeros, colocación sin compresión, simulacro y corrección final, repaso espaciado d+1/d+3/d+7/d+14, regla de minutos, IDs estables y textos). La prueba fija el ejemplo trabajado de §4 con la ruta de `tests/fixtures/ruta-prueba.ts`. Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/lib/fechas.ts`, `src/lib/plan/minutos.ts`, `src/lib/plan/generador.ts`, `tests/fixtures/ruta-prueba.ts`, `tests/unit/generador.test.ts`. Escríbelos con exactamente este contenido:

##### `src/lib/fechas.ts` — nuevo

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

##### `src/lib/plan/minutos.ts` — nuevo

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

##### `src/lib/plan/generador.ts` — nuevo

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

##### `tests/fixtures/ruta-prueba.ts` — nuevo

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

##### `tests/unit/generador.test.ts` — nuevo

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

**Done when**

- [ ] **WHEN** `generarPlan` runs on the test route with start `2026-03-01`, horizon 14, 120 minutes and a light day every 7 **THE SYSTEM SHALL** produce, in order, `estudio:a#1, estudio:a#2, estudio:b#1, evaluacion:t1, correccion:t1, estudio:c#1, repaso:rep-1, estudio:c#2, estudio:c#3, evaluacion:t2, correccion:t2, simulacro:final, correccion:final, repaso:rep-2` with day 14 dated `2026-03-14`.
- [ ] **WHEN** a subtopic finishes on day d **THE SYSTEM SHALL** schedule its review on days d+1, d+3, d+7 and d+14 that fall within the horizon, giving `repasoSlugs` 3:[a] 4:[b] 5:[a] 6:[b] 9:[a] 10:[b,c] 12:[c] in the test route.
- [ ] **WHEN** minutes are split for 120 minutes **THE SYSTEM SHALL** give study days of difficulty 1-2 the blocks 10/30/15/45/5/10/5, difficulty 3 the blocks 5/30/15/50/5/10/5, and every day exactly `minutosPorDia` (60 on light review days) in multiples of 5 with no block under 5, for every total from 60 to 360.
- [ ] **WHEN** the horizon is 7 days **THE SYSTEM SHALL** not compress any subtopic and SHALL return `fueraDelHorizonte` = `[{ temaSlug: "t2", subtemaSlug: "c", nombre: "Subtema C", diasEstimados: 3 }]`.
- [ ] **WHEN** only `fechaInicio` changes **THE SYSTEM SHALL** keep every block id identical, ids having the form `${rutaSlug}:${tipoDia}:${clave}:${tipoBloque}` such as `prueba:estudio:a#1:teoria`.
- [ ] **WHEN** the config has a 6-day horizon, 123 minutes or the date `2026-02-30` **THE SYSTEM SHALL** throw `RangeError`.

**Verify**

```bash
npm test -- tests/unit/generador.test.ts                    # expect: exit 0 — ejemplo trabajado de §4
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 4: Generador del plan puro, fechas locales y reparto de minutos"
git tag step-04-generador-plan
# rollback si el siguiente paso falla: git reset --hard step-04-generador-plan
```

---

#### Step 5 — Ajustes del plan y catálogo completo de cuatro rutas

*Tarea `E1-T5` · epic `01-fundamentos-y-logica` · depende de: paso 4*

**Do**

Crea las funciones puras de ajuste (configuración inicial, cambiar duración 7–120, extender, fijar/quitar refuerzos 0–7 y listar los prerrequisitos de una ruta, incluso de otras rutas) y completa el catálogo con Cálculo Multivariable y Ecuaciones Diferenciales, cuyos prerrequisitos cruzan rutas (por eso llegan junto con los refuerzos). Reemplaza `src/data/rutas/index.ts` con las cuatro rutas. La prueba de rutas del paso 3 valida automáticamente las dos nuevas. Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/lib/plan/ajustes.ts`, `src/data/rutas/calculo-multivariable.ts`, `src/data/rutas/ecuaciones-diferenciales.ts`, `src/data/rutas/index.ts`, `tests/unit/ajustes.test.ts`. Escríbelos con exactamente este contenido:

##### `src/lib/plan/ajustes.ts` — nuevo

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

##### `src/data/rutas/calculo-multivariable.ts` — nuevo

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

##### `src/data/rutas/ecuaciones-diferenciales.ts` — nuevo

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

##### `src/data/rutas/index.ts` — reemplaza (contenido completo)

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

##### `tests/unit/ajustes.test.ts` — nuevo

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

**Done when**

- [ ] **WHEN** `configInicial("2026-03-01")` runs **THE SYSTEM SHALL** return horizon 30, 120 minutes, a light day every 7 and no reinforcements.
- [ ] **WHEN** a 7-day test plan is extended by 7 days **THE SYSTEM SHALL** set the horizon to 14, empty `fueraDelHorizonte` and keep the block ids of days 1-5 unchanged.
- [ ] **WHEN** the duration is set to 6, 121 or 30.5 days, or an extension goes past 120 days or adds 0 days **THE SYSTEM SHALL** throw `RangeError`.
- [ ] **WHEN** `prerrequisitosDeRuta` runs on `ecuaciones-diferenciales` **THE SYSTEM SHALL** list `integral-indefinida`, `edo-primer-orden`, `integrales-impropias` and `edo-orden-superior` in that order, with their names and the topics that require them.
- [ ] **WHEN** `npm test` runs **THE SYSTEM SHALL** register exactly `calculo-diferencial`, `calculo-integral`, `calculo-multivariable` and `ecuaciones-diferenciales`, in that order, all passing the catalog validation.

**Verify**

```bash
npm test -- tests/unit/ajustes.test.ts                      # expect: exit 0 — ajustes + 4 rutas registradas
npm test -- tests/unit/rutas.test.ts                        # expect: exit 0 — las rutas nuevas también son válidas
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 5: Ajustes del plan y catálogo completo de cuatro rutas"
git tag step-05-ajustes-catalogo
# rollback si el siguiente paso falla: git reset --hard step-05-ajustes-catalogo
```

---

#### Step 6 — Progreso: modelo, validador, almacén y acciones

*Tarea `E1-T6` · epic `01-fundamentos-y-logica` · depende de: paso 5*

**Do**

Crea la forma versionada del progreso de §4 (clave `mentorix-reto:v1`), el validador manual sin dependencias, el acceso a `localStorage` siempre dentro de try/catch (los datos que no validan se copian a `mentorix-reto:v1:danado` y nunca se borran) y las acciones puras. Regla central: **completar bloques no cambia el dominio**; solo `declararDominio` lo cambia, y «dominado» exige evidencia. Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/lib/progreso/estado.ts`, `src/lib/progreso/validar.ts`, `src/lib/progreso/almacen.ts`, `src/lib/progreso/acciones.ts`, `tests/unit/progreso.test.ts`. Escríbelos con exactamente este contenido:

##### `src/lib/progreso/estado.ts` — nuevo

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

##### `src/lib/progreso/validar.ts` — nuevo

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

##### `src/lib/progreso/almacen.ts` — nuevo

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

##### `src/lib/progreso/acciones.ts` — nuevo

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

##### `tests/unit/progreso.test.ts` — nuevo

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

**Done when**

- [ ] **WHEN** a state with a completed block is saved and loaded again **THE SYSTEM SHALL** store it under `mentorix-reto:v1` and return an identical `Estado` with `corrupto: null`.
- [ ] **WHEN** the stored text is not valid JSON or has `version: 2` **THE SYSTEM SHALL** return the initial state, return the raw text in `corrupto`, copy it to `mentorix-reto:v1:danado` and leave `mentorix-reto:v1` untouched.
- [ ] **WHEN** `getItem` and `setItem` throw (private mode) **THE SYSTEM SHALL** return the initial state without throwing and `guardarEstado` SHALL return `false`.
- [ ] **WHEN** a block is marked completed **THE SYSTEM SHALL** record its ISO timestamp in `completados` and leave `dominio` unchanged.
- [ ] **WHEN** `declararDominio` receives level `dominado` with blank evidence **THE SYSTEM SHALL** return an `Error`, and `validarEstado` SHALL also reject a stored `dominado` without evidence.
- [ ] **WHEN** a grade is greater than the maximum grade or a difficulty text is blank **THE SYSTEM SHALL** return an `Error` and save nothing.

**Verify**

```bash
npm test -- tests/unit/progreso.test.ts                     # expect: exit 0 — almacén, validador y reglas de dominio
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 6: Progreso: modelo, validador, almacén y acciones"
git tag step-06-progreso-almacen
# rollback si el siguiente paso falla: git reset --hard step-06-progreso-almacen
```

---

#### Step 7 — Respaldo, derivados y límite de errores

*Tarea `E1-T7` · epic `01-fundamentos-y-logica` · depende de: paso 6*

**Do**

Crea el respaldo JSON (nombre `mentorix-reto-AAAA-MM-DD.json`, lectura con validación y resumen, recordatorio a los 7 días), los derivados puros (estado y posición de un día, avance global, temas estudiados, repasos pendientes, dificultades abiertas, resumen de dominio — siempre separados del avance) y el componente `LimiteErrores` que usarán todas las islas (su prueba de componente llega en el paso 8, cuando existe el primer archivo `.tsx` de pruebas de componentes). Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/lib/progreso/respaldo.ts`, `src/lib/progreso/derivados.ts`, `src/components/LimiteErrores.tsx`, `tests/unit/respaldo.test.ts`, `tests/unit/derivados.test.ts`. Escríbelos con exactamente este contenido:

##### `src/lib/progreso/respaldo.ts` — nuevo

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

##### `src/lib/progreso/derivados.ts` — nuevo

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

##### `src/components/LimiteErrores.tsx` — nuevo

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

##### `tests/unit/respaldo.test.ts` — nuevo

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

##### `tests/unit/derivados.test.ts` — nuevo

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

**Done when**

- [ ] **WHEN** a state is serialized and read back with `leerRespaldo` **THE SYSTEM SHALL** return the same state and the summary `1 ruta · 1 bloque completado · 0 evaluaciones · 0 dificultades`.
- [ ] **WHEN** the backup text is not JSON, lacks fields or has `version: 9` **THE SYSTEM SHALL** return an `Error`.
- [ ] **WHEN** there is progress and no backup, or the last backup is 7 or more days old **THE SYSTEM SHALL** report that a reminder is needed, and SHALL not report it at 6 days or with no progress.
- [ ] **WHEN** day 1 of the test plan is fully completed **THE SYSTEM SHALL** compute `{ completados: 7, total: 80, porcentaje: 9 }`, and with day 3 completed by day 5 the pending reviews SHALL be `b` (day 4) and `a` (day 5).
- [ ] **WHEN** the declared mastery is summarized **THE SYSTEM SHALL** count undeclared subtopics as `sin-evaluar` regardless of completed blocks.

**Verify**

```bash
npm test -- tests/unit/respaldo.test.ts                     # expect: exit 0 — respaldo y recordatorio
npm test -- tests/unit/derivados.test.ts                    # expect: exit 0 — derivados
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 7: Respaldo, derivados y límite de errores"
git tag step-07-respaldo-derivados
# rollback si el siguiente paso falla: git reset --hard step-07-respaldo-derivados
```

---

#### Step 8 — Store, enlaces e isla de Inicio

*Tarea `E2-T1` · epic `02-interfaz-y-despliegue` · depende de: paso 2, paso 7*

**Do**

Crea el store global con `@preact/signals` (única puerta de escritura: `actualizar`), los helpers de enlaces con la base del sitio y la isla de Inicio: sin ruta activa muestra las cuatro rutas y la configuración inicial (fecha = hoy, 30 días, 120 minutos); con ruta activa muestra el resumen y «Ir a Hoy»; con datos dañados ofrece descargarlos y empezar de nuevo. Reemplaza `src/pages/index.astro` para montar la isla con `client:only="preact"`. La prueba también cubre `LimiteErrores` (paso 7). Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/lib/progreso/store.ts`, `src/lib/enlaces.ts`, `src/components/Inicio.tsx`, `src/pages/index.astro`, `tests/componentes/inicio.test.tsx`. Escríbelos con exactamente este contenido:

##### `src/lib/progreso/store.ts` — nuevo

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

##### `src/lib/enlaces.ts` — nuevo

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

##### `src/components/Inicio.tsx` — nuevo

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

##### `src/pages/index.astro` — reemplaza (contenido completo)

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

##### `tests/componentes/inicio.test.tsx` — nuevo

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

**Done when**

- [ ] **WHEN** Inicio renders with no active route **THE SYSTEM SHALL** show four radio options named after the four routes and the fields «Fecha de inicio» (today), «Duración del reto (días)» (30) and «Minutos de estudio por día» (120).
- [ ] **WHEN** the student picks «Cálculo Integral» and presses «Empezar mi reto» **THE SYSTEM SHALL** save `rutaActiva: "calculo-integral"` with the default config under `mentorix-reto:v1` and show «Día 1 de 30» and the link «Ir a Hoy».
- [ ] **WHEN** the duration is 200 **THE SYSTEM SHALL** not start the route and SHALL show an alert containing «entre 7 y 120».
- [ ] **WHEN** the stored progress is corrupt **THE SYSTEM SHALL** offer «Descargar datos dañados» and «Empezar de nuevo» while keeping the raw text in `mentorix-reto:v1:danado`.
- [ ] **WHEN** a child of `LimiteErrores` throws **THE SYSTEM SHALL** show «Algo salió mal en esta sección» with the button «Exportar respaldo» and log a JSON line containing `"origen":"prueba"` with `console.error`.
- [ ] **WHEN** `npm run build` runs **THE SYSTEM SHALL** emit an `astro-island` in `dist/index.html` and `verificar-dist.mjs` SHALL print `verificar-dist: OK`.

**Verify**

```bash
npm test -- tests/componentes/inicio.test.tsx               # expect: exit 0 — Inicio + LimiteErrores
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run build                                               # expect: exit 0 y la última línea «verificar-dist: OK»
grep -q '<astro-island' dist/index.html                     # expect: exit 0 — la isla de Inicio está en el HTML
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 8: Store, enlaces e isla de Inicio"
git tag step-08-inicio
# rollback si el siguiente paso falla: git reset --hard step-08-inicio
```

---

#### Step 9 — Isla GuiaDia con los siete apartados y páginas Hoy y Día

*Tarea `E2-T2` · epic `02-interfaz-y-despliegue` · depende de: paso 8*

**Do**

Crea la guía del día (mismo componente para `/hoy/`, que usa la fecha de hoy, y `/dia/?n=<numero>`, que lee el parámetro): cabecera con día, fecha y tipo; Objetivo del día, Qué estudiar, Qué hacer, Repaso, Tiempo sugerido por bloque (una casilla por bloque con su ID estable y un contador `aria-live`), Cierre de sesión (lista + «Registrar dificultad» + «Reflexión del día») y Siguiente paso. Casos borde: antes del inicio muestra el día 1 con aviso; después del horizonte invita a extender; un `n` inexistente muestra «Ese día no existe en tu plan». Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/components/GuiaDia.tsx`, `src/pages/hoy/index.astro`, `src/pages/dia/index.astro`, `tests/componentes/guia-dia.test.tsx`. Escríbelos con exactamente este contenido:

##### `src/components/GuiaDia.tsx` — nuevo

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

##### `src/pages/hoy/index.astro` — nuevo

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

##### `src/pages/dia/index.astro` — nuevo

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

##### `tests/componentes/guia-dia.test.tsx` — nuevo

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

**Done when**

- [ ] **WHEN** GuiaDia renders day 1 of `calculo-diferencial` starting `2026-03-01` **THE SYSTEM SHALL** show the headings «Objetivo del día», «Qué estudiar», «Qué hacer», «Repaso», «Tiempo sugerido por bloque», «Cierre de sesión» and «Siguiente paso», the objective «Comprender y practicar «Dominio y rango de funciones reales».» and 7 checkboxes.
- [ ] **WHEN** the checkbox «Teoría · 30 min» is clicked **THE SYSTEM SHALL** save `calculo-diferencial:estudio:dominio-y-rango#1:teoria` in `completados`, show «1 de 7 bloques completados» and leave `dominio` empty.
- [ ] **WHEN** «Guardar dificultad» is pressed with a blank description **THE SYSTEM SHALL** save nothing and show «Describe la dificultad o el error antes de guardarlo.»; with text it SHALL save one open difficulty linked to `dominio-y-rango`.
- [ ] **WHEN** «Guardar reflexión» is pressed **THE SYSTEM SHALL** save the text under key `"1"` in `reflexiones`.
- [ ] **WHEN** GuiaDia receives `numero={2}` **THE SYSTEM SHALL** show day 2, and with `numero={99}` it SHALL show «Ese día no existe en tu plan».
- [ ] **WHEN** `npm run build` runs **THE SYSTEM SHALL** write `dist/hoy/index.html` and `dist/dia/index.html` and `verificar-dist.mjs` SHALL print `verificar-dist: OK`.

**Verify**

```bash
npm test -- tests/componentes/guia-dia.test.tsx             # expect: exit 0 — los 7 apartados, casillas, dificultad, reflexión
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run build                                               # expect: exit 0 y la última línea «verificar-dist: OK»
test -f dist/hoy/index.html                                 # expect: exit 0
test -f dist/dia/index.html                                 # expect: exit 0
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 9: Isla GuiaDia con los siete apartados y páginas Hoy y Día"
git tag step-09-guia-dia
# rollback si el siguiente paso falla: git reset --hard step-09-guia-dia
```

---

#### Step 10 — Calendario y «Para después del horizonte»

*Tarea `E2-T3` · epic `02-interfaz-y-despliegue` · depende de: paso 9*

**Do**

Crea la rejilla de días (cada uno enlaza a `/dia/?n=` y muestra fecha, tipo y estado: «Hoy», «Completado», «En curso», «Próximo» o «Pendiente», en `data-estado`) y la sección «Para después del horizonte» con los subtemas que no caben, los días de estudio que faltan y los botones «Extender 7 días» y «Extender 14 días». Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/components/Calendario.tsx`, `src/pages/calendario/index.astro`, `tests/componentes/calendario.test.tsx`. Escríbelos con exactamente este contenido:

##### `src/components/Calendario.tsx` — nuevo

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

##### `src/pages/calendario/index.astro` — nuevo

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

##### `tests/componentes/calendario.test.tsx` — nuevo

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

**Done when**

- [ ] **WHEN** the calendar renders a 30-day plan with day 1 completed and today being day 2 **THE SYSTEM SHALL** show 30 days whose `data-estado` is «Completado» for day 1, «Hoy» for day 2 and «Próximo» for day 3, with day 7 labelled «Repaso».
- [ ] **WHEN** a day is listed **THE SYSTEM SHALL** link it to `/dia/?n=<numero>` built with the site base.
- [ ] **WHEN** subtopics do not fit **THE SYSTEM SHALL** list them under «Para después del horizonte», for example «Reglas de derivación (2 días)».
- [ ] **WHEN** «Extender 14 días» is pressed **THE SYSTEM SHALL** save `horizonteDias: 44` and render 44 days.
- [ ] **WHEN** an extension would exceed 120 days **THE SYSTEM SHALL** keep the plan unchanged and show «La duración debe estar entre 7 y 120 días.».

**Verify**

```bash
npm test -- tests/componentes/calendario.test.tsx           # expect: exit 0 — rejilla, estados, extender
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run build                                               # expect: exit 0 y la última línea «verificar-dist: OK»
test -f dist/calendario/index.html                          # expect: exit 0
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 10: Calendario y «Para después del horizonte»"
git tag step-10-calendario
# rollback si el siguiente paso falla: git reset --hard step-10-calendario
```

---

#### Step 11 — Exámenes externos y diario de dificultades

*Tarea `E2-T4` · epic `02-interfaz-y-despliegue` · depende de: paso 9*

**Do**

Crea el formulario de resultado de examen externo (nota, nota máxima opcional, errores identificados, temas a reforzar; uno por día, se reemplaza al volver a guardar) y el diario de dificultades (abiertas primero, casilla «Resuelta»). Reemplaza `src/components/GuiaDia.tsx` para mostrar el formulario solo en días `evaluacion` o `simulacro`. El diario se monta en Progreso (paso 12). Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/components/FormularioEvaluacion.tsx`, `src/components/DiarioDificultades.tsx`, `src/components/GuiaDia.tsx`, `tests/componentes/evaluaciones.test.tsx`. Escríbelos con exactamente este contenido:

##### `src/components/FormularioEvaluacion.tsx` — nuevo

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

##### `src/components/DiarioDificultades.tsx` — nuevo

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

##### `src/components/GuiaDia.tsx` — reemplaza (contenido completo)

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

##### `tests/componentes/evaluaciones.test.tsx` — nuevo

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

**Done when**

- [ ] **WHEN** GuiaDia shows a study day **THE SYSTEM SHALL** not render «Resultado de tu examen», and on day 10 of a 30-day `calculo-diferencial` plan (exam on «Funciones») it SHALL render it.
- [ ] **WHEN** grade 15, maximum 20, an error text and the topic «Funciones» are saved **THE SYSTEM SHALL** store one evaluation with `diaNumero: 10`, `temaSlug: "funciones"`, `nota: 15`, `notaMaxima: 20` and `temasAReforzar: ["funciones"]`, and show «Resultado guardado.».
- [ ] **WHEN** the grade 25 exceeds the maximum 20 **THE SYSTEM SHALL** show the alert «La nota no puede ser mayor que la nota máxima.» and store no evaluation.
- [ ] **WHEN** the difficulty journal has no entries **THE SYSTEM SHALL** show «Aún no registras dificultades. Puedes hacerlo desde el cierre de cada día.».
- [ ] **WHEN** the journal lists entries **THE SYSTEM SHALL** show open ones first and the checkbox «Resuelta: <texto>» SHALL save `resuelta: true`.

**Verify**

```bash
npm test -- tests/componentes/evaluaciones.test.tsx         # expect: exit 0 — formulario de examen y diario
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run build                                               # expect: exit 0 y la última línea «verificar-dist: OK»
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 11: Exámenes externos y diario de dificultades"
git tag step-11-evaluaciones-dificultades
# rollback si el siguiente paso falla: git reset --hard step-11-evaluaciones-dificultades
```

---

#### Step 12 — Página Progreso con dominio declarado

*Tarea `E2-T5` · epic `02-interfaz-y-despliegue` · depende de: paso 11*

**Do**

Crea la página de progreso con tarjetas separadas: «Avance de actividades» (bloques completados / totales del plan), «Temas estudiados», «Pendientes de repaso», el diario de dificultades (paso 11), «Resultados de exámenes» y «Dominio declarado» (tabla editable por subtema: nivel + evidencia + Guardar; «Dominado» exige evidencia). Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/components/Progreso.tsx`, `src/pages/progreso/index.astro`, `tests/componentes/progreso.test.tsx`. Escríbelos con exactamente este contenido:

##### `src/components/Progreso.tsx` — nuevo

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

##### `src/pages/progreso/index.astro` — nuevo

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

##### `tests/componentes/progreso.test.tsx` — nuevo

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

**Done when**

- [ ] **WHEN** Progreso renders with day 1 completed **THE SYSTEM SHALL** show the separate headings «Avance de actividades» and «Dominio declarado», the text «7 de <total> bloques completados» and the level «sin-evaluar» for «Dominio y rango de funciones reales».
- [ ] **WHEN** every study day of «Funciones» is completed **THE SYSTEM SHALL** list «Funciones» under «Temas estudiados» and show «No tienes repasos pendientes.».
- [ ] **WHEN** today is day 3 and the day 2 review block is not marked **THE SYSTEM SHALL** list «Dominio y rango de funciones reales (programado el día 2)».
- [ ] **WHEN** «Dominado» is saved without evidence **THE SYSTEM SHALL** show an alert mentioning «evidencia» and save nothing; with evidence it SHALL save `{ nivel: "dominado", evidencia, fecha }`.
- [ ] **WHEN** an evaluation of day 10 on «Funciones» with 15/20 exists **THE SYSTEM SHALL** show «Día 10 · Funciones · 15/20».

**Verify**

```bash
npm test -- tests/componentes/progreso.test.tsx             # expect: exit 0 — avance separado del dominio
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run build                                               # expect: exit 0 y la última línea «verificar-dist: OK»
test -f dist/progreso/index.html                            # expect: exit 0
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 12: Página Progreso con dominio declarado"
git tag step-12-progreso
# rollback si el siguiente paso falla: git reset --hard step-12-progreso
```

---

#### Step 13 — Página Ajustes, respaldo, importar y reiniciar

*Tarea `E2-T6` · epic `02-interfaz-y-despliegue` · depende de: paso 11*

**Do**

Crea Ajustes (cambiar ruta conservando el progreso de cada una; fecha, duración, minutos y día ligero; extender +7/+14/personalizado; refuerzos de prerrequisitos; exportar; importar con resumen y confirmación; reiniciar con confirmación) y el recordatorio de respaldo (visible en Hoy y Ajustes si hay progreso y no se exportó nunca o hace 7 días o más). Reemplaza `src/components/GuiaDia.tsx` para mostrar el recordatorio. Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `src/components/RecordatorioRespaldo.tsx`, `src/components/Ajustes.tsx`, `src/pages/ajustes/index.astro`, `src/components/GuiaDia.tsx`, `tests/componentes/ajustes.test.tsx`. Escríbelos con exactamente este contenido:

##### `src/components/RecordatorioRespaldo.tsx` — nuevo

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

##### `src/components/Ajustes.tsx` — nuevo

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

##### `src/pages/ajustes/index.astro` — nuevo

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

##### `src/components/GuiaDia.tsx` — reemplaza (contenido completo)

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

##### `tests/componentes/ajustes.test.tsx` — nuevo

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

**Done when**

- [ ] **WHEN** the duration is changed to 45 and «Guardar cambios» is pressed **THE SYSTEM SHALL** save `horizonteDias: 45` and keep the completed block `calculo-diferencial:estudio:dominio-y-rango#1:teoria`.
- [ ] **WHEN** the minutes are 123 **THE SYSTEM SHALL** show an alert containing «múltiplo de 5» and keep 120.
- [ ] **WHEN** «Días de refuerzo de Límites» is set to 2 and saved **THE SYSTEM SHALL** store `refuerzos: [{ temaSlug: "limites", dias: 2 }]`.
- [ ] **WHEN** there is progress and no backup **THE SYSTEM SHALL** show the reminder in Hoy, and «Exportar ahora» SHALL download the file once, set `ultimoRespaldo` to today and hide the reminder.
- [ ] **WHEN** a valid backup file is chosen **THE SYSTEM SHALL** show «Este respaldo contiene: …» and replace the progress only after «Reemplazar mi progreso»; an invalid file SHALL show «El archivo no es un respaldo válido: no es JSON.» and change nothing.
- [ ] **WHEN** «Reiniciar todo» and then «Sí, borrar mi progreso» are pressed **THE SYSTEM SHALL** save the initial state, and not before the confirmation.

**Verify**

```bash
npm test -- tests/componentes/ajustes.test.tsx              # expect: exit 0 — ajustes, respaldo, importar, reiniciar
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run build                                               # expect: exit 0 y la última línea «verificar-dist: OK»
test -f dist/ajustes/index.html                             # expect: exit 0
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 13: Página Ajustes, respaldo, importar y reiniciar"
git tag step-13-ajustes-respaldo
# rollback si el siguiente paso falla: git reset --hard step-13-ajustes-respaldo
```

---

#### Step 14 — Workflow de GitHub Pages y README del docente

*Tarea `E2-T7` · epic `02-interfaz-y-despliegue` · depende de: paso 10, paso 12, paso 13*

**Do**

Crea el workflow de despliegue a GitHub Pages (mismos comandos que el gate §20.1), un verificador estructural del workflow que corre sin red ni dependencias (sangría con espacios y líneas obligatorias en orden; no es un parser YAML completo y lo dice) y el README para el docente (cómo editar y añadir rutas sin renombrar slugs, comandos, cómo publicar). Hacer push y activar Pages requiere la cuenta: va en la lista de lanzamiento de §20.1, no aquí. Ejecuta `npm run format` antes de Verify.

Archivos (Files touched): `.github/workflows/deploy.yml`, `scripts/verificar-workflow.mjs`, `README.md`. Escríbelos con exactamente este contenido:

##### `.github/workflows/deploy.yml` — nuevo

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

##### `scripts/verificar-workflow.mjs` — nuevo

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

##### `README.md` — nuevo

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

**Done when**

- [ ] **WHEN** `node scripts/verificar-workflow.mjs` runs **THE SYSTEM SHALL** print `verificar-workflow: OK` because `.github/workflows/deploy.yml` uses space indentation and contains, in order, checkout@v7, setup-node@v7 with `.nvmrc`, `npm ci`, `npm run format:check`, `npm run check`, `npm test`, `npm run build`, configure-pages@v6, upload-pages-artifact@v5 with `path: dist` and deploy-pages@v5.
- [ ] **WHEN** `npm run build` runs **THE SYSTEM SHALL** write the six pages `dist/index.html`, `dist/hoy/index.html`, `dist/dia/index.html`, `dist/calendario/index.html`, `dist/progreso/index.html` and `dist/ajustes/index.html`, and `verificar-dist.mjs` SHALL print `verificar-dist: OK`.
- [ ] **WHEN** the README is read by `grep` **THE SYSTEM SHALL** contain `src/data/rutas/index.ts` and the rule «nunca renombres un `slug`».
- [ ] **WHEN** `npm run format:check` runs **THE SYSTEM SHALL** exit 0 including `.github/workflows/deploy.yml`.

**Verify**

```bash
node scripts/verificar-workflow.mjs                         # expect: exit 0, «verificar-workflow: OK»
npm test                                                    # expect: exit 0 — 0 failed, 0 skipped
npm run check                                               # expect: exit 0 — 0 errors, 0 warnings
npm run build                                               # expect: exit 0 y la última línea «verificar-dist: OK»
test -f dist/index.html                                     # expect: exit 0
test -f dist/hoy/index.html                                 # expect: exit 0
test -f dist/dia/index.html                                 # expect: exit 0
test -f dist/calendario/index.html                          # expect: exit 0
test -f dist/progreso/index.html                            # expect: exit 0
test -f dist/ajustes/index.html                             # expect: exit 0
grep -q 'src/data/rutas/index.ts' README.md                 # expect: exit 0
grep -qi 'nunca renombres un `slug`' README.md              # expect: exit 0
npm run format:check                                        # expect: exit 0 — todos los archivos con estilo Prettier
```

**Checkpoint**

```bash
git add -A && git commit -m "step 14: Workflow de GitHub Pages y README del docente"
git tag step-14-despliegue
# rollback si el siguiente paso falla: git reset --hard step-14-despliegue
```

### 9.1 Parity and cutover

NOT APPLICABLE — greenfield build, no system is being replaced.

---

## 10. Environment Setup

### Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 24 (LTS; `.nvmrc` = `24`, `engines.node` = `>=24`; Astro 7.4.2 exige `>=22.23.4`) | `node -v` → `v24.x` |
| npm | la que trae Node 24 (Astro 7.4.2 exige `>=9.6.5`) | `npm -v` |
| git | ≥ 2.28 (por `git init -b`) | `git --version` |
| Shell | Git Bash en Windows o bash en Linux (los comandos no usan sintaxis de PowerShell) | `bash --version` |

### Accounts to create first

Ninguna para construir: todos los pasos 1–14 corren sin red salvo `npm install`. Para **publicar** (checklist §20.1, después del paso 14) hace falta la cuenta GitHub `Oswalec` y el repositorio `Oswalec/mentorix-calc-reto-30` (https://github.com/new) con Pages en «Source: GitHub Actions».

### Environment variables

| Variable | Purpose | Where to get it | Required by step | Secret? |
|---|---|---|---|---|
| — | Este proyecto no usa variables de entorno: `site` y `base` están fijos en `astro.config.mjs` y no hay servicios externos | — | — | — |

No hay `.env` ni `.env.example`: ningún comando de este blueprint lee variables de entorno, así que ninguna herramienta necesita un cargador de entorno. `.gitignore` igualmente ignora `.env` y `.env.*` por si alguien agrega uno.

### Files that must be committed

Ninguno de estos archivos coincide con un patrón de `.gitignore` (que solo contiene `node_modules/`, `dist/`, `.astro/`, `.env`, `.env.*`, `npm-debug.log*`, `.DS_Store`, `Thumbs.db`), así que no hace falta ninguna línea de excepción.

| File | Why it is committed | Ignore-file exception line |
|---|---|---|
| `package.json`, `package-lock.json` | `npm ci` en CI exige el lockfile | — not matched by any ignore pattern |
| `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.prettierrc`, `.prettierignore`, `.nvmrc`, `.gitattributes`, `.gitignore` | configuración que los gates necesitan | — not matched by any ignore pattern |
| `scripts/verificar-dist.mjs`, `scripts/verificar-workflow.mjs`, `tests/setup.ts` | los ejecutan los gates | — not matched by any ignore pattern |
| `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.claude/rules/*.md`, `.claude/skills/agregar-o-editar-ruta/SKILL.md` | configuración del agente constructor | — not matched by any ignore pattern |
| `.github/workflows/deploy.yml` | despliegue | — not matched by any ignore pattern |
| `blueprints/mentorix-calc-reto-30/**` | `tasks.json` lleva el estado de la construcción | — not matched by any ignore pattern |

### Bootstrap

Ejecuta este bloque **tal cual**, desde la raíz del proyecto (`mentorix-calc-reto-30/`, que ya contiene `blueprints/mentorix-calc-reto-30/`). Es no interactivo y **se puede ejecutar dos veces seguidas**: la segunda vez cada línea sale 0 sin cambiar nada.

```bash
# orden: copiar workspace/ (trae .gitignore, .gitattributes, .prettierignore y configs) → repo git → identidad local → dependencias → primer commit → formato
node -e "require('node:fs').cpSync('blueprints/mentorix-calc-reto-30/workspace', '.', { recursive: true, force: false, errorOnExist: false })"   # copia sin sobrescribir: lo que ya existe (package.json, configs editados) se respeta, y sale 0 en Windows y Linux
test -d .git || git init -b main                                                      # idempotente: no reinicia un repo existente
git config user.name >/dev/null || git config user.name "Mentorix Builder"           # identidad local solo si no hay una configurada (los commits de cada Checkpoint la necesitan)
git config user.email >/dev/null || git config user.email "builder@mentorix.local"
npm install --no-audit --no-fund                                                     # instala todo lo que fija workspace/package.json y genera package-lock.json
git rev-parse --verify HEAD >/dev/null 2>&1 || { git add -A && git commit -m "chore: andamiaje inicial desde el blueprint"; }   # primer commit solo si aún no hay ninguno
npm run format:check                                                                 # expect: exit 0 — Prettier ignora blueprints/ vía .prettierignore
```

- **El archivo de ignorados precede al primer commit:** `.gitignore` llega con la copia de la primera línea, antes de `git add -A`, así que `node_modules/` nunca se rastrea.
- **Archivos que la copia nunca sobrescribe:** todos los que ya existan, en particular `package.json` y `package-lock.json` una vez instalado, y cualquier archivo que un paso haya editado. `cpSync` con `force: false` y `errorOnExist: false` omite lo existente y sale 0 (no se usa `cp -Rn`, que en BSD/macOS sale 1 al omitir).
- **Sin servicios, sin migraciones, sin semillas:** no hay base de datos ni contenedores.
- Si `npm install` falla por red, repite el bloque completo: es seguro.

---

## 11. Dependencies

Procedencia: informe de `stack-researcher` + `npm view` en vivo del 2026-10-26 (tabla «PINS VERIFICADOS» del brief). Instalación probada el 2026-10-26 con Node 24.19.0: `npm install` resolvió exactamente estas versiones. **Todas las dependencias npm las instala el `npm install` de §10 Bootstrap**, porque `workspace/package.json` (§19.6) las declara todas; ningún paso ejecuta `npm install <paquete>`.

### Runtime

| Package | Version | Source (registry URL or track file) | Checked | Installed by | Purpose |
|---|---|---|---|---|---|
| astro | ^7.4.2 | https://registry.npmjs.org/astro/7.4.2 | 2026-10-26 | §10 Bootstrap (`npm install` sobre `workspace/package.json`) | framework y build estático; engines node >=22.23.4; depende de vite ^8.3.4 |
| @astrojs/preact | ^6.1.1 | https://registry.npmjs.org/@astrojs/preact/6.1.1 | 2026-10-26 | §10 Bootstrap | integración de islas Preact; peer preact ^10.6.5 \|\| ^11 |
| preact | ^10.29.8 | https://registry.npmjs.org/preact/10.29.8 | 2026-10-26 | §10 Bootstrap | islas; línea 10 (no 11.0.2) porque @testing-library/preact no está probado con 11 |
| @preact/signals | ^2.11.3 | https://registry.npmjs.org/@preact/signals/2.11.3 | 2026-10-26 | §10 Bootstrap | estado global del store; peer preact >=10.25 |
| @fontsource-variable/fraunces | ^5.3.0 | https://registry.npmjs.org/@fontsource-variable/fraunces/5.3.0 | 2026-10-26 | §10 Bootstrap | fuente de títulos autoalojada |
| @fontsource-variable/inter | ^5.3.0 | https://registry.npmjs.org/@fontsource-variable/inter/5.3.0 | 2026-10-26 | §10 Bootstrap | fuente de texto autoalojada |
| Node.js | 24 (`.nvmrc` = `24`, `engines.node` = `>=24`) | https://nodejs.org/dist/index.json (24.x es LTS; último 24.22.1) | 2026-10-26 | prerrequisito del desarrollador (§10 Prerequisites); en CI, `actions/setup-node` lee `.nvmrc` | runtime |

### Development

| Package | Version | Source (registry URL or track file) | Checked | Installed by | Purpose |
|---|---|---|---|---|---|
| typescript | ^6.0.3 | https://registry.npmjs.org/typescript/6.0.3 | 2026-10-26 | §10 Bootstrap | tipos estrictos; NO 7.x: @astrojs/check 0.9.12 pide `^5 \|\| ^6` |
| @astrojs/check | 0.9.12 (exacto) | https://registry.npmjs.org/@astrojs/check/0.9.12 | 2026-10-26 | §10 Bootstrap | `npm run check`; línea 0.x → pin exacto |
| vite | ^8.3.5 | https://registry.npmjs.org/vite/8.3.5 | 2026-10-26 | §10 Bootstrap | dependencia directa para que Astro y Vitest compartan una sola vite 8 |
| vitest | ^5.0.5 | https://registry.npmjs.org/vitest/5.0.5 | 2026-10-26 | §10 Bootstrap | pruebas; engines node ^22.12 \|\| ^24 \|\| >=26; `environment: 'happy-dom'` estaba UNVERIFIED para 5.x — lo comprueba la prueba de humo del paso 1 (verificado al escribir este blueprint) |
| happy-dom | ^21.0.4 | https://registry.npmjs.org/happy-dom/21.0.4 | 2026-10-26 | §10 Bootstrap | DOM y localStorage para las pruebas |
| @testing-library/preact | ^3.2.6 | https://registry.npmjs.org/@testing-library/preact/3.2.6 | 2026-10-26 | §10 Bootstrap | pruebas de componentes por rol y etiqueta |
| prettier | ^3.9.10 | https://registry.npmjs.org/prettier/3.9.10 | 2026-10-26 | §10 Bootstrap | formato |
| prettier-plugin-astro | ^1.1.2 | https://registry.npmjs.org/prettier-plugin-astro/1.1.2 | 2026-10-26 | §10 Bootstrap | formato de `.astro`; peer prettier ^3.5.3 |
| actions/checkout | @v7 | https://github.com/actions/checkout/releases (v7.0.1) | 2026-10-26 | `.github/workflows/deploy.yml` (paso 14) | CI |
| actions/setup-node | @v7 | https://github.com/actions/setup-node/releases (v7.1.0) | 2026-10-26 | `.github/workflows/deploy.yml` (paso 14) | CI: Node desde `.nvmrc` y caché npm |
| actions/configure-pages | @v6 | https://github.com/actions/configure-pages/releases (v6.0.0) | 2026-10-26 | `.github/workflows/deploy.yml` (paso 14) | CI |
| actions/upload-pages-artifact | @v5 | https://github.com/actions/upload-pages-artifact/releases (v5.0.0) | 2026-10-26 | `.github/workflows/deploy.yml` (paso 14) | CI: sube `dist` |
| actions/deploy-pages | @v5 | https://github.com/actions/deploy-pages/releases (v5.0.1) | 2026-10-26 | `.github/workflows/deploy.yml` (paso 14) | CI: publica |

Antes de subir Astro de mayor: revisa https://docs.astro.build/en/guides/upgrade-to/v7/ (y la guía de la versión siguiente) por si `base` o `trailingSlash` cambian de comportamiento; `npm run build` lo detecta porque `verificar-dist.mjs` falla si algún enlace pierde el prefijo.

### Deliberately not used

| Rejected | Instead | Why |
|---|---|---|
| `npm create astro`, `astro add` | manifiesto y configs emitidos en `workspace/` | sus prompts no son verificables en una construcción desatendida |
| tailwindcss | CSS con tokens | pocos componentes; tokens dan modo oscuro con una regla |
| zod | `validarEstado` manual | un solo esquema; evita una dependencia en el bundle del cliente |
| @biomejs/biome | prettier + prettier-plugin-astro | soporte de `.astro` más maduro y mismo formato que el proyecto hermano |
| playwright, jsdom | happy-dom + Testing Library | los flujos son de una isla; sin descargar navegadores |
| typescript 7.x, preact 11.x | typescript 6, preact 10 | compatibilidad de @astrojs/check y @testing-library/preact |
| Google Fonts por CDN | Fontsource autoalojado | sin terceros en tiempo de ejecución |
| sentry / analítica | `console.error` estructurado + `LimiteErrores` | requieren cuenta (non-goal) |
| yaml (paquete) | `scripts/verificar-workflow.mjs` estructural | un solo archivo YAML, verificado sin dependencias |

---

## 12. Deployment Strategy

### Hosting

GitHub Pages del repositorio `Oswalec/mentorix-calc-reto-30`, plan gratuito, servido en `https://oswalec.github.io/mentorix-calc-reto-30/`. Comando de build: `npm run build` (incluye `verificar-dist.mjs`); directorio de salida: `dist`; sin runtime de servidor.

### Environments

| Environment | Branch | URL | Database | Third-party mode |
|---|---|---|---|---|
| Local | — | http://localhost:4321/mentorix-calc-reto-30/ (`npm run dev`) | localStorage del navegador | ninguno |
| Preview | NOT APPLICABLE — GitHub Pages no tiene previews por PR; `npm run build && npm run preview` en local cumple ese papel | — | — | — |
| Production | `main` | https://oswalec.github.io/mentorix-calc-reto-30/ | localStorage del navegador de cada estudiante | ninguno |

### CI/CD

`.github/workflows/deploy.yml` (paso 14), en cada push a `main` o manual: `npm ci` → `npm run format:check` → `npm run check` → `npm test` → `npm run build` (con `verificar-dist.mjs`) → `actions/configure-pages` → `actions/upload-pages-artifact` (`dist`) → job `deploy` con `actions/deploy-pages`. Son los mismos comandos del gate §20.1.

### Release and rollback

Publicar = push a `main`. Revertir = `git revert <commit>` y push (≈ 2 minutos hasta que Actions vuelve a publicar), o re-ejecutar el workflow de un commit anterior desde la pestaña Actions. No hay migraciones; un cambio en la forma de `Estado` exige subir `VERSION_ESTADO` y `migrar()` en el mismo commit (§4).

### Domain, DNS, TLS

Dominio por defecto de GitHub Pages con HTTPS automático. No hay DNS propio en v1; si se agrega uno, `site` y `base` de `astro.config.mjs` y `PREFIJO` de `scripts/verificar-dist.mjs` cambian juntos (§19.6, reconciliación de valores).

---

## 13. Testing Strategy

| Layer | Framework | What it covers | Where | Runs |
|---|---|---|---|---|
| Unit | Vitest (happy-dom) | fechas, reparto de minutos, `generarPlan` con el ejemplo trabajado, ajustes, almacén, validador, acciones, respaldo, derivados, catálogo de rutas, tokens y contraste | `tests/unit/*.test.ts` | cada paso y en CI |
| Componentes (integración) | Vitest + @testing-library/preact | Inicio, GuiaDia, Calendario, evaluaciones y dificultades, Progreso, Ajustes, LimiteErrores — contra `localStorage` real de happy-dom | `tests/componentes/*.test.tsx` | cada paso y en CI |
| Tipos | `astro check` | TypeScript estricto en `.ts`, `.tsx` y `.astro` | todo el proyecto (excluye `blueprints/`) | cada paso y en CI |
| Build | `astro build` + `scripts/verificar-dist.mjs` | `dist/index.html` existe y ningún href/src interno pierde `/mentorix-calc-reto-30/` | `dist/` | cada paso desde el 1 y en CI |
| E2E | NOT APPLICABLE en el MVP — los flujos viven dentro de una sola isla y se cubren con pruebas de componentes; la pasada manual va en §20.1 | — | — |

### Critical flows to cover E2E

Cubiertos como pruebas de componentes (no hay navegador real en el MVP):

1. Elegir ruta y empezar → `tests/componentes/inicio.test.tsx`.
2. Abrir Hoy, marcar un bloque, registrar dificultad y reflexión → `tests/componentes/guia-dia.test.tsx`.
3. Exportar e importar el progreso (con confirmación) → `tests/componentes/ajustes.test.tsx` y `tests/unit/respaldo.test.ts`.

### Test data

Cada prueba empieza con `localStorage` vacío (`tests/setup.ts` lo limpia tras cada prueba; las de componentes llaman `recargarEstado()` y fijan `fechaHoy.value`). Las fechas son fijas (`2026-03-01` …). La ruta mínima del ejemplo trabajado está en `tests/fixtures/ruta-prueba.ts`. Ningún servicio real: no hay nada que provisionar.

### What is deliberately not tested

La apariencia visual (no hay snapshots de píxeles), el script inline del conmutador de tema (se verifica su presencia en `dist/index.html`), la descarga real del archivo (`URL.createObjectURL` se simula) y GitHub Pages en sí (checklist §20.1).

---

## 14. Security & Secrets

| Concern | Control | Implemented in |
|---|---|---|
| Secret storage | No hay secretos: ni API keys ni variables de entorno | — |
| Secret rotation | NOT APPLICABLE — sin secretos | — |
| Input validation | `erroresConfig` para la configuración; `validarEstado` manual al cargar y al importar; acciones que devuelven `Error` para texto vacío o notas inválidas | `src/lib/plan/generador.ts`, `src/lib/progreso/validar.ts`, `src/lib/progreso/acciones.ts` |
| Output encoding / XSS | Todo texto se renderiza con JSX de Preact (escapa por defecto); prohibido `dangerouslySetInnerHTML` | `src/components/**` |
| SQL injection | NOT APPLICABLE — no hay SQL | — |
| AuthN / AuthZ | NOT APPLICABLE — sin cuentas (non-goal de §1) | — |
| CSRF | NOT APPLICABLE — no hay servidor ni peticiones con estado | — |
| Rate limiting / abuse | NOT APPLICABLE — sitio estático en GitHub Pages | — |
| Webhook verification | NOT APPLICABLE | — |
| Dependency audit | `npm audit --omit=dev` mensual por el docente; Dependabot de GitHub activado en el repo | CI / GitHub |
| Security headers | GitHub Pages no permite cabeceras propias; no se carga ningún script de terceros (fuentes autoalojadas) | `src/layouts/Base.astro` |
| PII handling | Solo texto que el estudiante escribe (dificultades, reflexiones, notas) en su propio `localStorage`; nunca se envía a ningún servidor; «Reiniciar todo» lo borra | `src/lib/progreso/almacen.ts`, `src/components/Ajustes.tsx` |
| Logging hygiene | `console.error` solo registra `{nivel, origen, mensaje, fecha}`, nunca el contenido del progreso | `src/components/LimiteErrores.tsx` |

**Hard rules**
- Nada se envía a la red: ningún `fetch`, beacon ni script de terceros.
- El archivo de respaldo contiene texto personal del estudiante: la UI dice que vive solo en su navegador.

No hay datos regulados (salud, financieros, menores con cuenta). Los estudiantes pueden ser menores, pero no se recolecta nada en servidores.

---

## 15. Accessibility

**Objetivo: WCAG 2.2 nivel AA.** Los criterios accesibles están dentro de los pasos de §9 (etiquetas, roles, contraste), no en un pendiente.

### Baseline requirements

| Requirement | Rule |
|---|---|
| Semantic HTML | `nav` con `aria-label="Navegación principal"`, `main#contenido`, una `h1` estática por página, islas desde `h2`; listas para listas |
| Keyboard | todo es botón, enlace, casilla o campo nativo; enlace «Saltar al contenido» visible al recibir foco |
| Focus visible | `:focus-visible { outline: 3px solid var(--primary); outline-offset: 2px; }` |
| Contrast | AA en ambos modos; `tests/unit/tokens.test.ts` lo calcula |
| Forms | cada campo con `<label for>` o `aria-label`; errores en `role="alert"` y en texto; confirmaciones en `role="status"` |
| Images | sin imágenes; los SVG de navegación son `aria-hidden="true"` junto a texto visible |
| Motion | `prefers-reduced-motion: reduce` anula transiciones |
| Zoom / reflow | móvil primero; sin scroll horizontal a 320–360px; tablas de dominio dentro de `overflow-x: auto` |
| Live regions | contador «N de M bloques completados» con `aria-live="polite"`; mensajes en `role="status"` |

### WCAG 2.2 additions — the ones most often missed

| SC | Requirement |
|---|---|
| 2.4.11 Focus Not Obscured (Min) | `.contenido` reserva `48px + 64px` abajo para que la navegación fija no tape el foco |
| 2.5.7 Dragging Movements | no hay arrastre |
| 2.5.8 Target Size (Min) | botones y casillas de bloque con `min-height: 44px`; enlaces de navegación 56px |
| 3.3.7 Redundant Entry | Ajustes precarga la configuración actual; los formularios de evaluación precargan lo ya guardado |
| 3.3.8 Accessible Authentication (Min) | NOT APPLICABLE — sin autenticación |

### Verification

```bash
npm test -- tests/componentes   # expect: exit 0 — cada prueba localiza los controles por rol y nombre accesible
npm test -- tests/unit/tokens.test.ts   # expect: exit 0 — contraste AA de los pares de texto en ambos modos
```

No hay axe en el MVP. Antes de publicar, en §20.1: recorrido solo con teclado de Inicio → Hoy → Ajustes, una pasada con lector de pantalla (TalkBack o NVDA) sobre Hoy, y zoom al 200% a 360px.

---

## 16. Observability & Cost

### Instrumentation

| Signal | Tool | What it captures | Who looks at it |
|---|---|---|---|
| Errors | `LimiteErrores` + `console.error` estructurado | excepciones de render por isla: `{"nivel":"error","origen":"<isla>","mensaje":"…","fecha":"<ISO>"}`, sin datos del progreso | el docente, cuando un estudiante envía captura de la consola |
| Logs | NOT APPLICABLE — sin servidor | — | — |
| Metrics | NOT APPLICABLE — sin analítica (non-goal) | — | — |
| Uptime | GitHub Pages (estado en https://www.githubstatus.com) | disponibilidad del hosting | el docente |

### The metrics that matter for this project

| Metric | Target | Alert at |
|---|---|---|
| Ejecuciones fallidas del workflow de despliegue | 0 por mes | 1 (GitHub envía correo al docente) |
| Reportes de «Algo salió mal en esta sección» | 0 por mes | 2 en un mes → revisar §20.3 #2 |
| Peso transferido de `/hoy/` | < 250 KB | > 350 KB |

### Health check

NOT APPLICABLE como endpoint — sitio estático. El equivalente es `npm run build` en CI: `verificar-dist.mjs` falla si falta `dist/index.html` o si un enlace interno pierde la base.

### Cost model

| Service | Free tier | Cost at v1 scale (cientos de estudiantes) | Cost at 10× | Cliff to watch |
|---|---|---|---|---|
| GitHub Pages | 100 GB/mes de ancho de banda, 1 GB de sitio | $0 | $0 | 100 GB/mes (≈ 400 000 visitas de 250 KB) |
| GitHub Actions | ilimitado en repos públicos | $0 | $0 | si el repo pasa a privado: 2 000 min/mes gratis |

**Costo mensual estimado al lanzar: $0.** No hay ningún servicio de pago en ningún punto.

---

## 17. Model Routing

NOT APPLICABLE — this project does not call an LLM at runtime.

---

## 18. Skills to Use During Build

Ninguna es obligatoria: si no está instalada, el constructor sigue con el blueprint, lo anota en una línea y continúa.

| Skill | Build steps | Why | Install |
|---|---|---|---|
| `frontend-design` (se activa sola, sin `/`) | 8–13 | pulir las islas sin salirse de los tokens de §7 | `/plugin marketplace add anthropics/skills` y luego `/plugin install example-skills@anthropic-agent-skills` |
| `emil-design-eng` (se activa sola, sin `/`) | 2, 9 | revisar transiciones y estados de las casillas respetando `prefers-reduced-motion` | `npx skills@latest add emilkowalski/skills` |
| `/humanizalo` (comando con `/`) | 3, 5, 14 | revisar el tono de los textos de UI y del README en español | `git clone https://github.com/Hainrixz/humanizalo.git ~/.claude/skills/humanizalo` (el registro lo marca *stale* desde 2026-03-22: verifica el repo antes de instalar) |

---

## 19. Agent Workspace

`workspace/` del bundle refleja la raíz del proyecto: se copia **una vez**, con el comando no destructivo de §10 (`node -e "require('node:fs').cpSync(…, { force: false, errorOnExist: false })"`), que omite todo archivo existente y sale 0 si se repite. Nada más del bundle se copia al proyecto. Nunca se emite `.claude/commands/`.

```
blueprints/mentorix-calc-reto-30/workspace/
├── CLAUDE.md                    # §19.1
├── AGENTS.md                    # §19.2
├── .claude/
│   ├── settings.json            # §19.3
│   ├── skills/agregar-o-editar-ruta/SKILL.md   # §19.4
│   └── rules/                   # §19.5
│       ├── rutas-datos.md
│       ├── logica-plan-progreso.md
│       ├── interfaz.md
│       └── pruebas.md
├── .gitattributes .gitignore .nvmrc .prettierignore .prettierrc   # §19.6
├── astro.config.mjs package.json tsconfig.json vitest.config.ts  # §19.6
├── scripts/verificar-dist.mjs   # §19.6
└── tests/setup.ts               # §19.6
```

**Estilo de los archivos emitidos.** La configuración de formato que rige es la que este blueprint emite: `.prettierrc` (`prettier-plugin-astro`, `endOfLine: lf`, el resto por defecto de Prettier 3: 2 espacios, comillas dobles, comas finales, 80 columnas). Todos los archivos de `workspace/` que Prettier revisa (`.json`, `.mjs`, `.ts`, `.prettierrc`) ya están en ese formato; los `.md` están excluidos en `.prettierignore` porque son documentación escrita a mano.

### 19.1 `CLAUDE.md`

```markdown
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

**Camino de un dato.** `src/data/rutas/*.ts` (contenido) → `src/lib/plan/generador.ts` (`generarPlan`, función pura) → `src/lib/progreso/store.ts` (signals: `estado`, `planActivo`, `hoyNumero`) → islas en `src/components/*.tsx` → páginas `src/pages/**/index.astro`. Toda escritura pasa por `actualizar(cambio)` del store, que llama a una acción pura de `src/lib/progreso/acciones.ts` y guarda con `src/lib/progreso/almacen.ts` bajo la clave `mentorix-reto:v1`.

**Fronteras.**

| Capa | Puede importar de | Nunca |
|---|---|---|
| `src/data/rutas/**` | solo tipos de `src/lib/tipos.ts` | lógica, componentes, `window` |
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
2. Nunca agregues contenido matemático, ejercicios, solucionarios, videos ni simulacros a la app: solo se programan como actividades externas.
3. Completar bloques nunca cambia el dominio; solo `declararDominio`, y «dominado» exige evidencia.
4. `generarPlan` nunca reduce `diasEstimados`: lo que no cabe va a `fueraDelHorizonte`.
5. Nunca borres datos guardados que no validan: se copian a `mentorix-reto:v1:danado` y se ofrecen para descargar.
6. Nunca agregues servicios con cuenta, servidor, analítica ni dependencias sin justificarlo en el commit.
7. Nunca marques una tarea hecha con un gate en rojo, ni edites un comando Verify para que pase.
```

### 19.2 `AGENTS.md`

```markdown
# Mentorix Calc — Reto de Estudio de 30 Días — instrucciones para agentes

Sitio estático (Astro + islas Preact) que guía el estudio diario de Cálculo y guarda el progreso del estudiante en `localStorage`. Sin cuentas, sin servidor.

## Comandos

| Tarea | Comando |
|---|---|
| Instalar | `npm install --no-audit --no-fund` (CI: `npm ci`) |
| Desarrollo | `npm run dev` |
| Revisar tipos | `npm run check` |
| Pruebas | `npm test` · una: `npm test -- tests/unit/generador.test.ts` |
| Construir + verificar `dist/` | `npm run build` |
| Formato | `npm run format` · `npm run format:check` |

**Gate:** `npm run check && npm test && npm run build && npm run format:check` sale 0 antes de dar una tarea por hecha.

## No negociable

1. Nunca renombres un `slug` publicado (ruta, tema o subtema).
2. Nunca agregues contenido matemático, ejercicios, solucionarios, videos ni simulacros a la app.
3. Completar bloques nunca cambia el dominio; «dominado» exige evidencia.
4. `generarPlan` nunca reduce `diasEstimados`.
5. Nunca borres datos guardados que no validan.
6. Nunca agregues servicios con cuenta, servidor ni analítica.
7. Nunca marques una tarea hecha con un gate en rojo.

Arquitectura completa, fronteras y tokens de diseño: `CLAUDE.md` en este directorio. Orden de construcción: `blueprints/mentorix-calc-reto-30/tasks.json`.
```

### 19.3 `.claude/settings.json`

Cada subcomando de cada `Verify` de §9, de cada Checkpoint, de §10 Bootstrap y del gate §20.1 tiene su entrada (los de solo lectura `grep`, `ls`, `cat`, `wc` y `git` de lectura también están listados explícitamente). `test` está permitido para las comprobaciones `test -f`. Sin intérpretes desnudos: el único `node -e` permitido es la copia exacta de §10.

```json
{
  "permissions": {
    "allow": [
      "Bash(npm install --no-audit --no-fund)",
      "Bash(npm ci)",
      "Bash(npm run check)",
      "Bash(npm test)",
      "Bash(npm test -- tests/:*)",
      "Bash(npm run build)",
      "Bash(npm run format)",
      "Bash(npm run format:check)",
      "Bash(npm run dev)",
      "Bash(npm run preview)",
      "Bash(node scripts/verificar-dist.mjs)",
      "Bash(node scripts/verificar-workflow.mjs)",
      "Bash(node -e \"require('node:fs').cpSync('blueprints/mentorix-calc-reto-30/workspace', '.', { recursive: true, force: false, errorOnExist: false })\")",
      "Bash(test:*)",
      "Bash(grep:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(wc:*)",
      "Bash(tail:*)",
      "Bash(git init -b main)",
      "Bash(git config user.name)",
      "Bash(git config user.email)",
      "Bash(git config user.name \"Mentorix Builder\")",
      "Bash(git config user.email \"builder@mentorix.local\")",
      "Bash(git add -A)",
      "Bash(git commit -m:*)",
      "Bash(git tag step-:*)",
      "Bash(git tag -l:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git ls-files:*)",
      "Bash(git check-ignore -q:*)",
      "Bash(git rev-parse:*)",
      "Bash(git rev-list:*)"
    ],
    "deny": [
      "Bash(git push:*)",
      "Bash(git push --force:*)",
      "Bash(rm -rf:*)",
      "Bash(npm publish:*)",
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

### 19.4 Project skills — `.claude/skills/<name>/SKILL.md`

| Skill | Triggers on | What it automates |
|---|---|---|
| `agregar-o-editar-ruta` | «agrega la ruta…», «cambia los días de…», «agrega un subtema…» | editar `src/data/rutas/` sin renombrar slugs, registrar la ruta, actualizar la prueba y correr los gates |

`.claude/skills/agregar-o-editar-ruta/SKILL.md`

````markdown
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
````

### 19.5 `.claude/rules/*.md`

| File | `paths` globs | Covers |
|---|---|---|
| `.claude/rules/rutas-datos.md` | `src/data/rutas/**` | slugs inmutables, formato de datos, sin contenido matemático |
| `.claude/rules/logica-plan-progreso.md` | `src/lib/**` | pureza del generador, IDs, minutos, fechas, versión del Estado |
| `.claude/rules/interfaz.md` | `src/components/**`, `src/pages/**`, `src/layouts/**`, `src/styles/**` | islas, enlaces con base, accesibilidad, tokens |
| `.claude/rules/pruebas.md` | `tests/**` | ubicación, setup, fechas fijas, sin skip |

`.claude/rules/rutas-datos.md`

```markdown
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
```

`.claude/rules/logica-plan-progreso.md`

```markdown
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
```

`.claude/rules/interfaz.md`

```markdown
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
```

`.claude/rules/pruebas.md`

```markdown
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
```

### 19.6 Verify-critical config and local infrastructure

Todo archivo de configuración que un `Verify` de §9 necesita llega como archivo real en `workspace/` antes del paso 1. No hay servicios locales (sin base de datos ni contenedores) y ninguna herramienta lee variables de entorno.

| File | Path in the project | Which `Verify` commands need it | Resolution/env handling it carries | Bundle-path exclusion |
|---|---|---|---|---|
| `package.json` | `package.json` | todos (scripts `check`, `test`, `build`, `format:check`) | `"type": "module"`; `build` = `astro build && node scripts/verificar-dist.mjs`; todas las dependencias de §11 | n/a — npm no usa workspaces aquí |
| `astro.config.mjs` | `astro.config.mjs` | `npm run build`, `npm run check`, `npm test` (vía `getViteConfig`) | integración `preact()`; `base`, `site`, `trailingSlash`, `output` | n/a — Astro solo construye `src/pages/` |
| `tsconfig.json` | `tsconfig.json` | `npm run check` | `extends: astro/tsconfigs/strict` (moduleResolution `bundler`), `jsx: react-jsx`, `jsxImportSource: preact`; no lee env | `"exclude": ["dist", "node_modules", "blueprints"]` |
| `vitest.config.ts` | `vitest.config.ts` | `npm test` (todos los pasos) | `getViteConfig` aplica la integración Preact (JSX); `environment: "happy-dom"`; `setupFiles: ["tests/setup.ts"]`; `css.include` para que `tokens.css?raw` no llegue vacío; no lee env | `exclude: ["blueprints/**", "node_modules/**", "dist/**"]` |
| `tests/setup.ts` | `tests/setup.ts` | `npm test` | `cleanup()` + `localStorage.clear()` tras cada prueba | n/a — lo carga Vitest por ruta |
| `.prettierrc` | `.prettierrc` | `npm run format:check` (Bootstrap y todos los pasos) | `plugins: ["prettier-plugin-astro"]`, `endOfLine: "lf"` | (en `.prettierignore`) |
| `.prettierignore` | `.prettierignore` | `npm run format:check` | — | línea literal `blueprints/` |
| `.gitattributes` | `.gitattributes` | `npm run format:check` en clones de Windows (`core.autocrlf=true`) | `* text=auto eol=lf` | n/a |
| `.gitignore` | `.gitignore` | todos los Checkpoint (`git add -A`) | ignora `node_modules/`, `dist/`, `.astro/` | n/a — el bundle sí se versiona |
| `.nvmrc` | `.nvmrc` | CI (`actions/setup-node`), §10 | `24` | n/a |
| `scripts/verificar-dist.mjs` | `scripts/verificar-dist.mjs` | `npm run build` (pasos 1–14) | solo `node:fs`/`node:path`; no lee env | n/a — solo lee `dist/` |

Contenido completo de cada archivo de `workspace/` de esta tabla (idéntico byte a byte a los archivos del bundle):

`workspace/package.json`

```json
{
  "name": "mentorix-calc-reto-30",
  "version": "0.1.0",
  "private": true,
  "description": "Mentorix Calc — Reto de Estudio de 30 Días: guía diaria de estudio y seguimiento personal para estudiantes de Cálculo.",
  "type": "module",
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "build": "astro build && node scripts/verificar-dist.mjs",
    "preview": "astro preview",
    "test": "vitest run",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "@astrojs/preact": "^6.1.1",
    "@fontsource-variable/fraunces": "^5.3.0",
    "@fontsource-variable/inter": "^5.3.0",
    "@preact/signals": "^2.11.3",
    "astro": "^7.4.2",
    "preact": "^10.29.8"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.12",
    "@testing-library/preact": "^3.2.6",
    "happy-dom": "^21.0.4",
    "prettier": "^3.9.10",
    "prettier-plugin-astro": "^1.1.2",
    "typescript": "^6.0.3",
    "vite": "^8.3.5",
    "vitest": "^5.0.5"
  }
}
```

`workspace/astro.config.mjs`

```js
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// GitHub Pages sirve el sitio en https://oswalec.github.io/mentorix-calc-reto-30/
// `base` es la única fuente del prefijo; scripts/verificar-dist.mjs lo comprueba.
export default defineConfig({
  site: "https://oswalec.github.io",
  base: "/mentorix-calc-reto-30",
  trailingSlash: "always",
  output: "static",
  integrations: [preact()],
});
```

`workspace/tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules", "blueprints"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "noEmit": true
  }
}
```

`workspace/vitest.config.ts`

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// getViteConfig aplica astro.config.mjs (integración Preact) a Vitest.
export default getViteConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["blueprints/**", "node_modules/**", "dist/**"],
    setupFiles: ["tests/setup.ts"],
    // Sin esto Vitest entrega CSS vacío y `tokens.css?raw` llega como "".
    css: { include: [/src\/styles\//] },
  },
});
```

`workspace/tests/setup.ts`

```ts
import { cleanup } from "@testing-library/preact";
import { afterEach } from "vitest";

// Vitest corre sin `globals`, así que Testing Library no limpia sola:
// se desmonta todo y se vacía localStorage después de cada prueba.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
```

`workspace/.prettierrc`

```
{
  "plugins": ["prettier-plugin-astro"],
  "endOfLine": "lf"
}
```

`workspace/.prettierignore`

```
# el bundle del blueprint vive dentro del proyecto: nunca se formatea
blueprints/
# salidas y dependencias
dist/
.astro/
node_modules/
package-lock.json
# documentación en Markdown: se escribe a mano
*.md
```

`workspace/.gitignore`

```
# dependencias y salidas generadas
node_modules/
dist/
.astro/

# entorno local (este proyecto no usa variables de entorno)
.env
.env.*

# registros
npm-debug.log*

# sistema operativo
.DS_Store
Thumbs.db
```

`workspace/.gitattributes`

```
* text=auto eol=lf
```

`workspace/.nvmrc`

```
24
```

`workspace/scripts/verificar-dist.mjs`

```js
// Verifica la salida de `astro build` en dist/.
// 1. Debe existir dist/index.html.
// 2. Todo href/src interno (empieza con "/" pero no con "//") de cada
//    dist/**/*.html debe empezar con el prefijo de GitHub Pages.
// Sale con código 1 y lista los problemas si algo falla.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const PREFIJO = "/mentorix-calc-reto-30/";
const RAIZ = "dist";

function listarHtml(dir) {
  const salida = [];
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) {
      salida.push(...listarHtml(ruta));
    } else if (nombre.endsWith(".html")) {
      salida.push(ruta);
    }
  }
  return salida;
}

const problemas = [];

if (!existsSync(join(RAIZ, "index.html"))) {
  problemas.push("falta dist/index.html");
} else {
  const archivos = listarHtml(RAIZ);
  const patron = /\s(?:href|src)="([^"]*)"/g;
  for (const archivo of archivos) {
    const html = readFileSync(archivo, "utf8");
    for (const coincidencia of html.matchAll(patron)) {
      const valor = coincidencia[1];
      const interno = valor.startsWith("/") && !valor.startsWith("//");
      if (interno && !valor.startsWith(PREFIJO)) {
        problemas.push(
          `${relative(".", archivo)}: enlace sin prefijo "${valor}"`,
        );
      }
    }
  }
  console.log(`verificar-dist: ${archivos.length} archivo(s) HTML revisado(s)`);
}

if (problemas.length > 0) {
  for (const problema of problemas) console.error(problema);
  process.exit(1);
}
console.log("verificar-dist: OK");
```

Archivos que un `Verify` nombra y crea un paso (no `workspace/`): `tests/unit/*.test.ts`, `tests/componentes/*.test.tsx`, `tests/fixtures/ruta-prueba.ts`, `scripts/verificar-workflow.mjs`, `.github/workflows/deploy.yml`, `README.md` — cada uno aparece en los **Archivos** del paso que lo ejecuta por primera vez.

#### Resolution convention matrix

**La convención, una sola vez:** dentro de `src/` y `tests/`, imports **relativos y sin extensión** (`import { sumarDias } from "../fechas";`, `import { rutas } from "../../src/data/rutas";` resolviendo a `index.ts`), sin alias de ruta. `.css?raw` solo en pruebas. Los scripts `scripts/*.mjs` **no importan nada de `src/`**: solo módulos `node:`.

| Context | Command that exercises it | Convention as it appears there | Config + literal setting that makes it work |
|---|---|---|---|
| Application source | `npm run build` | `../lib/fechas`, `./GuiaDia`, `../../data/rutas` | `astro.config.mjs` — Vite resuelve sin extensión e `index.ts`; `tsconfig.json` — `extends: "astro/tsconfigs/strict"` (moduleResolution `bundler`) |
| Type check | `npm run check` | mismas | `tsconfig.json` — moduleResolution `bundler` heredado; `jsxImportSource: "preact"` |
| Test files | `npm test` | `../../src/lib/plan/generador`, `../fixtures/ruta-prueba`, `../../src/styles/tokens.css?raw` | `vitest.config.ts` — `getViteConfig` (mismo resolvedor de Vite que el build) y `css: { include: [/src\/styles\//] }` para `?raw` |
| Standalone scripts | `node scripts/verificar-dist.mjs`, `node scripts/verificar-workflow.mjs` | `import { readFileSync } from "node:fs"` (solo `node:`) | `package.json` — `"type": "module"` (ESM nativo de Node 24); nada de `src/` |
| Build / bundle | `npm run build` | — (Vite empaqueta; la salida no tiene imports relativos sin resolver) | `astro.config.mjs` — `output: "static"`, `base: "/mentorix-calc-reto-30"`; `verificar-dist.mjs` comprueba el prefijo |
| Formatter | `npm run format:check` | — | `.prettierrc` — `plugins: ["prettier-plugin-astro"]` |

#### Cross-artifact value reconciliation

| Shared value | Single source — the file that decides it | Literal value | Every other place it appears | Compared |
|---|---|---|---|---|
| Prefijo de la base | `astro.config.mjs` — `base` | `/mentorix-calc-reto-30` | `scripts/verificar-dist.mjs` — `PREFIJO = "/mentorix-calc-reto-30/"` (base + `/` por `trailingSlash: "always"`) · Verify de los pasos 1, 2 y 8 (`grep -q 'href="/mentorix-calc-reto-30/…"'`) · `README.md` (URL) · §6 | yes |
| URL del sitio | `astro.config.mjs` — `site` | `https://oswalec.github.io` | `README.md` — `https://oswalec.github.io/mentorix-calc-reto-30/` · §12 | yes |
| Directorio de salida | Astro (por defecto `outDir`) | `dist` | `scripts/verificar-dist.mjs` — `RAIZ = "dist"` · `deploy.yml` — `path: dist` · `.gitignore` `dist/` · `.prettierignore` `dist/` · `tsconfig.json` `"dist"` · `vitest.config.ts` `"dist/**"` · Verify `test -f dist/…` | yes |
| Ruta del bundle | estructura del proyecto | `blueprints/` | `.prettierignore` `blueprints/` · `tsconfig.json` `"blueprints"` · `vitest.config.ts` `"blueprints/**"` · §10 `blueprints/mentorix-calc-reto-30/workspace` | yes |
| Versión de Node | `.nvmrc` | `24` | `package.json` `"node": ">=24"` · `deploy.yml` `node-version-file: .nvmrc` | yes |
| Nombre del paquete / repo | `package.json` — `name` | `mentorix-calc-reto-30` | `base` · repositorio `Oswalec/mentorix-calc-reto-30` · `blueprints/mentorix-calc-reto-30/` | yes |
| Clave de almacenamiento | `src/lib/progreso/estado.ts` — `CLAVE_ALMACEN` | `mentorix-reto:v1` | `CLAVE_DANADA = "mentorix-reto:v1:danado"` · pruebas `progreso.test.ts`, `guia-dia.test.tsx` (vía la constante) · §4 | yes |
| Clave del tema | `src/layouts/Base.astro` (dos scripts inline) | `mentorix-tema` | Verify del paso 2 (`grep -q 'mentorix-tema' dist/index.html`) · `CLAUDE.md` | yes |
| Script de build | `package.json` — `scripts.build` | `astro build && node scripts/verificar-dist.mjs` | `deploy.yml` `run: npm run build` · `scripts/verificar-workflow.mjs` (`- run: npm run build`) | yes |
| Patrón de pruebas | `vitest.config.ts` — `include` | `tests/**/*.test.ts`, `tests/**/*.test.tsx` | todos los archivos de prueba de §9 (terminan en `.test.ts`/`.test.tsx`) | yes |

Contratos entre artefactos y el paso más temprano donde se ejercitan: `base` ↔ `verificar-dist.mjs` ↔ `package.json build` se ejecutan juntos en el paso 1 (`npm run build`); `vitest.config.ts` ↔ JSX de Preact ↔ happy-dom en el paso 1 (`tests/unit/humo.test.tsx` renderiza JSX y usa `localStorage`); `deploy.yml` ↔ `verificar-workflow.mjs` ↔ `package.json` en el paso 14, el primero donde existen ambos lados.

#### Byte-exact artifact reconciliation

Este blueprint no tiene archivos golden contra los que se haga `diff`. Sí fija literales que las pruebas comparan con `toEqual`/`toBe`; todos los produce código **escrito literalmente en este blueprint**, no el runtime, y se ejecutaron sobre las versiones de §11 (Node 24.19.0, vitest 5.0.5, happy-dom 21.0.4) antes de emitirlo: 79 pruebas en verde.

| Byte-exact artifact | Authored by | First diffed at | Blueprint rules that constrain it | Runtime call that produces it, on the §11 pin | Both confirmed |
|---|---|---|---|---|---|
| Orden de días, IDs, minutos y repasos del ejemplo trabajado (`tests/unit/generador.test.ts`) | paso 4 | paso 4 | §4 algoritmo (grupos, días ligeros, sin compresión, simulacro, d+1/3/7/14, regla de minutos) | `generarPlan(rutaPrueba, …)` — código literal del paso 4; ningún texto del runtime | yes |
| `formatearFecha("2026-03-01") === "dom 1 mar 2026"` | paso 4 | paso 4 | §4 fechas sin zona horaria | arreglos fijos `DIAS_SEMANA`/`MESES` + `getUTC*`, sin `Intl` (independiente del idioma del sistema) | yes |
| Mensajes de error de importación (`"El archivo no es un respaldo válido: no es JSON."`) | paso 7 | paso 7 / paso 13 | §6 estados de error | texto propio en `leerRespaldo`; nunca se muestra el mensaje de `JSON.parse` | yes |
| Tokens de color (`tests/unit/tokens.test.ts`) | paso 2 | paso 2 | §7 tabla de colores (minúsculas en el CSS) | `tokens.css?raw` (texto del archivo, sin transformación gracias a `css.include`) | yes |
| `{ completados: 7, total: 80, porcentaje: 9 }` | paso 7 | paso 7 | §4 ejemplo trabajado (80 bloques contados) | `progresoGlobal` — código literal | yes |

---

## 20. Acceptance Gate, Risks & Decision Log

### 20.1 Global acceptance gate

El proyecto está **terminado** cuando cada comando de abajo sale 0 en un checkout limpio, desde la raíz, con el bundle presente en `blueprints/`. Es el mismo conjunto que corre CI.

```bash
npm ci                                   # expect: exit 0, sin modificar package-lock.json
npm run format:check                     # expect: exit 0 — Prettier ignora blueprints/
npm run check                            # expect: exit 0, 0 errors, 0 warnings
npm test                                 # expect: exit 0, 0 failed, 0 skipped
npm run build                            # expect: exit 0 y "verificar-dist: OK" — ningún enlace interno sin /mentorix-calc-reto-30/
test -f dist/index.html                  # expect: exit 0 — el artefacto que GitHub Pages sirve existe
test -f dist/hoy/index.html              # expect: exit 0
test -f dist/dia/index.html              # expect: exit 0
test -f dist/calendario/index.html       # expect: exit 0
test -f dist/progreso/index.html         # expect: exit 0
test -f dist/ajustes/index.html          # expect: exit 0
node scripts/verificar-workflow.mjs      # expect: exit 0, "verificar-workflow: OK"
```

Accesibilidad automatizada: incluida en `npm test` (pruebas por rol/nombre accesible y contraste AA de `tokens.test.ts`). Toda expectativa es una propiedad, no un conteo; ninguna línea pasa con un código distinto de 0.

Más estas comprobaciones manuales — la lista de lanzamiento posterior a la construcción, una vez antes de publicar:

- [ ] Cada paso de §9 tiene su tag: `test "$(git tag -l 'step-*' | wc -l)" -eq 14` sale 0 (14 = número de pasos de §9). El repositorio lo crea §10 Bootstrap.
- [ ] Cada archivo de *Files that must be committed* (§10) está rastreado — un path por invocación: `git ls-files --error-unmatch package.json`, `… package-lock.json`, `… astro.config.mjs`, `… tsconfig.json`, `… vitest.config.ts`, `… .prettierrc`, `… .prettierignore`, `… .nvmrc`, `… .gitattributes`, `… .gitignore`, `… scripts/verificar-dist.mjs`, `… scripts/verificar-workflow.mjs`, `… tests/setup.ts`, `… CLAUDE.md`, `… AGENTS.md`, `… .claude/settings.json`, `… .github/workflows/deploy.yml`, `… blueprints/mentorix-calc-reto-30/tasks.json` — cada uno sale 0. Y por cada uno, `status=0; git check-ignore -q <path> || status=$?; test "$status" -eq 1` sale 0 (1 = no ignorado; 128 = error de uso, y entonces falla).
- [ ] `.gitignore` estaba antes del primer commit: `test "$(git log --diff-filter=A --format=%H -- .gitignore | tail -n 1)" = "$(git rev-list --max-parents=0 HEAD)"` sale 0.
- [ ] Cada fila de *Byte-exact artifact reconciliation* (§19.6) dice `yes`.
- [ ] §10 Bootstrap se re-ejecutó una vez sobre el árbol ya construido, **salió 0** en cada línea y `npm run build` sigue en verde después (la copia de `workspace/` no sobrescribió nada).
- [ ] Cada fila de *Cross-artifact value reconciliation* dice `Compared: yes` y `npm run format:check`/`npm run check` corrieron desde la raíz con el bundle presente.
- [ ] Ningún non-goal de §1 se construyó: `status=0; grep -rniE "fetch\(|sendBeacon|dangerouslySetInnerHTML" src || status=$?; test "$status" -eq 1` sale 0 (1 = ninguna coincidencia; 2 = error de grep, y entonces falla).
- [ ] Publicación (requiere cuenta, no es gate de construcción): crear `Oswalec/mentorix-calc-reto-30`, `git remote add origin …`, `git push -u origin main`, en GitHub **Settings → Pages → Source: GitHub Actions**, y el workflow «Desplegar en GitHub Pages» termina en verde.
- [ ] `https://oswalec.github.io/mentorix-calc-reto-30/` carga, elegir ruta → Hoy → marcar un bloque → recargar conserva la marca; `/calendario/`, `/progreso/`, `/ajustes/` cargan sin 404 de recursos (DevTools → Network).
- [ ] Peso de `/hoy/` < 250 KB transferidos (§1).
- [ ] A 360px de ancho no hay scroll horizontal en las seis páginas; modo oscuro del sistema y conmutador funcionan sin parpadeo.
- [ ] Recorrido solo con teclado de Inicio → Hoy → Ajustes y una pasada con lector de pantalla sobre Hoy (§15).
- [ ] Exportar en un dispositivo e importar en otro reproduce el progreso.
- [ ] Error de prueba: en DevTools, `localStorage.setItem("mentorix-reto:v1", "{roto")` y recargar Inicio muestra «No pudimos leer tu progreso guardado» (§16).
- [ ] Reversión una vez a propósito: `git revert` de un commit inocuo + push, y el sitio vuelve a publicarse (§12).

**No se ignora ninguna advertencia.**

### 20.2 Risk register

| Risk | Likelihood | Impact | Early signal | Mitigation |
|---|---|---|---|---|
| El estudiante borra los datos del navegador o cambia de dispositivo y pierde su progreso | M | A | mensajes al docente «perdí mi avance» | exportar/importar + `RecordatorioRespaldo` si no exporta en 7 días (paso 13); dueño: docente lo recuerda en clase |
| El docente renombra un slug publicado y deja completados huérfanos | M | M | estudiantes ven casillas desmarcadas tras una actualización | IDs por slug; regla `.claude/rules/rutas-datos.md` y skill `agregar-o-editar-ruta`; los huérfanos se ignoran sin romper |
| `base` mal puesta en GitHub Pages → recursos 404 | B | A | página sin estilos tras publicar | `scripts/verificar-dist.mjs` en cada `npm run build` local y en CI |
| Fecha «hoy» corrida por zona horaria | B | M | el día cambia a las 19:00 en Perú | solo fechas locales `YYYY-MM-DD` (`hoyLocal`, aritmética UTC); pruebas con fechas fijas |
| El esquema del progreso cambia en el futuro | M | A | `validarEstado` rechaza datos de estudiantes reales | `version` + `migrar()`; los datos inválidos se copian a `mentorix-reto:v1:danado` y nunca se borran |
| Una mayor futura de Astro cambia `base`/`trailingSlash` | B | A | `verificar-dist` falla tras actualizar | leer la guía de actualización (§11) antes de subir de mayor |
| Alcance: pedidos de "agregar ejercicios" dentro de la app | M | M | issues o mensajes pidiendo contenido | non-goals §1 y regla no negociable en `CLAUDE.md` |

### 20.3 Decision log

| # | Decision | Rejected alternative | Why | Would reverse if |
|---|---|---|---|---|
| 1 | Sin cuentas; progreso local en `localStorage` | Supabase (free tier) con auth por enlace mágico | cero costo, cero datos personales en servidores, MVP más simple | el docente necesita ver el avance de cada estudiante → Supabase free tier con enlace mágico |
| 2 | Sin servicio externo de errores: `console.error` estructurado + `LimiteErrores` | Sentry | requiere cuenta y envía datos a terceros | aparecen reportes de fallos no reproducibles |
| 3 | npm | pnpm (por defecto del track) | pnpm no está instalado en la máquina del docente | el docente adopta pnpm en todos sus proyectos |
| 4 | Astro + islas Preact | Next.js estático, Vite + Preact sin Astro | misma familia que el sitio de ejercicios del docente; páginas estáticas con islas | se necesita servidor (cuentas) y SSR |
| 5 | Preact 10 | Preact 11.0.2 | @testing-library/preact no está probado con 11 | @testing-library/preact declara soporte de Preact 11 |
| 6 | TypeScript 6 | TypeScript 7 | @astrojs/check 0.9.12 pide `^5 \|\| ^6` | @astrojs/check acepta 7 |
| 7 | CSS con tokens | Tailwind | pocos componentes; tokens resuelven el modo oscuro | el número de componentes se triplica |
| 8 | Islas `client:only` | `client:load` con SSR | el contenido depende de `localStorage`; SSR produciría un estado vacío y un parpadeo | se agregan cuentas y el estado vive en un servidor |
| 9 | Manifiesto y configs emitidos en `workspace/` | `npm create astro` + `astro add preact` | los prompts del scaffolder no son verificables en una construcción desatendida | el scaffolder garantiza modo no interactivo documentado |
| 10 | `generarPlan` puro y recalculado; solo se guarda la config | guardar el plan generado | IDs sin fechas: cambiar fecha u horizonte conserva lo completado; sin datos derivados que migrar | el generador se vuelve lento (no ocurre con ≤ 120 días) |
| 11 | Vitest + happy-dom sin E2E en navegador | Playwright | sin descarga de navegadores; los flujos son de una isla | aparecen errores que solo ocurren en un navegador real |
| 12 | Prettier | Biome (por defecto del track) | soporte maduro de `.astro`; mismo formato que el proyecto hermano | Biome formatea `.astro` de forma estable |
| 13 | Un tema se cierra siempre con su evaluación: el último subtema solo cabe si caben también evaluación y corrección | partir evaluación y estudio | nunca queda un tema sin examen dentro del horizonte | el docente prefiere estudiar más y evaluar después del horizonte |

### 20.4 What to build next

1. Panel del docente con cuentas (Supabase free tier, enlace mágico) — cuando el docente necesite ver el avance de cada estudiante.
2. Sincronización entre dispositivos — cuando más del 20% reporte pérdidas al cambiar de celular.
3. Recordatorios con notificaciones (service worker) — cuando se mida abandono por olvido.
4. Servicio de errores — cuando aparezcan fallos no reproducibles.

---

*Fin del blueprint. El orden de construcción es §9. Detente cuando §20.1 esté en verde.*
