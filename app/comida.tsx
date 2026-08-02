import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StatusBar, Text, View,} from "react-native";
import { SafeAreaView, useSafeAreaInsets, } from "react-native-safe-area-context";

// =========================================================
// TIPOS
// =========================================================

type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  desc: string;
  imagen: any;
};

type Carrito = {
  [productoId: number]: number;
};

// =========================================================
// PRODUCTOS
// Los mismos que tenías en comida.js
// =========================================================

const PRODUCTOS: Producto[] = [
  {
    id: 1,
    nombre: "Combo Pollo",
    categoria: "Combo",
    precio: 25,
    desc: "Pollo + papas + gaseosa mediana",
    imagen: {
      uri: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=60",
    },
  },
  {
    id: 2,
    nombre: "Combo Nachos",
    categoria: "Combo",
    precio: 18,
    desc: "Nachos con queso + gaseosa",
    imagen: {
      uri: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=60",
    },
  },
  {
    id: 3,
    nombre: "Gaseosa",
    categoria: "Bebida",
    precio: 6,
    desc: "Coca-Cola / Inka Kola / Sprite (mediana)",
    imagen: {
      uri: "https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=900&q=60",
    },
  },
  {
    id: 4,
    nombre: "Agua",
    categoria: "Bebida",
    precio: 4,
    desc: "Agua sin gas (500ml)",

    // Después puedes reemplazarla por tu imagen local:
    // require("../assets/images/aguasingas.webp")

    imagen: {
      uri: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=60",
    },
  },
  {
    id: 5,
    nombre: "Galletas",
    categoria: "Snack",
    precio: 4,
    desc: "Pack de galletas dulces",
    imagen: {
      uri: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=60",
    },
  },
  {
    id: 6,
    nombre: "Popcorn Grande",
    categoria: "Snack",
    precio: 12,
    desc: "Cancha grande (mantequilla opcional)",
    imagen: {
      uri: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=900&q=60",
    },
  },
];

// =========================================================
// PANTALLA COMIDA
// =========================================================

