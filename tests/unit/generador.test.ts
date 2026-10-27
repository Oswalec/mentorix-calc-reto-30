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
import { configInicial } from "../../src/lib/plan/ajustes";
import {
  AUTOEVALUACION,
  erroresConfig,
  generarPlan,
  repartirExtras,
} from "../../src/lib/plan/generador";
import {
  minutosDelDia,
  repartirMinutos,
  repartoDelDia,
} from "../../src/lib/plan/minutos";
import type { ConfigPlan, TipoDia } from "../../src/lib/tipos";
import { rutaNivelacion, rutaPrueba } from "../fixtures/ruta-prueba";

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
      "Practica con exámenes de años anteriores sobre Tema uno: con tiempo limitado y sin consultar tus apuntes. Luego registra tu nota, tus errores y los temas a reforzar.",
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
    const config = { ...base, refuerzos: [{ temaSlug: "base-t1", dias: 2 }] };
    expect(claves(config)).toEqual([
      "estudio:a#1",
      "estudio:a#2",
      "estudio:b#1",
      "evaluacion:t1",
      "correccion:t1",
      "refuerzo:base-t1#1",
      "repaso:rep-1",
      "refuerzo:base-t1#2",
      "estudio:c#1",
      "estudio:c#2",
      "estudio:c#3",
      "evaluacion:t2",
      "correccion:t2",
      "repaso:rep-2",
    ]);
    const refuerzo = generarPlan(rutaPrueba, config).dias[5]!;
    expect(refuerzo.objetivo).toBe(
      "Reforzar «Tema uno» antes de empezar «Tema dos» (día 1 de 2).",
    );
    expect(refuerzo.bloques.find((b) => b.tipo === "teoria")!.enlaces).toEqual(
      rutaPrueba.temas[1]!.prerrequisitos[0]!.enlaces,
    );
  });

  it("enlaza las lecciones del subtema en Teoría y Práctica, nunca en evaluaciones", () => {
    const plan = generarPlan(rutaPrueba, base);
    const bloques = Object.fromEntries(
      plan.dias[0]!.bloques.map((b) => [b.tipo, b.enlaces]),
    );
    expect(bloques.teoria).toEqual(rutaPrueba.temas[0]!.subtemas[0]!.teoria);
    expect(bloques.practica).toEqual(
      rutaPrueba.temas[0]!.subtemas[0]!.practica,
    );
    expect(bloques.ejemplos).toBeUndefined();
    for (const dia of plan.dias.filter((d) => d.tipo !== "estudio")) {
      for (const bloque of dia.bloques) expect(bloque.enlaces).toBeUndefined();
    }
  });

  it("rechaza configuraciones inválidas con RangeError", () => {
    expect(erroresConfig(base)).toEqual([]);
    expect(() =>
      generarPlan(rutaPrueba, { ...base, horizonteDias: 2 }),
    ).toThrow(RangeError);
    expect(() =>
      generarPlan(rutaPrueba, { ...base, minutosPorDia: 123 }),
    ).toThrow(RangeError);
    expect(() =>
      generarPlan(rutaPrueba, { ...base, fechaInicio: "2026-02-30" }),
    ).toThrow(RangeError);
  });
});

describe("generarPlan — duración estirable", () => {
  it("con más días reserva simulacro y reparte el resto por dificultad (3, 2, 1)", () => {
    expect(Object.fromEntries(repartirExtras(rutaPrueba, 6))).toEqual({
      b: 2,
      c: 2,
      a: 2,
    });
    expect(claves({ ...base, horizonteDias: 21 })).toEqual([
      "estudio:a#1",
      "estudio:a#2",
      "estudio:a#3",
      "estudio:a#4",
      "estudio:b#1",
      "estudio:b#2",
      "repaso:rep-1",
      "estudio:b#3",
      "evaluacion:t1",
      "correccion:t1",
      "estudio:c#1",
      "estudio:c#2",
      "estudio:c#3",
      "repaso:rep-2",
      "estudio:c#4",
      "estudio:c#5",
      "evaluacion:t2",
      "correccion:t2",
      "simulacro:final",
      "correccion:final",
      "repaso:rep-3",
    ]);
    const plan = generarPlan(rutaPrueba, { ...base, horizonteDias: 21 });
    expect(plan.dias[0]!.objetivo).toBe(
      "Comprender y practicar «Subtema A» (día 1 de 4).",
    );
    expect(plan.dias[8]!.repasoSlugs).toEqual(["b"]);
  });

  it("una ruta sin evaluaciones no programa examen ni simulacro y cierra con autoevaluación", () => {
    const corta = { ...base, horizonteDias: 3, minutosPorDia: 180 };
    expect(
      generarPlan(rutaNivelacion, corta).dias.map((d) =>
        d.bloques[0]!.id.split(":").slice(1, 3).join(":"),
      ),
    ).toEqual(["estudio:d1#1", "estudio:d2#1", "estudio:d3#1"]);
    const plan = generarPlan(rutaNivelacion, corta);
    const ultimo = plan.dias[2]!;
    const opcional = ultimo.bloques.at(-1)!;
    expect(opcional).toMatchObject({
      id: "nivel:estudio:d3#1:opcional",
      tipo: "opcional",
      minutos: 0,
      opcional: true,
    });
    expect(plan.dias[0]!.bloques.some((b) => b.opcional)).toBe(false);
    expect(ultimo.cierre.at(-1)).toBe(AUTOEVALUACION);
    expect(ultimo.siguientePaso).toBe("Sigue con la ruta principal.");
    expect(
      generarPlan(rutaNivelacion, { ...corta, horizonteDias: 5 }).dias.map(
        (d) => d.bloques[0]!.id.split(":")[2],
      ),
    ).toEqual(["d1#1", "d2#1", "d2#2", "d3#1", "d3#2"]);
  });
});

describe("generarPlan — rutas reales", () => {
  it("Cálculo Diferencial e Integral caben completos en su base de 30 días", () => {
    for (const slug of ["calculo-diferencial", "calculo-integral"]) {
      const ruta = rutas.find((r) => r.slug === slug)!;
      const plan = generarPlan(ruta, configInicial("2026-03-01", ruta));
      expect(plan.dias, slug).toHaveLength(30);
      expect(plan.fueraDelHorizonte, slug).toEqual([]);
    }
  });

  it("Diferencial se estira a 40, 50 y 60 días con simulacro y más días de estudio", () => {
    const ruta = rutas.find((r) => r.slug === "calculo-diferencial")!;
    const conteo = (dias: number) => {
      const plan = generarPlan(ruta, {
        ...configInicial("2026-03-01", ruta),
        horizonteDias: dias,
      });
      const tipos = plan.dias.map((d) => d.tipo);
      return [
        tipos.filter((t) => t === "estudio").length,
        tipos.filter((t) => t === "simulacro").length,
        tipos.filter((t) => t === "repaso").length,
      ];
    };
    expect(conteo(30)).toEqual([20, 0, 4]);
    expect(conteo(40)).toEqual([27, 1, 5]);
    expect(conteo(50)).toEqual([35, 1, 7]);
    expect(conteo(60)).toEqual([44, 1, 8]);
  });

  it("genera su duración base válida para cada ruta sin perder subtemas", () => {
    for (const ruta of rutas) {
      const plan = generarPlan(ruta, configInicial("2026-03-01", ruta));
      expect(plan.dias).toHaveLength(ruta.horizonteBase);
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
