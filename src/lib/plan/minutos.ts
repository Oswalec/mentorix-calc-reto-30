// Reparto de minutos por bloque. Regla única:
//   m = floor(total * peso / 500) * 5   (múltiplo de 5 hacia abajo)
//   m = max(m, 5)                        (ningún bloque queda en 0)
//   el residuo (total - suma) se suma al bloque `residuo`.
// La suma siempre es exactamente `total`.
import type { Dificultad, TipoBloque, TipoDia } from "../tipos";

export type Pesos = ReadonlyArray<readonly [TipoBloque, number]>;

interface Reparto {
  pesos: Pesos;
  residuo: TipoBloque;
}

const ESTUDIO: Pesos = [
  ["recuperar", 10],
  ["teoria", 25],
  ["ejemplos", 15],
  ["practica", 30],
  ["descanso", 5],
  ["repaso", 10],
  ["cierre", 5],
];

/** Dificultad 3: 5 puntos pasan de Recuperar a Práctica. */
const ESTUDIO_DIFICIL: Pesos = [
  ["recuperar", 5],
  ["teoria", 25],
  ["ejemplos", 15],
  ["practica", 35],
  ["descanso", 5],
  ["repaso", 10],
  ["cierre", 5],
];

const EVALUACION: Pesos = [
  ["recuperar", 10],
  ["evaluacion", 65],
  ["descanso", 5],
  ["repaso", 10],
  ["cierre", 10],
];

const CORRECCION: Pesos = [
  ["recuperar", 10],
  ["practica", 50],
  ["descanso", 5],
  ["repaso", 25],
  ["cierre", 10],
];

const LIGERO: Pesos = [
  ["recuperar", 30],
  ["repaso", 50],
  ["descanso", 10],
  ["cierre", 10],
];

export function repartoDelDia(
  tipo: TipoDia,
  dificultad: Dificultad = 2,
): Reparto {
  switch (tipo) {
    case "estudio":
      return {
        pesos: dificultad === 3 ? ESTUDIO_DIFICIL : ESTUDIO,
        residuo: "practica",
      };
    case "refuerzo":
      return { pesos: ESTUDIO, residuo: "practica" };
    case "evaluacion":
    case "simulacro":
      return { pesos: EVALUACION, residuo: "evaluacion" };
    case "correccion":
      return { pesos: CORRECCION, residuo: "practica" };
    case "repaso":
      return { pesos: LIGERO, residuo: "repaso" };
  }
}

/** Minutos totales del día: los días de repaso son ligeros (la mitad, múltiplo de 5). */
export function minutosDelDia(tipo: TipoDia, minutosPorDia: number): number {
  return tipo === "repaso" ? Math.floor(minutosPorDia / 10) * 5 : minutosPorDia;
}

export function repartirMinutos(
  total: number,
  pesos: Pesos,
  residuo: TipoBloque,
): Array<[TipoBloque, number]> {
  const reparto = pesos.map(([tipo, peso]): [TipoBloque, number] => [
    tipo,
    Math.max(Math.floor((total * peso) / 500) * 5, 5),
  ]);
  const suma = reparto.reduce(
    (acumulado, [, minutos]) => acumulado + minutos,
    0,
  );
  const destino = reparto.find(([tipo]) => tipo === residuo);
  if (!destino)
    throw new Error(`El bloque residuo ${residuo} no está en los pesos`);
  destino[1] += total - suma;
  return reparto;
}
