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
