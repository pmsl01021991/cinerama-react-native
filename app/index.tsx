import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useCallback, } from "react";
import {Dimensions, Image, Pressable, ScrollView, StatusBar, Text, View,} from "react-native";
import { SafeAreaView, useSafeAreaInsets, } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { useFocusEffect } from "@react-navigation/native";
import { cerrarSesion, obtenerSesion, UsuarioSesion,} from "../services/sessionService";

const { width } = Dimensions.get("window");

type Pelicula = {
  id: number;
  titulo: string;
  poster: any;
  clasificacion: string;
};

export default function Inicio() {

  const insets = useSafeAreaInsets();

  const [categoria, setCategoria] = useState<"cartelera" | "estrenos">(
    "cartelera"
  );

  const [usuarioSesion, setUsuarioSesion] =
    useState<UsuarioSesion | null>(null);

    useFocusEffect(
      useCallback(() => {
        const cargarSesion = async () => {
          const usuario = await obtenerSesion();
          setUsuarioSesion(usuario);
        };

        cargarSesion();
      }, [])
    );

    const salir = async () => {
      await cerrarSesion();
      setUsuarioSesion(null);
    };

  const peliculasCartelera: Pelicula[] = [
    {
      id: 1,
      titulo: "EL AFINADOR",
      poster: require("../assets/images/el_afinador.jpg"),
      clasificacion: "14+",
    },
    {
      id: 2,
      titulo: "SUPER GIRL",
      poster: require("../assets/images/super_girl.jpg"),
      clasificacion: "TE",
    },
    {
      id: 3,
      titulo: "TOY STORY",
      poster: require("../assets/images/toy_story.webp"),
      clasificacion: "TE",
    },
    {
      id: 4,
      titulo: "EL DÍA DE LA REVELACIÓN",
      poster: require("../assets/images/el_dia_de_la_revelacion.webp"),
      clasificacion: "14+",
    },
  ];

  const peliculasEstreno: Pelicula[] = [
    {
      id: 5,
      titulo: "EL VIAJE DE CHIHIRO",
      poster: require("../assets/images/estrenos/chihiro.png"),
      clasificacion: "TE",
    },
    {
      id: 6,
      titulo: "STANS",
      poster: require("../assets/images/estrenos/stans.png"),
      clasificacion: "18+",
    },
    {
      id: 7,
      titulo: "LIVE VIEWING",
      poster: require("../assets/images/estrenos/live.png"),
      clasificacion: "14+",
    },
    {
      id: 8,
      titulo: "MIRACULOUS",
      poster: require("../assets/images/estrenos/miraculo.png"),
      clasificacion: "TE",
    },
  ];

  const peliculas =
    categoria === "cartelera" ? peliculasCartelera : peliculasEstreno;

  const abrirPelicula = (id: number) => {
    if (categoria === "cartelera") {
      router.push({
        pathname: "/info",
        params: {
          pelicula: id.toString(),
        },
      });
    } else {
      router.push({
        pathname: "/info-estreno",
        params: {
          pelicula: id.toString(),
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#e30613" />

      {/* ================= HEADER ================= */}

      <View className="h-20 flex-row items-center justify-between bg-red-600 px-5">
        <View>
          <Text className="text-2xl font-black tracking-wider text-white">
            CINERAMA
          </Text>

          <Text className="text-xs text-red-100">
            Vive la experiencia
          </Text>
        </View>

        {usuarioSesion ? (
          <View className="items-end">
            <Text className="mb-1 text-xs font-bold text-white">
              Bienvenido,{" "}
              {usuarioSesion.rol === "ADMIN"
                ? "Admin"
                : usuarioSesion.nombre}
            </Text>

            <Pressable
              onPress={salir}
              className="flex-row items-center rounded-full bg-white/20 px-3 py-2"
            >
              <Ionicons
                name="log-out-outline"
                size={21}
                color="white"
              />

              <Text className="ml-1 font-bold text-white">
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => router.push("/login")}
            className="flex-row items-center rounded-full bg-white/20 px-4 py-2"
          >
            <Ionicons
              name="person-circle-outline"
              size={25}
              color="white"
            />

            <Text className="ml-2 font-bold text-white">
              Iniciar sesión
            </Text>
          </Pressable>
        )}
      </View>

      {/* ================= CONTENIDO ================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 90 + insets.bottom,
        }}
      >
        {/* ================= BANNER ================= */}

        <View className="bg-black">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200",
            }}
            style={{
              width: "100%",
              height: width * 0.62,
            }}
            resizeMode="cover"
          />

          {/* Texto encima del banner */}

          <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-5">
            <Text className="text-xs font-bold uppercase tracking-widest text-red-400">
              Cinerama
            </Text>

            <Text className="mt-1 text-3xl font-black text-white">
              Vive el cine
            </Text>

            <Text className="mt-1 text-sm text-gray-200">
              Disfruta los mejores estrenos en nuestras salas.
            </Text>
          </View>
        </View>

        {/* ================= PELÍCULAS ================= */}

        <View className="px-4 pt-6">
          <Text className="text-3xl font-black text-gray-900">
            Películas
          </Text>

          {/* PESTAÑAS */}

          <View className="mt-4 flex-row rounded-2xl bg-white p-1 shadow">
            <Pressable
              onPress={() => setCategoria("cartelera")}
              className={`flex-1 rounded-xl py-3 ${
                categoria === "cartelera" ? "bg-gray-900" : "bg-white"
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  categoria === "cartelera"
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                En cartelera
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setCategoria("estrenos")}
              className={`flex-1 rounded-xl py-3 ${
                categoria === "estrenos" ? "bg-gray-900" : "bg-white"
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  categoria === "estrenos"
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                Estrenos
              </Text>
            </Pressable>
          </View>

          {/* ================= GRID ================= */}

          <View className="mt-6 flex-row flex-wrap justify-between">
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
                  <View>
                    <Image
                      source={pelicula.poster}
                      style={{
                        width: "100%",
                        height: 240,
                      }}
                      resizeMode="cover"
                    />

                    {/* Clasificación */}

                    <View className="absolute left-2 top-2 rounded-lg bg-red-600 px-2 py-1">
                      <Text className="text-xs font-black text-white">
                        {pelicula.clasificacion}
                      </Text>
                    </View>
                  </View>

                  <View className="p-3">
                    <Text
                      numberOfLines={2}
                      className="text-base font-black text-gray-900"
                    >
                      {pelicula.titulo}
                    </Text>

                    <View className="mt-2 flex-row items-center">
                      <Ionicons
                        name="ticket-outline"
                        size={16}
                        color="#dc2626"
                      />

                      <Text className="ml-1 text-xs font-bold text-red-600">
                        Ver funciones
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ================= CINES ================= */}

        <View className="mx-4 mb-5 rounded-2xl bg-gray-900 p-5">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-red-600">
              <Ionicons name="location" size={25} color="white" />
            </View>

            <View className="flex-1">
              <Text className="text-lg font-black text-white">
                Encuentra tu Cinerama
              </Text>

              <Text className="mt-1 text-sm text-gray-300">
                Selecciona el cine donde deseas disfrutar tu película.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/cines")}
            className="mt-4 rounded-xl bg-red-600 py-3"
          >
            <Text className="text-center font-black text-white">
              Ver cines
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* ================= NAVBAR INFERIOR ================= */}

      <BottomNav />
    </SafeAreaView>
  );
}