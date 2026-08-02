import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "@cinerama_usuario";

export type UsuarioSesion = {
  id?: number;
  nombre: string;
  apellidos?: string;
  correo?: string;
  rol: string;
};

export const guardarSesion = async (
  usuario: UsuarioSesion
) => {
  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(usuario)
  );
};

export const obtenerSesion = async () => {
  const data = await AsyncStorage.getItem(SESSION_KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as UsuarioSesion;
};

export const cerrarSesion = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};