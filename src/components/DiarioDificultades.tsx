import { formatearFecha } from "../lib/fechas";
import { resolverDificultad } from "../lib/progreso/acciones";
import { actualizar, progresoActivo } from "../lib/progreso/store";
import type { Ruta } from "../lib/tipos";

/** Diario de dificultades y errores: abiertas primero, cada una se puede marcar resuelta. */
export function DiarioDificultades({ ruta }: { ruta: Ruta }) {
  const dificultades = progresoActivo.value?.dificultades ?? [];
  const nombres = new Map(
    ruta.temas.flatMap((t) => t.subtemas).map((s) => [s.slug, s.nombre]),
  );
  const ordenadas = [
    ...dificultades.filter((d) => !d.resuelta),
    ...dificultades.filter((d) => d.resuelta),
  ];
  return (
    <section class="tarjeta">
      <h2>Diario de dificultades y errores</h2>
      {ordenadas.length === 0 ? (
        <p>
          Aún no registras dificultades. Puedes hacerlo desde el cierre de cada
          día.
        </p>
      ) : (
        <ul>
          {ordenadas.map((d) => (
            <li key={d.id}>
              <label>
                <input
                  type="checkbox"
                  checked={d.resuelta}
                  aria-label={`Resuelta: ${d.texto}`}
                  onChange={(e) => {
                    const resuelta = e.currentTarget.checked;
                    actualizar((estado) =>
                      resolverDificultad(estado, ruta.slug, d.id, resuelta),
                    );
                  }}
                />{" "}
                {d.texto}
              </label>
              <p class="texto-tenue">
                {formatearFecha(d.fecha)}
                {d.subtemaSlug
                  ? ` · ${nombres.get(d.subtemaSlug) ?? d.subtemaSlug}`
                  : ""}
                {d.resuelta ? " · Resuelta" : " · Abierta"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
