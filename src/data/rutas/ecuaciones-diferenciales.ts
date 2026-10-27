import type { Ruta } from "../../lib/tipos";

export const ecuacionesDiferenciales: Ruta = {
  slug: "ecuaciones-diferenciales",
  nombre: "Ecuaciones Diferenciales",
  descripcion:
    "EDO de primer orden y sus aplicaciones, EDO lineales de orden superior, transformada de Laplace y sistemas.",
  horizonteBase: 30,
  minutosBase: 120,
  temas: [
    {
      slug: "edo-primer-orden",
      nombre: "EDO de primer orden",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "conceptos-basicos-edo",
          nombre:
            "Conceptos básicos: orden, solución y problema de valor inicial",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "variables-separables",
          nombre: "Ecuaciones de variables separables",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "edo-homogeneas",
          nombre: "Ecuaciones homogéneas",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "edo-exactas",
          nombre: "Ecuaciones exactas y factor integrante",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "edo-lineales-primer-orden",
          nombre: "Ecuaciones lineales de primer orden",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "bernoulli",
          nombre: "Ecuación de Bernoulli",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "aplicaciones-primer-orden",
      nombre: "Aplicaciones de primer orden",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "crecimiento-decaimiento",
          nombre: "Crecimiento y decaimiento exponencial",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "ley-enfriamiento",
          nombre: "Ley de enfriamiento de Newton",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "mezclas",
          nombre: "Problemas de mezclas",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "circuitos-rl-rc",
          nombre: "Circuitos RL y RC",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "edo-orden-superior",
      nombre: "EDO lineales de orden superior",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "homogeneas-coeficientes-constantes",
          nombre: "Ecuaciones homogéneas con coeficientes constantes",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "coeficientes-indeterminados",
          nombre: "Método de coeficientes indeterminados",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "variacion-de-parametros",
          nombre: "Variación de parámetros",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "cauchy-euler",
          nombre: "Ecuación de Cauchy-Euler",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "aplicaciones-orden-superior",
          nombre: "Aplicaciones: sistemas masa-resorte",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "transformada-laplace",
      nombre: "Transformada de Laplace",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "definicion-laplace",
          nombre: "Definición y propiedades de la transformada de Laplace",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "transformada-inversa",
          nombre: "Transformada inversa de Laplace",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "teoremas-traslacion",
          nombre: "Teoremas de traslación y función escalón unitario",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "laplace-valor-inicial",
          nombre: "Solución de problemas de valor inicial con Laplace",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "sistemas-edo",
      nombre: "Sistemas de EDO",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "sistemas-eliminacion",
          nombre: "Sistemas lineales por el método de eliminación",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "sistemas-valores-propios",
          nombre: "Método de valores y vectores propios",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "sistemas-laplace",
          nombre: "Sistemas resueltos con transformada de Laplace",
          diasEstimados: 1,
          dificultad: 3,
        },
      ],
    },
  ],
};
