import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, StatusBar, Text, View, Modal} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import { useState } from "react";

type PeliculaEstreno = {
  id: number;
  titulo: string;
  poster: any;
  trailer: any;
  director: string;
  duracion: string;
  estreno: string;
  reparto: string;
  sinopsis: string;
  categorias: string[];
};

const peliculasEstreno: PeliculaEstreno[] = [
  {
    id: 5,
    titulo: "RESIDENT EVIL",
    poster: require("../assets/images/estrenos/resident_evil.jpg"),
    trailer: require("../assets/videos/resident_evil.mp4"),
    director: "Zach Cregger",
    duracion: "01:30:00",
    estreno: "18/09/2026",
    reparto:
      "Austin Abrams, Zach Cherry, Kali Reis, Paul Walter Hauser",
    sinopsis:
      "Bryan, un mensajero médico, queda atrapado en una aterradora noche de caos y debe luchar por sobrevivir mientras todo a su alrededor se descontrola.",
    categorias: ["TERROR", "ACCIÓN", "14+"],
  },

  {
    id: 6,
    titulo: "STREET FIGHTER",
    poster: require("../assets/images/estrenos/street_fighter.jpg"),
    trailer: require("../assets/videos/street_fighter.mp4"),
    director: "Kitao Sakurai",
    duracion: "Por confirmar",
    estreno: "16/10/2026",
    reparto:
      "Andrew Koji, Noah Centineo, Callina Liang",
    sinopsis:
      "Ryu y Ken regresan al combate cuando Chun-Li los recluta para participar en el World Warrior Tournament, donde descubrirán una peligrosa conspiración.",
    categorias: ["ACCIÓN", "AVENTURA", "14+"],
  },

  {
    id: 7,
    titulo: "THE HUNGER GAMES: SUNRISE ON THE REAPING",
    poster: require("../assets/images/estrenos/hunger_games.jpg"),
    trailer: require("../assets/videos/hunger_games.mp4"),
    director: "Francis Lawrence",
    duracion: "Por confirmar",
    estreno: "20/11/2026",
    reparto:
      "Joseph Zada, Ralph Fiennes, Elle Fanning, Jesse Plemons",
    sinopsis:
      "La historia regresa a Panem 24 años antes de los acontecimientos de Los Juegos del Hambre y sigue el inicio de los 50.º Juegos del Hambre, conocidos como el Segundo Vasallaje de los Veinticinco.",
    categorias: ["ACCIÓN", "AVENTURA", "14+"],
  },

  {
    id: 8,
    titulo: "AVENGERS: DOOMSDAY",
    poster: require("../assets/images/estrenos/avengers_doomsday.jpg"),
    trailer: require("../assets/videos/avengers.mp4"),
    director: "Anthony Russo, Joe Russo",
    duracion: "Por confirmar",
    estreno: "18/12/2026",
    reparto:
      "Robert Downey Jr., Chris Evans, Chris Hemsworth, Pedro Pascal, Anthony Mackie, Vanessa Kirby",
    sinopsis:
      "Héroes provenientes de distintos universos se enfrentarán a una amenaza existencial que los llevará a una peligrosa colisión entre mundos.",
    categorias: ["ACCIÓN", "AVENTURA", "14+"],
  },
];

