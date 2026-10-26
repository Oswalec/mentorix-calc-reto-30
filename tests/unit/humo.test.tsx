import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";

describe("entorno de pruebas", () => {
  it("corre en happy-dom con localStorage disponible", () => {
    expect(typeof document).toBe("object");
    window.localStorage.setItem("humo", "ok");
    expect(window.localStorage.getItem("humo")).toBe("ok");
  });

  it("renderiza JSX de Preact", () => {
    render(<p>Hola, Mentorix</p>);
    expect(screen.getByText("Hola, Mentorix")).toBeTruthy();
  });
});
