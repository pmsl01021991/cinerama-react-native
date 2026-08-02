import { API } from "./api";

export type ReservaAdmin = {
  id: number;
  cine: string;
  pelicula_titulo: string;
  tipo_cine: string;
  sala: string;
  horario: string;
  asientos: string;
  cantidad_entradas: number;
  monto_entradas: number;
  nombre_cliente: string | null;
  correo_cliente: string | null;
  estado: string;
  fecha_creacion: string;
};

export type MensajeAdmin = {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  asunto: string;
  cine: string;
  mensaje: string;
  fecha: string;
};

export async function obtenerReservasAdmin(): Promise<
  ReservaAdmin[]
> {
  const response = await fetch(API.adminReservas);

  if (!response.ok) {
    throw new Error("No se pudieron obtener las reservaciones.");
  }

  return await response.json();
}

export async function obtenerMensajesAdmin(): Promise<
  MensajeAdmin[]
> {
  const response = await fetch(API.adminMensajes);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los mensajes.");
  }

  return await response.json();
}