// Comprobación estructural (sin red y sin dependencias) del workflow de despliegue.
// No es un parser YAML completo: verifica indentación con espacios y que las
// líneas obligatorias existan, en este orden. Sale con código 1 si algo falta.
import { readFileSync } from "node:fs";

const RUTA = ".github/workflows/deploy.yml";
const OBLIGATORIAS_EN_ORDEN = [
  "name: Desplegar en GitHub Pages",
  "branches: [main]",
  "pages: write",
  "id-token: write",
  "- uses: actions/checkout@v7",
  "- uses: actions/setup-node@v7",
  "node-version-file: .nvmrc",
  "- run: npm ci",
  "- run: npm run format:check",
  "- run: npm run check",
  "- run: npm test",
  "- run: npm run build",
  "- uses: actions/configure-pages@v6",
  "- uses: actions/upload-pages-artifact@v5",
  "path: dist",
  "needs: build",
  "uses: actions/deploy-pages@v5",
];

const problemas = [];
let texto = "";
try {
  texto = readFileSync(RUTA, "utf8");
} catch {
  problemas.push(`no existe ${RUTA}`);
}

if (texto) {
  const lineas = texto.split("\n");
  lineas.forEach((linea, i) => {
    if (linea.includes("\t")) problemas.push(`línea ${i + 1}: usa tabulador`);
    const sangria = linea.length - linea.trimStart().length;
    if (linea.trim() !== "" && sangria % 2 !== 0) {
      problemas.push(`línea ${i + 1}: sangría impar`);
    }
  });
  const limpias = lineas.map((l) => l.trim());
  let desde = 0;
  for (const requerida of OBLIGATORIAS_EN_ORDEN) {
    const indice = limpias.indexOf(requerida, desde);
    if (indice === -1) {
      problemas.push(`falta (o está fuera de orden): ${requerida}`);
    } else {
      desde = indice + 1;
    }
  }
}

if (problemas.length > 0) {
  for (const problema of problemas) console.error(problema);
  process.exit(1);
}
console.log("verificar-workflow: OK");
