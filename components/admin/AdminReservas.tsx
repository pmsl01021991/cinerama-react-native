import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View,} from "react-native";
import { obtenerReservasAdmin, ReservaAdmin,} from "../../services/adminService";

type Props = {
  refreshKey?: number;
};

export default function AdminReservas({
  refreshKey = 0,
}: Props) {
  const [reservas, setReservas] = useState<ReservaAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarReservas = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerReservasAdmin();
      setReservas(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error cargando reservaciones."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, [refreshKey]);

  if (cargando) {
    return (
      <View className="items-center py-12">
        <ActivityIndicator size="large" color="#dc2626" />

        <Text className="mt-3 text-gray-500">
          Cargando reservaciones...
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
          onPress={cargarReservas}
          className="mt-4 rounded-xl bg-red-600 px-5 py-3"
        >
          <Text className="font-bold text-white">
            Reintentar
          </Text>
        </Pressable>
      </View>
    );
  }

  if (reservas.length === 0) {
    return (
      <View className="items-center py-12">
        <Ionicons
          name="ticket-outline"
          size={40}
          color="#9ca3af"
        />

        <Text className="mt-3 text-gray-500">
          No hay reservaciones registradas.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-black text-gray-900">
            Reservaciones
          </Text>

          <Text className="text-sm text-gray-500">
            {reservas.length} registradas
          </Text>
        </View>

        <Pressable
          onPress={cargarReservas}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-200"
        >
          <Ionicons
            name="refresh-outline"
            size={21}
            color="#374151"
          />
        </Pressable>
      </View>

      {reservas.map((reserva) => (
        <View
          key={reserva.id}
          className="mb-4 rounded-2xl bg-white p-4 shadow"
        >
          <View className="flex-row items-start justify-between">
            <View className="mr-3 flex-1">
              <Text className="text-xs font-bold text-red-600">
                RESERVACIÓN #{reserva.id}
              </Text>

              <Text className="mt-1 text-lg font-black text-gray-900">
                {reserva.pelicula_titulo || "Sin película"}
              </Text>
            </View>

            <View className="rounded-lg bg-gray-900 px-3 py-1">
              <Text className="text-xs font-bold text-white">
                {reserva.estado || "Pendiente"}
              </Text>
            </View>
          </View>

          <View className="mt-4 border-t border-gray-200 pt-3">
            <Dato
              icono="person-outline"
              texto={reserva.nombre_cliente || "Sin cliente"}
            />

            <Dato
              icono="mail-outline"
              texto={reserva.correo_cliente || "Sin correo"}
            />

            <Dato
              icono="location-outline"
              texto={reserva.cine || "Sin cine"}
            />

            <Dato
              icono="videocam-outline"
              texto={`${reserva.tipo_cine || "-"} · Sala ${
                reserva.sala || "-"
              }`}
            />

            <Dato
              icono="time-outline"
              texto={reserva.horario || "Sin horario"}
            />

            <Dato
              icono="grid-outline"
              texto={`Asientos: ${reserva.asientos || "-"}`}
            />

            <Dato
              icono="ticket-outline"
              texto={`Entradas: ${reserva.cantidad_entradas ?? 0}`}
            />

            <Dato
              icono="cash-outline"
              texto={`S/ ${Number(
                reserva.monto_entradas || 0
              ).toFixed(2)}`}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function Dato({
  icono,
  texto,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  texto: string;
}) {
  return (
    <View className="mb-2 flex-row items-center">
      <Ionicons
        name={icono}
        size={17}
        color="#6b7280"
      />

      <Text className="ml-2 flex-1 text-sm text-gray-600">
        {texto}
      </Text>
    </View>
  );
}