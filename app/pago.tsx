import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, View,} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { API_URL } from "../services/api";

type MetodoPago = "tarjeta" | "billetera" | "";
type Billetera = "Yape" | "Plin" | "";

export default function Pago() {
    const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{
    cineId?: string;
    cine?: string;

    peliculaId?: string;
    titulo?: string;
    sala?: string;
    horario?: string;
    tipoCine?: string;
    funcionId?: string;
    asientos?: string;
    cantidadEntradas?: string;
    montoEntradas?: string;
    productos?: string;
    totalProductos?: string;
    totalGeneral?: string;
    }>();

  const cineId = params.cineId ?? "";
  const cine = params.cine ?? "";

  const peliculaId = params.peliculaId ?? "";
  const titulo = params.titulo ?? "Película";
  const sala = params.sala ?? "-";
  const horario = params.horario ?? "-";
  const tipoCine = params.tipoCine ?? "2D";
  const asientos = params.asientos ?? "-";

  const cantidadEntradas = Number(
    params.cantidadEntradas ?? 0
  );

  const montoEntradas = Number(
    params.montoEntradas ?? 0
  );

  const totalProductos = Number(
    params.totalProductos ?? 0
  );

  const totalGeneral = Number(
    params.totalGeneral ?? montoEntradas
  );

  // =====================================================
  // FORMULARIO
  // =====================================================

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  const [metodoPago, setMetodoPago] =
    useState<MetodoPago>("");

  const [billetera, setBilletera] =
    useState<Billetera>("");

  // Datos tarjeta
  const [numeroTarjeta, setNumeroTarjeta] =
    useState("");

  const [fechaTarjeta, setFechaTarjeta] =
    useState("");

  const [cvv, setCvv] = useState("");

  // Datos billetera
  const [tipoDocumento, setTipoDocumento] =
    useState("");

  const [numeroDocumento, setNumeroDocumento] =
    useState("");

  const [telefono, setTelefono] =
    useState("");

  const [procesando, setProcesando] =
    useState(false);

  // =====================================================
  // VALIDAR CORREO
  // =====================================================

  const correoValido = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // =====================================================
  // FORMATEAR TARJETA
  // =====================================================

  const cambiarNumeroTarjeta = (texto: string) => {
    const limpio = texto
      .replace(/\D/g, "")
      .slice(0, 16);

    const formateado = limpio
      .replace(/(.{4})/g, "$1 ")
      .trim();

    setNumeroTarjeta(formateado);
  };

  // =====================================================
  // FORMATEAR FECHA
  // =====================================================

  const cambiarFecha = (texto: string) => {
    const limpio = texto
      .replace(/\D/g, "")
      .slice(0, 4);

    if (limpio.length > 2) {
      setFechaTarjeta(
        `${limpio.slice(0, 2)}/${limpio.slice(2)}`
      );
    } else {
      setFechaTarjeta(limpio);
    }
  };


  const procesarPago = async () => {
    if (!nombre.trim()) {
      Alert.alert(
        "Campo requerido",
        "Ingresa tu nombre completo."
      );
      return;
    }

    if (!correo.trim()) {
      Alert.alert(
        "Campo requerido",
        "Ingresa tu correo electrónico."
      );
      return;
    }

    if (!correoValido(correo)) {
      Alert.alert(
        "Correo inválido",
        "Ingresa un correo electrónico válido."
      );
      return;
    }

    if (!metodoPago) {
      Alert.alert(
        "Método de pago",
        "Selecciona un método de pago."
      );
      return;
    }

    if (metodoPago === "tarjeta") {
      const tarjetaLimpia =
        numeroTarjeta.replace(/\s/g, "");

      if (tarjetaLimpia.length !== 16) {
        Alert.alert(
          "Tarjeta inválida",
          "Ingresa los 16 dígitos de la tarjeta."
        );
        return;
      }

      if (fechaTarjeta.length !== 5) {
        Alert.alert(
          "Fecha inválida",
          "Ingresa la fecha MM/AA."
        );
        return;
      }

      if (cvv.length !== 3) {
        Alert.alert(
          "CVV inválido",
          "Ingresa los 3 dígitos del CVV."
        );
        return;
      }
    }

    if (metodoPago === "billetera") {
      if (!billetera) {
        Alert.alert(
          "Selecciona una billetera",
          "Elige Yape o Plin."
        );
        return;
      }

      if (!tipoDocumento) {
        Alert.alert(
          "Documento",
          "Selecciona el tipo de documento."
        );
        return;
      }

      if (!numeroDocumento.trim()) {
        Alert.alert(
          "Documento",
          "Ingresa tu número de documento."
        );
        return;
      }

      if (telefono.length !== 9) {
        Alert.alert(
          "Teléfono inválido",
          "Ingresa un número celular de 9 dígitos."
        );
        return;
      }
    }

    setProcesando(true);

try {
  // =====================================================
  // PREPARAR PRODUCTOS
  // =====================================================

  const productos = JSON.parse(
    params.productos ?? "[]"
  );

  // =====================================================
  // PREPARAR ASIENTOS
  // =====================================================

  const listaAsientos = asientos
    .split(",")
    .map((asiento) => asiento.trim())
    .filter(Boolean);

  if (listaAsientos.length === 0) {
    Alert.alert(
      "Error",
      "No se encontraron los asientos seleccionados."
    );

    return;
  }

  const response = await fetch(
    `${API_URL}/api/reservas/confirmar-pago`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        funcion_id: Number(params.funcionId ?? 0),

        asientos: listaAsientos,

        cantidad_entradas: cantidadEntradas,

        nombre_cliente: nombre.trim(),

        correo_cliente: correo.trim(),

        metodo_pago: metodoPago,

        billetera:
          metodoPago === "billetera"
            ? billetera
            : null,

        tipo_documento:
          metodoPago === "billetera"
            ? tipoDocumento
            : null,

        numero_documento:
          metodoPago === "billetera"
            ? numeroDocumento
            : null,

        telefono:
          metodoPago === "billetera"
            ? telefono
            : null,

        productos,
      }),
    }
  );

  const textoRespuesta = await response.text();

