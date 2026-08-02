import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { obtenerSesion } from "../services/sessionService";

type Ruta =
  | "/"
  | "/cartelera"
  | "/estrenos"
  | "/cines"
  | "/contacto"
  | "/admin";

type NavItem = {
  nombre: string;
  ruta: Ruta;
  icono: keyof typeof Ionicons.glyphMap;
  iconoActivo: keyof typeof Ionicons.glyphMap;
};

const opciones: NavItem[] = [
  {
    nombre: "Inicio",
    ruta: "/",
    icono: "home-outline",
    iconoActivo: "home",
  },
  {
    nombre: "Cartelera",
    ruta: "/cartelera",
    icono: "film-outline",
    iconoActivo: "film",
  },
  {
    nombre: "Estrenos",
    ruta: "/estrenos",
    icono: "star-outline",
    iconoActivo: "star",
  },
  {
    nombre: "Cines",
    ruta: "/cines",
    icono: "location-outline",
    iconoActivo: "location",
  },
  {
    nombre: "Contacto",
    ruta: "/contacto",
    icono: "mail-outline",
    iconoActivo: "mail",
  },
];

const opcionAdmin: NavItem = {
  nombre: "Admin",
  ruta: "/admin",
  icono: "shield-checkmark-outline",
  iconoActivo: "shield-checkmark",
};

export default function BottomNav() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const revisarSesion = async () => {
      const sesion = await obtenerSesion();

      setEsAdmin(sesion?.rol === "ADMIN");
    };

    revisarSesion();
  }, [pathname]);

  const navegar = (ruta: Ruta) => {
    if (pathname === ruta) return;

    router.replace(ruta);
  };

  const opcionesVisibles = esAdmin
    ? [...opciones, opcionAdmin]
    : opciones;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,

        flexDirection: "row",
        alignItems: "flex-start",

        backgroundColor: "#dc2626",

        borderTopWidth: 1,
        borderTopColor: "#b91c1c",

        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 8),

        minHeight: 68 + insets.bottom,

        elevation: 20,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,

        zIndex: 999,
      }}
    >
      {opcionesVisibles.map((item) => {
        const activo = pathname === item.ruta;

        return (
          <Pressable
            key={item.ruta}
            onPress={() => navegar(item.ruta)}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={
                activo
                  ? item.iconoActivo
                  : item.icono
              }
              size={esAdmin ? 23 : 26}
              color="white"
            />

            <Text
              numberOfLines={1}
              style={{
                color: "white",
                fontSize: esAdmin ? 10 : 12,
                marginTop: 3,
                fontWeight: activo ? "800" : "400",
              }}
            >
              {item.nombre}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}