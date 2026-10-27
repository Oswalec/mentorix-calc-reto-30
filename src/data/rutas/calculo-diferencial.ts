import type { Ruta } from "../../lib/tipos";
import { leccion } from "../skool";

const intro = (t: string, id: string) => leccion("introduccion", t, id);
const fun = (t: string, id: string) => leccion("funciones", t, id);
const lim = (t: string, id: string) => leccion("limites", t, id);
const con = (t: string, id: string) => leccion("continuidad", t, id);
const der = (t: string, id: string) => leccion("derivadas", t, id);

// Base de 30 días: 20 de estudio + 3 temas × (examen + corrección) + 4 días
// ligeros (7, 14, 21 y 28). Con más días, el generador estira el plan.
export const calculoDiferencial: Ruta = {
  slug: "calculo-diferencial",
  nombre: "Cálculo Diferencial",
  descripcion:
    "Tus cursos de Funciones, Límites, Continuidad y Derivadas en Skool, de principio a fin.",
  horizonteBase: 30,
  minutosBase: 150,
  temas: [
    {
      slug: "funciones",
      nombre: "Funciones",
      prerrequisitos: [
        {
          slug: "base-intervalos-inecuaciones",
          nombre:
            "Intervalos, inecuaciones y valor absoluto (Introducción M4–M5)",
          enlaces: [
            intro(
              "M4 · Intervalos - Parte 1",
              "480cfb45e9184ef48d53a1cec5913399",
            ),
            intro(
              "M5 · Inecuación Cuadrática",
              "6a5138a61a4c4ae5a66df6c454670804",
            ),
            intro(
              "M5 · Inecuaciones con radical",
              "866e81ab55b043c19577e7403d5274f8",
            ),
            intro("M5 · Valor Absoluto", "1c6eaebed1454f26a118da0e6e1532fe"),
          ],
        },
        {
          slug: "base-exponenciales-logaritmos",
          nombre: "Ecuaciones exponenciales y logarítmicas (Introducción M5)",
          enlaces: [
            intro(
              "M5 · Ecuaciones Exponenciales",
              "92ed7bffe025443193bf00f3465abb42",
            ),
            intro(
              "M5 · Ecuaciones Logarítmicas",
              "7b0e1e8aff7c4983b7e67aef934938bf",
            ),
          ],
        },
        {
          slug: "base-trigonometria",
          nombre: "Trigonometría (Introducción)",
          enlaces: [
            intro(
              "Trigonometría - Parte 1",
              "6ba0a8cb07a645a3a6dc4fe592ca803e",
            ),
            intro(
              "Trigonometría - Parte 2",
              "1221482e1bdc4f1f8152b71cbb0a212b",
            ),
          ],
        },
      ],
      subtemas: [
        {
          slug: "fun-dominio-rango-grafica",
          nombre: "M.I · Dominio, rango, gráfica y tipos de funciones",
          diasEstimados: 2,
          dificultad: 2,
          teoria: [
            fun("Dominio P - 1", "2b6026a2277b448284fc2cecad0e4c78"),
            fun("Dominio P - 2", "05cfbb674ee94fd29defb972517c8adc"),
            fun("Dominio P - 3", "8da067ec4d4b434e8a34e902ae44db3a"),
            fun("Rango", "680922071f04404cb2236f73db2d843c"),
            fun("Gráfica", "902c12d349444cf392a410e62f3bdd05"),
            fun("Tipos de Funciones", "7c47ba0552dc461c9034cd87abed0034"),
            fun(
              "Aplicación de Función Cuadrática - P1",
              "ec570786b32a45ab88aa748866a99c64",
            ),
          ],
          practica: [
            fun("M.I · Ejercicio P - 1", "2082163280c04696b1f9ac3e723a6e73"),
            fun("M.I · Ejercicio P - 2", "b1f21caf8a4d4e25a19811cb6062d201"),
          ],
        },
        {
          slug: "fun-algebra-composicion",
          nombre: "M.II–III · Álgebra y composición de funciones",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            fun("Álgebra de funciones", "8610c8c69ad44bed8fbb34cb465cc082"),
            fun("Composición de Funciones", "7d9028297b2a47f7a358d81e9bd8237f"),
            fun("Composición: Propiedades", "6ed40dec0c3e42a7a7255e3399c0f61e"),
          ],
          practica: [
            fun("M.II · Ejercicio P - 0", "ad3f18f31da3485a8d5bfb3df175e0d9"),
            fun("M.II · Ejercicio P - 1", "0405300cc22d48709930789d05068945"),
            fun("M.II · Ejercicio P - 2", "9e0371d2b3e442dd9a3e795e07091150"),
            fun("M.III · Ejercicio P - 0", "85c2a7c04b1a45f9bfcec78320d13e14"),
            fun("M.III · Ejercicio P - 1", "2348b20cc0364d169e1288c4412683f1"),
            fun("M.III · Ejercicio P - 2", "cbf354c62f9d4debac76a1bf9c8fdb19"),
            fun("M.III · Ejercicio P - 3", "a6d6cd53c7ce4c42837bcdd5551db699"),
          ],
        },
        {
          slug: "fun-inyectiva-inversa",
          nombre: "M.IV · Inyectiva, sobreyectiva, biyectiva e inversa",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            fun("Función Inyectiva", "767eeb86f26b4d93ac73345d8d58c973"),
            fun("Inyectiva: Obs", "2985d54c08c341ca979751a51d2a4b8c"),
            fun(
              "Función Sobreyectiva y Biyectiva",
              "2cc41510a5b84a3090889c7529ae5eb0",
            ),
            fun("Función Inversa", "81e7a7c454d94017bd718d083ee72b4f"),
          ],
          practica: [
            fun(
              "Inyectiva · Ejercicio P - 1",
              "76198bb8acb349fcbe92fb32a4a255db",
            ),
            fun(
              "Inversa · Ejercicio P - 1",
              "8809de4886cc45048bc0aa632bb4cf9f",
            ),
            fun(
              "Inversa · Ejercicio P - 2",
              "8e3c60ee47cf439295b35b4d7d7a1463",
            ),
            fun(
              "Inversa · Ejercicio P - 3",
              "e5fbac7936b54f4e9e4f296774a00a1f",
            ),
            fun(
              "Inversa · Ejercicio P - 4 (Estudiante)",
              "7982fc7d0c554bb1aa4afe1875e1baf5",
            ),
          ],
        },
        {
          slug: "fun-par-trigonometricas",
          nombre: "M.V · Par e impar, periódica, monotonía y trigonométricas",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            fun("Función Par - Impar", "901041f83f4b4c29af5db7e8da808c7f"),
            fun("Función Periódica", "cdad06dcbe58401eb8fee84beee2ba61"),
            fun(
              "Función Creciente y Decreciente",
              "b526de9b1d2b46bca1dc6921de8ededa",
            ),
            fun(
              "F. Trigonométrica - Parte 1",
              "c2590542b6f04c29969d2c41b952204f",
            ),
            fun(
              "F. Trigonométrica - Parte 2",
              "f3a0c4407255405aa9e8b49a99c994a1",
            ),
            fun(
              "F. Trigonométrica - Parte 3",
              "916b42891dab4394b1e80260e248311a",
            ),
          ],
        },
        {
          slug: "fun-exponencial-logaritmo",
          nombre: "M.VI · Función exponencial y logaritmo",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            fun(
              "Función exponencial y logaritmo",
              "09d8996b1ce446a788c54a8fdd507769",
            ),
          ],
          practica: [
            fun(
              "Ejercicio Logaritmos y Exponencial",
              "6ee26fe9de6548489714a91876e10c0a",
            ),
          ],
        },
      ],
    },
    {
      slug: "limites-continuidad",
      nombre: "Límites y continuidad",
      prerrequisitos: [
        {
          slug: "base-algebra",
          nombre:
            "Productos notables, factorización y racionalización (Introducción M1–M3)",
          enlaces: [
            intro("M1 · Racionalización", "6ce4a5934efa4bb3999f11116ebde402"),
            intro(
              "M2 · Productos Notables - Parte 1",
              "c851cb5a6e274803bce282e4a6bc7c3e",
            ),
            intro(
              "M2 · Productos Notables - Parte 2",
              "0dc6b93537844b6d81e664182cfeefae",
            ),
            intro("M3 · Factorizar", "1f1e827334f44d8abea5eee4d25e7885"),
          ],
        },
      ],
      subtemas: [
        {
          slug: "lim-definicion-laterales",
          nombre:
            "Límites M.I–II · Definición, demostración, laterales y propiedades",
          diasEstimados: 1,
          dificultad: 3,
          teoria: [
            lim("Introducción", "bfbbc40555c74743ad601cfe0613d9b0"),
            lim("Definición", "8dfe401262784cd3967e959f0e916def"),
            lim("Observaciones", "898941c2a819428aa81ee8f004351299"),
            lim(
              "Demostración de un Límite",
              "885a2a1faed2477e81d039e0c16bdb0c",
            ),
            lim("Límites Laterales", "f349a7d56d3745948392be81202b8d76"),
            lim(
              "Propiedades y Operaciones",
              "97240f03790145288e6246d8c9aef657",
            ),
            lim(
              "Reglas Válidas y Forma Indeterminada",
              "ff1220f61f2644ea97171965bc04f064",
            ),
          ],
          ejemplos: [
            lim("Ejemplo 0", "43547f3c3a1349b2a3cb592dafc5ab43"),
            lim("M.II · Ejemplo P - 0", "fae785bb58f54adc9c2b73175ad50b1b"),
          ],
          practica: [
            lim("M.I · Ejercicio P - 1", "a488e0c347374cb4a20b9e0d1945a8b2"),
            lim("M.I · Ejercicio P - 2", "c956cd18b85b4e8587eb35bcb03dbfc9"),
            lim("M.I · Ejercicio P - 3", "6f2dbae074c44d4887c03c8d359fa3ed"),
            lim("M.I · Ejercicio P - 4", "7f41500a49ff46a8b046202486bc611a"),
            lim("M.II · Ejercicio P - 1", "0f10b27316634d6fb527e3fde8ced070"),
            lim("M.II · Ejercicio P - 2", "41649675c6e34e4381c2fdd6c2319c1e"),
            lim(
              "M.II · Ejercicio P - 3 (Gráficas)",
              "3770e46fde584d4fa90fd3063c9cfabb",
            ),
          ],
        },
        {
          slug: "lim-indeterminacion-trigonometricos",
          nombre:
            "Límites M.III · Indeterminación 0/0 y límites trigonométricos",
          diasEstimados: 2,
          dificultad: 3,
          teoria: [
            lim("Indeterminación 0/0", "444d577fff0b4dc1a4e02b35ced5c070"),
            lim("Límites Trigonométricos", "97e900fb115044bdbff2b037aca2af1a"),
            lim(
              "Trigonométricos: Observación",
              "882eee30d47f495f81c38adad8cefbde",
            ),
          ],
          ejemplos: [
            lim("M.III · Ejemplo P - 0", "9e569be1090547debf20d8c3709ecf07"),
          ],
          practica: [
            lim("0/0 · Ejercicio P - 1", "31eeca3d877346bc8b7799fbe267a002"),
            lim("0/0 · Ejercicio P - 2", "e2c64ddfb4c14a1893f1745bb9a37d8c"),
            lim("0/0 · Ejercicio P - 3", "bf08a4c0a3314d3b801d945a7b26ab4d"),
            lim(
              "0/0 · Ejercicio P - 4 (Operativo)",
              "40149c229dae46ae8b3af93786f80519",
            ),
            lim(
              "Trigonométricos · Ejercicio P - 1",
              "36942e7e0cd843e8b1d3733e43998424",
            ),
            lim(
              "Trigonométricos · Ejercicio P - 2",
              "f84c9234a1bb42dd83e4677732350113",
            ),
            lim(
              "Trigonométricos · Ejercicio P - 3",
              "ceb09f1e77bc402a8cc0a5157012a1a3",
            ),
            lim(
              "Trigonométricos · Ejercicio P - 4",
              "d6dc3a8cc21440dead7f6ec4315139ad",
            ),
            lim(
              "Trigonométricos · Ejercicio P - 5 (Estudiante)",
              "83f1ed51b9ea4aab9f4f28cc090f5405",
            ),
            lim(
              "Trigonométricos · Ejercicio P - 6 (Estudiante)",
              "6761c48bbd64489aa3ba8a67de6f8d80",
            ),
          ],
        },
        {
          slug: "lim-infinitos-asintotas",
          nombre: "Límites M.IV–V · Límites infinitos, al infinito y asíntotas",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            lim("Límite al Infinito", "8d5411a803b74318934c945baf7c1896"),
            lim("Límite Infinito", "90103cea2ef9420e9f49d7da061cfc3c"),
            lim(
              "Límite del Infinito al Infinito",
              "e62a4e1f02c94840bc4141d05984e742",
            ),
            lim("M.IV · Teorema", "7a4a316e03f14a3c997f2a842fc34231"),
            lim("Asíntota", "be43861eeb884e6a98c6ca2262317576"),
            lim("Asíntota Vertical", "b2714b31ea1549e38f9b5645cbdcf693"),
            lim("Asíntota Oblicua", "982793486e004766a354ea35d337303c"),
            lim("Asíntota Horizontal", "71ad824234ca4417af2d48eb156a41e1"),
          ],
          practica: [
            lim("M.IV · Ejercicio P - 1", "410495cf1f05450192f7e80b1385d0d5"),
            lim(
              "M.IV · Ejercicio P - 2 (Estudiante)",
              "5ba81041ec94428fbae1aa464c14feae",
            ),
            lim("M.V · Ejercicio P - 1", "926574c9329c4ff8a13a9847bcced39f"),
            lim("M.V · Ejercicio P - 2", "59e639ff77bb459aae271b261331a5b7"),
          ],
        },
        {
          slug: "lim-logaritmo-exponencial",
          nombre: "Límites M.VI · Límites con ln(x) y eˣ",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            lim("Límites en ln(x) y e^x", "423e630daa3546719472ec09a8786742"),
            lim("M.VI · Teorema", "d849eab36e1345d492a0d51153c7de82"),
          ],
          practica: [
            lim("M.VI · Ejercicio P - 1", "92eafedaa09141ddbe422c5ec276b2f8"),
            lim("M.VI · Ejercicio P - 2", "ad230b107ef74e2c947144905ef3c8f9"),
            lim("M.VI · Ejercicio P - 3", "d7c7d40e93884260bc0bc50f6a0b26bc"),
          ],
        },
        {
          slug: "con-definicion-teoremas",
          nombre:
            "Continuidad M.I–II · Definición, tipos, valor medio y Bolzano",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            con("Definición", "971473834bf14be6a9d4e85bcc383f31"),
            con("Tipos de continuidad", "f364c66941784d1b8571d7602f5f17a2"),
            con("Observación", "fb836f740ca44852b79e045c46262ce5"),
            con("Teorema de Valor Medio", "2be86af6407f47f88b09c11e700f1129"),
            con("Teorema de Bolzano", "0623812ba97e456eb9942b7f5901c397"),
          ],
          practica: [
            con("Ejercicio P - 1", "24e53183ba584675827b0c6012ea355f"),
            con("Ejercicio P - 2", "befdcfd690a84bc292fcd2074aa64cc7"),
            con("Ejercicio P - 3", "26bcf0e630564da6a5fd53430b380cf4"),
            con("Ejercicio P - 4", "78b9f5d6c8e746c782fa67a748fc6c04"),
            con(
              "Ejercicio P - 5 (Estudiante)",
              "44a0240713b74013a660f465093e1922",
            ),
            con(
              "Ejercicio P - 6 (Estudiante)",
              "7d3bcaf2808643ee923f03cadc1233c4",
            ),
            con(
              "Ejercicio P - 7 (Estudiante)",
              "eed1b18a1aa04414a76426e7f91ab303",
            ),
          ],
        },
      ],
    },
    {
      slug: "derivadas",
      nombre: "Derivadas",
      prerrequisitos: [],
      subtemas: [
        {
          slug: "der-definicion-reglas",
          nombre:
            "M.I · Definición, reglas, recta tangente, laterales y trigonométricas",
          diasEstimados: 2,
          dificultad: 2,
          teoria: [
            der(
              "Introducción - Recta Tangente",
              "97ffd9d9ead24ab29a164049438b8335",
            ),
            der(
              "Introducción - Velocidad Instantánea",
              "73959f42e1cd4bdfb67494dccea027e8",
            ),
            der("Definición", "4ed0d4c423d845068c50e8bb484247a5"),
            der("Reglas de Derivación", "bf24062a22e4482ca9b01998f5251fb6"),
            der("Recta Tangente y Normal", "96f6434d3f1540149c7e47495771b4aa"),
            der("Derivadas Laterales", "6005c0b8c797471c8cb12ef1cd442a63"),
            der(
              "Existencia de la Derivada",
              "450485ef6c7f4858942b7c35a86bf61c",
            ),
            der(
              "Derivadas Trigonométricas",
              "ecd5e2fdffeb4f43a21701d2be53693e",
            ),
          ],
          practica: [
            der(
              "Definición · Ejercicios P - 1",
              "8b10fe318f5549b0b2117bcdcdead32a",
            ),
            der(
              "Definición · Ejercicio P - 2 (Estudiante)",
              "5b83897f073246e7abc36c76c9536921",
            ),
            der("Reglas · Ejercicio P - 1", "192ae41d35cb49b3a85bcb4490dc7a63"),
            der(
              "Laterales · Ejercicio P - 1",
              "f2138356341d435e9dd4a5dfce7883b2",
            ),
            der(
              "Laterales · Ejercicio P - 2",
              "051b776d72b24c3f9923ee64f5f27d85",
            ),
          ],
        },
        {
          slug: "der-cadena-implicita",
          nombre: "M.II · Regla de la cadena, implícita y orden superior",
          diasEstimados: 1,
          dificultad: 3,
          teoria: [
            der("Regla de la Cadena", "3184fb758de54ce3acb199b26aa1fccf"),
            der("Derivada Implícita", "3118f47239654ff3a0c87f2652394505"),
            der(
              "Derivada de Orden Superior",
              "9e958f1a032b44ebb1222bd8afc7b011",
            ),
          ],
          practica: [
            der("Cadena · Ejercicio P - 1", "b4b23a9e96174a33ae0ec76d67070d54"),
            der("Cadena · Ejercicio P - 2", "b1861fda161b4efe92dd71c29cc035f4"),
            der("Cadena · Ejercicio P - 3", "1c1f1a9d6c7942ff9012d089c2185c75"),
            der(
              "Implícita · Ejercicio P - 1",
              "c3147d2c670d43e8bbe430da2875406d",
            ),
            der(
              "Implícita · Ejercicio P - 2",
              "28beb19c5ef7461dadbbd8a4bbf52d08",
            ),
            der(
              "Implícita · Ejercicio P - 3",
              "5f3d4ab0b6674dc58e0401e5651078d7",
            ),
            der(
              "Orden superior · Ejercicio P - 1",
              "ab81b68151cf455dbbff4744c20e2e07",
            ),
          ],
        },
        {
          slug: "der-inversas-trascendentes",
          nombre:
            "M.III · Derivadas de inversas, exponenciales, logarítmicas e hiperbólicas",
          diasEstimados: 1,
          dificultad: 2,
          teoria: [
            der("Función Inversa", "5fe47fe2656e4e8ea0b87584c1c7deff"),
            der(
              "Derivada de Función Inversa",
              "1a225a3558444031b625e4da63d32c8d",
            ),
            der(
              "Derivada de F. Trigonométrica Inversa",
              "88d057fbadd94ae4a953f2c4c8faddd9",
            ),
            der(
              "Derivada de F. Exponencial y Logarítmica",
              "51e27ee390854678b6a77087664af487",
            ),
            der(
              "Derivada de F. Hiperbólica",
              "0f12622dc7864a178fb82ed9f89b1ab5",
            ),
          ],
          practica: [
            der(
              "Inversa · Ejercicio P - 1",
              "a259c17bf2cc4950a72138b7d0079418",
            ),
            der(
              "Trig. inversa · Ejercicio P - 2",
              "55e2ff0846074c8f9688dccd0058596c",
            ),
            der(
              "Exp. y log. · Ejercicio P - 1",
              "78b499a7f4d343cc974b2cd32b652ff4",
            ),
          ],
        },
        {
          slug: "der-diferenciales-rolle",
          nombre:
            "M.IV–V · Diferenciales, errores, razón de cambio, Rolle y valor medio",
          diasEstimados: 1,
          dificultad: 3,
          teoria: [
            der("Diferenciales", "4e899c2db6b34d0fab8a2257003726f3"),
            der("Errores", "877ff64534c346ce917e7ec8ac6c1db7"),
            der("Razón de Cambio", "3cecef3557a149849a22b7fba88472a4"),
            der("Teorema de Rolle", "b2ab3669f57b442fa80335c7725148f5"),
            der("Teorema del Valor Medio", "bef5c38edb204e2e9c0f91312fd394fc"),
          ],
          practica: [
            der(
              "Diferenciales · Ejercicio P - 1",
              "eaf04c1434734139916ddd37dabf0bec",
            ),
            der(
              "Diferenciales · Ejercicio P - 2",
              "94eed02213e04d4d9285fd0b497ac802",
            ),
            der(
              "Diferenciales · Ejercicio P - 3",
              "a68ec3f4977443498155e3209ad383a7",
            ),
            der(
              "Errores · Ejercicio P - 1",
              "f7a647ae27644d6b9492e09c9bf0e2e0",
            ),
            der(
              "Errores · Ejercicio P - 2",
              "36792aef378e443ca6f6f7e14c90c212",
            ),
            der(
              "Errores · Ejercicio P - 3",
              "cb0f56fae7244391b4a3235a0085d02f",
            ),
            der(
              "Razón de cambio · Ejercicio P - 1",
              "ca9b16c5f81041a6bd3c475937a2caf1",
            ),
            der(
              "Razón de cambio · Ejercicio P - 2",
              "5f208f2c52a64ebfb959f588e85e092b",
            ),
            der(
              "Razón de cambio · Ejercicio P - 3",
              "4dd61df570d84c92be15ddd108a10ebd",
            ),
            der(
              "Razón de cambio · Ejercicio P - 4",
              "05b79b62be894493bea6684e9bb32313",
            ),
            der("Rolle · Ejercicio P - 1", "c0d3e99619b7449bba4ea277e1828bfc"),
            der(
              "Valor medio · Ejercicio P - 1",
              "10110a8f5bd84439888c1bfe7cf61424",
            ),
          ],
        },
        {
          slug: "der-extremos-graficas",
          nombre: "M.VI · Extremos, criterios, concavidad y gráficas",
          diasEstimados: 2,
          dificultad: 3,
          teoria: [
            der(
              "Función Creciente y Decreciente",
              "51495d920c944cb58dc4538782ca519d",
            ),
            der("Máximos y Mínimos", "cecbd3d9679446cc9fcb52d1c1865eb0"),
            der("Puntos Críticos", "254f995898ac459c894fd47d72631073"),
            der(
              "Criterio de la 1ra Derivada",
              "694a56665e7a49e7b54a673a1be29f45",
            ),
            der(
              "Criterio de la 2da Derivada",
              "00b20bec1bd24805b224ec0cb5cf0699",
            ),
            der(
              "Concavidad y Punto de Inflexión",
              "1e33cfbd36b3476a90e13492a9877d98",
            ),
            der("Pasos para Graficar", "e7d60e8a40c648bda8e5d602b78ecc40"),
          ],
          practica: [
            der(
              "Monotonía · Ejercicio P - 1",
              "65f7d45f37d74268a2841110e00a1289",
            ),
            der(
              "1ra derivada · Ejercicio P - 1",
              "473a222885ee4d1b8da72475b6725ecb",
            ),
            der(
              "1ra derivada · Ejercicio P - 2",
              "ca4f56929af342339d4786c05d7dbd5d",
            ),
            der(
              "1ra derivada · Ejercicio P - 3",
              "6bafba2e25984d28aa0399826487949b",
            ),
            der(
              "Concavidad · Ejercicio P - 1",
              "f4582214fbc3454ea555314703b0753a",
            ),
            der(
              "Graficar · Ejercicio P - 1",
              "d2d20dd83a0e4a0292962410ae1aa133",
            ),
            der(
              "Graficar · Ejercicio P - 2",
              "6a3b82f4ef9c48389d636518db36f697",
            ),
          ],
        },
        {
          slug: "der-optimizacion-lhopital",
          nombre: "M.VII · Optimización y regla de L'Hôpital",
          diasEstimados: 1,
          dificultad: 3,
          teoria: [
            der("Optimización", "ed7b5d15beb44adda64878727ff760c0"),
            der("Regla de L'Hôpital", "14de7f00e7a64d1ab99ef13be0951d45"),
          ],
          practica: [
            der(
              "Optimización · Ejercicio P - 1",
              "5933b01e441d42b4b75772bf302ecc7d",
            ),
            der(
              "Optimización · Ejercicio P - 2",
              "240ad256fb9b4a5baaa511f7c73ffad5",
            ),
            der(
              "Optimización · Ejercicio P - 3",
              "235cd212e030434babfd06983fcd0c5b",
            ),
            der(
              "L'Hôpital · Ejercicio P - 1",
              "8c482f573c144585925a5f2ec710c8f3",
            ),
            der(
              "L'Hôpital · Ejercicio P - 2",
              "98941a77b41d4ce3b583fabb58c744e5",
            ),
            der(
              "L'Hôpital · Ejercicio P - 3",
              "ce0e7a07893d41e2986e556bbeb46547",
            ),
          ],
        },
      ],
    },
  ],
};
