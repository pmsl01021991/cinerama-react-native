import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {Image, Pressable, ScrollView, StatusBar, Text, View,} from "react-native";
import {SafeAreaView, useSafeAreaInsets,} from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";

type Pelicula = {
  id: number;
  titulo: string;
  poster: any;
  clasificacion: string;
  genero: string;
  duracion: string;
};

export default function Estrenos() {
  const insets = useSafeAreaInsets();

  // ===============================
  // PRÓXIMOS ESTRENOS
  // ===============================

  const peliculas: Pelicula[] = [
    {
      id: 5,
      titulo: "EL VIAJE DE CHIHIRO",
      poster: require("../assets/images/estrenos/chihiro.png"),
      clasificacion: "TE",
      genero: "Animación",
      duracion: "2h 05min",
    },
    {
      id: 6,
      titulo: "STANS",
      poster: require("../assets/images/estrenos/stans.png"),
      clasificacion: "18+",
      genero: "Documental",
      duracion: "1h 42min",
    },
    {
      id: 7,
      titulo: "LIVE VIEWING",
      poster: require("../assets/images/estrenos/live.png"),
      clasificacion: "14+",
      genero: "Concierto",
      duracion: "2h 45min",
    },
    {
      id: 8,
      titulo: "MIRACULOUS",
      poster: require("../assets/images/estrenos/miraculo.png"),
      clasificacion: "TE",
      genero: "Aventura",
      duracion: "1h 11min",
    },
  ];

  // ===============================
  // ABRIR INFORMACIÓN DEL ESTRENO
  // ===============================

  const abrirPelicula = (id: number) => {
    router.push({
      pathname: "/info-estreno",
      params: {
        pelicula: id.toString(),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#e30613"
      />

      {/* ================= HEADER ================= */}

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
            ESTRENOS
          </Text>

          <Text className="text-xs text-red-100">
            Próximamente en Cinerama
          </Text>
        </View>

        <Ionicons
          name="star-outline"
          size={28}
          color="white"
        />
      </View>

      {/* ================= CONTENIDO ================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 90 + insets.bottom,
        }}
      >
        {/* ================= PRESENTACIÓN ================= */}

        <View className="px-4 pb-2 pt-6">
          <Text className="text-3xl font-black text-gray-900">
            Próximos estrenos
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            Descubre las películas que muy pronto llegarán a nuestras salas.
          </Text>
        </View>

        {/* ================= GRID ================= */}

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

                  {/* ETIQUETA ESTRENO */}

                  <View className="absolute right-2 top-2 rounded-lg bg-gray-900 px-2 py-1">
                    <Text className="text-xs font-black text-white">
                      PRÓXIMO
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

                  {/* VER INFORMACIÓN */}

                  <View className="mt-3 flex-row items-center">
                    <Ionicons
                      name="information-circle-outline"
                      size={18}
                      color="#dc2626"
                    />

                    <Text className="ml-1 text-sm font-bold text-red-600">
                      Ver información
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* ================= AVISO ================= */}

        <View className="mx-4 mb-5 rounded-2xl bg-gray-900 p-5">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-red-600">
              <Ionicons
                name="calendar-outline"
                size={25}
                color="white"
              />
            </View>

            <View className="flex-1">
              <Text className="text-lg font-black text-white">
                Muy pronto
              </Text>

              <Text className="mt-1 text-sm text-gray-300">
                Las fechas y horarios pueden variar según el cine seleccionado.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ================= NAVBAR ================= */}

      <BottomNav />
    </SafeAreaView>
  );
}