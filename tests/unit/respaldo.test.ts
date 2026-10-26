import { describe, expect, it } from "vitest";
import { configInicial } from "../../src/lib/plan/ajustes";
import {
  activarRuta,
  marcarBloque,
  marcarRespaldo,
} from "../../src/lib/progreso/acciones";
import { estadoInicial } from "../../src/lib/progreso/estado";
import {
  describirResumen,
  leerRespaldo,
  necesitaRecordatorio,
  nombreArchivoRespaldo,
  serializarRespaldo,
} from "../../src/lib/progreso/respaldo";

const conAvance = marcarBloque(
  activarRuta(estadoInicial(), "prueba", configInicial("2026-03-01")),
  "prueba",
  "prueba:estudio:a#1:teoria",
  true,
  "2026-03-01T10:00:00.000Z",
);

describe("respaldo JSON", () => {
  it("nombra el archivo mentorix-reto-AAAA-MM-DD.json", () => {
    expect(nombreArchivoRespaldo("2026-03-08")).toBe(
      "mentorix-reto-2026-03-08.json",
    );
  });

  it("exporta e importa el mismo estado con su resumen", () => {
    const leido = leerRespaldo(serializarRespaldo(conAvance));
    expect(leido).not.toBeInstanceOf(Error);
    if (leido instanceof Error) return;
    expect(leido.estado).toEqual(conAvance);
    expect(describirResumen(leido.resumen)).toBe(
      "1 ruta · 1 bloque completado · 0 evaluaciones · 0 dificultades",
    );
  });

  it("rechaza archivos que no son JSON o que no pasan la validación", () => {
    expect(leerRespaldo("hola")).toBeInstanceOf(Error);
    expect(leerRespaldo(JSON.stringify({ version: 1 }))).toBeInstanceOf(Error);
    expect(
      leerRespaldo(JSON.stringify({ ...estadoInicial(), version: 9 })),
    ).toBeInstanceOf(Error);
  });

  it("recuerda exportar si hay avance y el último respaldo tiene 7 días o más", () => {
    expect(necesitaRecordatorio(estadoInicial(), "2026-03-10")).toBe(false);
    expect(necesitaRecordatorio(conAvance, "2026-03-10")).toBe(true);
    const respaldado = marcarRespaldo(conAvance, "2026-03-03");
    expect(necesitaRecordatorio(respaldado, "2026-03-09")).toBe(false);
    expect(necesitaRecordatorio(respaldado, "2026-03-10")).toBe(true);
  });
});
