import type { Ruta } from "../../lib/tipos";

export const calculoIntegral: Ruta = {
  slug: "calculo-integral",
  nombre: "Cálculo Integral",
  descripcion:
    "Integral indefinida y técnicas, integral definida y Teorema Fundamental, aplicaciones e integrales impropias.",
  temas: [
    {
      slug: "integral-indefinida",
      nombre: "Integral indefinida y técnicas de integración",
      prerrequisitos: ["derivadas"],
      subtemas: [
        {
          slug: "antiderivadas",
          nombre: "Antiderivadas e integrales inmediatas",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "sustitucion",
          nombre: "Integración por sustitución",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "por-partes",
          nombre: "Integración por partes",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "integrales-trigonometricas",
          nombre: "Integrales trigonométricas",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "sustitucion-trigonometrica",
          nombre: "Sustitución trigonométrica",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "fracciones-parciales",
          nombre: "Integración por fracciones parciales",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "integral-definida",
      nombre: "Integral definida y Teorema Fundamental del Cálculo",
      prerrequisitos: ["integral-indefinida"],
      subtemas: [
        {
          slug: "sumas-de-riemann",
          nombre: "Sumas de Riemann y definición de integral definida",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "propiedades-integral-definida",
          nombre: "Propiedades de la integral definida",
          diasEstimados: 1,
          dificultad: 1,
        },
        {
          slug: "teorema-fundamental",
          nombre: "Teorema Fundamental del Cálculo",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "cambio-de-variable-definida",
          nombre: "Cambio de variable en la integral definida",
          diasEstimados: 1,
          dificultad: 2,
        },
      ],
    },
    {
      slug: "aplicaciones-integral",
      nombre: "Aplicaciones de la integral",
      prerrequisitos: ["integral-definida"],
      subtemas: [
        {
          slug: "area-entre-curvas",
          nombre: "Área entre curvas",
          diasEstimados: 2,
          dificultad: 2,
        },
        {
          slug: "volumenes-discos-arandelas",
          nombre: "Volúmenes de sólidos de revolución: discos y arandelas",
          diasEstimados: 2,
          dificultad: 3,
        },
        {
          slug: "volumenes-capas-cilindricas",
          nombre: "Volúmenes por capas cilíndricas",
          diasEstimados: 1,
          dificultad: 3,
        },
        {
          slug: "longitud-de-arco",
          nombre: "Longitud de arco y área de superficie de revolución",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "trabajo-y-centroides",
          nombre: "Trabajo, presión y centros de masa",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
    {
      slug: "integrales-impropias",
      nombre: "Integrales impropias",
      prerrequisitos: ["integral-definida", "limites"],
      subtemas: [
        {
          slug: "impropias-limites-infinitos",
          nombre: "Integrales con límites de integración infinitos",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "impropias-discontinuas",
          nombre: "Integrales con integrando discontinuo",
          diasEstimados: 1,
          dificultad: 2,
        },
        {
          slug: "criterios-de-convergencia",
          nombre: "Criterios de comparación y convergencia",
          diasEstimados: 2,
          dificultad: 3,
        },
      ],
    },
  ],
};
