import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Ajustes } from "../../src/components/Ajustes";
import { GuiaDia } from "../../src/components/GuiaDia";
import { configInicial } from "../../src/lib/plan/ajustes";
import { activarRuta, marcarBloque } from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN, estadoInicial } from "../../src/lib/progreso/estado";
import { serializarRespaldo } from "../../src/lib/progreso/respaldo";
import {
  actualizar,
  estado,
  fechaHoy,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";
const BLOQUE = "calculo-diferencial:estudio:dominio-y-rango#1:teoria";

const guardado = () => JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-10";
  URL.createObjectURL = vi.fn(() => "blob:respaldo");
  URL.revokeObjectURL = vi.fn();
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
  actualizar((e) =>
    marcarBloque(e, RUTA, BLOQUE, true, "2026-03-01T10:00:00.000Z"),
  );
});

describe("Ajustes", () => {
  it("cambia la duración y conserva los bloques completados", () => {
    render(<Ajustes />);
    fireEvent.input(screen.getByLabelText("Duración del reto (días)"), {
      target: { value: "45" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(guardado().rutas[RUTA].config.horizonteDias).toBe(45);
    expect(Object.keys(guardado().rutas[RUTA].completados)).toEqual([BLOQUE]);
  });

  it("rechaza minutos que no son múltiplo de 5", () => {
    render(<Ajustes />);
    fireEvent.input(screen.getByLabelText("Minutos de estudio por día"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    expect(screen.getByRole("alert").textContent).toContain("múltiplo de 5");
    expect(guardado().rutas[RUTA].config.minutosPorDia).toBe(120);
  });

  it("guarda días de refuerzo de un prerrequisito", () => {
    render(<Ajustes />);
    fireEvent.input(screen.getByLabelText("Días de refuerzo de Límites"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar refuerzos" }));
    expect(guardado().rutas[RUTA].config.refuerzos).toEqual([
      { temaSlug: "limites", dias: 2 },
    ]);
  });

  it("exporta el respaldo y anota la fecha, lo que apaga el recordatorio", () => {
    render(<GuiaDia />);
    expect(
      screen.getByText(/Aún no guardas un respaldo de tu progreso/),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Exportar ahora" }));
    expect(estado.value.ultimoRespaldo).toBe("2026-03-10");
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText(/Aún no guardas un respaldo de tu progreso/),
    ).toBeNull();
  });

  it("importa un respaldo válido solo después de confirmar", async () => {
    render(<Ajustes />);
    const otro = activarRuta(
      estadoInicial(),
      "calculo-integral",
      configInicial("2026-04-01"),
    );
    const archivo = new File([serializarRespaldo(otro)], "respaldo.json", {
      type: "application/json",
    });
    const entrada = screen.getByLabelText("Archivo de respaldo (.json)");
    Object.defineProperty(entrada, "files", { value: [archivo] });
    fireEvent.change(entrada);
    expect(
      await screen.findByText(
        "Este respaldo contiene: 1 ruta · 0 bloques completados · 0 evaluaciones · 0 dificultades.",
      ),
    ).toBeTruthy();
    expect(estado.value.rutaActiva).toBe(RUTA);
    fireEvent.click(
      screen.getByRole("button", { name: "Reemplazar mi progreso" }),
    );
    expect(guardado().rutaActiva).toBe("calculo-integral");
  });

  it("rechaza un archivo inválido sin tocar el progreso", async () => {
    render(<Ajustes />);
    const entrada = screen.getByLabelText("Archivo de respaldo (.json)");
    Object.defineProperty(entrada, "files", {
      value: [new File(["no es json"], "malo.json")],
    });
    fireEvent.change(entrada);
    expect((await screen.findByRole("alert")).textContent).toBe(
      "El archivo no es un respaldo válido: no es JSON.",
    );
    expect(guardado().rutaActiva).toBe(RUTA);
  });

  it("reinicia todo solo tras confirmar", () => {
    render(<Ajustes />);
    fireEvent.click(screen.getByRole("button", { name: "Reiniciar todo" }));
    expect(guardado().rutaActiva).toBe(RUTA);
    fireEvent.click(
      screen.getByRole("button", { name: "Sí, borrar mi progreso" }),
    );
    expect(guardado()).toEqual(estadoInicial());
  });
});
