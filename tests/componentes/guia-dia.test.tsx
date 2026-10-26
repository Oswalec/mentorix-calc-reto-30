import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { GuiaDia } from "../../src/components/GuiaDia";
import { configInicial } from "../../src/lib/plan/ajustes";
import { activarRuta } from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN } from "../../src/lib/progreso/estado";
import {
  actualizar,
  estado,
  fechaHoy,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-01";
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
});

const guardado = () => JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);

describe("GuiaDia", () => {
  it("muestra los siete apartados del día de hoy", () => {
    render(<GuiaDia />);
    for (const titulo of [
      "Objetivo del día",
      "Qué estudiar",
      "Qué hacer",
      "Repaso",
      "Tiempo sugerido por bloque",
      "Cierre de sesión",
      "Siguiente paso",
    ]) {
      expect(screen.getByRole("heading", { name: titulo })).toBeTruthy();
    }
    expect(
      screen.getByText(
        "Comprender y practicar «Dominio y rango de funciones reales».",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Hoy no hay repasos programados.")).toBeTruthy();
    expect(screen.getAllByRole("checkbox")).toHaveLength(7);
  });

  it("marcar un bloque lo guarda con su ID estable y actualiza el contador", () => {
    render(<GuiaDia />);
    fireEvent.click(screen.getByRole("checkbox", { name: "Teoría · 30 min" }));
    expect(Object.keys(guardado().rutas[RUTA].completados)).toEqual([
      "calculo-diferencial:estudio:dominio-y-rango#1:teoria",
    ]);
    expect(screen.getByText("1 de 7 bloques completados")).toBeTruthy();
    expect(guardado().rutas[RUTA].dominio).toEqual({});
  });

  it("registra una dificultad y rechaza una vacía", () => {
    render(<GuiaDia />);
    fireEvent.click(
      screen.getByRole("button", { name: "Registrar dificultad" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Guardar dificultad" }));
    expect(estado.value.rutas[RUTA]!.dificultades).toHaveLength(0);
    expect(
      screen.getByText("Describe la dificultad o el error antes de guardarlo."),
    ).toBeTruthy();
    fireEvent.input(
      screen.getByLabelText("Describe la dificultad o el error"),
      {
        target: { value: "No entiendo el dominio de raíces" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "Guardar dificultad" }));
    const dificultades = guardado().rutas[RUTA].dificultades;
    expect(dificultades).toHaveLength(1);
    expect(dificultades[0].subtemaSlug).toBe("dominio-y-rango");
    expect(dificultades[0].resuelta).toBe(false);
  });

  it("guarda la reflexión del día", () => {
    render(<GuiaDia />);
    fireEvent.input(screen.getByLabelText("Reflexión del día"), {
      target: { value: "Hoy entendí el dominio" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar reflexión" }));
    expect(guardado().rutas[RUTA].reflexiones).toEqual({
      "1": "Hoy entendí el dominio",
    });
  });

  it("muestra cualquier día por número y avisa si no existe", () => {
    const { unmount } = render(<GuiaDia numero={2} />);
    expect(
      screen.getByText(
        "Comprender y practicar «Gráficas de funciones elementales y transformaciones» (día 1 de 2).",
      ),
    ).toBeTruthy();
    unmount();
    render(<GuiaDia numero={99} />);
    expect(
      screen.getByRole("heading", { name: "Ese día no existe en tu plan" }),
    ).toBeTruthy();
  });
});
