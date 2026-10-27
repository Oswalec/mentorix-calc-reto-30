import type { Ruta } from "../../lib/tipos";
import { leccion } from "../skool";

const l = (titulo: string, id: string) => leccion("introduccion", titulo, id);

export const precalculo: Ruta = {
  slug: "precalculo",
  nombre: "Precálculo",
  descripcion:
    "Para quienes empiezan desde cero o quieren nivelarse: álgebra, ecuaciones, inecuaciones, logaritmos y trigonometría en 3 días (curso Introducción).",
  horizonteBase: 3,
  minutosBase: 180,
  mensajeFinal:
    "Terminaste la nivelación: ya puedes empezar la ruta Cálculo Diferencial desde Ajustes → Cambiar de ruta.",
  temas: [
    {
      slug: "nivelacion-precalculo",
      nombre: "Nivelación de precálculo",
      sinEvaluacion: true,
      prerrequisitos: [],
      subtemas: [
        {
          slug: "pre-algebra-basica",
          nombre:
            "Álgebra básica: números reales, exponentes, productos notables y factorización (M1–M3)",
          diasEstimados: 1,
          dificultad: 1,
          teoria: [
            l(
              "M1 · Números Reales - Parte 1",
              "a08f77c93f4c4ae7b7f144f7a36d1ae2",
            ),
            l(
              "M1 · Exponente y Radicación",
              "0071e6d19c7b43cf8d95c1f82dea32d0",
            ),
            l("M1 · Racionalización", "6ce4a5934efa4bb3999f11116ebde402"),
            l(
              "M2 · Productos Notables - Parte 1",
              "c851cb5a6e274803bce282e4a6bc7c3e",
            ),
            l(
              "M2 · Productos Notables - Parte 2",
              "0dc6b93537844b6d81e664182cfeefae",
            ),
            l("M3 · Factorizar", "1f1e827334f44d8abea5eee4d25e7885"),
          ],
        },
        {
          slug: "pre-ecuaciones-inecuaciones",
          nombre:
            "Ecuaciones, intervalos, inecuaciones y valor absoluto (M3–M5)",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            l("M3 · Ecuación de 2do Grado", "e660acec3ec64fe7a81adf120874303b"),
            l("M3 · Ecuaciones Racionales", "2cca4e1da08141f8964b54cae26ffc60"),
            l("M4 · Intervalos - Parte 1", "480cfb45e9184ef48d53a1cec5913399"),
            l("M5 · Inecuación Cuadrática", "6a5138a61a4c4ae5a66df6c454670804"),
            l(
              "M5 · Inecuaciones con radical",
              "866e81ab55b043c19577e7403d5274f8",
            ),
            l("M5 · Valor Absoluto", "1c6eaebed1454f26a118da0e6e1532fe"),
          ],
          practica: [
            l(
              "M5 · Inecuaciones de 1er Grado - Ejercicio",
              "707955d40a3b405982fdb059a7e22d13",
            ),
            l(
              "M5 · Ejercicios - I. Cuadráticas y de Grado Superior",
              "6ad3dbf6a1594331a57ebd9c9f1f2e7b",
            ),
          ],
        },
        {
          slug: "pre-exponenciales-trigonometria",
          nombre:
            "Ecuaciones exponenciales y logarítmicas, y trigonometría (M5 y Trigonometría)",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            l(
              "M5 · Ecuaciones Exponenciales",
              "92ed7bffe025443193bf00f3465abb42",
            ),
            l(
              "M5 · Ecuaciones Logarítmicas",
              "7b0e1e8aff7c4983b7e67aef934938bf",
            ),
            l("Trigonometría - Parte 1", "6ba0a8cb07a645a3a6dc4fe592ca803e"),
            l("Trigonometría - Parte 2", "1221482e1bdc4f1f8152b71cbb0a212b"),
          ],
          opcionales: [
            l("M6 · Lógica y conjuntos", "78e6a520b87645cc812e756715ca511a"),
            l("M7 · Números complejos", "1b54e0bb0be040f0afb98da013abe41d"),
            l("M8 · Rectas y cónicas", "12aed73ed611444592cd64d15347a45f"),
            l("M9 · Matrices y sistemas", "e7cdcd1bc7d54a8b9f9ee9113a167d65"),
            l("M10 · Vectores", "90c08bcf646d47dfad304678c07a22e5"),
          ],
        },
      ],
    },
  ],
};
