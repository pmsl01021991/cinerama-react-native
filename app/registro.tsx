import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, View,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API } from "../services/api";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] =
    useState("");

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] =
    useState(false);

  const [registrando, setRegistrando] =
    useState(false);

  // =====================================================
  // VALIDACIONES
  // =====================================================

  const correoValido = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const soloLetras = (texto: string) => {
    return /^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(texto);
  };

  // =====================================================
  // REGISTRAR
  // =====================================================

  const registrarUsuario = async () => {
    // CAMPOS VACÍOS

    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !correo.trim() ||
      !telefono.trim() ||
      !password.trim() ||
      !confirmarPassword.trim()
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor completa todos los campos."
      );

      return;
    }

    // NOMBRE

    if (!soloLetras(nombre.trim())) {
      Alert.alert(
        "Nombre inválido",
        "El nombre solo debe contener letras."
      );

      return;
    }

    // APELLIDOS

    if (!soloLetras(apellidos.trim())) {
      Alert.alert(
        "Apellidos inválidos",
        "Los apellidos solo deben contener letras."
      );

      return;
    }

    // CORREO

    if (!correoValido(correo.trim())) {
      Alert.alert(
        "Correo inválido",
        "Ingresa un correo electrónico válido."
      );

      return;
    }

    // TELÉFONO

    if (telefono.length !== 9) {
      Alert.alert(
        "Teléfono inválido",
        "El número de celular debe tener 9 dígitos."
      );

      return;
    }

    // CONTRASEÑA

    if (password.length < 6) {
      Alert.alert(
        "Contraseña muy corta",
        "La contraseña debe tener al menos 6 caracteres."
      );

      return;
    }

    // CONFIRMAR CONTRASEÑA

    if (password !== confirmarPassword) {
      Alert.alert(
        "Las contraseñas no coinciden",
        "Verifica que ambas contraseñas sean iguales."
      );

      return;
    }

    // =====================================================
    // REGISTRO
    // =====================================================

    setRegistrando(true);

    try {
      const response = await fetch(API.registro, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          correo: correo.trim().toLowerCase(),
          telefono: telefono.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          "Error",
          data.mensaje || "No se pudo crear la cuenta."
        );
        return;
      }

      Alert.alert(
        "Cuenta creada 🎉",
        "Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión.",
        [
          {
            text: "Iniciar sesión",
            onPress: () => router.replace("/login"),
          },
        ]
      );

      Alert.alert(
        "Cuenta creada 🎉",
        "Tu cuenta fue creada correctamente. Ahora puedes iniciar sesión.",
        [
          {
            text: "Iniciar sesión",

            onPress: () =>
              router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      console.error("Error registro:", error);

      Alert.alert(
        "Error",
        "No se pudo crear la cuenta."
      );
    } finally {
      setRegistrando(false);
    }
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
          onPress={() => router.replace("/login")}
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
            Crear cuenta
          </Text>
        </View>
      </View>

      {/* =================================================
          CONTENIDO
      ================================================= */}

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
            paddingBottom: 40,
          }}
        >
          {/* =================================================
              CABECERA
          ================================================= */}

          <View className="bg-gray-900 px-6 pb-16 pt-9">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-red-600">
              <Ionicons
                name="person-add-outline"
                size={31}
                color="white"
              />
            </View>

            <Text className="mt-5 text-3xl font-black text-white">
              Crea tu cuenta
            </Text>

            <Text className="mt-2 text-sm leading-6 text-gray-300">
              Regístrate en Cinerama para gestionar tus
              compras y reservas.
            </Text>
          </View>

          {/* =================================================
              FORMULARIO
          ================================================= */}

          <View className="-mt-8 px-4">
            <View className="rounded-3xl bg-white p-6 shadow">

              <Text className="text-2xl font-black text-gray-900">
                Registro
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                Completa tus datos personales
              </Text>

              {/* NOMBRE */}

              <TituloCampo
                icono="person-outline"
                texto="Nombre"
              />

              <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4">
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#6b7280"
                />

                <TextInput
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Ingresa tu nombre"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="words"
                  className="ml-3 flex-1 py-4 text-gray-900"
                />
              </View>

              {/* APELLIDOS */}

              <TituloCampo
                icono="people-outline"
                texto="Apellidos"
              />

              <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4">
                <Ionicons
                  name="people-outline"
                  size={20}
                  color="#6b7280"
                />

                <TextInput
                  value={apellidos}
                  onChangeText={setApellidos}
                  placeholder="Ingresa tus apellidos"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="words"
                  className="ml-3 flex-1 py-4 text-gray-900"
                />
              </View>

              {/* CORREO */}

              <TituloCampo
                icono="mail-outline"
                texto="Correo electrónico"
              />

              <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4">
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#6b7280"
                />

                <TextInput
                  value={correo}
                  onChangeText={setCorreo}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="ml-3 flex-1 py-4 text-gray-900"
                />
              </View>

              {/* TELÉFONO */}

              <TituloCampo
                icono="call-outline"
                texto="Número de celular"
              />

              <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4">
                <Text className="font-bold text-gray-500">
                  +51
                </Text>

                <TextInput
                  value={telefono}
                  onChangeText={(texto) =>
                    setTelefono(
                      texto
                        .replace(/\D/g, "")
                        .slice(0, 9)
                    )
                  }
                  placeholder="999 999 999"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  maxLength={9}
                  className="ml-3 flex-1 py-4 text-gray-900"
                />
              </View>

              {/* CONTRASEÑA */}

              <TituloCampo
                icono="lock-closed-outline"
                texto="Contraseña"
              />

              <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6b7280"
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!mostrarPassword}
                  autoCapitalize="none"
                  className="ml-3 flex-1 py-4 text-gray-900"
                />

                <Pressable
                  onPress={() =>
                    setMostrarPassword(
                      !mostrarPassword
                    )
                  }
                  className="p-2"
                >
                  <Ionicons
                    name={
                      mostrarPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={21}
                    color="#6b7280"
                  />
                </Pressable>
              </View>

              {/* CONFIRMAR */}

              <TituloCampo
                icono="shield-checkmark-outline"
                texto="Confirmar contraseña"
              />

              <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#6b7280"
                />

                <TextInput
                  value={confirmarPassword}
                  onChangeText={setConfirmarPassword}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={
                    !mostrarConfirmarPassword
                  }
                  autoCapitalize="none"
                  className="ml-3 flex-1 py-4 text-gray-900"
                />

                <Pressable
                  onPress={() =>
                    setMostrarConfirmarPassword(
                      !mostrarConfirmarPassword
                    )
                  }
                  className="p-2"
                >
                  <Ionicons
                    name={
                      mostrarConfirmarPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={21}
                    color="#6b7280"
                  />
                </Pressable>
              </View>

              {/* BOTÓN REGISTRO */}

              <Pressable
                disabled={registrando}
                onPress={registrarUsuario}
                className={`mt-7 flex-row items-center justify-center rounded-xl py-4 ${
                  registrando
                    ? "bg-red-400"
                    : "bg-red-600"
                }`}
              >
                <Ionicons
                  name={
                    registrando
                      ? "hourglass-outline"
                      : "person-add-outline"
                  }
                  size={20}
                  color="white"
                />

                <Text className="ml-2 text-base font-black text-white">
                  {registrando
                    ? "Creando cuenta..."
                    : "Crear cuenta"}
                </Text>
              </Pressable>

              {/* YA TIENE CUENTA */}

              <View className="mt-7 flex-row items-center justify-center">
                <Text className="text-gray-500">
                  ¿Ya tienes una cuenta?
                </Text>

                <Pressable
                  onPress={() =>
                    router.replace("/login")
                  }
                >
                  <Text className="ml-1 font-black text-red-600">
                    Inicia sesión
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* VOLVER AL INICIO */}

          <Pressable
            onPress={() => router.replace("/")}
            className="mt-5 items-center py-4"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="home-outline"
                size={17}
                color="#6b7280"
              />

              <Text className="ml-2 font-bold text-gray-500">
                Volver al inicio
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// =========================================================
// TÍTULO DE CADA CAMPO
// =========================================================

type TituloCampoProps = {
  icono: any;
  texto: string;
};

function TituloCampo({
  icono,
  texto,
}: TituloCampoProps) {
  return (
    <View className="mb-2 mt-5 flex-row items-center">
      <Ionicons
        name={icono}
        size={17}
        color="#dc2626"
      />

      <Text className="ml-2 font-bold text-gray-700">
        {texto}
      </Text>
    </View>
  );
}