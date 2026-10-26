// Registro de rutas. Para añadir una ruta: crea su archivo en esta carpeta
// y agrégala a `rutas` (el orden de este arreglo es el orden en Inicio).
import type { Ruta, Tema } from "../../lib/tipos";
import { calculoDiferencial } from "./calculo-diferencial";
import { calculoIntegral } from "./calculo-integral";

export const rutas: Ruta[] = [calculoDiferencial, calculoIntegral];

export function buscarRuta(slug: string): Ruta | undefined {
  return rutas.find((ruta) => ruta.slug === slug);
}

export function buscarTema(slug: string): Tema | undefined {
  for (const ruta of rutas) {
    const tema = ruta.temas.find((t) => t.slug === slug);
    if (tema) return tema;
  }
  return undefined;
}
