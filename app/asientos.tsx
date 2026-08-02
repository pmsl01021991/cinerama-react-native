import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState, useEffect, } from "react";
import {Alert, Pressable, ScrollView, StatusBar, Text, View,} from "react-native";
import { SafeAreaView, useSafeAreaInsets, } from "react-native-safe-area-context";

const PRECIO_ENTRADA = 12;

// =====================================================
// CONFIGURACIÓN DE SALAS
// Equivale a salas.json
// =====================================================

const CONFIG_SALAS = {
  "2D": {
    filas: 10,
    columnas: 10,
  },
  "3D": {
    filas: 10,
    columnas: 10,
  },
};

export default function Asientos() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    reservaId?: string;
    cineId?: string;
    cine?: string;
    peliculaId?: string;
    titulo?: string;
    sala?: string;
    horario?: string;
    tipoCine?: string;
    }>();

    const reservaId = params.reservaId ?? "";
    const cineId = params.cineId ?? "";
    const cine = params.cine ?? "";

    const peliculaId = params.peliculaId ?? "";
    const titulo = params.titulo ?? "Película";
    const sala = params.sala ?? "-";
    const horario = params.horario ?? "-";
    const tipoCine = params.tipoCine === "3D" ? "3D" : "2D";

  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const [ocupados, setOcupados] = useState<string[]>([]);
    const [cargandoOcupados, setCargandoOcupados] = useState(true);

    // =====================================================
    // CARGAR ASIENTOS OCUPADOS DESDE MYSQL
    // =====================================================

    useEffect(() => {
    const cargarOcupados = async () => {
        if (!cine || !titulo || !sala || !horario) {
        setCargandoOcupados(false);
        return;
        }

        try {
        setCargandoOcupados(true);

        const url =
            `http://192.168.1.37:3001/api/reservas/ocupados/` +
            `${encodeURIComponent(cine)}/` +
            `${encodeURIComponent(titulo)}/` +
            `${encodeURIComponent(sala)}/` +
            `${encodeURIComponent(horario)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
            `Error cargando asientos: ${response.status}`
            );
        }

        const data = await response.json();

        setOcupados(
            Array.isArray(data.ocupados)
            ? data.ocupados
            : []
        );
        } catch (error) {
        console.error(
            "Error cargando asientos ocupados:",
            error
        );

        Alert.alert(
            "Error",
            "No se pudieron cargar los asientos ocupados."
        );

        setOcupados([]);
        } finally {
        setCargandoOcupados(false);
        }
    };

    cargarOcupados();
    }, [cine, titulo, sala, horario]);

  const config = CONFIG_SALAS[tipoCine];

  // =====================================================
  // GENERAR ASIENTOS
  // =====================================================

  const filas = useMemo(() => {
    return Array.from({ length: config.filas }, (_, filaIndex) => {
      const letra = String.fromCharCode(65 + filaIndex);

      return {
        letra,

        asientos: Array.from(
          { length: config.columnas },
          (_, columnaIndex) => {
            return `${letra}${columnaIndex + 1}`;
          }
        ),
      };
    });
  }, [config]);

  // =====================================================
  // SELECCIONAR / DESELECCIONAR
  // =====================================================

  const toggleAsiento = (codigo: string) => {
    if (ocupados.includes(codigo)) {
      return;
    }

    setSeleccionados((actuales) => {
      if (actuales.includes(codigo)) {
        return actuales.filter((asiento) => asiento !== codigo);
      }

      return [...actuales, codigo];
    });
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const total = seleccionados.length * PRECIO_ENTRADA;

  // =====================================================
  // CONTINUAR
  // =====================================================

  const continuarCompra = async () => {
    if (seleccionados.length === 0) {
        Alert.alert(
        "Selecciona tus asientos",
        "Debes seleccionar al menos un asiento para continuar."
        );

        return;
    }

    if (!reservaId) {
        Alert.alert(
        "Error",
        "No se encontró el identificador de la reserva."
        );

        return;
    }

    try {
        // =====================================================
        // GUARDAR ASIENTOS EN LA RESERVA
        // =====================================================

        const response = await fetch(
        `http://192.168.1.37:3001/api/reservas/${reservaId}`,
        {
            method: "PUT",

            headers: {
            "Content-Type": "application/json",
            },

            body: JSON.stringify({
            asientos: seleccionados.join(","),
            cantidad_entradas: seleccionados.length,
            monto_entradas: total,
            estado: "RESERVADO",
            }),
        }
        );

        // =====================================================
        // SI OTRO USUARIO TOMÓ EL ASIENTO
        // =====================================================

        if (response.status === 409) {
        const data = await response.json();

        const asientosConflicto =
            Array.isArray(data.ocupados)
            ? data.ocupados
            : [];

        setOcupados((actuales) => [
            ...new Set([
            ...actuales,
            ...asientosConflicto,
            ]),
        ]);

        setSeleccionados((actuales) =>
            actuales.filter(
            (asiento) =>
                !asientosConflicto.includes(asiento)
            )
        );

        Alert.alert(
            "Asiento no disponible",
            `Los siguientes asientos acaban de ser ocupados: ${asientosConflicto.join(
            ", "
            )}`
        );

        return;
        }

        if (!response.ok) {
        const texto = await response.text();

        console.log(
            "Error guardando asientos:",
            texto
        );

        Alert.alert(
            "Error",
            "No se pudieron guardar los asientos."
        );

        return;
        }

        // =====================================================
        // IR A COMIDA
        // =====================================================

        router.push({
        pathname: "/comida",

        params: {
            reservaId,

            cineId,
            cine,

            peliculaId,
            titulo,
            sala,
            horario,
            tipoCine,

            asientos: seleccionados.join(", "),
            cantidadEntradas:
            seleccionados.length.toString(),
            montoEntradas:
            total.toString(),
        },
        });
    } catch (error) {
        console.error(
        "Error guardando asientos:",
        error
        );

        Alert.alert(
        "Error de conexión",
        "No se pudo conectar con el servidor."
        );
    }
    };

  // =====================================================
  // VOLVER
  // =====================================================

  const volver = () => {
    Alert.alert(
      "¿Deseas regresar?",
      "Perderás la selección de asientos actual.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, regresar",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#dc2626"
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <View className="h-16 flex-row items-center bg-red-600 px-4">
        <Pressable
          onPress={volver}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons
            name="arrow-back"
            size={27}
            color="white"
          />
        </Pressable>

        <Text className="ml-2 flex-1 text-lg font-black text-white">
          Selecciona tus asientos
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 150 + insets.bottom,
        }}
      >
        {/* =================================================
            INFORMACIÓN DE LA FUNCIÓN
        ================================================= */}

        <View className="bg-gray-900 px-5 py-5">
          <Text
            numberOfLines={2}
            className="text-xl font-black text-white"
          >
            {titulo}
          </Text>

          <View className="mt-4 flex-row flex-wrap">
            <View className="mb-2 mr-2 flex-row items-center rounded-lg bg-white/10 px-3 py-2">
              <Ionicons
                name="film-outline"
                size={16}
                color="#f87171"
              />

              <Text className="ml-2 text-xs font-bold text-white">
                {tipoCine}
              </Text>
            </View>

            <View className="mb-2 mr-2 flex-row items-center rounded-lg bg-white/10 px-3 py-2">
              <Ionicons
                name="time-outline"
                size={16}
                color="#f87171"
              />

              <Text className="ml-2 text-xs font-bold text-white">
                {horario}
              </Text>
            </View>

            <View className="mb-2 flex-row items-center rounded-lg bg-white/10 px-3 py-2">
              <Ionicons
                name="location-outline"
                size={16}
                color="#f87171"
              />

              <Text className="ml-2 text-xs font-bold text-white">
                Sala {sala}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            INDICACIÓN
        ================================================= */}

        <View className="px-4 pt-6">
          <Text className="text-center text-2xl font-black text-gray-900">
            Elige tus butacas
          </Text>

          <Text className="mt-2 text-center text-sm text-gray-500">
            Selecciona los asientos que deseas reservar.
          </Text>

          {/* =================================================
              PANTALLA
          ================================================= */}

          <View className="mt-8 items-center">
            <View
              style={{
                width: "85%",
                height: 8,
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
              }}
              className="bg-red-600"
            />

            <View
              style={{
                width: "75%",
                height: 15,
              }}
              className="bg-red-100"
            />

            <Text className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              Pantalla
            </Text>
          </View>

          {/* =================================================
              ASIENTOS
          ================================================= */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
          >
            <View className="mt-8">
              {filas.map((fila) => (
                <View
                  key={fila.letra}
                  className="mb-3 flex-row items-center"
                >
                  {/* LETRA IZQUIERDA */}

                  <Text className="mr-3 w-5 text-center text-xs font-black text-gray-500">
                    {fila.letra}
                  </Text>

                  {/* ASIENTOS */}

                  {fila.asientos.map((codigo) => {
                    const estaOcupado =
                      ocupados.includes(codigo);

                    const estaSeleccionado =
                      seleccionados.includes(codigo);

                    return (
                      <Pressable
                        key={codigo}
                        disabled={estaOcupado}
                        onPress={() =>
                          toggleAsiento(codigo)
                        }
                        style={{
                          width: 39,
                          height: 39,
                        }}
                        className={`mx-1 items-center justify-center rounded-lg ${
                          estaOcupado
                            ? "bg-gray-300"
                            : estaSeleccionado
                              ? "bg-red-600"
                              : "border border-gray-300 bg-white"
                        }`}
                      >
                        {estaOcupado ? (
                          <Ionicons
                            name="close"
                            size={17}
                            color="#9ca3af"
                          />
                        ) : (
                          <Ionicons
                            name="person-outline"
                            size={16}
                            color={
                              estaSeleccionado
                                ? "white"
                                : "#374151"
                            }
                          />
                        )}

                        <Text
                          style={{
                            fontSize: 8,
                          }}
                          className={`font-black ${
                            estaSeleccionado
                              ? "text-white"
                              : estaOcupado
                                ? "text-gray-400"
                                : "text-gray-600"
                          }`}
                        >
                          {codigo}
                        </Text>
                      </Pressable>
                    );
                  })}

                  {/* LETRA DERECHA */}

                  <Text className="ml-3 w-5 text-center text-xs font-black text-gray-500">
                    {fila.letra}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* =================================================
              LEYENDA
          ================================================= */}

          <View className="mt-7 flex-row justify-center">
            <Leyenda
              tipo="disponible"
              texto="Disponible"
            />

            <Leyenda
              tipo="seleccionado"
              texto="Seleccionado"
            />

            <Leyenda
              tipo="ocupado"
              texto="Ocupado"
            />
          </View>

          {/* =================================================
              RESUMEN
          ================================================= */}

          <View className="mt-8 rounded-2xl bg-white p-5 shadow">
            <Text className="text-lg font-black text-gray-900">
              Resumen
            </Text>

            <View className="mt-4 flex-row justify-between">
              <Text className="text-sm text-gray-500">
                Entradas
              </Text>

              <Text className="font-black text-gray-900">
                {seleccionados.length}
              </Text>
            </View>

            <View className="mt-3 flex-row justify-between">
              <Text className="text-sm text-gray-500">
                Precio por entrada
              </Text>

              <Text className="font-black text-gray-900">
                S/ {PRECIO_ENTRADA.toFixed(2)}
              </Text>
            </View>

            <View className="mt-3 flex-row items-start justify-between">
              <Text className="text-sm text-gray-500">
                Butacas
              </Text>

              <Text
                style={{
                  maxWidth: "65%",
                }}
                className="text-right font-black text-gray-900"
              >
                {seleccionados.length > 0
                  ? seleccionados.join(", ")
                  : "-"}
              </Text>
            </View>

            <View className="mt-4 border-t border-gray-200 pt-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-black text-gray-900">
                  Total
                </Text>

                <Text className="text-2xl font-black text-red-600">
                  S/ {total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* =================================================
          BARRA INFERIOR
      ================================================= */}

      <View
        style={{
            paddingBottom: Math.max(insets.bottom, 12),
        }}
        className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 pt-3"
        >
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-xs text-gray-500">
              Total a pagar
            </Text>

            <Text className="text-2xl font-black text-gray-900">
              S/ {total.toFixed(2)}
            </Text>
          </View>

          <Pressable
            disabled={seleccionados.length === 0}
            onPress={continuarCompra}
            className={`flex-row items-center rounded-xl px-7 py-4 ${
              seleccionados.length === 0
                ? "bg-gray-300"
                : "bg-red-600"
            }`}
          >
            <Text
              className={`font-black ${
                seleccionados.length === 0
                  ? "text-gray-500"
                  : "text-white"
              }`}
            >
              Continuar
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={
                seleccionados.length === 0
                  ? "#6b7280"
                  : "white"
              }
              style={{
                marginLeft: 8,
              }}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// =========================================================
// LEYENDA
// =========================================================

type LeyendaProps = {
  tipo: "disponible" | "seleccionado" | "ocupado";
  texto: string;
};

function Leyenda({ tipo, texto }: LeyendaProps) {
  let estilo = "border border-gray-300 bg-white";

  if (tipo === "seleccionado") {
    estilo = "bg-red-600";
  }

  if (tipo === "ocupado") {
    estilo = "bg-gray-300";
  }

  return (
    <View className="mx-2 items-center">
      <View
        className={`h-6 w-6 rounded-md ${estilo}`}
      />

      <Text className="mt-1 text-xs text-gray-500">
        {texto}
      </Text>
    </View>
  );
}