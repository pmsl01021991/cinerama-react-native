import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View,} from "react-native";
import CaptchaModal from "./CaptchaModal";

type Props = {
  onLogin: (
    usuario: string,
    password: string,
    captcha: string
  ) => Promise<void>;
  cargando: boolean;
};

export default function LoginForm({
  onLogin,
  cargando,
}: Props) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] =
    useState(false);
  const [captchaVisible, setCaptchaVisible] =
    useState(false);

  const iniciar = async () => {
    if (!usuario.trim()) {
      Alert.alert(
        "Usuario requerido",
        "Ingresa tu correo o usuario."
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Contraseña requerida",
        "Ingresa tu contraseña."
      );
      return;
    }

    setCaptchaVisible(true);
  };

  const captchaVerificado = async (token: string) => {
    setCaptchaVisible(false);

    await onLogin(
        usuario.trim(),
        password,
        token
    );
    };

  return (
    <View className="rounded-3xl bg-white p-6 shadow">
      <Text className="text-2xl font-black text-gray-900">
        Iniciar sesión
      </Text>

      <Text className="mt-1 text-sm text-gray-500">
        Ingresa tus datos para continuar
      </Text>

      <Text className="mb-2 mt-6 font-bold text-gray-700">
        Correo o usuario
      </Text>

      <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4">
        <Ionicons
          name="person-outline"
          size={21}
          color="#6b7280"
        />

        <TextInput
          value={usuario}
          onChangeText={setUsuario}
          placeholder="Correo o usuario"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
          className="ml-3 flex-1 py-4 text-gray-900"
        />
      </View>

      <Text className="mb-2 mt-5 font-bold text-gray-700">
        Contraseña
      </Text>

      <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4">
        <Ionicons
          name="lock-closed-outline"
          size={21}
          color="#6b7280"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#9ca3af"
          secureTextEntry={!mostrarPassword}
          autoCapitalize="none"
          className="ml-3 flex-1 py-4 text-gray-900"
        />

        <Pressable
          onPress={() =>
            setMostrarPassword(!mostrarPassword)
          }
          className="p-2"
        >
          <Ionicons
            name={
              mostrarPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={22}
            color="#6b7280"
          />
        </Pressable>
      </View>

      <Pressable
        onPress={() =>
          Alert.alert(
            "Recuperar contraseña",
            "Esta función la conectaremos posteriormente."
          )
        }
        className="mt-4 self-end"
      >
        <Text className="font-bold text-red-600">
          ¿Olvidaste tu contraseña?
        </Text>
      </Pressable>

      <Pressable
        disabled={cargando}
        onPress={iniciar}
        className={`mt-7 flex-row items-center justify-center rounded-xl py-4 ${
          cargando ? "bg-red-400" : "bg-red-600"
        }`}
      >
        <Ionicons
          name={
            cargando
              ? "hourglass-outline"
              : "log-in-outline"
          }
          size={21}
          color="white"
        />

        <Text className="ml-2 text-base font-black text-white">
          {cargando
            ? "Ingresando..."
            : "Iniciar sesión"}
        </Text>
      </Pressable>

      <CaptchaModal
        visible={captchaVisible}
        onClose={() => setCaptchaVisible(false)}
        onVerify={captchaVerificado}
        />
    </View>
  );
}