/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// getViteConfig aplica astro.config.mjs (integración Preact) a Vitest.
export default getViteConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    exclude: ["blueprints/**", "node_modules/**", "dist/**"],
    setupFiles: ["tests/setup.ts"],
    // Sin esto Vitest entrega CSS vacío y `tokens.css?raw` llega como "".
    css: { include: [/src\/styles\//] },
  },
});
