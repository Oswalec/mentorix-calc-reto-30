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
  const obligatorios = dia.bloques.filter((b) => !b.opcional);
  const hechos = obligatorios.filter((b) => b.id in completados).length;
  const totalMinutos = obligatorios.reduce((t, b) => t + b.minutos, 0);

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
            <li
              key={bloque.id}
              class={bloque.opcional ? "bloque-opcional" : ""}
            >
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
                  {bloque.opcional
                    ? `${bloque.titulo} · sin tiempo asignado`
                    : `${bloque.titulo} · ${bloque.minutos} min`}
                </strong>
              </label>
              <p class="texto-tenue">{bloque.instruccion}</p>
              {bloque.enlaces && (
                <ul
                  class="enlaces-skool"
                  aria-label={`Lecciones de ${bloque.titulo} en Skool`}
                >
                  {bloque.enlaces.map((e) => (
                    <li key={e.url}>
                      <a href={e.url} target="_blank" rel="noopener noreferrer">
                        ▶ {e.titulo}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <p aria-live="polite">
          {hechos} de {obligatorios.length} bloques completados
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
