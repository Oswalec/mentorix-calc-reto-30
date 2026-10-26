import { describe, expect, it } from "vitest";
import { buscarRuta, buscarTema, rutas } from "../../src/data/rutas";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const temas = rutas.flatMap((ruta) => ruta.temas);
const subtemas = temas.flatMap((tema) => tema.subtemas);

function duplicados(valores: string[]): string[] {
  return valores.filter((valor, i) => valores.indexOf(valor) !== i);
}

describe("catálogo de rutas", () => {
  it("tiene al menos una ruta, y cada ruta y cada tema tienen contenido", () => {
    expect(rutas.length).toBeGreaterThan(0);
    for (const ruta of rutas) {
      expect(ruta.temas.length, ruta.slug).toBeGreaterThan(0);
      expect(ruta.nombre.trim(), ruta.slug).not.toBe("");
      expect(ruta.descripcion.trim(), ruta.slug).not.toBe("");
    }
    for (const tema of temas) {
      expect(tema.subtemas.length, tema.slug).toBeGreaterThan(0);
    }
  });

  it("usa slugs en kebab-case, únicos en todo el catálogo", () => {
    const todos = [
      ...rutas.map((r) => r.slug),
      ...temas.map((t) => t.slug),
      ...subtemas.map((s) => s.slug),
    ];
    for (const slug of todos) expect(slug).toMatch(SLUG);
    expect(duplicados(rutas.map((r) => r.slug))).toEqual([]);
    expect(duplicados(temas.map((t) => t.slug))).toEqual([]);
    expect(duplicados(subtemas.map((s) => s.slug))).toEqual([]);
  });

  it("reserva la clave «final»: ningún tema se llama así", () => {
    expect(temas.map((t) => t.slug)).not.toContain("final");
  });

  it("solo declara prerrequisitos que existen y que se estudian antes en su ruta", () => {
    for (const ruta of rutas) {
      ruta.temas.forEach((tema, indice) => {
        for (const prerrequisito of tema.prerrequisitos) {
          expect(buscarTema(prerrequisito), prerrequisito).toBeDefined();
          expect(prerrequisito).not.toBe(tema.slug);
          const posicion = ruta.temas.findIndex(
            (t) => t.slug === prerrequisito,
          );
          if (posicion >= 0) expect(posicion).toBeLessThan(indice);
        }
      });
    }
  });

  it("usa diasEstimados enteros >= 1 y dificultad 1, 2 o 3", () => {
    for (const subtema of subtemas) {
      expect(Number.isInteger(subtema.diasEstimados), subtema.slug).toBe(true);
      expect(subtema.diasEstimados, subtema.slug).toBeGreaterThanOrEqual(1);
      expect([1, 2, 3], subtema.slug).toContain(subtema.dificultad);
    }
  });

  it("encuentra rutas y temas por slug", () => {
    const primera = rutas[0]!;
    expect(buscarRuta(primera.slug)).toBe(primera);
    expect(buscarRuta("no-existe")).toBeUndefined();
    expect(buscarTema(primera.temas[0]!.slug)).toBe(primera.temas[0]);
    expect(buscarTema("no-existe")).toBeUndefined();
  });
});