export default function InfoEstreno() {
  const [modalVisible, setModalVisible] = useState(false);
  const { pelicula } = useLocalSearchParams<{
    pelicula: string;
  }>();

  const peliculaSeleccionada = peliculasEstreno.find(
    (item) => item.id === Number(pelicula)
  );

  const player = useVideoPlayer(
    peliculaSeleccionada?.trailer ?? null,
    (player) => {
      player.loop = false;
    }
  );

  if (!peliculaSeleccionada) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <StatusBar
          barStyle="light-content"
          backgroundColor="#dc2626"
        />

        <View className="h-16 flex-row items-center bg-red-600 px-4">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="white"
            />
          </Pressable>

          <Text className="ml-3 text-xl font-black text-white">
            Estreno
          </Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="film-outline"
            size={60}
            color="#9ca3af"
          />

          <Text className="mt-4 text-xl font-black text-gray-900">
            Película no encontrada
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#dc2626"
      />

      {/* HEADER */}

      <View className="h-16 flex-row items-center bg-red-600 px-4">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-white/20"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
          />
        </Pressable>

        <View className="ml-3">
          <Text className="text-xl font-black tracking-wider text-white">
            CINERAMA
          </Text>

          <Text className="text-xs text-red-100">
            Próximo estreno
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        {/* POSTER */}

        <Image
          source={peliculaSeleccionada.poster}
          style={{
            width: "100%",
            height: 480,
          }}
          resizeMode="cover"
        />

        {/* INFORMACIÓN */}

        <View className="-mt-6 mx-4 rounded-3xl bg-white p-5 shadow">
          <Text className="text-2xl font-black text-gray-900">
            {peliculaSeleccionada.titulo}
          </Text>

          {/* CATEGORÍAS */}

          <View className="mt-4 flex-row flex-wrap">
            {peliculaSeleccionada.categorias.map(
              (categoria, index) => (
                <View
                  key={index}
                  className={`mb-2 mr-2 rounded-lg px-3 py-2 ${
                    index === 0
                      ? "bg-red-600"
                      : index === 1
                      ? "bg-blue-500"
                      : "bg-gray-600"
                  }`}
                >
                  <Text className="text-xs font-black text-white">
                    {categoria}
                  </Text>
                </View>
              )
            )}
          </View>

          {/* VER TRÁILER */}

            <Pressable
              onPress={() => {
                player.currentTime = 0;
                player.play();
                setModalVisible(true);
              }}
              className="mt-3 flex-row items-center justify-center rounded-xl bg-red-600 py-3"
            >
              <Ionicons
                name="play-circle-outline"
                size={23}
                color="white"
              />

              <Text className="ml-2 font-black text-white">
                Ver tráiler
              </Text>
            </Pressable>

          {/* DATOS */}

          <View className="mt-4">
            <Dato
              icono="videocam-outline"
              titulo="Director"
              valor={peliculaSeleccionada.director}
            />

            <Dato
              icono="time-outline"
              titulo="Duración"
              valor={peliculaSeleccionada.duracion}
            />

            <Dato
              icono="calendar-outline"
              titulo="Estreno"
              valor={peliculaSeleccionada.estreno}
            />

            <Dato
              icono="people-outline"
              titulo="Reparto"
              valor={peliculaSeleccionada.reparto}
            />
          </View>

          {/* SINOPSIS */}

          <View className="mt-6">
            <View className="flex-row items-center">
              <Ionicons
                name="book-outline"
                size={24}
                color="#dc2626"
              />

              <Text className="ml-2 text-xl font-black text-red-600">
                Sinopsis
              </Text>
            </View>

            <Text className="mt-3 text-sm leading-6 text-gray-700">
              {peliculaSeleccionada.sinopsis}
            </Text>
          </View>

          {/* AVISO */}

          <View className="mt-6 flex-row rounded-2xl bg-red-50 p-4">
            <Ionicons
              name="calendar-outline"
              size={22}
              color="#dc2626"
            />

            <View className="ml-3 flex-1">
              <Text className="font-black text-gray-900">
                Próximamente en Cinerama
              </Text>

              <Text className="mt-1 text-xs leading-5 text-gray-600">
                Las funciones y horarios estarán disponibles
                cuando la película ingrese a cartelera.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* MODAL TRÁILER */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          player.pause();
          setModalVisible(false);
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/90 px-5">

          <View className="w-full rounded-2xl bg-gray-900 p-5">

            {/* TÍTULO */}

            <View className="flex-row items-center justify-between">

              <Text className="flex-1 text-xl font-black text-white">
                {peliculaSeleccionada.titulo}
              </Text>

              <Pressable
                onPress={() => {
                  player.pause();
                  setModalVisible(false);
                }}
                className="h-10 w-10 items-center justify-center"
              >
                <Ionicons
                  name="close"
                  size={30}
                  color="white"
                />
              </Pressable>

            </View>

            {/* VIDEO */}

            <View className="mt-4 overflow-hidden rounded-xl bg-black">

              <VideoView
                player={player}
                style={{
                  width: "100%",
                  height: 230,
                }}
                nativeControls
                contentFit="contain"
                allowsFullscreen
              />

            </View>

            {/* CERRAR */}

            <Pressable
              onPress={() => {
                player.pause();
                setModalVisible(false);
              }}
              className="mt-5 rounded-xl bg-red-600 py-3"
            >
              <Text className="text-center font-black text-white">
                Cerrar
              </Text>
            </Pressable>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

type DatoProps = {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  valor: string;
};

function Dato({
  icono,
  titulo,
  valor,
}: DatoProps) {
  return (
    <View className="mb-3 flex-row items-start">
      <Ionicons
        name={icono}
        size={19}
        color="#6b7280"
      />

      <Text className="ml-2 font-black text-gray-900">
        {titulo}:
      </Text>

      <Text className="ml-1 flex-1 text-gray-600">
        {valor}
      </Text>
    </View>
  );
}