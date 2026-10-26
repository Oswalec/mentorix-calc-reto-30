// Verifica la salida de `astro build` en dist/.
// 1. Debe existir dist/index.html.
// 2. Todo href/src interno (empieza con "/" pero no con "//") de cada
//    dist/**/*.html debe empezar con el prefijo de GitHub Pages.
// Sale con código 1 y lista los problemas si algo falla.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const PREFIJO = "/mentorix-calc-reto-30/";
const RAIZ = "dist";

function listarHtml(dir) {
  const salida = [];
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) {
      salida.push(...listarHtml(ruta));
    } else if (nombre.endsWith(".html")) {
      salida.push(ruta);
    }
  }
  return salida;
}

const problemas = [];

if (!existsSync(join(RAIZ, "index.html"))) {
  problemas.push("falta dist/index.html");
} else {
  const archivos = listarHtml(RAIZ);
  const patron = /\s(?:href|src)="([^"]*)"/g;
  for (const archivo of archivos) {
    const html = readFileSync(archivo, "utf8");
    for (const coincidencia of html.matchAll(patron)) {
      const valor = coincidencia[1];
      const interno = valor.startsWith("/") && !valor.startsWith("//");
      if (interno && !valor.startsWith(PREFIJO)) {
        problemas.push(
          `${relative(".", archivo)}: enlace sin prefijo "${valor}"`,
        );
      }
    }
  }
  console.log(`verificar-dist: ${archivos.length} archivo(s) HTML revisado(s)`);
}

if (problemas.length > 0) {
  for (const problema of problemas) console.error(problema);
  process.exit(1);
}
console.log("verificar-dist: OK");
