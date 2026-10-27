import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { Calendario } from "../../src/components/Calendario";
import { configInicial } from "../../src/lib/plan/ajustes";
import { activarRuta, marcarBloque } from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN } from "../../src/lib/progreso/estado";
import {
  actualizar,
  fechaHoy,
  planActivo,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-02";
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
});

const dias = () =>
  screen
    .getAllByRole("listitem")
    .filter((li) => li.classList.contains("calendario__dia"));

describe("Calendario", () => {
  it("muestra un día por cada día del horizonte con su tipo y estado", () => {
    for (const bloque of planActivo.value!.dias[0]!.bloques) {
      actualizar((e) =>
        marcarBloque(e, RUTA, bloque.id, true, "2026-03-01T10:00:00.000Z"),
      );
    }
    render(<Calendario />);
    const items = dias();
    expect(items).toHaveLength(30);
    expect(items[0]!.dataset.estado).toBe("Completado");
    expect(items[1]!.dataset.estado).toBe("Hoy");
    expect(items[2]!.dataset.estado).toBe("Próximo");
    expect(items[6]!.textContent).toContain("Repaso");
    expect(
      screen.getByRole("link", { name: /^Día 3 / }).getAttribute("href"),
    ).toBe("/dia/?n=3");
  });

  it("lista lo que no cabe en «Para después del horizonte»", () => {
    actualizar((e) =>
      activarRuta({ ...e, rutas: {} }, RUTA, {
        ...configInicial("2026-03-01"),
        horizonteDias: 21,
      }),
    );
    render(<Calendario />);
    expect(
      screen.getByRole("heading", { name: "Para después del horizonte" }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "M.II · Regla de la cadena, implícita y orden superior (1 día)",
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "M.VI · Extremos, criterios, concavidad y gráficas (2 días)",
      ),
    ).toBeTruthy();
  });

  it("extiende 14 días y guarda el nuevo horizonte", () => {
    render(<Calendario />);
    fireEvent.click(screen.getByRole("button", { name: "Extender 14 días" }));
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);
    expect(guardado.rutas[RUTA].config.horizonteDias).toBe(44);
    expect(dias()).toHaveLength(44);
  });

  it("no extiende más allá de 120 días y lo explica", () => {
    actualizar((e) =>
      activarRuta({ ...e, rutas: {} }, RUTA, {
        ...configInicial("2026-03-01"),
        horizonteDias: 115,
      }),
    );
    render(<Calendario />);
    fireEvent.click(screen.getByRole("button", { name: "Extender 7 días" }));
    expect(screen.getByRole("alert").textContent).toBe(
      "La duración debe estar entre 3 y 120 días.",
    );
    expect(dias()).toHaveLength(115);
  });
});
