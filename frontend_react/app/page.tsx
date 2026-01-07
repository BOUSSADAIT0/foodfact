"use client"

import { useState, useEffect, useCallback } from "react"
import { searchProducts } from "@/lib/api"
import type { Product, SearchFilters } from "@/lib/types"
import ProductCard from "@/components/ProductCard"
import SearchFilters from "@/components/SearchFilters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sparkles, AlertCircle, X, RotateCcw, Loader2 } from "lucide-react"

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    brand: "",
    country: "",
    sortBy: "",
    order: "asc",
    minEnergy: "",
    maxEnergy: "",
    minSugar: "",
    maxSugar: "",
    minFat: "",
    maxFat: "",
  })

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      brand: "",
      country: "",
      sortBy: "",
      order: "asc",
      minEnergy: "",
      maxEnergy: "",
      minSugar: "",
      maxSugar: "",
      minFat: "",
      maxFat: "",
    })
    setQuery("")
    setSearchInput("")
    setError(null)
  }, [])

  const fetchData = useCallback(async () => {
    if (!query && !Object.values(filters).some((v) => v)) {
      setProducts([])
      setCount(0)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await searchProducts({ q: query || "", ...filters })
      setProducts(data?.products || [])
      setCount(data?.count || 0)
    } catch (error: any) {
      setProducts([])
      setCount(0)
      setError(error?.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }, [query, filters])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchData])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setQuery(searchInput)
  }, [searchInput])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FoodFact Recherche</h1>
              <p className="text-xs text-muted-foreground">Des choix alimentaires plus intelligents</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Découvrez des Choix <span className="text-primary">Alimentaires Plus Sains</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Recherchez parmi des milliers de produits avec des filtres avancés et trouvez de meilleures alternatives
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Recherchez des produits, marques ou catégories..."
              className="pl-12 pr-24 h-12 sm:h-14 text-base sm:text-lg bg-card border-border"
            />
            <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 sm:h-10 text-sm sm:text-base">
              Rechercher
            </Button>
          </form>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-4 sm:mb-6 px-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-destructive mb-1">Erreur de connexion</h4>
                <p className="text-xs sm:text-sm text-destructive/80 break-words">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-destructive/60 hover:text-destructive transition-colors flex-shrink-0"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
            <SearchFilters filters={filters} onChange={updateFilter} onReset={resetFilters} />
          </aside>

          <main className="flex-1 min-w-0 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-12 sm:py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary" />
                  <p className="text-sm sm:text-base text-muted-foreground">Recherche de produits...</p>
                </div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <span className="text-foreground font-semibold">{count}</span> produit{count > 1 ? "s" : ""} trouvé
                      {count > 1 ? "s" : ""}
                    </p>
                    {filters.country && (
                      <p className="text-xs text-primary mt-1">
                        🌍 Filtre actif: <span className="font-semibold">{filters.country}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.code} product={product} />
                  ))}
                </div>
              </>
            ) : query || Object.values(filters).some((v) => v) ? (
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">Essayez d'ajuster votre recherche ou vos filtres</p>
                <Button variant="outline" onClick={resetFilters} size="sm" className="text-xs sm:text-sm">
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Commencez votre recherche</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Entrez un nom de produit ou utilisez les filtres pour commencer</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
