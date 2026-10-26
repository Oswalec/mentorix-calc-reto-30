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
