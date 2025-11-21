export const API_URL = "http://localhost:3000"; // Si usas simulador iOS funciona

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}
export async function apiPost<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}