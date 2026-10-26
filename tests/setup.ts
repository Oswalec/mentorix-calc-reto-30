import { cleanup } from "@testing-library/preact";
import { afterEach } from "vitest";

// Vitest corre sin `globals`, así que Testing Library no limpia sola:
// se desmonta todo y se vacía localStorage después de cada prueba.
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
