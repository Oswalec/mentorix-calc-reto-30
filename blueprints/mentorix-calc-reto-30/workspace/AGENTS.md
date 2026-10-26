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
