import { API } from "./api";

export type LoginResponse = {
  ok: boolean;
  usuario: {
    id?: number;
    nombre: string;
    apellidos?: string;
    correo: string;
    rol: "USUARIO" | "ADMIN";
  };
};

export async function loginUsuario(
  usuario: string,
  password: string,
  captcha: string
): Promise<LoginResponse> {
  const response = await fetch(API.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario: usuario.trim().toLowerCase(),
      password,
      captcha,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.mensaje ||
      data.error ||
      "Correo o contraseña incorrectos."
    );
  }

  return data;
}