"use client"

import { useEffect, useState } from "react"
import { getProduct } from "@/lib/api"
import type { ProductDetailResponse } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Leaf, Zap, Candy, Droplet, AlertCircle, Sparkles, Award } from "lucide-react"
import Link from "next/link"
import ProductCard from "@/components/ProductCard"

export default function ProductClient({ code }: { code: string }) {
  const [data, setData] = useState<ProductDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const result = await getProduct(code)
        setData(result)
      } catch (err) {
        console.error("[v0] Error loading product:", err)
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Produit introuvable</h2>
          <p className="text-muted-foreground mb-6">Impossible de charger les détails du produit</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la recherche
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const { product, alternatives } = data

  const nutriscoreColors: Record<string, string> = {
    a: "bg-green-500",
    b: "bg-lime-500",
    c: "bg-yellow-500",
    d: "bg-orange-500",
    e: "bg-red-500",
  }

  const ecoscoreColors: Record<string, string> = {
    a: "bg-green-500",
    b: "bg-lime-500",
    c: "bg-yellow-500",
    d: "bg-orange-500",
    e: "bg-red-500",
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la recherche
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="bg-card border border-border/50 rounded-xl p-8 flex items-center justify-center aspect-square">
              {product.image_url ? (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.product_name || "Produit"}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Award className="w-24 h-24" />
                  <p>Aucune image disponible</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-balance">{product.product_name || "Produit sans nom"}</h1>
                {product.brands && <p className="text-lg text-muted-foreground">{product.brands}</p>}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                {product.quantity && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {product.quantity}
                  </Badge>
                )}
                {product.categories && (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {product.categories}
                  </Badge>
                )}
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                {product.nutriscore_grade && (
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg ${
                            nutriscoreColors[product.nutriscore_grade.toLowerCase()] || "bg-muted"
                          } flex items-center justify-center`}
                        >
                          <span className="text-xl font-bold text-white uppercase">{product.nutriscore_grade}</span>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Nutri-Score</p>
                          <p className="font-semibold">Qualité nutritionnelle</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {product.ecoscore_grade && (
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg ${
                            ecoscoreColors[product.ecoscore_grade.toLowerCase()] || "bg-muted"
                          } flex items-center justify-center`}
                        >
                          <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Éco-Score</p>
                          <p className="font-semibold">Impact environnemental</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Nutritional Information */}
              {product.nutriments && (
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Informations nutritionnelles
                      <span className="text-sm text-muted-foreground font-normal ml-1">(pour 100g)</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {product.nutriments.energy !== null && product.nutriments.energy !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Énergie</p>
                            <p className="font-mono font-bold text-lg">{product.nutriments.energy} kcal</p>
                          </div>
                        </div>
                      )}
                      {product.nutriments.sugars !== null && product.nutriments.sugars !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Candy className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Sucres</p>
                            <p className="font-mono font-bold text-lg">{product.nutriments.sugars}g</p>
                          </div>
                        </div>
                      )}
                      {product.nutriments.fat !== null && product.nutriments.fat !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Droplet className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Matières grasses</p>
                            <p className="font-mono font-bold text-lg">{product.nutriments.fat}g</p>
                          </div>
                        </div>
                      )}
                      {product.nutriments.salt !== null && product.nutriments.salt !== undefined && (
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Sel</p>
                            <p className="font-mono font-bold text-lg">{product.nutriments.salt}g</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {alternatives && alternatives.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Alternatives plus saines</h2>
                <p className="text-muted-foreground">Produits similaires qui pourraient être de meilleurs choix</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {alternatives.map((alt) => (
                  <ProductCard key={alt.code} product={alt} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
