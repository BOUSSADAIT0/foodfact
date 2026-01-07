export interface Nutriments {
  energy?: number | null
  sugars?: number | null
  salt?: number | null
  fat?: number | null
}

export interface Product {
  code: string
  product_name?: string | null
  brands?: string | null
  categories?: string | null
  quantity?: string | null
  nutriscore_grade?: string | null
  ecoscore_grade?: string | null
  image_url?: string | null
  image_small_url?: string | null
  nutriments?: Nutriments | null
}

export interface SearchResponse {
  count: number
  products: Product[]
}

export interface ProductDetailResponse {
  product: Product
  alternatives: Product[]
}

export interface SearchFilters {
  country: string
  sortBy: string
  order: string
  minEnergy: string
  maxEnergy: string
  minSugar: string
  maxSugar: string
  minFat: string
  maxFat: string
}
