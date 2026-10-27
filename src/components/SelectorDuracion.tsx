import { opcionesDuracion } from "../lib/plan/ajustes";
import type { Ruta } from "../lib/tipos";

interface Props {
  ruta: Ruta;
  /** Prefijo de los id de los campos, para no repetirlos en una misma página. */
  prefijo: string;
  horizonte: string;
  minutos: string;
  onCambio: (horizonte: string, minutos: string) => void;
}

/**
 * Elige la duración con botones de ritmo (base, 4/3, 5/3 y 2 veces la base) o
 * con un número libre. Cada botón también sugiere los minutos por día.
 */
export function SelectorDuracion(props: Props) {
  const { ruta, prefijo, horizonte, minutos, onCambio } = props;
  return (
    <>
      <fieldset>
        <legend>Elige tu ritmo</legend>
        <div class="ritmos">
          {opcionesDuracion(ruta).map((opcion) => (
            <button
              key={opcion.dias}
              type="button"
              class="ritmo"
              aria-pressed={horizonte === String(opcion.dias)}
              onClick={() =>
                onCambio(String(opcion.dias), String(opcion.minutos))
              }
            >
              <strong>{opcion.dias} días</strong>
              <span>{opcion.ritmo}</span>
              <span class="texto-tenue">{opcion.minutos} min/día</span>
            </button>
          ))}
        </div>
        <p class="texto-tenue">
          Con más días el plan se estira: más tiempo para los temas difíciles,
          un simulacro al final y menos minutos por día.
        </p>
      </fieldset>
      <div class="campo">
        <label for={`${prefijo}-horizonte`}>Duración del reto (días)</label>
        <input
          id={`${prefijo}-horizonte`}
          type="number"
          min={3}
          max={120}
          value={horizonte}
          onInput={(e) => onCambio(e.currentTarget.value, minutos)}
        />
      </div>
      <div class="campo">
        <label for={`${prefijo}-minutos`}>Minutos de estudio por día</label>
        <input
          id={`${prefijo}-minutos`}
          type="number"
          min={60}
          max={360}
          step={5}
          value={minutos}
          onInput={(e) => onCambio(horizonte, e.currentTarget.value)}
        />
      </div>
    </>
  );
}
