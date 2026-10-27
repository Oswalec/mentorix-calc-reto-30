import type { Ruta } from "../../src/lib/tipos";

const ENLACE = (titulo: string) => ({
  titulo,
  url: `https://www.skool.com/mentorix-8847/classroom/d853019a?md=${titulo.length}`,
});

// Ruta de prueba del ejemplo trabajado (blueprint §4).
export const rutaPrueba: Ruta = {
  slug: "prueba",
  nombre: "Ruta de prueba",
  descripcion: "Ruta mínima para pruebas.",
  horizonteBase: 14,
  minutosBase: 120,
  temas: [
    {
      slug: "t1",
      nombre: "Tema uno",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "a",
          nombre: "Subtema A",
          diasEstimados: 2,
          dificultad: 1,
          teoria: [ENLACE("Teoría A")],
          practica: [ENLACE("Ejercicio A")],
        },
        { slug: "b", nombre: "Subtema B", diasEstimados: 1, dificultad: 3 },
      ],
    },
    {
      slug: "t2",
      nombre: "Tema dos",
      prerrequisitos: [
        { slug: "base-t1", nombre: "Tema uno", enlaces: [ENLACE("Base")] },
      ],
      subtemas: [
        { slug: "c", nombre: "Subtema C", diasEstimados: 3, dificultad: 2 },
      ],
    },
  ],
};

// Ruta de nivelación: sin evaluaciones y con módulos opcionales al final.
export const rutaNivelacion: Ruta = {
  slug: "nivel",
  nombre: "Nivelación de prueba",
  descripcion: "Ruta corta sin evaluaciones.",
  horizonteBase: 3,
  minutosBase: 180,
  mensajeFinal: "Sigue con la ruta principal.",
  temas: [
    {
      slug: "n1",
      nombre: "Nivelación",
      sinEvaluacion: true,
      prerrequisitos: [],
      subtemas: [
        { slug: "d1", nombre: "Día uno", diasEstimados: 1, dificultad: 1 },
        { slug: "d2", nombre: "Día dos", diasEstimados: 1, dificultad: 2 },
        {
          slug: "d3",
          nombre: "Día tres",
          diasEstimados: 1,
          dificultad: 2,
          opcionales: [ENLACE("Opcional")],
        },
      ],
    },
  ],
};