console.log(
  "STATUS CONFIRMAR PAGO:",
  response.status
);

console.log(
  "RESPUESTA CONFIRMAR PAGO:",
  textoRespuesta
);

let data: any;

try {
  data = JSON.parse(textoRespuesta);
} catch {
  console.error(
    "La respuesta del servidor NO es JSON:",
    textoRespuesta
  );

  Alert.alert(
    "Error del servidor",
    `El servidor respondió con un formato inesperado. Código: ${response.status}`
  );

  return;
}

  // =====================================================
  // ERROR DE ASIENTO OCUPADO
  // =====================================================

  if (response.status === 409) {
    Alert.alert(
      "Asiento no disponible",
      data?.ocupados?.length
        ? `Los siguientes asientos ya fueron ocupados: ${data.ocupados.join(
            ", "
          )}`
        : "Uno o más asientos ya fueron ocupados."
    );

    return;
  }

  // =====================================================
  // OTROS ERRORES
  // =====================================================

  if (!response.ok) {
    console.error(
      "Error confirmando pago:",
      data
    );

    Alert.alert(
      "Error",
      data?.error ||
        data?.message ||
        "No se pudo completar la compra."
    );

    return;
  }

  // =====================================================
  // RESERVA CREADA
  // =====================================================

  const reservaId =
    data.reservaId ??
    data.id ??
    data.reserva?.id;

  if (!reservaId) {
    console.error(
      "El backend no devolvió reservaId:",
      data
    );

    Alert.alert(
      "Error",
      "La compra fue procesada, pero no se recibió el identificador de la reserva."
    );

    return;
  }

  console.log(
    "✅ Reserva creada:",
    reservaId
  );

  // =====================================================
  // ENVIAR VOUCHER AL CORREO
  // =====================================================

  try {
    const responseCorreo = await fetch(
      `${API_URL}/api/reservas/${reservaId}/enviar-voucher`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const dataCorreo =
      await responseCorreo.json();

    if (!responseCorreo.ok) {
      console.log(
        "Error enviando voucher:",
        dataCorreo
      );

      Alert.alert(
        "Compra realizada",
        "La compra se registró correctamente, pero no se pudo enviar el voucher al correo."
      );
    } else {
      console.log(
        "✅ Voucher enviado correctamente"
      );
    }
  } catch (errorCorreo) {
    console.error(
      "Error enviando voucher:",
      errorCorreo
    );

    Alert.alert(
      "Compra realizada",
      "La compra se registró correctamente, pero hubo un problema enviando el voucher."
    );
  }

  // =====================================================
  // IR AL VOUCHER
  // =====================================================

  router.replace({
    pathname: "/voucher",

    params: {
      reservaId: reservaId.toString(),

      cineId,
      cine,

      peliculaId,
      titulo,
      sala,
      horario,
      tipoCine,
      asientos,

      cantidadEntradas:
        cantidadEntradas.toString(),

      montoEntradas:
        montoEntradas.toString(),

      productos:
        params.productos ?? "[]",

      totalProductos:
        totalProductos.toString(),

      totalGeneral:
        totalGeneral.toString(),

      nombre:
        nombre.trim(),

      correo:
        correo.trim(),

      metodoPago,

      billetera:
        metodoPago === "billetera"
          ? billetera
          : "",
    },
  });

} catch (error) {
  console.error(
    "Error procesando compra:",
    error
  );

  Alert.alert(
    "Error de conexión",
    "No se pudo conectar con el servidor."
  );
} finally {
  setProcesando(false);
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
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center"
        >
          <Ionicons
            name="arrow-back"
            size={27}
            color="white"
          />
        </Pressable>

        <View className="ml-2 flex-1">
          <Text className="text-lg font-black text-white">
            Pago
          </Text>

          <Text className="text-xs text-red-100">
            Finaliza tu compra
          </Text>
        </View>

        <Ionicons
          name="card-outline"
          size={26}
          color="white"
        />
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
            paddingBottom: 150 + insets.bottom,
          }}
        >
          {/* =============================================
              INFORMACIÓN PELÍCULA
          ============================================= */}

          <View className="bg-gray-900 px-5 py-5">
            <Text
              numberOfLines={2}
              className="text-xl font-black text-white"
            >
              {titulo}
            </Text>

            <View className="mt-3 flex-row flex-wrap">
              <Info
                icono="film-outline"
                texto={tipoCine}
              />

              <Info
                icono="time-outline"
                texto={horario}
              />

              <Info
                icono="location-outline"
                texto={`Sala ${sala}`}
              />
            </View>

            <View className="mt-2 flex-row items-center">
              <Ionicons
                name="ticket-outline"
                size={16}
                color="#f87171"
              />

              <Text className="ml-2 text-sm text-gray-300">
                {cantidadEntradas} entrada
                {cantidadEntradas !== 1 ? "s" : ""}
                {" • "}
                {asientos}
              </Text>
            </View>
          </View>

          <View className="px-4 py-6">
            {/* ===========================================
                DATOS PERSONALES
            =========================================== */}

            <View className="rounded-2xl bg-white p-5 shadow">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-red-100">
                  <Ionicons
                    name="person-outline"
                    size={23}
                    color="#dc2626"
                  />
                </View>

                <View className="ml-3">
                  <Text className="text-lg font-black text-gray-900">
                    Tus datos
                  </Text>

                  <Text className="text-xs text-gray-500">
                    Información para tu compra
                  </Text>
                </View>
              </View>

              <Text className="mb-2 mt-5 text-sm font-bold text-gray-700">
                Nombre completo
              </Text>

              <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-3">
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#6b7280"
                />

                <TextInput
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Ej. Juan Pérez"
                  placeholderTextColor="#9ca3af"
                  className="ml-2 flex-1 py-4 text-gray-900"
                />
              </View>

              <Text className="mb-2 mt-4 text-sm font-bold text-gray-700">
                Correo electrónico
              </Text>

              <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-3">
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
                  className="ml-2 flex-1 py-4 text-gray-900"
                />
              </View>
            </View>

            {/* ===========================================
                MÉTODO DE PAGO
            =========================================== */}

            <View className="mt-5 rounded-2xl bg-white p-5 shadow">
              <Text className="text-lg font-black text-gray-900">
                Método de pago
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                Selecciona cómo deseas pagar
              </Text>

              {/* TARJETA */}

              <Pressable
                onPress={() => {
                  setMetodoPago("tarjeta");
                  setBilletera("");
                }}
                className={`mt-5 flex-row items-center rounded-xl border-2 p-4 ${
                  metodoPago === "tarjeta"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View
                  className={`h-11 w-11 items-center justify-center rounded-full ${
                    metodoPago === "tarjeta"
                      ? "bg-red-600"
                      : "bg-gray-100"
                  }`}
                >
                  <Ionicons
                    name="card-outline"
                    size={23}
                    color={
                      metodoPago === "tarjeta"
                        ? "white"
                        : "#374151"
                    }
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="font-black text-gray-900">
                    Tarjeta
                  </Text>

                  <Text className="text-xs text-gray-500">
                    Crédito o débito
                  </Text>
                </View>

                <Ionicons
                  name={
                    metodoPago === "tarjeta"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={24}
                  color={
                    metodoPago === "tarjeta"
                      ? "#dc2626"
                      : "#9ca3af"
                  }
                />
              </Pressable>

              {/* BILLETERA */}

              <Pressable
                onPress={() =>
                  setMetodoPago("billetera")
                }
                className={`mt-3 flex-row items-center rounded-xl border-2 p-4 ${
                  metodoPago === "billetera"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View
                  className={`h-11 w-11 items-center justify-center rounded-full ${
                    metodoPago === "billetera"
                      ? "bg-red-600"
                      : "bg-gray-100"
                  }`}
                >
                  <Ionicons
                    name="phone-portrait-outline"
                    size={23}
                    color={
                      metodoPago === "billetera"
                        ? "white"
                        : "#374151"
                    }
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="font-black text-gray-900">
                    Billetera digital
                  </Text>

                  <Text className="text-xs text-gray-500">
                    Yape o Plin
                  </Text>
                </View>

                <Ionicons
                  name={
                    metodoPago === "billetera"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={24}
                  color={
                    metodoPago === "billetera"
                      ? "#dc2626"
                      : "#9ca3af"
                  }
                />
              </Pressable>

              {/* =========================================
                  DATOS TARJETA
              ========================================= */}

              {metodoPago === "tarjeta" && (
                <View className="mt-5 border-t border-gray-200 pt-5">
                  <Text className="mb-2 text-sm font-bold text-gray-700">
                    Número de tarjeta
                  </Text>

                  <TextInput
                    value={numeroTarjeta}
                    onChangeText={cambiarNumeroTarjeta}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                    maxLength={19}
                    className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 text-gray-900"
                  />

                  <View className="mt-4 flex-row">
                    <View className="mr-2 flex-1">
                      <Text className="mb-2 text-sm font-bold text-gray-700">
                        Vencimiento
                      </Text>

                      <TextInput
                        value={fechaTarjeta}
                        onChangeText={cambiarFecha}
                        placeholder="MM/AA"
                        placeholderTextColor="#9ca3af"
                        keyboardType="number-pad"
                        maxLength={5}
                        className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 text-gray-900"
                      />
                    </View>

                    <View className="ml-2 flex-1">
                      <Text className="mb-2 text-sm font-bold text-gray-700">
                        CVV
                      </Text>

                      <TextInput
                        value={cvv}
                        onChangeText={(texto) =>
                          setCvv(
                            texto
                              .replace(/\D/g, "")
                              .slice(0, 3)
                          )
                        }
                        placeholder="123"
                        placeholderTextColor="#9ca3af"
                        keyboardType="number-pad"
                        secureTextEntry
                        maxLength={3}
                        className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 text-gray-900"
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* =========================================
                  BILLETERAS
              ========================================= */}

              {metodoPago === "billetera" && (
                <View className="mt-5 border-t border-gray-200 pt-5">
                  <Text className="font-black text-gray-900">
                    Selecciona tu billetera
                  </Text>

                  <View className="mt-4 flex-row">
                    <Pressable
                      onPress={() =>
                        setBilletera("Yape")
                      }
                      className={`mr-2 flex-1 items-center rounded-xl border-2 p-4 ${
                        billetera === "Yape"
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200"
                      }`}
                    >
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-600">
                        <Text className="text-xl font-black text-white">
                          Y
                        </Text>
                      </View>

                      <Text className="mt-2 font-black text-gray-900">
                        Yape
                      </Text>

                      {billetera === "Yape" && (
                        <Ionicons
                          name="checkmark-circle"
                          size={21}
                          color="#9333ea"
                          style={{
                            marginTop: 5,
                          }}
                        />
                      )}
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        setBilletera("Plin")
                      }
                      className={`ml-2 flex-1 items-center rounded-xl border-2 p-4 ${
                        billetera === "Plin"
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-gray-200"
                      }`}
                    >
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-cyan-500">
                        <Text className="text-xl font-black text-white">
                          P
                        </Text>
                      </View>

                      <Text className="mt-2 font-black text-gray-900">
                        Plin
                      </Text>

                      {billetera === "Plin" && (
                        <Ionicons
                          name="checkmark-circle"
                          size={21}
                          color="#06b6d4"
                          style={{
                            marginTop: 5,
                          }}
                        />
                      )}
                    </Pressable>
                  </View>

                  {/* TIPO DOCUMENTO */}

                  <Text className="mb-2 mt-5 text-sm font-bold text-gray-700">
                    Tipo de documento
                  </Text>

                  <View className="flex-row">
                    <Pressable
                      onPress={() =>
                        setTipoDocumento("DNI")
                      }
                      className={`mr-2 flex-1 rounded-xl border py-3 ${
                        tipoDocumento === "DNI"
                          ? "border-red-600 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <Text
                        className={`text-center font-bold ${
                          tipoDocumento === "DNI"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        DNI
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        setTipoDocumento("CE")
                      }
                      className={`ml-2 flex-1 rounded-xl border py-3 ${
                        tipoDocumento === "CE"
                          ? "border-red-600 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <Text
                        className={`text-center font-bold ${
                          tipoDocumento === "CE"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        C.E.
                      </Text>
                    </Pressable>
                  </View>

                  {/* DOCUMENTO */}

                  <Text className="mb-2 mt-4 text-sm font-bold text-gray-700">
                    Número de documento
                  </Text>

                  <TextInput
                    value={numeroDocumento}
                    onChangeText={(texto) =>
                      setNumeroDocumento(
                        texto
                          .replace(/\D/g, "")
                          .slice(0, 12)
                      )
                    }
                    placeholder="Ingresa tu documento"
                    placeholderTextColor="#9ca3af"
                    keyboardType="number-pad"
                    className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 text-gray-900"
                  />

                  {/* TELÉFONO */}

                  <Text className="mb-2 mt-4 text-sm font-bold text-gray-700">
                    Número de celular
                  </Text>

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

                  {/* QR SIMULADO */}

                  {billetera !== "" && (
                    <View className="mt-5 items-center rounded-2xl bg-gray-50 p-5">
                      <View className="h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white">
                        <Ionicons
                          name="qr-code-outline"
                          size={90}
                          color="#111827"
                        />
                      </View>

                      <Text className="mt-3 font-black text-gray-900">
                        Escanea con {billetera}
                      </Text>

                      <Text className="mt-1 text-center text-xs text-gray-500">
                        Realiza el pago de S/{" "}
                        {totalGeneral.toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* ===========================================
                RESUMEN
            =========================================== */}

            <View className="mt-5 rounded-2xl bg-white p-5 shadow">
              <Text className="text-lg font-black text-gray-900">
                Resumen de compra
              </Text>

              <FilaResumen
                nombre={`${cantidadEntradas} entrada${
                  cantidadEntradas !== 1
                    ? "s"
                    : ""
                }`}
                monto={montoEntradas}
              />

              <FilaResumen
                nombre="Dulcería"
                monto={totalProductos}
              />

              <View className="mt-4 border-t border-gray-200 pt-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-black text-gray-900">
                    Total
                  </Text>

                  <Text className="text-2xl font-black text-red-600">
                    S/ {totalGeneral.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* SEGURIDAD */}

            <View className="mt-5 flex-row items-center justify-center">
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color="#6b7280"
              />

              <Text className="ml-2 text-xs text-gray-500">
                Tus datos están protegidos
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* =================================================
          BOTÓN INFERIOR
      ================================================= */}

      <View
        style={{
            paddingBottom: Math.max(insets.bottom, 12),
        }}
        className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 pt-3"
        >
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-xs text-gray-500">
              Total a pagar
            </Text>

            <Text className="text-2xl font-black text-gray-900">
              S/ {totalGeneral.toFixed(2)}
            </Text>
          </View>

          <Pressable
            disabled={procesando}
            onPress={procesarPago}
            className={`flex-row items-center rounded-xl px-6 py-4 ${
              procesando
                ? "bg-gray-400"
                : "bg-red-600"
            }`}
          >
            <Ionicons
              name={
                procesando
                  ? "hourglass-outline"
                  : "lock-closed"
              }
              size={17}
              color="white"
            />

            <Text className="ml-2 font-black text-white">
              {procesando
                ? "Procesando..."
                : "Pagar"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// =========================================================
// COMPONENTE INFO
// =========================================================

type InfoProps = {
  icono:
    | "film-outline"
    | "time-outline"
    | "location-outline";
  texto: string;
};

function Info({ icono, texto }: InfoProps) {
  return (
    <View className="mb-2 mr-2 flex-row items-center rounded-lg bg-white/10 px-3 py-2">
      <Ionicons
        name={icono}
        size={16}
        color="#f87171"
      />

      <Text className="ml-2 text-xs font-bold text-white">
        {texto}
      </Text>
    </View>
  );
}

// =========================================================
// FILA RESUMEN
// =========================================================

function FilaResumen({
  nombre,
  monto,
}: {
  nombre: string;
  monto: number;
}) {
  return (
    <View className="mt-4 flex-row justify-between">
      <Text className="text-sm text-gray-500">
        {nombre}
      </Text>

      <Text className="font-black text-gray-900">
        S/ {monto.toFixed(2)}
      </Text>
    </View>
  );
}