import { describe, expect, it } from "vitest";
import { buscarRuta, rutas } from "../../src/data/rutas";
import {
  cambiarDuracion,
  configInicial,
  extenderHorizonte,
  fijarRefuerzo,
  opcionesDuracion,
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

  it("parte de la duración y los minutos base de cada ruta", () => {
    const precalculo = buscarRuta("precalculo")!;
    expect(configInicial("2026-03-01", precalculo)).toMatchObject({
      horizonteDias: 3,
      minutosPorDia: 180,
    });
    expect(
      opcionesDuracion(buscarRuta("calculo-diferencial")!).map((o) => [
        o.dias,
        o.ritmo,
        o.minutos,
      ]),
    ).toEqual([
      [30, "Intensivo", 150],
      [40, "Normal", 120],
      [50, "Tranquilo", 100],
      [60, "Muy tranquilo", 90],
    ]);
    expect(opcionesDuracion(precalculo).map((o) => o.dias)).toEqual([
      3, 4, 5, 6,
    ]);
  });

  it("acepta duraciones de 3 a 120 días y rechaza el resto", () => {
    expect(cambiarDuracion(corta, 3).horizonteDias).toBe(3);
    expect(cambiarDuracion(corta, 120).horizonteDias).toBe(120);
    expect(() => cambiarDuracion(corta, 2)).toThrow(RangeError);
    expect(() => cambiarDuracion(corta, 121)).toThrow(RangeError);
    expect(() => cambiarDuracion(corta, 30.5)).toThrow(RangeError);
    expect(() =>
      extenderHorizonte({ ...corta, horizonteDias: 115 }, 7),
    ).toThrow(RangeError);
    expect(() => extenderHorizonte(corta, 0)).toThrow(RangeError);
  });

  it("crea, reemplaza y quita refuerzos de prerrequisitos", () => {
    const con = fijarRefuerzo(corta, "base-t1", 2);
    expect(con.refuerzos).toEqual([{ temaSlug: "base-t1", dias: 2 }]);
    expect(fijarRefuerzo(con, "base-t1", 3).refuerzos).toEqual([
      { temaSlug: "base-t1", dias: 3 },
    ]);
    expect(fijarRefuerzo(con, "base-t1", 0).refuerzos).toEqual([]);
    expect(() => fijarRefuerzo(corta, "base-t1", 8)).toThrow(RangeError);
  });

  it("lista los prerrequisitos de una ruta: su base en Introducción, nunca otra ruta", () => {
    const diferencial = buscarRuta("calculo-diferencial")!;
    expect(
      prerrequisitosDeRuta(diferencial).map((p) => [
        p.temaSlug,
        p.requeridoPor,
      ]),
    ).toEqual([
      ["base-intervalos-inecuaciones", ["Funciones"]],
      ["base-exponenciales-logaritmos", ["Funciones"]],
      ["base-trigonometria", ["Funciones"]],
      ["base-algebra", ["Límites y continuidad"]],
    ]);
    expect(prerrequisitosDeRuta(buscarRuta("precalculo")!)).toEqual([]);
  });

  it("registra las cinco rutas, Precálculo primero y cada asignatura por separado", () => {
    expect(rutas.map((r) => r.slug)).toEqual([
      "precalculo",
      "calculo-diferencial",
      "calculo-integral",
      "calculo-multivariable",
      "ecuaciones-diferenciales",
    ]);
  });
});
