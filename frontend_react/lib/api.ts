import type { SearchResponse, ProductDetailResponse } from "./types"

export const API_URL = "http://localhost:8080"

export async function searchProducts(params: any): Promise<SearchResponse> {
  // Remove empty/null/undefined filter values to avoid sending e.g. brand="" which
  // would match everything on the backend ("" is contained in any string).
  // Keep `q` even if empty because the backend expects that parameter.
  const entries = Object.entries(params || {}).filter(([k, v]) => {
    if (k === "q") return true
    return v !== undefined && v !== null && String(v).trim() !== ""
  })

  const qs = new URLSearchParams(entries as any)
  const url = `${API_URL}/api/search?` + qs.toString()
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error("API Error")
  }

  return res.json()
}

export async function getProduct(code: string): Promise<ProductDetailResponse> {
  const res = await fetch(`${API_URL}/api/product/${code}`)

  if (!res.ok) {
    throw new Error("API Error")
  }

  return res.json()
}
