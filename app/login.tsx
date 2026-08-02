import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, View,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginForm from "../components/LoginForm";
import { loginUsuario } from "../services/authService";
import { guardarSesion } from "../services/sessionService";

export default function Login() {
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async (
    usuario: string,
    password: string,
    captcha: string
  ) => {
    setCargando(true);

    try {
      const data = await loginUsuario(
        usuario,
        password,
        captcha
      );

      console.log("LOGIN CORRECTO:", data.usuario);
      await guardarSesion(data.usuario);

      Alert.alert(
        "Bienvenido",
        `Hola ${data.usuario.nombre}`,
        [
          {
            text: "Continuar",
            onPress: () => router.replace("/"),
          },
        ]
      );
    } catch (error) {
      console.error("Error login:", error);

      Alert.alert(
        "Inicio de sesión",
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#dc2626"
      />

      <View className="h-16 flex-row items-center bg-red-600 px-4">
        <Pressable
          onPress={() => router.replace("/")}
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
            Iniciar sesión
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View className="bg-gray-900 px-6 pb-16 pt-10">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-red-600">
              <Ionicons
                name="person-outline"
                size={32}
                color="white"
              />
            </View>

            <Text className="mt-5 text-3xl font-black text-white">
              Bienvenido
            </Text>

            <Text className="mt-2 text-sm leading-6 text-gray-300">
              Inicia sesión para acceder a tu cuenta y
              gestionar tus reservas.
            </Text>
          </View>

          <View className="-mt-8 px-4">
            <LoginForm
              onLogin={iniciarSesion}
              cargando={cargando}
            />
          </View>

          <View className="mx-4 mt-6">
            <View className="flex-row items-center">
              <View className="h-px flex-1 bg-gray-300" />

              <Text className="mx-3 text-xs text-gray-400">
                ¿No tienes una cuenta?
              </Text>

              <View className="h-px flex-1 bg-gray-300" />
            </View>

            <Pressable
              onPress={() => router.push("/registro")}
              className="mt-5 rounded-xl border-2 border-red-600 py-4"
            >
              <Text className="text-center font-black text-red-600">
                Crear una cuenta
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.replace("/")}
            className="mb-8 mt-7 items-center py-3"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="arrow-back-outline"
                size={17}
                color="#6b7280"
              />

              <Text className="ml-2 font-bold text-gray-500">
                Continuar sin iniciar sesión
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}