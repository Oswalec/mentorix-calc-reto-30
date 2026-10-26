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
