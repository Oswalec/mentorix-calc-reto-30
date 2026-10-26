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
