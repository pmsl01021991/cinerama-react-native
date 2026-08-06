import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StatusBar, Text, View,} from "react-native";
import { SafeAreaView, useSafeAreaInsets,} from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { API } from "../services/api";

type Cine = {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  referencia: string;
};

export default function Cines() {
  const insets = useSafeAreaInsets();
  // =====================================================
  // SABER SI VENIMOS DESDE CARTELERA
  // =====================================================

  const params = useLocalSearchParams<{
    pelicula?: string;
    origen?: string;
  }>();

  const peliculaSeleccionada = params.pelicula ?? "";
  const origen = params.origen ?? "";

  // Cine que actualmente está creando una reserva
  const [cineCargando, setCineCargando] =
    useState<number | null>(null);

  const cines: Cine[] = [
    {
      id: 1,
      nombre: "CINERAMA PACIFICO",
      ciudad: "LIMA",
      direccion:
        "AV JOSE PARDO 121 MIRAFLORES - LIMA - LIMA",
      referencia: "Miraflores",
    },
    {
      id: 2,
      nombre: "CINERAMA MINKA",
      ciudad: "CALLAO",
      direccion:
        "AV ARGENTINA 3093 CC MINKA 2DO NIVEL CALLAO",
      referencia: "Centro Comercial Minka",
    },
    {
      id: 3,
      nombre: "CINERAMA CHIMBOTE",
      ciudad: "CHIMBOTE",
      direccion:
        "AV. V. RAUL H. DE LA TORRE MEGA PLAZA CHIMBOTE",
      referencia: "Mega Plaza Chimbote",
    },
    {
      id: 4,
      nombre: "CINERAMA QUINDE",
      ciudad: "ICA",
      direccion:
        "AV LOS MAESTROS S/N CC EL QUINDE",
      referencia: "Centro Comercial El Quinde",
    },
    {
      id: 5,
      nombre: "CINERAMA TARAPOTO",
      ciudad: "TARAPOTO",
      direccion:
        "AV ALFONSO UGARTE 1360 TARAPOTO",
      referencia: "Tarapoto",
    },
    {
      id: 6,
      nombre: "CINERAMA CAJAMARCA",
      ciudad: "CAJAMARCA",
      direccion:
        "JR SOR MANUELA GIL 151 CC EL QUINDE CAJAMARCA",
      referencia: "Centro Comercial El Quinde",
    },
    {
      id: 7,
      nombre: "CINERAMA SOL",
      ciudad: "ICA",
      direccion:
        "AV SAN MARTIN 727 CC PLAZA DEL SOL ICA",
      referencia: "Centro Comercial Plaza del Sol",
    },
    {
      id: 8,
      nombre: "CINERAMA HUACHO",
      ciudad: "HUACHO",
      direccion:
        "COLON 601 CC PLAZA DEL SOL 2DO NIVEL",
      referencia: "Centro Comercial Plaza del Sol",
    },
    {
      id: 9,
      nombre: "CINERAMA MOYOBAMBA",
      ciudad: "MOYOBAMBA",
      direccion:
        "JR MANUEL DEL AGUILA 542 MOYOBAMBA",
      referencia: "Moyobamba",
    },
    {
      id: 10,
      nombre: "CINERAMA CUZCO",
      ciudad: "CUSCO",
      direccion:
        "CALLE CRUZ VERDE 347 CC IMPERIAL PLAZA CUSCO",
      referencia: "Centro Comercial Imperial Plaza",
    },
    {
      id: 11,
      nombre: "CINERAMA PIURA",
      ciudad: "PIURA",
      direccion:
        "AV GRAU 1460 CC. PLAZA DEL SOL",
      referencia: "Centro Comercial Plaza del Sol",
    },
  ];

  // ==========================================
  // SELECCIONAR CINE + CREAR RESERVA
  // ==========================================

  const seleccionarCine = async (cine: Cine) => {
    // Evita múltiples pulsaciones
    if (cineCargando !== null) {
      return;
    }

    setCineCargando(cine.id);

    try {
      // ======================================
      // CREAR RESERVA EN EL BACKEND
      // ======================================

      const response = await fetch(API.reservas, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          cine: cine.nombre,
        }),
      });

      const data = await response.json();

      // ======================================
      // VALIDAR RESPUESTA
      // ======================================

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "No se pudo crear la reserva"
        );
      }

      if (!data?.id) {
        throw new Error(
          "El servidor no devolvió el ID de la reserva"
        );
      }

      const reservaId = data.id.toString();

      console.log(
        "Reserva creada correctamente:",
        reservaId
      );

      if (
        origen === "cartelera" &&
        peliculaSeleccionada
      ) {

        router.push({
          pathname: "/info",

          params: {
            pelicula: peliculaSeleccionada,
            reservaId,
            cineId: cine.id.toString(),
            cine: cine.nombre,
          },
        });

        return;
      }

      router.push({
        pathname: "/cartelera",

        params: {
          reservaId,
          cineId: cine.id.toString(),
          cine: cine.nombre,
        },
      });
    } catch (error) {
      console.error(
        "Error creando reserva:",
        error
      );

      Alert.alert(
        "Error de conexión",
        "No se pudo iniciar la reserva. Verifica que el backend esté encendido y que el celular esté conectado a la misma red Wi-Fi que la computadora."
      );
    } finally {
      setCineCargando(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#e30613"
      />

      {/* =====================================
          HEADER
      ===================================== */}

      <View className="h-20 flex-row items-center bg-red-600 px-5">
        <Pressable
          onPress={() => router.replace("/")}
          className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/20"
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color="white"
          />
        </Pressable>

        <View className="flex-1">
          <Text className="text-2xl font-black text-white">
            CINERAMA
          </Text>

          <Text className="text-xs text-red-100">
            Nuestros cines
          </Text>
        </View>

        <Ionicons
          name="location-outline"
          size={28}
          color="white"
        />
      </View>

      {/* =====================================
          CONTENIDO
      ===================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 90 + insets.bottom,
        }}
      >
        {/* =====================================
            TÍTULO
        ===================================== */}

        <View className="px-5 pb-2 pt-6">
          <Text className="text-3xl font-black text-gray-900">
            Nuestros cines
          </Text>

          <Text className="mt-2 text-sm leading-5 text-gray-500">
            Selecciona el cine donde deseas disfrutar
            tu película.
          </Text>
        </View>

        {/* =====================================
            LISTA DE CINES
        ===================================== */}

        <View className="mt-4 px-4">
          {cines.map((cine) => {
            const cargando =
              cineCargando === cine.id;

            return (
              <Pressable
                key={cine.id}
                disabled={cineCargando !== null}
                onPress={() =>
                  seleccionarCine(cine)
                }
                className="mb-4 overflow-hidden rounded-2xl bg-white shadow"
              >
                <View className="p-5">
                  {/* PARTE SUPERIOR */}

                  <View className="flex-row items-center">
                    {/* ICONO */}

                    <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-red-600">
                      <Ionicons
                        name="location"
                        size={27}
                        color="white"
                      />
                    </View>

                    {/* NOMBRE */}

                    <View className="flex-1">
                      <Text className="text-lg font-black text-gray-900">
                        {cine.nombre}
                      </Text>

                      <Text className="mt-1 text-sm font-semibold text-red-600">
                        {cine.ciudad}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#9ca3af"
                    />
                  </View>

                  {/* SEPARADOR */}

                  <View className="my-4 h-px bg-gray-200" />

                  {/* DIRECCIÓN */}

                  <View className="flex-row items-start">
                    <Ionicons
                      name="navigate-outline"
                      size={19}
                      color="#6b7280"
                    />

                    <Text className="ml-2 flex-1 text-sm text-gray-600">
                      {cine.direccion}
                    </Text>
                  </View>

                  {/* REFERENCIA */}

                  <View className="mt-2 flex-row items-start">
                    <Ionicons
                      name="business-outline"
                      size={19}
                      color="#6b7280"
                    />

                    <Text className="ml-2 flex-1 text-sm text-gray-600">
                      {cine.referencia}
                    </Text>
                  </View>

                  {/* BOTÓN */}

                  <View
                    className={`mt-4 rounded-xl py-3 ${
                      cargando
                        ? "bg-red-400"
                        : "bg-red-600"
                    }`}
                  >
                    <View className="flex-row items-center justify-center">
                      {cargando ? (
                        <>
                          <ActivityIndicator
                            size="small"
                            color="white"
                          />

                          <Text className="ml-2 font-black text-white">
                            Iniciando reserva...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Ionicons
                            name="ticket-outline"
                            size={19}
                            color="white"
                          />

                          <Text className="ml-2 font-black text-white">
                            Seleccionar cine
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* =====================================
            INFORMACIÓN
        ===================================== */}

        <View className="mx-4 mb-6 mt-2 rounded-2xl bg-gray-900 p-5">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-red-600">
              <Ionicons
                name="information-circle-outline"
                size={27}
                color="white"
              />
            </View>

            <View className="flex-1">
              <Text className="text-lg font-black text-white">
                Elige tu cine
              </Text>

              <Text className="mt-1 text-sm leading-5 text-gray-300">
                Los horarios y funciones disponibles
                pueden variar según el cine seleccionado.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* =====================================
          NAVBAR REUTILIZABLE
      ===================================== */}

      <BottomNav />
    </SafeAreaView>
  );
}