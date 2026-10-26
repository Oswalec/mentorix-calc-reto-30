import { describe, expect, it } from "vitest";
import tokens from "../../src/styles/tokens.css?raw";

const CLARO: Record<string, string> = {
  "--bg": "#f6f8f7",
  "--surface": "#ffffff",
  "--surface-2": "#eef3f1",
  "--text": "#0f1f1c",
  "--text-muted": "#5b6b67",
  "--primary": "#0f766e",
  "--primary-contrast": "#ffffff",
  "--accent": "#d97706",
  "--success": "#15803d",
  "--warning": "#b45309",
  "--danger": "#b91c1c",
  "--border": "#d6e0dd",
};

const OSCURO: Record<string, string> = {
  "--bg": "#0b1513",
  "--surface": "#12201d",
  "--surface-2": "#1a2c28",
  "--text": "#e7f0ee",
  "--text-muted": "#9db0ab",
  "--primary": "#2dd4bf",
  "--primary-contrast": "#04201c",
  "--accent": "#fbbf24",
  "--success": "#4ade80",
  "--warning": "#fbbf24",
  "--danger": "#f87171",
  "--border": "#24413b",
};

function luminancia(hex: string): number {
  const canales = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * canales[0]! + 0.7152 * canales[1]! + 0.0722 * canales[2]!;
}

function contraste(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1! + 0.05) / (l2! + 0.05);
}

function bloque(selector: string): string {
  const inicio = tokens.indexOf(selector);
  expect(inicio, selector).toBeGreaterThanOrEqual(0);
  return tokens.slice(inicio, tokens.indexOf("}", inicio));
}

describe("tokens de diseño", () => {
  it("declara cada token claro en :root", () => {
    const raiz = bloque(":root {");
    for (const [nombre, valor] of Object.entries(CLARO)) {
      expect(raiz).toContain(`${nombre}: ${valor};`);
    }
  });

  it("declara cada token oscuro para el sistema y para el conmutador", () => {
    for (const selector of [
      ':root:not([data-theme="light"]) {',
      ':root[data-theme="dark"] {',
    ]) {
      const oscuro = bloque(selector);
      for (const [nombre, valor] of Object.entries(OSCURO)) {
        expect(oscuro).toContain(`${nombre}: ${valor};`);
      }
    }
  });

  it("cumple contraste AA (4.5:1) en los pares de texto de ambos modos", () => {
    const pares: [string, string][] = [
      ["--text", "--bg"],
      ["--text", "--surface"],
      ["--text-muted", "--bg"],
      ["--text-muted", "--surface"],
      ["--primary-contrast", "--primary"],
      ["--primary", "--surface"],
      ["--danger", "--surface"],
      ["--warning", "--surface"],
      ["--success", "--surface"],
    ];
    for (const paleta of [CLARO, OSCURO]) {
      for (const [texto, fondo] of pares) {
        expect(
          contraste(paleta[texto]!, paleta[fondo]!),
          `${texto} sobre ${fondo}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
