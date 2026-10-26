import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// GitHub Pages sirve el sitio en https://oswalec.github.io/mentorix-calc-reto-30/
// `base` es la única fuente del prefijo; scripts/verificar-dist.mjs lo comprueba.
export default defineConfig({
  site: "https://oswalec.github.io",
  base: "/mentorix-calc-reto-30",
  trailingSlash: "always",
  output: "static",
  integrations: [preact()],
});
