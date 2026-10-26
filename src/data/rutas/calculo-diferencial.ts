import type { Ruta } from "../../lib/tipos";

export const calculoDiferencial: Ruta = {
  slug: "calculo-diferencial",
  nombre: "Cálculo Diferencial",
  descripcion:
    "Funciones, límites, continuidad, derivadas y sus aplicaciones, en el orden de un primer curso universitario.",
  temas: [
    {
      slug: "funciones",
      nombre: "Funciones",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "dominio-y-rango",
          nombre: "Dominio y rango de funciones reales",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "graficas-funciones-elementales",
          nombre: "Gráficas de funciones elementales y transformaciones",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "operaciones-y-composicion",
          nombre: "Operaciones y composición de funciones",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "funciones-inversas",
          nombre: "Funciones inyectivas e inversas",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "exponenciales-y-logaritmicas",
          nombre: "Funciones exponenciales y logarítmicas",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "funciones-trigonometricas",
          nombre: "Funciones trigonométricas y sus inversas",
          diasEstimados: 2,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "limites",
      nombre: "Límites",
      prerrequisitos: ["funciones"],
      subtemas: [
        {
          slug: "nocion-de-limite",
          nombre: "Noción intuitiva de límite y límites laterales",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "limites-algebraicos",
          nombre: "Cálculo algebraico de límites e indeterminaciones",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "limites-trigonometricos",
          nombre: "Límites trigonométricos notables",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "limites-al-infinito",
          nombre: "Límites infinitos, límites al infinito y asíntotas",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "definicion-epsilon-delta",
          nombre: "Definición formal de límite (épsilon-delta)",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "continuidad",
      nombre: "Continuidad",
      prerrequisitos: ["limites"],
      subtemas: [
        {
          slug: "continuidad-en-un-punto",
          nombre: "Continuidad en un punto y en un intervalo",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "tipos-de-discontinuidad",
          nombre: "Tipos de discontinuidad",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "teorema-valor-intermedio",
          nombre: "Teorema del valor intermedio",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "derivadas",
      nombre: "Derivadas",
      prerrequisitos: ["limites", "continuidad"],
      subtemas: [
        {
          slug: "definicion-de-derivada",
          nombre: "Definición de derivada y recta tangente",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "reglas-de-derivacion",
          nombre: "Reglas de derivación",
          diasEstimados: 2,
          dificultad: 1,
        },
        {
          slug: "regla-de-la-cadena",
          nombre: "Regla de la cadena",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "derivadas-trascendentes",
          nombre:
            "Derivadas de funciones exponenciales, logarítmicas y trigonométricas",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "derivacion-implicita",
          nombre: "Derivación implícita y logarítmica",
          diasEstimados: 1,
          dificultad: 3,
        },
        {
          slug: "derivadas-orden-superior",
          nombre: "Derivadas de orden superior",
          diasEstimados: 1,
          dificultad: 1,
        },
      ],
    },
    {
      slug: "aplicaciones-derivada",
      nombre: "Aplicaciones de la derivada",
      prerrequisitos: ["derivadas"],
      subtemas: [
        {
          slug: "razones-relacionadas",
          nombre: "Razones de cambio relacionadas",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "maximos-y-minimos",
          nombre: "Máximos y mínimos absolutos",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "teorema-valor-medio",
          nombre: "Teoremas de Rolle y del valor medio",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "criterios-primera-segunda",
          nombre:
            "Monotonía, concavidad y criterios de la primera y segunda derivada",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "trazado-de-curvas",
          nombre: "Trazado de curvas",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "optimizacion",
          nombre: "Problemas de optimización",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "regla-de-lhopital",
          nombre: "Regla de L'Hôpital",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
  ],
};
