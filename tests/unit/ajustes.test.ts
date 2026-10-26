import { describe, expect, it } from "vitest";
import { buscarRuta, rutas } from "../../src/data/rutas";
import {
  cambiarDuracion,
  configInicial,
  extenderHorizonte,
  fijarRefuerzo,
  prerrequisitosDeRuta,
} from "../../src/lib/plan/ajustes";
import { generarPlan } from "../../src/lib/plan/generador";
import { rutaPrueba } from "../fixtures/ruta-prueba";

const corta = { ...configInicial("2026-03-01"), horizonteDias: 7 };

describe("ajustes del plan", () => {
  it("parte de 30 días, 120 minutos, día ligero cada 7 y sin refuerzos", () => {
    expect(configInicial("2026-03-01")).toEqual({
      fechaInicio: "2026-03-01",
      horizonteDias: 30,
      minutosPorDia: 120,
      diaLigeroCada: 7,
      refuerzos: [],
    });
  });

  it("extiende +7 días: lo pendiente entra al plan y los días ya hechos conservan sus IDs", () => {
    const antes = generarPlan(rutaPrueba, corta);
    const extendida = extenderHorizonte(corta, 7);
    expect(extendida.horizonteDias).toBe(14);
    const despues = generarPlan(rutaPrueba, extendida);
    expect(antes.fueraDelHorizonte.map((s) => s.subtemaSlug)).toEqual(["c"]);
    expect(despues.fueraDelHorizonte).toEqual([]);
    for (let i = 0; i < 5; i++) {
      expect(despues.dias[i]!.bloques.map((b) => b.id)).toEqual(
        antes.dias[i]!.bloques.map((b) => b.id),
      );
    }
  });

  it("acepta duraciones de 7 a 120 días y rechaza el resto", () => {
    expect(cambiarDuracion(corta, 45).horizonteDias).toBe(45);
    expect(cambiarDuracion(corta, 120).horizonteDias).toBe(120);
    expect(() => cambiarDuracion(corta, 6)).toThrow(RangeError);
    expect(() => cambiarDuracion(corta, 121)).toThrow(RangeError);
    expect(() => cambiarDuracion(corta, 30.5)).toThrow(RangeError);
    expect(() =>
      extenderHorizonte({ ...corta, horizonteDias: 115 }, 7),
    ).toThrow(RangeError);
    expect(() => extenderHorizonte(corta, 0)).toThrow(RangeError);
  });

  it("crea, reemplaza y quita refuerzos de prerrequisitos", () => {
    const con = fijarRefuerzo(corta, "t1", 2);
    expect(con.refuerzos).toEqual([{ temaSlug: "t1", dias: 2 }]);
    expect(fijarRefuerzo(con, "t1", 3).refuerzos).toEqual([
      { temaSlug: "t1", dias: 3 },
    ]);
    expect(fijarRefuerzo(con, "t1", 0).refuerzos).toEqual([]);
    expect(() => fijarRefuerzo(corta, "t1", 8)).toThrow(RangeError);
  });

  it("lista los prerrequisitos de una ruta, incluso de otras rutas", () => {
    const edo = buscarRuta("ecuaciones-diferenciales")!;
    expect(
      prerrequisitosDeRuta(edo, rutas).map((p) => [
        p.temaSlug,
        p.nombre,
        p.requeridoPor,
      ]),
    ).toEqual([
      [
        "integral-indefinida",
        "Integral indefinida y técnicas de integración",
        ["EDO de primer orden"],
      ],
      [
        "edo-primer-orden",
        "EDO de primer orden",
        ["Aplicaciones de primer orden", "EDO lineales de orden superior"],
      ],
      [
        "integrales-impropias",
        "Integrales impropias",
        ["Transformada de Laplace"],
      ],
      [
        "edo-orden-superior",
        "EDO lineales de orden superior",
        ["Transformada de Laplace", "Sistemas de EDO"],
      ],
    ]);
  });

  it("registra las cuatro rutas del acompañamiento en este orden", () => {
    expect(rutas.map((r) => r.slug)).toEqual([
      "calculo-diferencial",
      "calculo-integral",
      "calculo-multivariable",
      "ecuaciones-diferenciales",
    ]);
  });
});
