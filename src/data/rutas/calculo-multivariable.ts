import type { Ruta } from "../../lib/tipos";

export const calculoMultivariable: Ruta = {
  slug: "calculo-multivariable",
  nombre: "Cálculo Multivariable",
  descripcion:
    "Funciones de varias variables, derivadas parciales, extremos con Lagrange e integrales dobles y triples.",
  temas: [
    {
      slug: "funciones-varias-variables",
      nombre: "Funciones de varias variables",
      prerrequisitos: ["funciones"],
      subtemas: [
        {
          slug: "dominio-varias-variables",
          nombre: "Dominio y rango de funciones de varias variables",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "curvas-de-nivel",
          nombre: "Curvas y superficies de nivel",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "superficies-cuadricas",
          nombre: "Superficies cuádricas",
          diasEstimados: 2,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "limites-continuidad-varias",
      nombre: "Límites y continuidad en varias variables",
      prerrequisitos: ["funciones-varias-variables", "limites"],
      subtemas: [
        {
          slug: "limites-varias-variables",
          nombre: "Límites de funciones de varias variables",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "continuidad-varias-variables",
          nombre: "Continuidad en varias variables",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "derivadas-parciales",
      nombre: "Derivadas parciales y diferenciabilidad",
      prerrequisitos: ["limites-continuidad-varias", "derivadas"],
      subtemas: [
        {
          slug: "calculo-derivadas-parciales",
          nombre: "Cálculo de derivadas parciales",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "plano-tangente-diferencial",
          nombre: "Plano tangente, diferenciabilidad y diferencial total",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "regla-cadena-varias",
          nombre: "Regla de la cadena en varias variables",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "gradiente-direccional",
          nombre: "Gradiente y derivada direccional",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "extremos-lagrange",
      nombre: "Extremos y multiplicadores de Lagrange",
      prerrequisitos: ["derivadas-parciales"],
      subtemas: [
        {
          slug: "puntos-criticos-hessiana",
          nombre: "Puntos críticos y criterio de la hessiana",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "extremos-absolutos-regiones",
          nombre: "Extremos absolutos en regiones cerradas y acotadas",
          diasEstimados: 1,
          dificultad: 3,
        },
        {
          slug: "multiplicadores-lagrange",
          nombre: "Multiplicadores de Lagrange",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "integrales-dobles",
      nombre: "Integrales dobles",
      prerrequisitos: ["integral-definida"],
      subtemas: [
        {
          slug: "dobles-rectangulos",
          nombre: "Integrales dobles sobre rectángulos e integrales iteradas",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "dobles-regiones-generales",
          nombre: "Integrales dobles sobre regiones generales",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "dobles-polares",
          nombre: "Integrales dobles en coordenadas polares",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "aplicaciones-dobles",
          nombre: "Aplicaciones: área, masa y centro de masa",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "integrales-triples",
      nombre: "Integrales triples",
      prerrequisitos: ["integrales-dobles"],
      subtemas: [
        {
          slug: "triples-rectangulares",
          nombre: "Integrales triples en coordenadas rectangulares",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "triples-cilindricas",
          nombre: "Integrales triples en coordenadas cilíndricas",
          diasEstimados: 1,
          dificultad: 3,
        },
        {
          slug: "triples-esfericas",
          nombre: "Integrales triples en coordenadas esféricas",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "cambio-de-variables-jacobiano",
          nombre: "Cambio de variables y jacobiano",
          diasEstimados: 1,
          dificultad: 3,
        },
      ],
    },
  ],
};
