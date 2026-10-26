import { describe, expect, it } from "vitest";
import { rutas } from "../../src/data/rutas";
import {
  diferenciaDias,
  esFechaValida,
  formatearFecha,
  hoyLocal,
  numeroDelDia,
  sumarDias,
} from "../../src/lib/fechas";
import { erroresConfig, generarPlan } from "../../src/lib/plan/generador";
import {
  minutosDelDia,
  repartirMinutos,
  repartoDelDia,
} from "../../src/lib/plan/minutos";
import type { ConfigPlan, TipoDia } from "../../src/lib/tipos";
import { rutaPrueba } from "../fixtures/ruta-prueba";

const base: ConfigPlan = {
  fechaInicio: "2026-03-01",
  horizonteDias: 14,
  minutosPorDia: 120,
  diaLigeroCada: 7,
  refuerzos: [],
};

const claves = (config: ConfigPlan) =>
  generarPlan(rutaPrueba, config).dias.map((d) =>
    d.bloques[0]!.id.split(":").slice(1, 3).join(":"),
  );

describe("fechas locales", () => {
  it("suma días y cruza meses y años bisiestos", () => {
    expect(sumarDias("2026-03-01", 13)).toBe("2026-03-14");
    expect(sumarDias("2028-02-28", 1)).toBe("2028-02-29");
    expect(sumarDias("2026-12-31", 1)).toBe("2027-01-01");
    expect(diferenciaDias("2026-03-01", "2026-03-14")).toBe(13);
    expect(numeroDelDia("2026-03-01", "2026-03-01")).toBe(1);
    expect(numeroDelDia("2026-03-01", "2026-02-28")).toBe(0);
  });

  it("rechaza fechas imposibles y formatea sin depender del idioma", () => {
    expect(esFechaValida("2026-02-30")).toBe(false);
    expect(esFechaValida("2026-3-1")).toBe(false);
    expect(() => sumarDias("2026-13-01", 1)).toThrow(RangeError);
    expect(formatearFecha("2026-03-01")).toBe("dom 1 mar 2026");
    expect(hoyLocal(new Date(2026, 2, 5, 23, 59))).toBe("2026-03-05");
  });
});

describe("minutos por bloque", () => {
  const reparto = (tipo: TipoDia, dificultad: 1 | 2 | 3, minutos: number) => {
    const { pesos, residuo } = repartoDelDia(tipo, dificultad);
    return Object.fromEntries(
      repartirMinutos(minutosDelDia(tipo, minutos), pesos, residuo),
    );
  };

  it("reparte 120 minutos de estudio con el residuo en Práctica", () => {
    expect(reparto("estudio", 1, 120)).toEqual({
      recuperar: 10,
      teoria: 30,
      ejemplos: 15,
      practica: 45,
      descanso: 5,
      repaso: 10,
      cierre: 5,
    });
    expect(reparto("estudio", 3, 120)).toEqual({
      recuperar: 5,
      teoria: 30,
      ejemplos: 15,
      practica: 50,
      descanso: 5,
      repaso: 10,
      cierre: 5,
    });
  });

  it("reparte los días de evaluación, corrección y repaso ligero", () => {
    expect(reparto("evaluacion", 2, 120)).toEqual({
      recuperar: 10,
      evaluacion: 85,
      descanso: 5,
      repaso: 10,
      cierre: 10,
    });
    expect(reparto("correccion", 2, 120)).toEqual({
      recuperar: 10,
      practica: 65,
      descanso: 5,
      repaso: 30,
      cierre: 10,
    });
    expect(reparto("repaso", 2, 120)).toEqual({
      recuperar: 15,
      repaso: 35,
      descanso: 5,
      cierre: 5,
    });
  });

  it("suma exactamente el total, en múltiplos de 5 y sin bloques en 0, de 60 a 360", () => {
    const tipos: TipoDia[] = [
      "estudio",
      "refuerzo",
      "evaluacion",
      "correccion",
      "repaso",
      "simulacro",
    ];
    for (let minutos = 60; minutos <= 360; minutos += 5) {
      for (const tipo of tipos) {
        for (const dificultad of [1, 2, 3] as const) {
          const total = minutosDelDia(tipo, minutos);
          const { pesos, residuo } = repartoDelDia(tipo, dificultad);
          const valores = repartirMinutos(total, pesos, residuo).map(
            ([, m]) => m,
          );
          expect(valores.reduce((a, b) => a + b, 0)).toBe(total);
          for (const m of valores) {
            expect(m).toBeGreaterThanOrEqual(5);
            expect(m % 5).toBe(0);
          }
        }
      }
    }
  });
});

