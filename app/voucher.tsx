import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProductoVoucher = {
  id?: number;
  producto_id?: number;
  nombre?: string;
  cantidad: number;
  precio?: number;
  precio_unitario?: number;
};

export default function Voucher() {
  const params = useLocalSearchParams<{
    peliculaId?: string;
    titulo?: string;
    sala?: string;
    horario?: string;
    tipoCine?: string;
    asientos?: string;
    cantidadEntradas?: string;
    montoEntradas?: string;
    productos?: string;
    totalProductos?: string;
    totalGeneral?: string;
    nombre?: string;
    correo?: string;
    metodoPago?: string;
    billetera?: string;
  }>();

  // =====================================================
  // DATOS GENERALES
  // =====================================================

  const titulo = params.titulo ?? "Película";
  const sala = params.sala ?? "-";
  const horario = params.horario ?? "-";
  const tipoCine = params.tipoCine ?? "-";
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
    params.totalGeneral ??
      montoEntradas + totalProductos
  );

  const nombre = params.nombre ?? "-";
  const correo = params.correo ?? "-";
  const metodoPago = params.metodoPago ?? "-";
  const billetera = params.billetera ?? "";

  // =====================================================
  // PRODUCTOS
  // =====================================================

  const [productos, setProductos] = useState<
    ProductoVoucher[]
  >([]);

  // =====================================================
  // CÓDIGO DE COMPRA
  // =====================================================

  const [codigoCompra] = useState(() => {
    const fecha = Date.now().toString().slice(-6);
    const aleatorio = Math.floor(
      1000 + Math.random() * 9000
    );

    return `CIN-${fecha}-${aleatorio}`;
  });

  // =====================================================
  // FECHA ACTUAL
  // =====================================================

  const [fechaCompra] = useState(() => {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  });

  // =====================================================
  // CARGAR PRODUCTOS RECIBIDOS
  // =====================================================

  useEffect(() => {
    if (!params.productos) {
      setProductos([]);
      return;
    }

    try {
      const parsed = JSON.parse(params.productos);

      if (Array.isArray(parsed)) {
        setProductos(parsed);
      }
    } catch (error) {
      console.log(
        "No se pudieron cargar los productos:",
        error
      );

      setProductos([]);
    }
  }, [params.productos]);

  // =====================================================
  // MOSTRAR MÉTODO DE PAGO
  // =====================================================

  const obtenerMetodoPago = () => {
    if (metodoPago === "billetera") {
      return billetera
        ? `Billetera digital (${billetera})`
        : "Billetera digital";
    }

    if (metodoPago === "tarjeta") {
      return "Tarjeta";
    }

    return metodoPago || "-";
  };

  // =====================================================
  // PRECIO DEL PRODUCTO
  // =====================================================

  const obtenerPrecioProducto = (
    producto: ProductoVoucher
  ) => {
    return Number(
      producto.precio ??
        producto.precio_unitario ??
        0
    );
  };

  // =====================================================
  // FINALIZAR
  // =====================================================

  const finalizarCompra = () => {
    Alert.alert(
      "Compra finalizada",
      "Tu compra se realizó correctamente.",
      [
        {
          text: "Volver al inicio",
          onPress: () => {
            router.dismissAll();
            router.replace("/");
          },
        },
      ]
    );
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

      <View className="h-16 flex-row items-center bg-red-600 px-5">
        <View className="flex-1">
          <Text className="text-xl font-black tracking-wider text-white">
            CINERAMA
          </Text>

          <Text className="text-xs text-red-100">
            Confirmación de compra
          </Text>
        </View>

        <Ionicons
          name="ticket-outline"
          size={28}
          color="white"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* =================================================
            MENSAJE DE ÉXITO
        ================================================= */}

        <View className="items-center bg-gray-900 px-5 pb-8 pt-8">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-green-500">
            <Ionicons
              name="checkmark"
              size={50}
              color="white"
            />
          </View>

          <Text className="mt-5 text-center text-2xl font-black text-white">
            ¡Pago realizado!
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-gray-300">
            Tu compra fue registrada correctamente.
          </Text>

          <View className="mt-5 rounded-full bg-green-500/20 px-5 py-2">
            <Text className="font-black text-green-400">
              PAGADO ✓
            </Text>
          </View>
        </View>

        {/* =================================================
            VOUCHER
        ================================================= */}

        <View className="mx-4 -mt-3 rounded-3xl bg-white p-5 shadow">
          {/* CABECERA TICKET */}

          <View className="items-center border-b border-dashed border-gray-300 pb-5">
            <Ionicons
              name="film"
              size={34}
              color="#dc2626"
            />

            <Text className="mt-2 text-2xl font-black tracking-widest text-red-600">
              CINERAMA
            </Text>

            <Text className="mt-1 text-xs text-gray-400">
              VOUCHER DE COMPRA
            </Text>
          </View>

          {/* CÓDIGO */}

          <View className="mt-5 items-center rounded-xl bg-gray-100 p-4">
            <Text className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Código de compra
            </Text>

            <Text className="mt-1 text-xl font-black tracking-wider text-gray-900">
              {codigoCompra}
            </Text>
          </View>

          {/* =================================================
              PELÍCULA
          ================================================= */}

          <View className="mt-6">
            <TituloSeccion
              icono="film-outline"
              titulo="Película"
            />

            <Text className="mt-3 text-xl font-black text-gray-900">
              {titulo}
            </Text>

            <View className="mt-4 rounded-xl bg-gray-50 p-4">
              <FilaDato
                icono="videocam-outline"
                titulo="Formato"
                valor={tipoCine}
              />

              <FilaDato
                icono="location-outline"
                titulo="Sala"
                valor={sala}
              />

              <FilaDato
                icono="time-outline"
                titulo="Horario"
                valor={horario}
              />

              <FilaDato
                icono="calendar-outline"
                titulo="Fecha de compra"
                valor={fechaCompra}
                ultimo
              />
            </View>
          </View>

          {/* =================================================
              ENTRADAS
          ================================================= */}

          <View className="mt-6 border-t border-dashed border-gray-300 pt-6">
            <TituloSeccion
              icono="ticket-outline"
              titulo="Entradas"
            />

            <View className="mt-4 rounded-xl bg-red-50 p-4">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">
                  Cantidad
                </Text>

                <Text className="font-black text-gray-900">
                  {cantidadEntradas}
                </Text>
              </View>

              <View className="mt-3 flex-row justify-between">
                <Text className="text-sm text-gray-600">
                  Butacas
                </Text>

                <Text className="ml-5 flex-1 text-right font-black text-red-600">
                  {asientos}
                </Text>
              </View>

              <View className="mt-4 border-t border-red-100 pt-4">
                <View className="flex-row justify-between">
                  <Text className="font-bold text-gray-700">
                    Subtotal entradas
                  </Text>

                  <Text className="font-black text-gray-900">
                    S/ {montoEntradas.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* =================================================
              PRODUCTOS
          ================================================= */}

          <View className="mt-6 border-t border-dashed border-gray-300 pt-6">
            <TituloSeccion
              icono="fast-food-outline"
              titulo="Dulcería"
            />

            {productos.length === 0 ? (
              <View className="mt-4 rounded-xl bg-gray-50 p-4">
                <Text className="text-center text-sm text-gray-500">
                  No se compraron productos.
                </Text>
              </View>
            ) : (
              <View className="mt-4 rounded-xl bg-gray-50 p-4">
                {productos.map(
                  (producto, index) => {
                    const precio =
                      obtenerPrecioProducto(
                        producto
                      );

                    const subtotal =
                      precio *
                      Number(
                        producto.cantidad || 0
                      );

                    return (
                      <View
                        key={
                          producto.id ??
                          producto.producto_id ??
                          index
                        }
                        className={`flex-row justify-between py-3 ${
                          index !==
                          productos.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                      >
                        <View className="mr-3 flex-1">
                          <Text className="font-bold text-gray-900">
                            {producto.nombre ??
                              `Producto ${
                                producto.producto_id ??
                                index + 1
                              }`}
                          </Text>

                          <Text className="mt-1 text-xs text-gray-500">
                            Cantidad:{" "}
                            {producto.cantidad}
                          </Text>
                        </View>

                        <Text className="font-black text-gray-900">
                          S/ {subtotal.toFixed(2)}
                        </Text>
                      </View>
                    );
                  }
                )}

                <View className="mt-2 border-t border-gray-200 pt-4">
                  <View className="flex-row justify-between">
                    <Text className="font-bold text-gray-700">
                      Subtotal dulcería
                    </Text>

                    <Text className="font-black text-gray-900">
                      S/ {totalProductos.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* =================================================
              CLIENTE
          ================================================= */}

          <View className="mt-6 border-t border-dashed border-gray-300 pt-6">
            <TituloSeccion
              icono="person-outline"
              titulo="Cliente"
            />

            <View className="mt-4 rounded-xl bg-gray-50 p-4">
              <FilaDato
                icono="person-outline"
                titulo="Nombre"
                valor={nombre}
              />

              <FilaDato
                icono="mail-outline"
                titulo="Correo"
                valor={correo}
              />

              <FilaDato
                icono="wallet-outline"
                titulo="Método de pago"
                valor={obtenerMetodoPago()}
                ultimo
              />
            </View>
          </View>

          {/* =================================================
              TOTAL
          ================================================= */}

          <View className="mt-6 border-t border-dashed border-gray-300 pt-6">
            <View className="rounded-2xl bg-gray-900 p-5">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-300">
                  Entradas
                </Text>

                <Text className="font-bold text-white">
                  S/ {montoEntradas.toFixed(2)}
                </Text>
              </View>

              <View className="mt-3 flex-row justify-between">
                <Text className="text-sm text-gray-300">
                  Dulcería
                </Text>

                <Text className="font-bold text-white">
                  S/ {totalProductos.toFixed(2)}
                </Text>
              </View>

              <View className="mt-4 border-t border-gray-700 pt-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-black text-white">
                    TOTAL
                  </Text>

                  <Text className="text-2xl font-black text-red-400">
                    S/ {totalGeneral.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* =================================================
              MENSAJE FINAL
          ================================================= */}

          <View className="mt-6 items-center border-t border-dashed border-gray-300 pt-6">
            <Ionicons
              name="checkmark-circle"
              size={28}
              color="#16a34a"
            />

            <Text className="mt-2 text-center font-black text-gray-900">
              ¡Gracias por tu compra!
            </Text>

            <Text className="mt-1 text-center text-xs leading-5 text-gray-500">
              Presenta este voucher al ingresar a la
              sala.
            </Text>
          </View>
        </View>

        {/* =================================================
            CORREO
        ================================================= */}

        <View className="mx-4 mt-5 flex-row rounded-2xl bg-blue-50 p-4">
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-blue-100">
            <Ionicons
              name="mail-outline"
              size={22}
              color="#2563eb"
            />
          </View>

          <View className="flex-1">
            <Text className="font-black text-gray-900">
              Voucher digital
            </Text>

            <Text className="mt-1 text-xs leading-5 text-gray-600">
              La confirmación de tu compra será
              enviada a {correo}.
            </Text>
          </View>
        </View>

        {/* =================================================
            BOTÓN FINALIZAR
        ================================================= */}

        <Pressable
          onPress={finalizarCompra}
          className="mx-4 mt-5 flex-row items-center justify-center rounded-2xl bg-red-600 py-4"
        >
          <Ionicons
            name="home-outline"
            size={21}
            color="white"
          />

          <Text className="ml-2 text-base font-black text-white">
            Finalizar y volver al inicio
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// =========================================================
// TÍTULO DE SECCIÓN
// =========================================================

function TituloSeccion({
  icono,
  titulo,
}: {
  icono: any;
  titulo: string;
}) {
  return (
    <View className="flex-row items-center">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-red-100">
        <Ionicons
          name={icono}
          size={19}
          color="#dc2626"
        />
      </View>

      <Text className="ml-3 text-lg font-black text-gray-900">
        {titulo}
      </Text>
    </View>
  );
}

// =========================================================
// FILA DE INFORMACIÓN
// =========================================================

function FilaDato({
  icono,
  titulo,
  valor,
  ultimo = false,
}: {
  icono: any;
  titulo: string;
  valor: string;
  ultimo?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center py-3 ${
        !ultimo
          ? "border-b border-gray-200"
          : ""
      }`}
    >
      <Ionicons
        name={icono}
        size={18}
        color="#6b7280"
      />

      <Text className="ml-3 text-sm text-gray-500">
        {titulo}
      </Text>

      <Text className="ml-3 flex-1 text-right text-sm font-black text-gray-900">
        {valor}
      </Text>
    </View>
  );
}