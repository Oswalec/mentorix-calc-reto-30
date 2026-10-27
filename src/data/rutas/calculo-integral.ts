import type { Ruta } from "../../lib/tipos";
import { cursoCompleto, leccion } from "../skool";

const int = (t: string, id: string) => leccion("integrales", t, id);

// Programa de C.I (módulos 1–9). Base de 30 días: 18 de estudio + 4 temas ×
// (examen + corrección) + 4 días ligeros. Con más días, el plan se estira.
export const calculoIntegral: Ruta = {
  slug: "calculo-integral",
  nombre: "Cálculo Integral",
  descripcion:
    "Tu Programa de Cálculo Integral en Skool (módulos 1 a 9): teoremas fundamentales, métodos de integración, áreas, volúmenes, impropias, polares y centroides.",
  horizonteBase: 30,
  minutosBase: 150,
  temas: [
    {
      slug: "int-fundamentos",
      nombre: "Fundamentos: antiderivada e integral definida",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "int-antiderivada-tfc",
          nombre:
            "Módulo 1 · Antiderivada y teoremas fundamentales del cálculo",
          diasEstimados: 2,
          dificultad: 2,
          teoria: [
            int("Antiderivada", "357cdd1aa9494eb198334baf02729ef5"),
            int("1er Teorema F. Cálculo", "0523ab635fb048038dda4e5f038e38a9"),
            int("Teorema (1)", "949f34195ae34b73af7f0591b014ab72"),
            int("Teorema (2)", "1f260efa26284b20b8127b3b0a1ac379"),
            int("2do Teorema F. Cálculo", "0edcc0ef66a54820978f46aa5cc01c62"),
          ],
          practica: [
            int(
              "Antiderivada · Ejercicio 1",
              "42bf41d3964847299939332ebe444781",
            ),
            int(
              "1er Teorema · Ejercicio 1",
              "dd370d5ced0b4e5791ba9f75621e39dd",
            ),
            int("Teorema (1) · Ejercicio", "7dc2bd1f7bb34db1b725258ff165000f"),
            int("Teorema (2) · Ejercicio", "16d0ca537f6541f5b9eaa5f2f2975dec"),
          ],
        },
        {
          slug: "int-definida-indefinida",
          nombre: "Módulo 2 · Integral definida e indefinida: propiedades",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            int("Integral Definida", "cb3a01aac8a248c29735f0ce3f94d592"),
            int("Teoremas", "9e8579eb012a491fadf604736a3f1350"),
            int("Integral Indefinida", "ee81249622f6459f9525cd0748051a0a"),
          ],
          practica: [
            int("Módulo 2 · Ejercicio 1", "8eb7dc05276f4df18083e4b9bb1a722a"),
            int("Módulo 2 · Ejercicio 2", "30ab795c7361411f857f8a766143f3e6"),
            int(
              "Propiedades - Ejercicios 1",
              "319a8c4a5f8e4d5c9f279a440ed3b344",
            ),
            int(
              "Propiedades - Ejercicios 2",
              "f875af2afc9645d68b2ea450c6d4f7fb",
            ),
          ],
        },
      ],
    },
    {
      slug: "int-metodos",
      nombre: "Métodos de integración",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "int-sustitucion",
          nombre:
            "Módulo 3 · Sustitución algebraica, funciones pares e impares y sustitución trigonométrica",
          diasEstimados: 3,
          dificultad: 3,
          teoria: [
            int("Sustitución Algebraica", "485a4feb15d54dca9548c4fe0c3f83ee"),
            int(
              "Integración F. Pares e Impares",
              "963750134e7f486c8bcc344bd684ca37",
            ),
            int(
              "Sustitución Trigonométrica - Caso 1",
              "618f7d0997ba4856b6a768f1e5d6eb5a",
            ),
            int(
              "Sustitución Trigonométrica - Caso 2",
              "566e031dfb664f6a9a45497479ba424f",
            ),
            int(
              "Sustitución Trigonométrica - Caso 3",
              "25e7e1b218f04c0c8f9a7f6972b8650b",
            ),
          ],
          practica: [
            int(
              "Sustitución algebraica · Ejercicios",
              "5eba441a95604feda02ceed6f7a0577a",
            ),
            int(
              "Pares e impares · Ejercicios",
              "0272ad423243436ab880cebf1779df30",
            ),
            int("Caso 1 · Ejercicio 1", "08b6d6c41f6248f2a695cecb980bc206"),
            int("Caso 1 · Ejercicio 2", "7dc56aaf261e4676b33114e5df49c83f"),
            int("Caso 1 · Ejercicio 3", "9948f09f260048bdaa3db748c5046130"),
            int("Caso 2 · Ejercicio 1", "258d2aba6b6f4c688dafc3ea070960ed"),
            int("Caso 2 · Ejercicio 2", "0f0490174d5c480dbc3aead272ea18ab"),
            int("Caso 2 · Ejercicio 3", "ce553ce732164515a45b7e526c683232"),
            int("Caso 2 · Ejercicio 4", "44bba63f29624c539c291695d0b311fe"),
            int("Caso 3 · Ejercicio 1-2", "13990adf0e2d4b05a9e25bc3bf54b959"),
            int("Caso 3 · Ejercicio 3", "323c65d06c994beab81108adc7aba2b8"),
          ],
        },
        {
          slug: "int-partes-fracciones",
          nombre:
            "Módulo 4 · Por partes, fracciones parciales y potencias trigonométricas",
          diasEstimados: 3,
          dificultad: 3,
          teoria: [
            int("Integral Por Partes", "3559c31ec6b94e4ab307be3e3c50cb91"),
            int(
              "I. por Fracciones Parciales",
              "76ac916cf02c430bb3414501d7c23744",
            ),
            int(
              "Fracciones parciales - Caso 1",
              "e1c1d04ce6ab4f429563ae9cc0fe04a6",
            ),
            int(
              "Fracciones parciales - Caso 2",
              "7e3c2c1d2dfb4c56a28c2839b416397b",
            ),
            int(
              "Fracciones parciales - Caso 3",
              "6c74f9ed06a546a0a990814f2df33f56",
            ),
            int(
              "Potencias de F. Trigonométricas - Caso 1",
              "043260b1d1c9433dac2a5c4b58e64400",
            ),
            int(
              "Potencias de F. Trigonométricas - Caso 2",
              "f9d3cff6d49e48fdbfe4b4ef67d2dcca",
            ),
            int(
              "Potencias de F. Trigonométricas - Caso 3",
              "d94c5e4904af47598fbc9b5933413354",
            ),
            int(
              "F. Trigonométricas en Producto",
              "a99c0936cf0d489685f9b3adbe1962a0",
            ),
          ],
          practica: [
            int("Por partes · Ejercicios", "98c82841583a4e2b80b22a211300e873"),
          ],
        },
      ],
    },
    {
      slug: "int-areas-volumenes",
      nombre: "Áreas y volúmenes",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "int-areas",
          nombre: "Módulo 5 · Áreas (respecto a x y a y)",
          diasEstimados: 2,
          dificultad: 2,
          teoria: [
            int("Áreas", "d35fbd58d49044b6b7f0120e39ad11eb"),
            int("Áreas: Observación", "51a9be02dcee45d2b7e880be27497b78"),
            int("Cálculo del Área - Y", "13c228d69b4f489f927cc1d10e3243e1"),
          ],
          practica: [
            int("Áreas · Ejercicio 1", "a82e8bdb5ac844c18718d048f94e35bc"),
            int("Áreas · Ejercicio 2", "cff2afca1aaf4cdba84ad1392ee7d3d4"),
            int("Área - Y · Ejercicio 1", "f919705308654636830ff514641653e1"),
            int("Área - Y · Ejercicio 2", "772c54aa84a24bd3a8b86effa4063804"),
          ],
        },
        {
          slug: "int-volumenes",
          nombre: "Módulo 6 · Volúmenes: disco, anillo y cascarones",
          diasEstimados: 2,
          dificultad: 3,
          teoria: [
            int(
              "Volumen de Sólido de Revolución",
              "e29c5ed3831e4826b5940e0e5203e444",
            ),
            int(
              "Método del Anillo Circular",
              "3e32a367dd334a09a4a114758e67239d",
            ),
            int(
              "Volumen - Cascarones Cilíndricos",
              "778b8616856245fc8e3304b90286f391",
            ),
          ],
          practica: [
            int(
              "Sólido de revolución · Ejercicio 1",
              "18a0a73dcde64a11a7a8403003f8acda",
            ),
            int("Anillo · Ejercicio 1.1", "5fba7695ddc64992900f02229487ed74"),
            int("Anillo · Ejercicio 1.2", "03973f6476c547039944b6959bdaf81e"),
            int("Anillo · Ejercicio 2", "55ff7569674544a7857ae0b37d7bfe8c"),
            int("Anillo · Ejercicio 3", "2c931dcea1d04111abe7c503752afafe"),
            int("Anillo · Ejercicio 4", "b7f75bb7a62147cf834c1bcf20957450"),
            int("Cascarones · Ejercicio 1", "92959986bf344ea3bd6618687cf4bfaf"),
            int("Cascarones · Ejercicio 2", "509f4f89fc3640dc8599b293481d7c59"),
            int("Cascarones · Ejercicio 3", "f179aef43e78488fa562417ef335f2a8"),
            int("Cascarones · Ejercicio 4", "e31c336bb0d34691b45579a52dc3a84a"),
            int("Cascarones · Ejercicio 5", "e89db2bc63e0422988227033b2df95bf"),
          ],
        },
      ],
    },
    {
      slug: "int-impropias-polares",
      nombre: "Impropias, polares, centroides y longitud de arco",
      prerrequisitos: [
        {
          slug: "base-coordenadas-polares",
          nombre: "Coordenadas polares (curso de Skool)",
          enlaces: [cursoCompleto("polares", "Curso Coordenadas Polares")],
        },
        {
          slug: "base-parametricas",
          nombre: "Ecuaciones paramétricas (curso de Skool)",
          enlaces: [cursoCompleto("parametricas", "Curso Paramétricas")],
        },
      ],
      subtemas: [
        {
          slug: "int-impropias",
          nombre:
            "Módulo 7 · Integrales impropias de 1.ª y 2.ª especie, criterio de comparación",
          diasEstimados: 2,
          dificultad: 3,
          teoria: [
            int(
              "Integral Impropia - 1ra Especie",
              "c3c1c72ac9d842a8b10fa445aa02589f",
            ),
            int(
              "Integral Impropia - 2da Especie",
              "65fbcc767b2548f7b2f407299d0bdde9",
            ),
            int("Integral Conocida", "896448454a3b42dc8d2e10a182523598"),
            int("Criterio de Comparación", "c7100056a2cc45c086e2e15ad971b80b"),
          ],
          practica: [
            int("1ra especie · Ejercicios", "abd681d809894540a79a79bfa047e384"),
            int("2da especie · Ejercicios", "666cf45e8dfb4bd79dcf1c8ea286f33d"),
            int(
              "Comparación · Ejercicio 1",
              "82e9292ff047493d84ee8d2c306321c6",
            ),
            int(
              "Comparación · Ejercicio 2",
              "f0885fbfc2db4c28912864c4608ea1a9",
            ),
          ],
        },
        {
          slug: "int-polares",
          nombre: "Módulo 8 · Coordenadas polares: gráficas y áreas",
          diasEstimados: 2,
          dificultad: 3,
          teoria: [
            int("Coordenadas Polares", "cf0035f2a05742fa90e796b8e08399ca"),
            int("Cómo graficar en polares", "a5a450d01f96479d8fe176a22bc4f851"),
            int("Gráficas Conocidas", "8f47d15e661d4637a5af1ed93eefa34f"),
            int("Áreas en gráfica Polar", "35ebb7a2890a46f59b2b77254c153220"),
            int(
              "Áreas entre curvas polares",
              "4e7f0afa6a004dee8d516a50c880e5dd",
            ),
          ],
          practica: [
            int(
              "Polares · Ejercicios Básicos",
              "3b1b10d43beb45e9934d5430945abfe3",
            ),
          ],
        },
        {
          slug: "int-centroides-arco",
          nombre: "Módulo 9 · Momentos, centroides y longitud de arco",
          diasEstimados: 1,
          dificultad: 3,
          teoria: [
            int(
              "Momento y masa de una lámina",
              "9aa9e9136b764fb986c7d085d9cd306c",
            ),
            int(
              "Centroide de Una Región Plana",
              "909e6e0203574dbabee321d29cde6082",
            ),
            int("Longitud de Arco", "6b56f06a273a4e8d8e12aecbe083d1f7"),
            int(
              "Longitud de Arco - Curvas Paramétricas",
              "2201a86ad7cd4e72ac3bceae0e496826",
            ),
          ],
        },
      ],
    },
  ],
};
