const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = "APIError"
  }
}

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!res.ok) {
      let errorMessage = "Une erreur est survenue"
      if (res.status === 0 || res.status >= 500) {
        errorMessage = "Le serveur backend n'est pas disponible"
      } else if (res.status === 404) {
        errorMessage = "Ressource introuvable"
      } else if (res.status === 400) {
        errorMessage = "Requête invalide"
      }
      throw new APIError(errorMessage, res.status, "FETCH_ERROR")
    }

    return res
  } catch (error) {
    if (error instanceof APIError) throw error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new APIError(
        "Impossible de se connecter au serveur",
        0,
        "NETWORK_ERROR"
      )
    }
    throw new APIError(
      error instanceof Error ? error.message : "Une erreur inattendue est survenue",
      undefined,
      "UNKNOWN_ERROR"
    )
  }
}

export async function searchProducts(params: any): Promise<SearchResponse> {
  const entries = Object.entries(params || {}).filter(([k, v]) => {
    if (k === "q") return true
    return v !== undefined && v !== null && String(v).trim() !== ""
  })

  const qs = new URLSearchParams(entries as any)
  const url = `${API_URL}/api/search?${qs.toString()}`
  const res = await fetchWithErrorHandling(url)
  return res.json()
}

export async function getProduct(code: string): Promise<ProductDetailResponse> {
  const res = await fetchWithErrorHandling(`${API_URL}/api/product/${code}`)
  return res.json()
}

export type { SearchResponse, ProductDetailResponse } from "./types"
