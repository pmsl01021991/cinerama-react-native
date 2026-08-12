import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Modal, Pressable, ScrollView, StatusBar, Text, View, Alert,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, } from "react";
import { API_URL } from "../services/api";
import { VideoView, useVideoPlayer } from "expo-video";

type PeliculaInfo = {
  id: number;
  codigo: string;
  titulo: string;
  director: string;
  duracion: string;
  estreno: string;
  reparto: string;
  sinopsis: string;
  poster: any;
  trailer: any;
  clasificacion: string;
  genero: string;
  sala: string;
  horarios2D: string[];
  horarios3D: string[];
};

type Funcion = {
  id: number;
  cine: string;
  pelicula_codigo: string;
  pelicula_titulo: string;
  tipo_cine: "2D" | "3D";
  sala: string;
  fecha: string;
  hora: string;
  precio: string;
};

export default function Info() {
  const params = useLocalSearchParams<{
    pelicula?: string;
    cineId?: string;
    cine?: string;
    }>();

    const peliculaId = Number(params.pelicula);
    const cineId = params.cineId ?? "";
    const cine = params.cine ?? "";

  const [modalVisible, setModalVisible] = useState(false);
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [cargandoFunciones, setCargandoFunciones] = useState(true);

  const peliculas: PeliculaInfo[] = [
    {
      id: 1,
      codigo: "elAfinador",
      titulo: "EL AFINADOR",
      director: "DANIEL ROHER",
      duracion: "1h 47min",
      estreno: "25 de junio de 2026",
      reparto:
        "Leo Woodall, Dustin Hoffman, Alisen Richmond-Peck",
      sinopsis:
        "Harry Horowitz es un veterano afinador de pianos que trabaja junto a Niki, su leal y talentoso aprendiz, quien padece hiperacusia. Cuando el joven descubre una inesperada habilidad para abrir cajas fuertes, termina involucrado en un peligroso mundo criminal que cambiará su vida por completo.",
      poster: require("../assets/images/el_afinador.jpg"),
      trailer: require("../assets/videos/el_afinador.mp4"),
      clasificacion: "14+",
      genero: "Drama",
      sala: "01",
      horarios2D: ["4:00 PM", "7:00 PM"],
      horarios3D: ["9:30 PM"],
    },

    {
      id: 2,
      codigo: "superGirl",
      titulo: "SUPER GIRL",
      director: "CRAIG GILLESPIE",
      duracion: "1h 48min",
      estreno: "24 de junio de 2026",
      reparto:
        "Milly Alcock, David Corenswet, Eve Ridley",
      sinopsis:
        "Kara, la prima de Superman, se ha ido haciendo más fuerte con el paso de los años. Mientras viaja por diferentes lugares conoce a Ruthye, una joven que busca venganza por el asesinato de su padre.",
      poster: require("../assets/images/super_girl.jpg"),
      trailer: require("../assets/videos/super_girl.mp4"),
      clasificacion: "14+",
      genero: "Aventura",
      sala: "02",
      horarios2D: ["3:30 PM", "6:30 PM"],
      horarios3D: ["9:00 PM"],
    },

    {
      id: 3,
      codigo: "toyStory",
      titulo: "TOY STORY",
      director: "MCKENNA HARRIS, ANDREW STANTON",
      duracion: "1h 42min",
      estreno: "17 de junio de 2026",
      reparto:
        "Tom Hanks, Keanu Reeves, Joan Cusack",
      sinopsis:
        "Los juguetes están de vuelta. Buzz Lightyear, Woody, Jessie y el resto de la pandilla se enfrentan a un nuevo reto cuando conocen a Lilypad, una nueva tablet que llega con sus propias ideas sobre lo que es mejor para Bonnie.",
      poster: require("../assets/images/toy_story.webp"),
      trailer: require("../assets/videos/toy_story.mp4"),
      clasificacion: "APT",
      genero: "Animación",
      sala: "03",
      horarios2D: ["2:00 PM", "5:00 PM"],
      horarios3D: ["8:00 PM"],
    },

    {
      id: 4,
      codigo: "diaRevelacion",
      titulo: "EL DÍA DE LA REVELACIÓN",
      director: "STEVEN SPIELBERG",
      duracion: "2h 25min",
      estreno: "10 de junio de 2026",
      reparto:
        "Emily Blunt, Josh O'Connor, Colin Firth",
      sinopsis:
        "En un futuro no muy lejano, la humanidad está a punto de descubrir la verdad sobre la existencia de extraterrestres, un secreto que ha permanecido oculto durante décadas.",
      poster: require("../assets/images/el_dia_de_la_revelacion.webp"),
      trailer: require("../assets/videos/el_dia_de_la_revelacion.mp4"),
      clasificacion: "14+",
      genero: "Ciencia ficción",
      sala: "04",
      horarios2D: ["4:30 PM", "7:30 PM"],
      horarios3D: ["10:00 PM"],
    },
  ];

  const pelicula = peliculas.find((p) => p.id === peliculaId);
    const player = useVideoPlayer(
      pelicula?.trailer ?? null,
      (player) => {
        player.loop = false;
      }
    );

    useEffect(() => {
      if (modalVisible && pelicula?.trailer) {
        player.currentTime = 0;
        player.play();
      } else {
        player.pause();
      }
    }, [modalVisible]);

    useEffect(() => {
      const cargarFunciones = async () => {
        if (!cine || !pelicula?.codigo) {
          setFunciones([]);
          setCargandoFunciones(false);
          return;
        }

        try {
          setCargandoFunciones(true);

          const response = await fetch(
            `${API_URL}/api/reservas/funciones?cine=${encodeURIComponent(cine)}`
          );

          if (!response.ok) {
            throw new Error(
              `Error cargando funciones: ${response.status}`
            );
          }

          const data = await response.json();

          const funcionesPelicula = Array.isArray(data)
            ? data.filter(
                (funcion: Funcion) =>
                  funcion.pelicula_codigo === pelicula.codigo
              )
            : [];

          setFunciones(funcionesPelicula);

        } catch (error) {
          console.error("Error cargando funciones:", error);
          setFunciones([]);
        } finally {
          setCargandoFunciones(false);
        }
      };

      cargarFunciones();
    }, [cine, pelicula?.codigo]);

  if (!pelicula) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-100 px-6">
        <Ionicons
          name="alert-circle-outline"
          size={70}
          color="#dc2626"
        />

        <Text className="mt-4 text-center text-2xl font-black text-gray-900">
          Película no encontrada
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-6 rounded-xl bg-red-600 px-6 py-3"
        >
          <Text className="font-bold text-white">
            Regresar
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

const seleccionarFuncion = (funcion: Funcion) => {
  router.push({
    pathname: "/asientos",

    params: {
      cineId,
      cine,

      peliculaId: pelicula.id.toString(),
      peliculaCodigo: pelicula.codigo,
      titulo: pelicula.titulo,

      funcionId: funcion.id.toString(),
      sala: funcion.sala,
      horario: funcion.hora,
      tipoCine: funcion.tipo_cine,
      precio: funcion.precio,
    },
  });
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
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons
            name="arrow-back"
            size={27}
            color="white"
          />
        </Pressable>

        <Text
          numberOfLines={1}
          className="ml-2 flex-1 text-lg font-black text-white"
        >
          Información
        </Text>

        <Pressable
          onPress={() => router.push("/login")}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons
            name="person-circle-outline"
            size={29}
            color="white"
          />
        </Pressable>
      </View>

      {/* =================================================
          CONTENIDO
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* POSTER */}

        <View className="bg-black">
          <Image
            source={pelicula.poster}
            style={{
              width: "100%",
              height: 430,
            }}
            resizeMode="contain"
          />
        </View>

        {/* =================================================
            INFORMACIÓN PRINCIPAL
        ================================================= */}

        <View className="px-5 pt-5">
          <Text className="text-3xl font-black text-gray-900">
            {pelicula.titulo}
          </Text>

          {/* ETIQUETAS */}

          <View className="mt-3 flex-row flex-wrap">
            <View className="mr-2 rounded-lg bg-red-600 px-3 py-1">
              <Text className="text-xs font-black text-white">
                {pelicula.clasificacion}
              </Text>
            </View>

            <View className="mr-2 rounded-lg bg-gray-900 px-3 py-1">
              <Text className="text-xs font-bold text-white">
                {pelicula.genero}
              </Text>
            </View>

            <View className="rounded-lg bg-gray-200 px-3 py-1">
              <Text className="text-xs font-bold text-gray-700">
                {pelicula.duracion}
              </Text>
            </View>
          </View>

          {/* TRAILER */}

          <Pressable
            onPress={() => setModalVisible(true)}
            className="mt-5 flex-row items-center justify-center rounded-xl bg-red-600 py-3"
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

          {/* =================================================
              DATOS
          ================================================= */}

          <View className="mt-6 rounded-2xl bg-white p-5 shadow">
            <InfoRow
              icon="person-outline"
              titulo="Director"
              valor={pelicula.director}
            />

            <InfoRow
              icon="time-outline"
              titulo="Duración"
              valor={pelicula.duracion}
            />

            <InfoRow
              icon="calendar-outline"
              titulo="Estreno"
              valor={pelicula.estreno}
            />

            <InfoRow
              icon="people-outline"
              titulo="Reparto"
              valor={pelicula.reparto}
              ultimo
            />
          </View>

          {/* =================================================
              SINOPSIS
          ================================================= */}

          <View className="mt-6">
            <Text className="text-xl font-black text-gray-900">
              Sinopsis
            </Text>

            <Text className="mt-3 text-base leading-6 text-gray-600">
              {pelicula.sinopsis}
            </Text>
          </View>

          {/* =================================================
                FUNCIONES DESDE MYSQL
            ================================================= */}

            <View className="mt-8">
            <Text className="text-2xl font-black text-gray-900">
                Funciones
            </Text>

            <Text className="mt-1 text-sm text-gray-500">
                Selecciona el formato y horario de tu función.
            </Text>

            {/* CARGANDO */}

            {cargandoFunciones ? (
                <View className="mt-5 rounded-2xl bg-white p-5 shadow">
                <Text className="text-center font-bold text-gray-500">
                    Cargando funciones...
                </Text>
                </View>
            ) : funciones.length === 0 ? (
                /* SIN FUNCIONES */

                <View className="mt-5 rounded-2xl bg-white p-5 shadow">
                <Ionicons
                    name="calendar-outline"
                    size={35}
                    color="#9ca3af"
                    style={{ alignSelf: "center" }}
                />

                <Text className="mt-3 text-center font-black text-gray-700">
                    No hay funciones disponibles
                </Text>

                <Text className="mt-1 text-center text-sm text-gray-500">
                    No encontramos horarios disponibles para este cine.
                </Text>
                </View>
            ) : (
                /* FUNCIONES DISPONIBLES */

                funciones.map((funcion) => (
                <View
                    key={funcion.id}
                    className="mt-4 rounded-2xl bg-white p-4 shadow"
                >
                    <View className="flex-row items-center">
                    <View
                        className={`h-10 w-10 items-center justify-center rounded-full ${
                        funcion.tipo_cine === "2D"
                            ? "bg-red-100"
                            : "bg-gray-900"
                        }`}
                    >
                        <Ionicons
                        name={
                            funcion.tipo_cine === "2D"
                            ? "film-outline"
                            : "glasses-outline"
                        }
                        size={21}
                        color={
                            funcion.tipo_cine === "2D"
                            ? "#dc2626"
                            : "white"
                        }
                        />
                    </View>

                    <View className="ml-3 flex-1">
                        <Text className="text-lg font-black text-gray-900">
                        {funcion.tipo_cine}
                        </Text>

                        <Text className="text-xs text-gray-500">
                        Sala {funcion.sala}
                        </Text>
                    </View>

                    <Text className="font-black text-gray-900">
                        S/ {Number(funcion.precio).toFixed(2)}
                    </Text>
                    </View>

                    {/* HORARIO */}

                    <Pressable
                    onPress={() => seleccionarFuncion(funcion)}
                    className={`mt-4 self-start rounded-xl px-5 py-3 ${
                        funcion.tipo_cine === "2D"
                        ? "border border-red-600"
                        : "bg-gray-900"
                    }`}
                    >
                    <View className="flex-row items-center">
                        <Ionicons
                        name="time-outline"
                        size={18}
                        color={
                            funcion.tipo_cine === "2D"
                            ? "#dc2626"
                            : "white"
                        }
                        />

                        <Text
                        className={`ml-2 font-black ${
                            funcion.tipo_cine === "2D"
                            ? "text-red-600"
                            : "text-white"
                        }`}
                        >
                        {funcion.hora}
                        </Text>
                    </View>
                    </Pressable>
                </View>
                ))
            )}
            </View>
        </View>
      </ScrollView>

      {/* =================================================
          MODAL TRAILER
      ================================================= */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/90 px-5">
          <View className="w-full rounded-2xl bg-gray-900 p-5">

            {/* TÍTULO Y CERRAR */}
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-xl font-black text-white">
                {pelicula.titulo}
              </Text>

              <Pressable
                onPress={() => setModalVisible(false)}
                className="h-10 w-10 items-center justify-center"
              >
                <Ionicons
                  name="close"
                  size={30}
                  color="white"
                />
              </Pressable>
            </View>

            {/* REPRODUCTOR */}
            <View className="mt-4 overflow-hidden rounded-xl bg-black">
              {pelicula.trailer ? (
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
              ) : (
                <View
                  style={{ height: 230 }}
                  className="items-center justify-center"
                >
                  <Ionicons
                    name="videocam-off-outline"
                    size={55}
                    color="#9ca3af"
                  />

                  <Text className="mt-3 font-bold text-white">
                    Tráiler no disponible
                  </Text>
                </View>
              )}
            </View>

            {/* BOTÓN CERRAR */}
            <Pressable
              onPress={() => setModalVisible(false)}
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

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  titulo: string;
  valor: string;
  ultimo?: boolean;
};

function InfoRow({
  icon,
  titulo,
  valor,
  ultimo = false,
}: InfoRowProps) {
  return (
    <View
      className={`flex-row py-4 ${
        ultimo ? "" : "border-b border-gray-100"
      }`}
    >
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-red-50">
        <Ionicons
          name={icon}
          size={20}
          color="#dc2626"
        />
      </View>

      <View className="flex-1">
        <Text className="text-xs font-bold uppercase text-gray-400">
          {titulo}
        </Text>

        <Text className="mt-1 text-sm font-semibold leading-5 text-gray-800">
          {valor}
        </Text>
      </View>
    </View>
  );
}