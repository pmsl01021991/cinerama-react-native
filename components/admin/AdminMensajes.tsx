import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  MensajeAdmin,
  obtenerMensajesAdmin,
} from "../../services/adminService";

type Props = {
  refreshKey?: number;
};

export default function AdminMensajes({
  refreshKey = 0,
}: Props) {
  const [mensajes, setMensajes] = useState<MensajeAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarMensajes = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerMensajesAdmin();
      setMensajes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error cargando mensajes."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, [refreshKey]);

  if (cargando) {
    return (
      <View className="items-center py-12">
        <ActivityIndicator
          size="large"
          color="#dc2626"
        />

        <Text className="mt-3 text-gray-500">
          Cargando mensajes...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center rounded-2xl bg-red-50 p-6">
        <Ionicons
          name="alert-circle-outline"
          size={35}
          color="#dc2626"
        />

        <Text className="mt-2 text-center font-bold text-red-600">
          {error}
        </Text>

        <Pressable
          onPress={cargarMensajes}
          className="mt-4 rounded-xl bg-red-600 px-5 py-3"
        >
          <Text className="font-bold text-white">
            Reintentar
          </Text>
        </Pressable>
      </View>
    );
  }

  if (mensajes.length === 0) {
    return (
      <View className="items-center py-12">
        <Ionicons
          name="mail-outline"
          size={40}
          color="#9ca3af"
        />

        <Text className="mt-3 text-gray-500">
          No hay mensajes registrados.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-black text-gray-900">
            Mensajes
          </Text>

          <Text className="text-sm text-gray-500">
            {mensajes.length} registrados
          </Text>
        </View>

        <Pressable
          onPress={cargarMensajes}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-200"
        >
          <Ionicons
            name="refresh-outline"
            size={21}
            color="#374151"
          />
        </Pressable>
      </View>

      {mensajes.map((mensaje) => (
        <View
          key={mensaje.id}
          className="mb-4 rounded-2xl bg-white p-4 shadow"
        >
          <View className="flex-row items-start">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <Ionicons
                name="mail-outline"
                size={22}
                color="#dc2626"
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-lg font-black text-gray-900">
                {mensaje.nombre} {mensaje.apellidos}
              </Text>

              <Text className="text-sm text-gray-500">
                {mensaje.email}
              </Text>
            </View>
          </View>

          <View className="mt-4 border-t border-gray-200 pt-3">
            <Dato
              icono="chatbubble-outline"
              titulo="Asunto"
              texto={mensaje.asunto || "Sin asunto"}
            />

            <Dato
              icono="location-outline"
              titulo="Cine"
              texto={mensaje.cine || "No especificado"}
            />

            <Dato
              icono="calendar-outline"
              titulo="Fecha"
              texto={formatearFecha(mensaje.fecha)}
            />
          </View>

          <View className="mt-2 rounded-xl bg-gray-100 p-3">
            <Text className="mb-1 text-xs font-bold uppercase text-gray-500">
              Mensaje
            </Text>

            <Text className="leading-5 text-gray-700">
              {mensaje.mensaje}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function Dato({
  icono,
  titulo,
  texto,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  texto: string;
}) {
  return (
    <View className="mb-2 flex-row items-start">
      <Ionicons
        name={icono}
        size={17}
        color="#6b7280"
      />

      <Text className="ml-2 text-sm font-bold text-gray-600">
        {titulo}:
      </Text>

      <Text className="ml-1 flex-1 text-sm text-gray-600">
        {texto}
      </Text>
    </View>
  );
}

function formatearFecha(fecha: string) {
  if (!fecha) return "Sin fecha";

  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return fecha;
  }

  return date.toLocaleString("es-PE");
}