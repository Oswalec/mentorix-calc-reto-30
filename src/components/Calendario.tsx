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
