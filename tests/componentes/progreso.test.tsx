import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { Progreso } from "../../src/components/Progreso";
import { configInicial } from "../../src/lib/plan/ajustes";
import {
  activarRuta,
  marcarBloque,
  registrarEvaluacion,
} from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN, type Estado } from "../../src/lib/progreso/estado";
import {
  actualizar,
  fechaHoy,
  planActivo,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";
// Días de estudio de «Funciones» con 30 días y día ligero cada 7.
const DIAS_FUNCIONES = [1, 2, 3, 4, 5, 6];

function completarDias(...numeros: number[]) {
  for (const n of numeros) {
    for (const bloque of planActivo.value!.dias[n - 1]!.bloques) {
      actualizar((e) =>
        marcarBloque(e, RUTA, bloque.id, true, "2026-03-01T10:00:00.000Z"),
      );
    }
  }
}

const guardado = () => JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-03";
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
});

describe("Progreso", () => {
  it("separa el avance de actividades del dominio declarado", () => {
    completarDias(1);
    render(<Progreso />);
    expect(
      screen.getByRole("heading", { name: "Avance de actividades" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Dominio declarado" }),
    ).toBeTruthy();
    expect(screen.getByText(/^7 de \d+ bloques completados/)).toBeTruthy();
    expect(
      (
        screen.getByLabelText(
          "Nivel de M.I · Dominio, rango, gráfica y tipos de funciones",
        ) as HTMLSelectElement
      ).value,
    ).toBe("sin-evaluar");
  });

  it("lista temas estudiados y repasos pendientes hasta hoy", () => {
    completarDias(...DIAS_FUNCIONES);
    render(<Progreso />);
    const estudiados = screen
      .getByRole("heading", { name: "Temas estudiados" })
      .closest("section")!;
    expect(estudiados.textContent).toContain("Funciones");
    expect(screen.getByText("No tienes repasos pendientes.")).toBeTruthy();
  });

  it("muestra como pendiente el repaso de un día pasado sin marcar", () => {
    render(<Progreso />);
    expect(
      screen.getByText(
        "M.I · Dominio, rango, gráfica y tipos de funciones (programado el día 3)",
      ),
    ).toBeTruthy();
  });

  it("exige evidencia para declarar «Dominado» y la guarda cuando existe", () => {
    render(<Progreso />);
    const nombre = "M.I · Dominio, rango, gráfica y tipos de funciones";
    fireEvent.change(screen.getByLabelText(`Nivel de ${nombre}`), {
      target: { value: "dominado" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: `Guardar dominio de ${nombre}` }),
    );
    expect(screen.getByRole("alert").textContent).toContain("evidencia");
    expect(guardado().rutas[RUTA].dominio).toEqual({});
    fireEvent.input(screen.getByLabelText(`Evidencia de ${nombre}`), {
      target: { value: "18/20 en el examen del día 10" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: `Guardar dominio de ${nombre}` }),
    );
    expect(guardado().rutas[RUTA].dominio["fun-dominio-rango-grafica"]).toEqual(
      {
        nivel: "dominado",
        evidencia: "18/20 en el examen del día 10",
        fecha: "2026-03-03",
      },
    );
  });

  it("muestra los resultados de exámenes registrados", () => {
    actualizar(
      (e) =>
        registrarEvaluacion(e, RUTA, {
          id: "e1",
          diaNumero: 10,
          temaSlug: "funciones",
          fecha: "2026-03-10",
          nota: 15,
          notaMaxima: 20,
          errores: "Dominio de raíces",
          temasAReforzar: ["funciones"],
        }) as Estado,
    );
    render(<Progreso />);
    expect(screen.getByText("Día 10 · Funciones · 15/20")).toBeTruthy();
  });
});