describe("generarPlan — ejemplo trabajado", () => {
  it("ordena estudio, hitos, días ligeros, simulacro y corrección final", () => {
    expect(claves(base)).toEqual([
      "estudio:a#1",
      "estudio:a#2",
      "estudio:b#1",
      "evaluacion:t1",
      "correccion:t1",
      "estudio:c#1",
      "repaso:rep-1",
      "estudio:c#2",
      "estudio:c#3",
      "evaluacion:t2",
      "correccion:t2",
      "simulacro:final",
      "correccion:final",
      "repaso:rep-2",
    ]);
    const plan = generarPlan(rutaPrueba, base);
    expect(plan.fueraDelHorizonte).toEqual([]);
    expect(plan.dias.map((d) => d.fecha)[13]).toBe("2026-03-14");
    expect(plan.dias[0]!.objetivo).toBe(
      "Comprender y practicar «Subtema A» (día 1 de 2).",
    );
    expect(plan.dias[2]!.objetivo).toBe("Comprender y practicar «Subtema B».");
    expect(plan.dias[3]!.queHacer).toBe(
      "Realiza un examen de años anteriores sobre Tema uno, con tiempo limitado y sin consultar tus apuntes. Registra tu nota y tus errores.",
    );
    expect(plan.dias[11]!.queHacer).toBe(
      "Completa el simulacro que tienes disponible en tu acompañamiento, con el tiempo real del examen.",
    );
    expect(plan.dias[0]!.siguientePaso).toBe("Día 2: Subtema A.");
    expect(plan.dias[13]!.siguientePaso).toBe(
      "Fin del horizonte: revisa tu progreso y, si aún tienes temas pendientes, extiende la ruta.",
    );
  });

  it("programa el repaso espaciado en d+1, d+3, d+7 y d+14 dentro del horizonte", () => {
    const plan = generarPlan(rutaPrueba, base);
    const porDia = Object.fromEntries(
      plan.dias
        .filter((d) => d.repasoSlugs.length > 0)
        .map((d) => [d.numero, d.repasoSlugs]),
    );
    expect(porDia).toEqual({
      3: ["a"],
      4: ["b"],
      5: ["a"],
      6: ["b"],
      9: ["a"],
      10: ["b", "c"],
      12: ["c"],
    });
    expect(plan.dias[9]!.repaso).toEqual([
      "Repasa «Subtema B» (lo estudiaste el día 3).",
      "Repasa «Subtema C» (lo estudiaste el día 9).",
    ]);
  });

  it("usa IDs de bloque estables y suma minutosPorDia en cada día no ligero", () => {
    const plan = generarPlan(rutaPrueba, base);
    expect(plan.dias[0]!.bloques.map((b) => b.id)).toEqual([
      "prueba:estudio:a#1:recuperar",
      "prueba:estudio:a#1:teoria",
      "prueba:estudio:a#1:ejemplos",
      "prueba:estudio:a#1:practica",
      "prueba:estudio:a#1:descanso",
      "prueba:estudio:a#1:repaso",
      "prueba:estudio:a#1:cierre",
    ]);
    for (const dia of plan.dias) {
      const suma = dia.bloques.reduce((a, b) => a + b.minutos, 0);
      expect(suma).toBe(dia.tipo === "repaso" ? 60 : 120);
    }
    const ids = plan.dias.flatMap((d) => d.bloques.map((b) => b.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("conserva los IDs al cambiar la fecha de inicio", () => {
    const antes = generarPlan(rutaPrueba, base);
    const despues = generarPlan(rutaPrueba, {
      ...base,
      fechaInicio: "2026-05-20",
    });
    expect(despues.dias.map((d) => d.bloques.map((b) => b.id))).toEqual(
      antes.dias.map((d) => d.bloques.map((b) => b.id)),
    );
    expect(despues.dias[0]!.fecha).toBe("2026-05-20");
  });

  it("no comprime: lo que no cabe en 7 días va a fueraDelHorizonte", () => {
    const plan = generarPlan(rutaPrueba, { ...base, horizonteDias: 7 });
    expect(claves({ ...base, horizonteDias: 7 })).toEqual([
      "estudio:a#1",
      "estudio:a#2",
      "estudio:b#1",
      "evaluacion:t1",
      "correccion:t1",
      "repaso:rep-1",
      "repaso:rep-2",
    ]);
    expect(plan.fueraDelHorizonte).toEqual([
      {
        temaSlug: "t2",
        subtemaSlug: "c",
        nombre: "Subtema C",
        diasEstimados: 3,
      },
    ]);
  });

  it("inserta los días de refuerzo de un prerrequisito antes del tema que lo pide", () => {
    const config = { ...base, refuerzos: [{ temaSlug: "t1", dias: 2 }] };
    expect(claves(config)).toEqual([
      "estudio:a#1",
      "estudio:a#2",
      "estudio:b#1",
      "evaluacion:t1",
      "correccion:t1",
      "refuerzo:t1#1",
      "repaso:rep-1",
      "refuerzo:t1#2",
      "estudio:c#1",
      "estudio:c#2",
      "estudio:c#3",
      "evaluacion:t2",
      "correccion:t2",
      "repaso:rep-2",
    ]);
    expect(generarPlan(rutaPrueba, config).dias[5]!.objetivo).toBe(
      "Reforzar «Tema uno» antes de empezar «Tema dos» (día 1 de 2).",
    );
  });

  it("rechaza configuraciones inválidas con RangeError", () => {
    expect(erroresConfig(base)).toEqual([]);
    expect(() =>
      generarPlan(rutaPrueba, { ...base, horizonteDias: 6 }),
    ).toThrow(RangeError);
    expect(() =>
      generarPlan(rutaPrueba, { ...base, minutosPorDia: 123 }),
    ).toThrow(RangeError);
    expect(() =>
      generarPlan(rutaPrueba, { ...base, fechaInicio: "2026-02-30" }),
    ).toThrow(RangeError);
  });
});

describe("generarPlan — rutas reales", () => {
  it("genera 30 días válidos para cada ruta sin perder subtemas", () => {
    for (const ruta of rutas) {
      const plan = generarPlan(ruta, { ...base, horizonteDias: 30 }, rutas);
      expect(plan.dias).toHaveLength(30);
      const programados = new Set(
        plan.dias.flatMap((d) => (d.subtemaSlug ? [d.subtemaSlug] : [])),
      );
      const fuera = new Set(plan.fueraDelHorizonte.map((s) => s.subtemaSlug));
      for (const subtema of ruta.temas.flatMap((t) => t.subtemas)) {
        expect(
          programados.has(subtema.slug) !== fuera.has(subtema.slug),
          subtema.slug,
        ).toBe(true);
      }
    }
  });
});
