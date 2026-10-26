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
