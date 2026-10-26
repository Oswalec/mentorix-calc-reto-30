import type { Ruta } from "../../src/lib/tipos";

// Ruta de prueba del ejemplo trabajado (blueprint §4).
export const rutaPrueba: Ruta = {
  slug: "prueba",
  nombre: "Ruta de prueba",
  descripcion: "Ruta mínima para pruebas.",
  temas: [
    {
      slug: "t1",
      nombre: "Tema uno",
      prerrequisitos: [],
      subtemas: [
        { slug: "a", nombre: "Subtema A", diasEstimados: 2, dificultad: 1 },
        { slug: "b", nombre: "Subtema B", diasEstimados: 1, dificultad: 3 },
      ],
    },
    {
      slug: "t2",
      nombre: "Tema dos",
      prerrequisitos: ["t1"],
      subtemas: [
        { slug: "c", nombre: "Subtema C", diasEstimados: 3, dificultad: 2 },
      ],
    },
  ],
};
