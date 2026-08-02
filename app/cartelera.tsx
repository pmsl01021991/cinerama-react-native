import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, StatusBar, Text, View,} from "react-native";
import { SafeAreaView, useSafeAreaInsets,} from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";

type Pelicula = {
  id: number;
  titulo: string;
  poster: any;
  clasificacion: string;
  genero: string;
  duracion: string;
};

export default function Cartelera() {
  const insets = useSafeAreaInsets();

  // =====================================================
  // RECIBIR DATOS DEL CINE Y DE LA RESERVA
  // =====================================================

  const params = useLocalSearchParams<{
    reservaId?: string;
    cineId?: string;
    cine?: string;
  }>();

  const reservaId = params.reservaId ?? "";
  const cineId = params.cineId ?? "";
  const cine = params.cine ?? "";

  // =====================================================
  // PELÍCULAS EN CARTELERA
  // =====================================================

  const peliculas: Pelicula[] = [
    {
      id: 1,
      titulo: "EL AFINADOR",
      poster: require("../assets/images/el_afinador.jpg"),
      clasificacion: "14+",
      genero: "Drama",
      duracion: "1h 47min",
    },
    {
      id: 2,
      titulo: "SUPER GIRL",
      poster: require("../assets/images/super_girl.jpg"),
      clasificacion: "TE",
      genero: "Aventura",
      duracion: "1h 48min",
    },
    {
      id: 3,
      titulo: "TOY STORY",
      poster: require("../assets/images/toy_story.webp"),
      clasificacion: "TE",
      genero: "Animación",
      duracion: "1h 42min",
    },
    {
      id: 4,
      titulo: "EL DÍA DE LA REVELACIÓN",
      poster: require("../assets/images/el_dia_de_la_revelacion.webp"),
      clasificacion: "14+",
      genero: "Ciencia ficción",
      duracion: "2h 25min",
    },
  ];

  // =====================================================
  // ABRIR PELÍCULA
  // =====================================================

 const abrirPelicula = (id: number) => {
    // =====================================================
    // SI NO HAY CINE SELECCIONADO
    // =====================================================

    if (!cineId || !cine || !reservaId) {
      router.push({
        pathname: "/cines",

        params: {
          pelicula: id.toString(),
          origen: "cartelera",
        },
      });

      return;
    }

    // =====================================================
    // SI YA HAY CINE SELECCIONADO
    // =====================================================

    router.push({
      pathname: "/info",

      params: {
        pelicula: id.toString(),
        reservaId,
        cineId,
        cine,
      },
    });
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
            CARTELERA
          </Text>

          <Text className="text-xs text-red-100">
            Películas disponibles
          </Text>
        </View>

        <Ionicons
          name="film-outline"
          size={28}
          color="white"
        />
      </View>

      {/* =====================================
          CINE SELECCIONADO
      ===================================== */}

      {cine !== "" && (
        <View className="flex-row items-center bg-gray-900 px-5 py-3">
          <Ionicons
            name="location"
            size={18}
            color="#f87171"
          />

          <View className="ml-2 flex-1">
            <Text className="text-xs text-gray-400">
              Cine seleccionado
            </Text>

            <Text
              numberOfLines={1}
              className="font-bold text-white"
            >
              {cine}
            </Text>
          </View>
        </View>
      )}

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

        <View className="px-4 pb-2 pt-6">
          <Text className="text-3xl font-black text-gray-900">
            En cartelera
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            Elige una película y revisa sus funciones disponibles.
          </Text>
        </View>

        {/* =====================================
            GRID DE PELÍCULAS
        ===================================== */}

        <View className="mt-5 flex-row flex-wrap justify-between px-4">
          {peliculas.map((pelicula) => (
            <Pressable
              key={pelicula.id}
              onPress={() => abrirPelicula(pelicula.id)}
              style={{
                width: "48%",
              }}
              className="mb-6"
            >
              <View className="overflow-hidden rounded-2xl bg-white shadow">

                {/* IMAGEN */}

                <View>
                  <Image
                    source={pelicula.poster}
                    style={{
                      width: "100%",
                      height: 250,
                    }}
                    resizeMode="cover"
                  />

                  {/* CLASIFICACIÓN */}

                  <View className="absolute left-2 top-2 rounded-lg bg-red-600 px-2 py-1">
                    <Text className="text-xs font-black text-white">
                      {pelicula.clasificacion}
                    </Text>
                  </View>
                </View>

                {/* INFORMACIÓN */}

                <View className="p-3">
                  <Text
                    numberOfLines={2}
                    className="text-base font-black text-gray-900"
                  >
                    {pelicula.titulo}
                  </Text>

                  {/* GÉNERO */}

                  <View className="mt-2 flex-row items-center">
                    <Ionicons
                      name="videocam-outline"
                      size={15}
                      color="#6b7280"
                    />

                    <Text
                      numberOfLines={1}
                      className="ml-1 flex-1 text-xs text-gray-500"
                    >
                      {pelicula.genero}
                    </Text>
                  </View>

                  {/* DURACIÓN */}

                  <View className="mt-1 flex-row items-center">
                    <Ionicons
                      name="time-outline"
                      size={15}
                      color="#6b7280"
                    />

                    <Text className="ml-1 text-xs text-gray-500">
                      {pelicula.duracion}
                    </Text>
                  </View>

                  {/* VER FUNCIONES */}

                  <View className="mt-3 flex-row items-center">
                    <Ionicons
                      name="ticket-outline"
                      size={17}
                      color="#dc2626"
                    />

                    <Text className="ml-1 text-sm font-bold text-red-600">
                      Ver funciones
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* =====================================
          NAVBAR REUTILIZABLE
      ===================================== */}

      <BottomNav />
    </SafeAreaView>
  );
}