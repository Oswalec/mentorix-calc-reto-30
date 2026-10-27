import { describe, expect, it } from "vitest";
import { configInicial } from "../../src/lib/plan/ajustes";
import { generarPlan } from "../../src/lib/plan/generador";
import { activarRuta } from "../../src/lib/progreso/acciones";
import {
  dificultadesAbiertas,
  estadoDelDia,
  posicionDelDia,
  progresoGlobal,
  repasosPendientes,
  resumenDominio,
  temasEstudiados,
} from "../../src/lib/progreso/derivados";
import { estadoInicial } from "../../src/lib/progreso/estado";
import { rutaNivelacion, rutaPrueba } from "../fixtures/ruta-prueba";

const config = { ...configInicial("2026-03-01"), horizonteDias: 14 };
const plan = generarPlan(rutaPrueba, config);

function completar(...numeros: number[]): Record<string, string> {
  const completados: Record<string, string> = {};
  for (const n of numeros) {
    for (const bloque of plan.dias[n - 1]!.bloques) {
      completados[bloque.id] = "2026-03-01T10:00:00.000Z";
    }
  }
  return completados;
}

describe("derivados del progreso", () => {
  it("clasifica un día como pendiente, parcial o completado", () => {
    const dia = plan.dias[0]!;
    expect(estadoDelDia(dia, {})).toBe("pendiente");
    expect(estadoDelDia(dia, { [dia.bloques[0]!.id]: "x" })).toBe("parcial");
    expect(estadoDelDia(dia, completar(1))).toBe("completado");
    expect(posicionDelDia(3, 5)).toBe("pasado");
    expect(posicionDelDia(5, 5)).toBe("hoy");
    expect(posicionDelDia(6, 5)).toBe("futuro");
  });

  it("calcula el avance como bloques completados / bloques del plan", () => {
    expect(progresoGlobal(plan, {})).toEqual({
      completados: 0,
      total: 80,
      porcentaje: 0,
    });
    expect(progresoGlobal(plan, completar(1))).toEqual({
      completados: 7,
      total: 80,
      porcentaje: 9,
    });
  });

  it("marca un tema como estudiado solo con todos sus días de estudio completos", () => {
    expect(temasEstudiados(rutaPrueba, plan, completar(1, 2))).toEqual([]);
    expect(temasEstudiados(rutaPrueba, plan, completar(1, 2, 3))).toEqual([
      "t1",
    ]);
  });

  it("lista los repasos programados hasta hoy cuyo bloque Repaso no se marcó", () => {
    expect(repasosPendientes(plan, {}, 5)).toEqual([
      { subtemaSlug: "a", diaNumero: 3 },
      { subtemaSlug: "b", diaNumero: 4 },
      { subtemaSlug: "a", diaNumero: 5 },
    ]);
    expect(repasosPendientes(plan, completar(3), 5)).toEqual([
      { subtemaSlug: "b", diaNumero: 4 },
      { subtemaSlug: "a", diaNumero: 5 },
    ]);
  });

  it("resume el dominio declarado sin mirar los completados", () => {
    const progreso = activarRuta(estadoInicial(), "prueba", config).rutas
      .prueba!;
    const conDominio = {
      ...progreso,
      completados: completar(1, 2, 3),
      dominio: {
        a: {
          nivel: "dominado" as const,
          evidencia: "18/20",
          fecha: "2026-03-04",
        },
      },
      dificultades: [
        {
          id: "d1",
          fecha: "2026-03-02",
          subtemaSlug: "a",
          texto: "Confundo los signos",
          resuelta: false,
        },
        {
          id: "d2",
          fecha: "2026-03-02",
          subtemaSlug: null,
          texto: "Me faltó tiempo",
          resuelta: true,
        },
      ],
    };
    expect(resumenDominio(rutaPrueba, conDominio)).toEqual({
      "sin-evaluar": 2,
      "en-progreso": 0,
      inseguro: 0,
      dominado: 1,
    });
    expect(resumenDominio(rutaPrueba, { ...conDominio, dominio: {} })).toEqual({
      "sin-evaluar": 3,
      "en-progreso": 0,
      inseguro: 0,
      dominado: 0,
    });
    expect(dificultadesAbiertas(conDominio).map((d) => d.id)).toEqual(["d1"]);
  });

  it("el bloque opcional no cuenta para el estado del día ni para el avance", () => {
    const nivel = generarPlan(rutaNivelacion, {
      ...configInicial("2026-03-01"),
      horizonteDias: 3,
      minutosPorDia: 180,
    });
    const dia = nivel.dias[2]!;
    const hechos = Object.fromEntries(
      dia.bloques.filter((b) => !b.opcional).map((b) => [b.id, "x"]),
    );
    expect(estadoDelDia(dia, hechos)).toBe("completado");
    const soloOpcional = { "nivel:estudio:d3#1:opcional": "x" };
    expect(estadoDelDia(dia, soloOpcional)).toBe("pendiente");
    expect(progresoGlobal(nivel, soloOpcional)).toEqual({
      completados: 0,
      total: 21,
      porcentaje: 0,
    });
  });
});