export default function Comida() {
  const insets = useSafeAreaInsets();
  // =======================================================
  // RECIBIR DATOS DE ASIENTOS
  // =======================================================

  const params = useLocalSearchParams<{
    reservaId?: string;
    peliculaId?: string;
    titulo?: string;
    sala?: string;
    horario?: string;
    tipoCine?: string;
    asientos?: string;
    cantidadEntradas?: string;
    montoEntradas?: string;
    }>();

const reservaId = params.reservaId ?? "";

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

  // =======================================================
  // CARRITO
  // =======================================================

  const [carrito, setCarrito] = useState<Carrito>({});

  // =======================================================
  // CAMBIAR CANTIDAD
  // =======================================================

  const cambiarCantidad = (
    productoId: number,
    cambio: number
  ) => {
    setCarrito((actual) => {
      const cantidadActual = actual[productoId] ?? 0;

      const nuevaCantidad = Math.max(
        0,
        cantidadActual + cambio
      );

      const nuevoCarrito = {
        ...actual,
      };

      if (nuevaCantidad === 0) {
        delete nuevoCarrito[productoId];
      } else {
        nuevoCarrito[productoId] = nuevaCantidad;
      }

      return nuevoCarrito;
    });
  };

  // =======================================================
  // AGREGAR PRODUCTO
  // =======================================================

  const agregarProducto = (productoId: number) => {
    setCarrito((actual) => {
      const cantidadActual = actual[productoId] ?? 0;

      return {
        ...actual,
        [productoId]:
          cantidadActual === 0
            ? 1
            : cantidadActual,
      };
    });
  };

  // =======================================================
  // TOTAL PRODUCTOS
  // =======================================================

  const totalProductos = useMemo(() => {
    return PRODUCTOS.reduce((total, producto) => {
      const cantidad = carrito[producto.id] ?? 0;

      return total + producto.precio * cantidad;
    }, 0);
  }, [carrito]);

  // =======================================================
  // PRODUCTOS DEL RESUMEN
  // =======================================================

  const productosSeleccionados = useMemo(() => {
    return PRODUCTOS.filter(
      (producto) => (carrito[producto.id] ?? 0) > 0
    );
  }, [carrito]);

  // =======================================================
  // TOTAL GENERAL
  // =======================================================

  const totalGeneral =
    montoEntradas + totalProductos;

  // =======================================================
  // CONTINUAR A PAGO
  // =======================================================

  const continuarPago = () => {
    const productos = productosSeleccionados.map(
      (producto) => ({
        producto_id: producto.id,
        nombre: producto.nombre,
        cantidad: carrito[producto.id],
        precio_unitario: producto.precio,
        subtotal:
          producto.precio *
          carrito[producto.id],
      })
    );

    router.push({
      pathname: "/pago",

      params: {
        reservaId,
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
          JSON.stringify(productos),

        totalProductos:
          totalProductos.toString(),

        totalGeneral:
          totalGeneral.toString(),
      },
    });
  };

  // =======================================================
  // SALTAR COMIDA
  // =======================================================

  const saltarComida = () => {
    router.push({
      pathname: "/pago",

      params: {
        reservaId,
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

        productos: JSON.stringify([]),

        totalProductos: "0",

        totalGeneral:
          montoEntradas.toString(),
      },
    });
  };

  // =======================================================
  // REGRESAR
  // =======================================================

  const regresar = () => {
    if (productosSeleccionados.length === 0) {
      router.back();
      return;
    }

    Alert.alert(
      "¿Deseas regresar?",
      "Los productos seleccionados se eliminarán.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Regresar",
          style: "destructive",
          onPress: () => router.back(),
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

      <View className="h-16 flex-row items-center bg-red-600 px-4">
        <Pressable
          onPress={regresar}
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
            Dulcería
          </Text>

          <Text className="text-xs text-red-100">
            Agrega algo para disfrutar tu película
          </Text>
        </View>

        <Ionicons
          name="fast-food-outline"
          size={27}
          color="white"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 150 + insets.bottom,
        }}
      >
        {/* =================================================
            INFORMACIÓN DE LA PELÍCULA
        ================================================= */}

        <View className="bg-gray-900 px-5 py-5">
          <Text
            numberOfLines={2}
            className="text-xl font-black text-white"
          >
            {titulo}
          </Text>

          <View className="mt-3 flex-row flex-wrap">
            <InfoFuncion
              icono="film-outline"
              texto={tipoCine}
            />

            <InfoFuncion
              icono="time-outline"
              texto={horario}
            />

            <InfoFuncion
              icono="location-outline"
              texto={`Sala ${sala}`}
            />
          </View>

          <View className="mt-3 flex-row items-center">
            <Ionicons
              name="ticket-outline"
              size={16}
              color="#f87171"
            />

            <Text className="ml-2 text-sm text-gray-300">
              {cantidadEntradas} entrada
              {cantidadEntradas !== 1 ? "s" : ""}
              {"  •  "}
              {asientos}
            </Text>
          </View>
        </View>

        {/* =================================================
            TÍTULO
        ================================================= */}

        <View className="px-4 pt-6">
          <Text className="text-3xl font-black text-gray-900">
            Elige tus favoritos
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            Combos, bebidas y snacks para disfrutar
            la función.
          </Text>

          {/* =================================================
              PRODUCTOS
          ================================================= */}

          <View className="mt-6">
            {PRODUCTOS.map((producto) => {
              const cantidad =
                carrito[producto.id] ?? 0;

              return (
                <View
                  key={producto.id}
                  className="mb-5 overflow-hidden rounded-2xl bg-white shadow"
                >
                  {/* IMAGEN */}

                  <Image
                    source={producto.imagen}
                    style={{
                      width: "100%",
                      height: 190,
                    }}
                    resizeMode="cover"
                  />

                  {/* CATEGORÍA */}

                  <View className="absolute left-3 top-3 rounded-lg bg-red-600 px-3 py-1">
                    <Text className="text-xs font-black uppercase text-white">
                      {producto.categoria}
                    </Text>
                  </View>

                  {/* INFORMACIÓN */}

                  <View className="p-4">
                    <View className="flex-row justify-between">
                      <View className="mr-3 flex-1">
                        <Text className="text-xl font-black text-gray-900">
                          {producto.nombre}
                        </Text>

                        <Text className="mt-1 text-sm leading-5 text-gray-500">
                          {producto.desc}
                        </Text>
                      </View>

                      <Text className="text-xl font-black text-red-600">
                        S/ {producto.precio.toFixed(2)}
                      </Text>
                    </View>

                    {/* CANTIDAD */}

                    <View className="mt-5 flex-row items-center justify-between">
                      <View className="flex-row items-center rounded-xl bg-gray-100 p-1">
                        <Pressable
                          onPress={() =>
                            cambiarCantidad(
                              producto.id,
                              -1
                            )
                          }
                          className="h-10 w-10 items-center justify-center rounded-lg bg-white"
                        >
                          <Ionicons
                            name="remove"
                            size={22}
                            color="#111827"
                          />
                        </Pressable>

                        <Text className="w-12 text-center text-lg font-black text-gray-900">
                          {cantidad}
                        </Text>

                        <Pressable
                          onPress={() =>
                            cambiarCantidad(
                              producto.id,
                              1
                            )
                          }
                          className="h-10 w-10 items-center justify-center rounded-lg bg-red-600"
                        >
                          <Ionicons
                            name="add"
                            size={22}
                            color="white"
                          />
                        </Pressable>
                      </View>

                      <Pressable
                        onPress={() =>
                          agregarProducto(
                            producto.id
                          )
                        }
                        className={`rounded-xl px-4 py-3 ${
                          cantidad > 0
                            ? "bg-green-600"
                            : "bg-gray-900"
                        }`}
                      >
                        <View className="flex-row items-center">
                          <Ionicons
                            name={
                              cantidad > 0
                                ? "checkmark-circle"
                                : "cart-outline"
                            }
                            size={18}
                            color="white"
                          />

                          <Text className="ml-2 text-xs font-black text-white">
                            {cantidad > 0
                              ? "Agregado"
                              : "Agregar"}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* =================================================
              RESUMEN
          ================================================= */}

          <View className="mb-5 rounded-2xl bg-white p-5 shadow">
            <View className="flex-row items-center">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-red-100">
                <Ionicons
                  name="receipt-outline"
                  size={23}
                  color="#dc2626"
                />
              </View>

              <Text className="ml-3 text-xl font-black text-gray-900">
                Resumen de compra
              </Text>
            </View>

            {/* ENTRADAS */}

            <View className="mt-5 flex-row justify-between">
              <Text className="text-sm text-gray-500">
                Entradas
              </Text>

              <Text className="font-black text-gray-900">
                {cantidadEntradas}
              </Text>
            </View>

            {/* BUTACAS */}

            <View className="mt-3 flex-row items-start justify-between">
              <Text className="text-sm text-gray-500">
                Butacas
              </Text>

              <Text
                style={{
                  maxWidth: "65%",
                }}
                className="text-right font-black text-gray-900"
              >
                {asientos}
              </Text>
            </View>

            {/* MONTO ENTRADAS */}

            <View className="mt-3 flex-row justify-between">
              <Text className="text-sm text-gray-500">
                Total entradas
              </Text>

              <Text className="font-black text-gray-900">
                S/ {montoEntradas.toFixed(2)}
              </Text>
            </View>

            {/* PRODUCTOS */}

            <View className="mt-5 border-t border-gray-200 pt-4">
              <Text className="mb-3 text-sm font-black text-gray-900">
                Productos
              </Text>

              {productosSeleccionados.length ===
              0 ? (
                <Text className="text-sm text-gray-400">
                  Ningún producto seleccionado.
                </Text>
              ) : (
                productosSeleccionados.map(
                  (producto) => {
                    const cantidad =
                      carrito[producto.id];

                    const subtotal =
                      producto.precio *
                      cantidad;

                    return (
                      <View
                        key={producto.id}
                        className="mb-3 flex-row justify-between"
                      >
                        <Text className="flex-1 text-sm text-gray-600">
                          {producto.nombre} x
                          {cantidad}
                        </Text>

                        <Text className="font-bold text-gray-900">
                          S/ {subtotal.toFixed(2)}
                        </Text>
                      </View>
                    );
                  }
                )
              )}
            </View>

            {/* TOTAL PRODUCTOS */}

            <View className="mt-2 flex-row justify-between">
              <Text className="font-bold text-gray-500">
                Total productos
              </Text>

              <Text className="font-black text-gray-900">
                S/ {totalProductos.toFixed(2)}
              </Text>
            </View>

            {/* TOTAL GENERAL */}

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

          {/* =================================================
              SALTAR
          ================================================= */}

          <Pressable
            onPress={saltarComida}
            className="mb-5 items-center py-3"
          >
            <Text className="font-bold text-gray-500">
              No quiero agregar productos
            </Text>

            <Text className="mt-1 text-xs text-gray-400">
              Saltar y continuar al pago
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* =================================================
          BARRA INFERIOR
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
            onPress={continuarPago}
            className="flex-row items-center rounded-xl bg-red-600 px-6 py-4"
          >
            <Text className="font-black text-white">
              Continuar
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="white"
              style={{
                marginLeft: 8,
              }}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// =========================================================
// PEQUEÑO COMPONENTE PARA LA INFORMACIÓN
// =========================================================

type InfoFuncionProps = {
  icono:
    | "film-outline"
    | "time-outline"
    | "location-outline";

  texto: string;
};

function InfoFuncion({
  icono,
  texto,
}: InfoFuncionProps) {
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