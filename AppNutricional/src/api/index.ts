export const API_URL = "http://localhost:3000"; // Si usas simulador iOS funciona

export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}