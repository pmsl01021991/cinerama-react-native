export const API_URL = "https://cinerama-backen-react-native.onrender.com";

export const API = {
  // AUTH
  login: `${API_URL}/api/auth/login`,

  registro: `${API_URL}/api/usuarios/registro`,

  // CONTACTO
  contacto: `${API_URL}/api/contacto`,

  // RESERVAS
  reservas: `${API_URL}/api/reservas`,

  reserva: (id: number | string) =>
    `${API_URL}/api/reservas/${id}`,

  // PRODUCTOS DE UNA RESERVA
  productosReserva: (id: number | string) =>
    `${API_URL}/api/reservas/${id}/productos`,

  // ENVIAR VOUCHER AL CORREO
  enviarVoucher: (id: number | string) =>
    `${API_URL}/api/reservas/${id}/enviar-voucher`,

  // ASIENTOS OCUPADOS
  asientosOcupados: (
    cine: string,
    pelicula: string,
    sala: string,
    horario: string
  ) =>
    `${API_URL}/api/reservas/ocupados/${encodeURIComponent(
      cine
    )}/${encodeURIComponent(
      pelicula
    )}/${encodeURIComponent(
      sala
    )}/${encodeURIComponent(horario)}`,

  // ADMIN
  adminReservas: `${API_URL}/api/admin/reservas`,
  adminMensajes: `${API_URL}/api/contacto`,
};