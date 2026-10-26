import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Inicio } from "../../src/components/Inicio";
import { LimiteErrores } from "../../src/components/LimiteErrores";
import { CLAVE_ALMACEN } from "../../src/lib/progreso/estado";
import {
  datosDanados,
  estado,
  fechaHoy,
  recargarEstado,
} from "../../src/lib/progreso/store";

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-01";
});

describe("Inicio", () => {
  it("sin ruta activa muestra las cuatro rutas y la configuración inicial", () => {
    render(<Inicio />);
    for (const nombre of [
      "Cálculo Diferencial",
      "Cálculo Integral",
      "Cálculo Multivariable",
      "Ecuaciones Diferenciales",
    ]) {
      expect(
        screen.getByRole("radio", { name: new RegExp(nombre) }),
      ).toBeTruthy();
    }
    expect(
      (screen.getByLabelText("Fecha de inicio") as HTMLInputElement).value,
    ).toBe("2026-03-01");
    expect(
      (screen.getByLabelText("Duración del reto (días)") as HTMLInputElement)
        .value,
    ).toBe("30");
    expect(
      (screen.getByLabelText("Minutos de estudio por día") as HTMLInputElement)
        .value,
    ).toBe("120");
  });

  it("al empezar guarda la ruta en localStorage y muestra el resumen", () => {
    render(<Inicio />);
    fireEvent.click(screen.getByRole("radio", { name: /Cálculo Integral/ }));
    fireEvent.click(screen.getByRole("button", { name: "Empezar mi reto" }));
    expect(estado.value.rutaActiva).toBe("calculo-integral");
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);
    expect(guardado.rutas["calculo-integral"].config).toEqual({
      fechaInicio: "2026-03-01",
      horizonteDias: 30,
      minutosPorDia: 120,
      diaLigeroCada: 7,
      refuerzos: [],
    });
    expect(screen.getByText("Día 1 de 30")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ir a Hoy" })).toBeTruthy();
  });

  it("no empieza con una duración fuera de 7..120 y explica por qué", () => {
    render(<Inicio />);
    fireEvent.input(screen.getByLabelText("Duración del reto (días)"), {
      target: { value: "200" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Empezar mi reto" }));
    expect(estado.value.rutaActiva).toBeNull();
    expect(screen.getByRole("alert").textContent).toContain("entre 7 y 120");
  });

  it("con datos dañados ofrece descargarlos y empezar de nuevo sin borrarlos", () => {
    window.localStorage.setItem(CLAVE_ALMACEN, "{roto");
    recargarEstado();
    render(<Inicio />);
    expect(datosDanados.value).toBe("{roto");
    expect(
      screen.getByRole("button", { name: "Descargar datos dañados" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Empezar de nuevo" }));
    expect(datosDanados.value).toBeNull();
    expect(window.localStorage.getItem("mentorix-reto:v1:danado")).toBe(
      "{roto",
    );
  });
});

describe("LimiteErrores", () => {
  it("muestra un mensaje amable y el botón Exportar respaldo si una isla falla", () => {
    const consola = vi.spyOn(console, "error").mockImplementation(() => {});
    function Rota(): never {
      throw new Error("fallo de prueba");
    }
    render(
      <LimiteErrores origen="prueba">
        <Rota />
      </LimiteErrores>,
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "Algo salió mal en esta sección",
    );
    expect(
      screen.getByRole("button", { name: "Exportar respaldo" }),
    ).toBeTruthy();
    expect(
      consola.mock.calls.some((args) =>
        String(args[0]).includes('"origen":"prueba"'),
      ),
    ).toBe(true);
    consola.mockRestore();
  });
});
