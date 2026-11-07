const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Falta configurar NEXT_PUBLIC_API_URL.")
  }

  const headers = new Headers(init.headers)
  if (typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  })

  const result = await response.json().catch(() => null)
  if (!response.ok) {
    const message = Array.isArray(result?.message)
      ? result.message.join(" ")
      : result?.message ?? "Ocurrió un error al conectar con el servidor."
    throw new ApiError(message, response.status)
  }

  return result as T
}
