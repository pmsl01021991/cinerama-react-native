import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StatusBar, Text, View, RefreshControl,} from "react-native";
import { SafeAreaView, useSafeAreaInsets,} from "react-native-safe-area-context";
import AdminMensajes from "../components/admin/AdminMensajes";
import AdminReservas from "../components/admin/AdminReservas";
import BottomNav from "../components/BottomNav";
import { obtenerSesion } from "../services/sessionService";
import { useRefresh } from "../hooks/useRefresh";

type Seccion = "reservas" | "mensajes";

export default function Admin() {
  const insets = useSafeAreaInsets();

  const [seccion, setSeccion] =
    useState<Seccion>("reservas");

  const [verificando, setVerificando] =
    useState(true);

  const [autorizado, setAutorizado] =
    useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

    const { refreshing, onRefresh } = useRefresh(
    async () => {
        setRefreshKey((valor) => valor + 1);

        await new Promise((resolve) =>
        setTimeout(resolve, 500)
        );
    }
    );

  useEffect(() => {
    const verificarAdmin = async () => {
      const sesion = await obtenerSesion();

      if (sesion?.rol !== "ADMIN") {
        setAutorizado(false);
        setVerificando(false);

        router.replace("/");
        return;
      }

      setAutorizado(true);
      setVerificando(false);
    };

    verificarAdmin();
  }, []);

  if (verificando) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator
          size="large"
          color="#dc2626"
        />

        <Text className="mt-3 text-gray-500">
          Verificando acceso...
        </Text>
      </SafeAreaView>
    );
  }

  if (!autorizado) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#dc2626"
      />

      <View className="h-20 flex-row items-center bg-red-600 px-5">
        <Pressable
          onPress={() => router.replace("/")}
          className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/20"
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color="white"
          />
        </Pressable>

        <View className="flex-1">
          <Text className="text-xl font-black text-white">
            PANEL ADMIN
          </Text>

          <Text className="text-xs text-red-100">
            Administración Cinerama
          </Text>
        </View>

        <Ionicons
          name="shield-checkmark"
          size={28}
          color="white"
        />
      </View>

      <View className="bg-gray-900 px-4 py-5">
        <Text className="text-2xl font-black text-white">
          Panel de Administración
        </Text>

        <Text className="mt-1 text-sm text-gray-300">
          Gestiona reservaciones y mensajes.
        </Text>

        <View className="mt-5 flex-row rounded-xl bg-gray-800 p-1">
          <Pressable
            onPress={() => setSeccion("reservas")}
            className={`flex-1 flex-row items-center justify-center rounded-lg py-3 ${
              seccion === "reservas"
                ? "bg-red-600"
                : "bg-transparent"
            }`}
          >
            <Ionicons
              name="ticket-outline"
              size={18}
              color="white"
            />

            <Text className="ml-2 font-bold text-white">
              Reservaciones
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSeccion("mensajes")}
            className={`flex-1 flex-row items-center justify-center rounded-lg py-3 ${
              seccion === "mensajes"
                ? "bg-red-600"
                : "bg-transparent"
            }`}
          >
            <Ionicons
              name="mail-outline"
              size={18}
              color="white"
            />

            <Text className="ml-2 font-bold text-white">
              Mensajes
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            />
        }
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100 + insets.bottom,
        }}
      >
        {seccion === "reservas" ? (
        <AdminReservas refreshKey={refreshKey} />
        ) : (
        <AdminMensajes refreshKey={refreshKey} />
        )}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}