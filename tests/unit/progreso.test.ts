import { describe, expect, it } from "vitest";
import {
  activarRuta,
  declararDominio,
  guardarReflexion,
  marcarBloque,
  registrarDificultad,
  registrarEvaluacion,
} from "../../src/lib/progreso/acciones";
import { cargarEstado, guardarEstado } from "../../src/lib/progreso/almacen";
import {
  CLAVE_ALMACEN,
  CLAVE_DANADA,
  estadoInicial,
  type Estado,
} from "../../src/lib/progreso/estado";
import { validarEstado } from "../../src/lib/progreso/validar";
import { configInicial } from "../../src/lib/plan/ajustes";

const config = configInicial("2026-03-01");
const conRuta = (): Estado => activarRuta(estadoInicial(), "prueba", config);

const almacenRoto: Storage = {
  length: 0,
  clear: () => undefined,
  key: () => null,
  removeItem: () => undefined,
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("QuotaExceededError");
  },
};

describe("almacén de progreso", () => {
  it("empieza vacío con la versión 1", () => {
    expect(cargarEstado(window.localStorage)).toEqual({
      estado: {
        version: 1,
        rutaActiva: null,
        ultimoRespaldo: null,
        rutas: {},
      },
      corrupto: null,
    });
  });

  it("guarda bajo la clave mentorix-reto:v1 y vuelve a cargar lo mismo", () => {
    const estado = marcarBloque(
      conRuta(),
      "prueba",
      "prueba:estudio:a#1:teoria",
      true,
      "2026-03-01T10:00:00.000Z",
    );
    expect(guardarEstado(estado, window.localStorage)).toBe(true);
    expect(window.localStorage.getItem("mentorix-reto:v1")).not.toBeNull();
    expect(cargarEstado(window.localStorage)).toEqual({
      estado,
      corrupto: null,
    });
  });

  it("no borra datos corruptos: los copia aparte y empieza limpio", () => {
    window.localStorage.setItem(CLAVE_ALMACEN, "{esto no es JSON");
    const carga = cargarEstado(window.localStorage);
    expect(carga.estado).toEqual(estadoInicial());
    expect(carga.corrupto).toBe("{esto no es JSON");
    expect(window.localStorage.getItem(CLAVE_DANADA)).toBe("{esto no es JSON");
    expect(window.localStorage.getItem(CLAVE_ALMACEN)).toBe("{esto no es JSON");
  });

  it("trata una versión desconocida como dato corrupto", () => {
    const crudo = JSON.stringify({ ...estadoInicial(), version: 2 });
    window.localStorage.setItem(CLAVE_ALMACEN, crudo);
    expect(cargarEstado(window.localStorage).corrupto).toBe(crudo);
  });

  it("sobrevive a un almacenamiento que lanza errores (modo privado)", () => {
    expect(cargarEstado(almacenRoto)).toEqual({
      estado: estadoInicial(),
      corrupto: null,
    });
    expect(guardarEstado(estadoInicial(), almacenRoto)).toBe(false);
    expect(cargarEstado(null).estado).toEqual(estadoInicial());
  });
});

describe("acciones y reglas de dominio", () => {
  it("marcar un bloque registra el completado y no cambia el dominio", () => {
    const estado = marcarBloque(
      conRuta(),
      "prueba",
      "prueba:estudio:a#1:practica",
      true,
      "2026-03-01T10:00:00.000Z",
    );
    const progreso = estado.rutas.prueba!;
    expect(progreso.completados).toEqual({
      "prueba:estudio:a#1:practica": "2026-03-01T10:00:00.000Z",
    });
    expect(progreso.dominio).toEqual({});
    const desmarcado = marcarBloque(
      estado,
      "prueba",
      "prueba:estudio:a#1:practica",
      false,
      "2026-03-01T11:00:00.000Z",
    );
    expect(desmarcado.rutas.prueba!.completados).toEqual({});
  });

  it("exige evidencia para declarar «dominado»", () => {
    const sinEvidencia = declararDominio(
      conRuta(),
      "prueba",
      "a",
      "dominado",
      "   ",
      "2026-03-05",
    );
    expect(sinEvidencia).toBeInstanceOf(Error);
    const conEvidencia = declararDominio(
      conRuta(),
      "prueba",
      "a",
      "dominado",
      "17/20 en el examen de años anteriores",
      "2026-03-05",
    );
    expect(conEvidencia).not.toBeInstanceOf(Error);
    expect((conEvidencia as Estado).rutas.prueba!.dominio.a).toEqual({
      nivel: "dominado",
      evidencia: "17/20 en el examen de años anteriores",
      fecha: "2026-03-05",
    });
    const inseguro = declararDominio(
      conRuta(),
      "prueba",
      "a",
      "inseguro",
      "",
      "2026-03-05",
    );
    expect(inseguro).not.toBeInstanceOf(Error);
  });

  it("valida notas, dificultades y reflexiones", () => {
    const evaluacion = {
      id: "e1",
      diaNumero: 4,
      temaSlug: "t1",
      fecha: "2026-03-04",
      nota: 21,
      notaMaxima: 20,
      errores: "",
      temasAReforzar: [],
    };
    expect(registrarEvaluacion(conRuta(), "prueba", evaluacion)).toBeInstanceOf(
      Error,
    );
    const valida = registrarEvaluacion(conRuta(), "prueba", {
      ...evaluacion,
      nota: 14,
    }) as Estado;
    expect(valida.rutas.prueba!.evaluaciones).toHaveLength(1);
    const vacia = registrarDificultad(conRuta(), "prueba", {
      id: "d1",
      fecha: "2026-03-02",
      subtemaSlug: null,
      texto: "  ",
      resuelta: false,
    });
    expect(vacia).toBeInstanceOf(Error);
    const reflexion = guardarReflexion(
      conRuta(),
      "prueba",
      3,
      "Entendí la regla",
    );
    expect(reflexion.rutas.prueba!.reflexiones).toEqual({
      "3": "Entendí la regla",
    });
    expect(
      guardarReflexion(reflexion, "prueba", 3, "").rutas.prueba!.reflexiones,
    ).toEqual({});
  });

  it("validarEstado rechaza un dominio «dominado» sin evidencia y una config inválida", () => {
    const base = conRuta();
    expect(validarEstado(base)).toBe(base);
    const sinEvidencia = structuredClone(base);
    sinEvidencia.rutas.prueba!.dominio.a = {
      nivel: "dominado",
      evidencia: "",
      fecha: "2026-03-05",
    };
    expect(validarEstado(sinEvidencia)).toBeInstanceOf(Error);
    const configMala = structuredClone(base);
    configMala.rutas.prueba!.config.horizonteDias = 500;
    expect(validarEstado(configMala)).toBeInstanceOf(Error);
    expect(validarEstado("texto")).toBeInstanceOf(Error);
  });
});
