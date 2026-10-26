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
