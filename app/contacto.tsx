import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, View,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";
import { API } from "../services/api";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("");
  const [cine, setCine] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mostrarCines, setMostrarCines] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const cines = [
    "Cinerama Pacífico",
    "Cinerama Minka",
    "Cinerama Chimbote",
    "Cinerama Quinde",
    "Cinerama Tarapoto",
    "Cinerama Cajamarca",
    "Cinerama Sol",
    "Cinerama Huacho",
    "Cinerama Moyobamba",
    "Cinerama Cuzco",
    "Cinerama Piura"
  ];

  // =====================================================
  // VALIDAR FORMULARIO
  // =====================================================

  const validarFormulario = () => {
    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !email.trim() ||
      !asunto.trim() ||
      !cine.trim() ||
      !mensaje.trim()
    ) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa todos los campos."
      );

      return false;
    }

    // Solo letras
    const soloLetrasRegex =
      /^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s]+$/;

    if (!soloLetrasRegex.test(nombre.trim())) {
      Alert.alert(
        "Nombre inválido",
        'El campo "Nombre" solo debe contener letras.'
      );

      return false;
    }

    if (!soloLetrasRegex.test(apellidos.trim())) {
      Alert.alert(
        "Apellidos inválidos",
        'El campo "Apellidos" solo debe contener letras.'
      );

      return false;
    }

    if (!soloLetrasRegex.test(asunto.trim())) {
      Alert.alert(
        "Asunto inválido",
        'El campo "Asunto" solo debe contener letras.'
      );

      return false;
    }

    // Validar correo
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert(
        "Correo inválido",
        "Ingresa una dirección de correo electrónico válida."
      );

      return false;
    }

    // El mensaje debe contener al menos una letra
    const contieneLetraRegex =
      /[a-zA-ZÁÉÍÓÚáéíóúÑñÜü]/;

    if (!contieneLetraRegex.test(mensaje.trim())) {
      Alert.alert(
        "Mensaje inválido",
        'El campo "Mensaje" debe contener al menos una letra.'
      );

      return false;
    }

    return true;
  };

  // =====================================================
  // ENVIAR
  // =====================================================

  const enviarFormulario = async () => {
  if (!validarFormulario()) return;

  setEnviando(true);

  try {
    const response = await fetch(API.contacto, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        email: email.trim().toLowerCase(),
        asunto: asunto.trim(),
        cine: cine.trim(),
        mensaje: mensaje.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "Error enviando mensaje"
      );
    }

    Alert.alert(
      "Mensaje enviado 🎉",
      "¡Tus datos han sido enviados correctamente!",
      [
        {
          text: "Aceptar",
          onPress: limpiarFormulario,
        },
      ]
    );
  } catch (error) {
    console.error("Error enviando contacto:", error);

    Alert.alert(
      "Error de conexión",
      "No se pudo enviar el mensaje. Verifica que el servidor esté encendido y que el celular esté conectado a la misma red Wi-Fi que la computadora."
    );
  } finally {
    setEnviando(false);
  }
};

  // =====================================================
  // LIMPIAR
  // =====================================================

  const limpiarFormulario = () => {
    setNombre("");
    setApellidos("");
    setEmail("");
    setAsunto("");
    setCine("");
    setMensaje("");
    setMostrarCines(false);
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
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="white"
          />
        </Pressable>

        <View className="flex-1">
          <Text className="text-xl font-black tracking-wider text-white">
            CINERAMA
          </Text>

          <Text className="text-xs text-red-100">
            Contáctanos
          </Text>
        </View>

        <Ionicons
          name="mail-outline"
          size={26}
          color="white"
        />
      </View>

      {/* =================================================
          FORMULARIO
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 110,
          }}
        >
          {/* CABECERA */}

          <View className="bg-gray-900 px-5 pb-8 pt-7">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-red-600">
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={27}
                color="white"
              />
            </View>

            <Text className="mt-4 text-3xl font-black text-white">
              Contáctanos
            </Text>

            <Text className="mt-2 text-sm leading-6 text-gray-300">
              ¿Tienes alguna consulta, sugerencia o
              comentario? Escríbenos y estaremos
              encantados de ayudarte.
            </Text>
          </View>

          {/* FORM */}

          <View className="mx-4 -mt-3 rounded-3xl bg-white p-5 shadow">
            {/* NOMBRE */}

            <CampoTitulo
              icono="person-outline"
              texto="Nombre"
            />

            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              className="mt-2 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900"
            />

            {/* APELLIDOS */}

            <View className="mt-5">
              <CampoTitulo
                icono="people-outline"
                texto="Apellidos"
              />
            </View>

            <TextInput
              value={apellidos}
              onChangeText={setApellidos}
              placeholder="Ingresa tus apellidos"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              className="mt-2 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900"
            />

            {/* EMAIL */}

            <View className="mt-5">
              <CampoTitulo
                icono="mail-outline"
                texto="Correo electrónico"
              />
            </View>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="mt-2 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900"
            />

            {/* ASUNTO */}

            <View className="mt-5">
              <CampoTitulo
                icono="document-text-outline"
                texto="Asunto"
              />
            </View>

            <TextInput
              value={asunto}
              onChangeText={setAsunto}
              placeholder="Motivo de tu consulta"
              placeholderTextColor="#9ca3af"
              className="mt-2 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900"
            />

            {/* CINE */}

            <View className="mt-5">
              <CampoTitulo
                icono="location-outline"
                texto="Cine"
              />
            </View>

            <Pressable
              onPress={() =>
                setMostrarCines(!mostrarCines)
              }
              className="mt-2 flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-4"
            >
              <Text
                className={`flex-1 ${
                  cine
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {cine || "Selecciona un cine"}
              </Text>

              <Ionicons
                name={
                  mostrarCines
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={20}
                color="#6b7280"
              />
            </Pressable>

            {/* LISTA CINES */}

            {mostrarCines && (
              <View className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white">
                {cines.map(
                  (nombreCine, index) => (
                    <Pressable
                      key={nombreCine}
                      onPress={() => {
                        setCine(nombreCine);
                        setMostrarCines(false);
                      }}
                      className={`flex-row items-center px-4 py-4 ${
                        index !==
                        cines.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <Ionicons
                        name="location"
                        size={18}
                        color="#dc2626"
                      />

                      <Text className="ml-3 flex-1 font-bold text-gray-700">
                        {nombreCine}
                      </Text>

                      {cine === nombreCine && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#16a34a"
                        />
                      )}
                    </Pressable>
                  )
                )}
              </View>
            )}

            {/* MENSAJE */}

            <View className="mt-5">
              <CampoTitulo
                icono="chatbox-outline"
                texto="Mensaje"
              />
            </View>

            <TextInput
              value={mensaje}
              onChangeText={setMensaje}
              placeholder="Escribe aquí tu mensaje..."
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
              maxLength={500}
              style={{
                minHeight: 130,
              }}
              className="mt-2 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900"
            />

            <Text className="mt-2 text-right text-xs text-gray-400">
              {mensaje.length}/500
            </Text>

            {/* BOTÓN */}

            <Pressable
              onPress={enviarFormulario}
              disabled={enviando}
              className={`mt-6 flex-row items-center justify-center rounded-xl py-4 ${
                enviando
                  ? "bg-red-400"
                  : "bg-red-600"
              }`}
            >
              <Ionicons
                name={
                  enviando
                    ? "hourglass-outline"
                    : "send"
                }
                size={20}
                color="white"
              />

              <Text className="ml-2 text-base font-black text-white">
                {enviando
                  ? "Enviando..."
                  : "Enviar mensaje"}
              </Text>
            </Pressable>
          </View>

          {/* INFORMACIÓN */}

          <View className="mx-4 mt-5 rounded-2xl bg-gray-900 p-5">
            <Text className="text-lg font-black text-white">
              Estamos para ayudarte
            </Text>

            <View className="mt-4 flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-red-600">
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color="white"
                />
              </View>

              <View className="ml-3">
                <Text className="text-xs text-gray-400">
                  Atención al cliente
                </Text>

                <Text className="font-bold text-white">
                  Cinerama
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-red-600">
                <Ionicons
                  name="time-outline"
                  size={19}
                  color="white"
                />
              </View>

              <View className="ml-3">
                <Text className="text-xs text-gray-400">
                  Horario de atención
                </Text>

                <Text className="font-bold text-white">
                  Todos los días
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* =================================================
          NAVBAR INFERIOR
      ================================================= */}

      <BottomNav />
    </SafeAreaView>
  );
}

// =========================================================
// COMPONENTE PARA LABEL
// =========================================================

function CampoTitulo({
  icono,
  texto,
}: {
  icono: any;
  texto: string;
}) {
  return (
    <View className="flex-row items-center">
      <Ionicons
        name={icono}
        size={18}
        color="#dc2626"
      />

      <Text className="ml-2 font-black text-gray-700">
        {texto}
      </Text>
    </View>
  );
}