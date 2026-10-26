import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { buscarRuta } from "../../src/data/rutas";
import { DiarioDificultades } from "../../src/components/DiarioDificultades";
import { GuiaDia } from "../../src/components/GuiaDia";
import { configInicial } from "../../src/lib/plan/ajustes";
import {
  activarRuta,
  registrarDificultad,
} from "../../src/lib/progreso/acciones";
import { CLAVE_ALMACEN, type Estado } from "../../src/lib/progreso/estado";
import {
  actualizar,
  fechaHoy,
  recargarEstado,
} from "../../src/lib/progreso/store";

const RUTA = "calculo-diferencial";
// Con 30 días y día ligero cada 7, el examen de «Funciones» cae el día 10.
const DIA_EVALUACION = 10;

beforeEach(() => {
  window.localStorage.clear();
  recargarEstado();
  fechaHoy.value = "2026-03-10";
  actualizar((e) => activarRuta(e, RUTA, configInicial("2026-03-01")));
});

const guardado = () => JSON.parse(window.localStorage.getItem(CLAVE_ALMACEN)!);

describe("Evaluaciones externas", () => {
  it("solo aparece el formulario en días de evaluación o simulacro", () => {
    const { unmount } = render(<GuiaDia numero={1} />);
    expect(
      screen.queryByRole("heading", { name: "Resultado de tu examen" }),
    ).toBeNull();
    unmount();
    render(<GuiaDia numero={DIA_EVALUACION} />);
    expect(
      screen.getByRole("heading", { name: "Resultado de tu examen" }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        "Realiza un examen de años anteriores sobre Funciones, con tiempo limitado y sin consultar tus apuntes. Registra tu nota y tus errores.",
      ),
    ).toBeTruthy();
  });

  it("guarda nota, nota máxima, errores y temas a reforzar", () => {
    render(<GuiaDia numero={DIA_EVALUACION} />);
    fireEvent.input(screen.getByLabelText("Nota obtenida"), {
      target: { value: "15" },
    });
    fireEvent.input(screen.getByLabelText("Nota máxima (opcional)"), {
      target: { value: "20" },
    });
    fireEvent.input(screen.getByLabelText("Errores identificados"), {
      target: { value: "Olvidé restringir el dominio" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Funciones" }));
    fireEvent.click(screen.getByRole("button", { name: "Guardar resultado" }));
    const [evaluacion] = guardado().rutas[RUTA].evaluaciones;
    expect(evaluacion).toMatchObject({
      diaNumero: 10,
      temaSlug: "funciones",
      fecha: "2026-03-10",
      nota: 15,
      notaMaxima: 20,
      errores: "Olvidé restringir el dominio",
      temasAReforzar: ["funciones"],
    });
    expect(screen.getByText("Resultado guardado.")).toBeTruthy();
  });

  it("rechaza una nota mayor que la nota máxima sin guardar nada", () => {
    render(<GuiaDia numero={DIA_EVALUACION} />);
    fireEvent.input(screen.getByLabelText("Nota obtenida"), {
      target: { value: "25" },
    });
    fireEvent.input(screen.getByLabelText("Nota máxima (opcional)"), {
      target: { value: "20" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar resultado" }));
    expect(screen.getByRole("alert").textContent).toBe(
      "La nota no puede ser mayor que la nota máxima.",
    );
    expect(guardado().rutas[RUTA].evaluaciones).toEqual([]);
  });
});

describe("Diario de dificultades", () => {
  const ruta = buscarRuta(RUTA)!;

  it("muestra un estado vacío cuando no hay dificultades", () => {
    render(<DiarioDificultades ruta={ruta} />);
    expect(
      screen.getByText(
        "Aún no registras dificultades. Puedes hacerlo desde el cierre de cada día.",
      ),
    ).toBeTruthy();
  });

  it("lista las abiertas primero y permite marcarlas como resueltas", () => {
    for (const [id, texto, resuelta] of [
      ["d1", "Me confundo con la composición", true],
      ["d2", "No sé cuándo usar valor absoluto", false],
    ] as const) {
      actualizar(
        (e) =>
          registrarDificultad(e, RUTA, {
            id,
            fecha: "2026-03-02",
            subtemaSlug: "operaciones-y-composicion",
            texto,
            resuelta,
          }) as Estado,
      );
    }
    render(<DiarioDificultades ruta={ruta} />);
    const casillas = screen.getAllByRole("checkbox");
    expect(casillas[0]!.getAttribute("aria-label")).toBe(
      "Resuelta: No sé cuándo usar valor absoluto",
    );
    fireEvent.click(casillas[0]!);
    expect(
      guardado().rutas[RUTA].dificultades.map(
        (d: { id: string; resuelta: boolean }) => [d.id, d.resuelta],
      ),
    ).toEqual([
      ["d1", true],
      ["d2", true],
    ]);
  });
});
