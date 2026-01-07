"use client"

import { useEffect, useState, memo } from "react"
import { getProduct, APIError } from "@/lib/api"
import type { ProductDetailResponse } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Leaf, Zap, Candy, Droplet, AlertCircle, Sparkles, RefreshCw, Info, Shield, Tag, Package, Globe, Loader2 } from "lucide-react"
import Link from "next/link"
import ProductCard from "@/components/ProductCard"

const nutriscoreColors: Record<string, string> = {
  a: "bg-gradient-to-br from-emerald-500 to-green-600",
  b: "bg-gradient-to-br from-lime-500 to-green-500",
  c: "bg-gradient-to-br from-yellow-400 to-amber-500",
  d: "bg-gradient-to-br from-orange-500 to-orange-600",
  e: "bg-gradient-to-br from-red-500 to-rose-600",
}

const ecoscoreColors: Record<string, string> = {
  a: "bg-gradient-to-br from-emerald-500 to-green-600",
  b: "bg-gradient-to-br from-lime-500 to-green-500",
  c: "bg-gradient-to-br from-yellow-400 to-amber-500",
  d: "bg-gradient-to-br from-orange-500 to-orange-600",
  e: "bg-gradient-to-br from-red-500 to-rose-600",
}

const novaColors: Record<number, string> = {
  1: "bg-gradient-to-br from-emerald-500 to-green-600",
  2: "bg-gradient-to-br from-lime-500 to-green-500",
  3: "bg-gradient-to-br from-orange-500 to-orange-600",
  4: "bg-gradient-to-br from-red-500 to-rose-600",
}

const SkeletonLoader = memo(() => (
  <div className="space-y-6 animate-pulse">
    <div className="skeleton h-96 rounded-2xl" />
    <div className="skeleton h-64 rounded-2xl" />
    <div className="skeleton h-48 rounded-2xl" />
  </div>
))

export default function ProductClient({ code }: { code: string }) {
  const [data, setData] = useState<ProductDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getProduct(code)
      setData(result)
    } catch (err: any) {
      setError(err?.message || "Impossible de charger le produit")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6">
        <div className="container mx-auto max-w-6xl">
          <SkeletonLoader />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-destructive/10 border-destructive/20 rounded-2xl">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold text-destructive">Erreur</h2>
            <p className="text-destructive/80">{error}</p>
            <Button onClick={fetchData} className="rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { product, alternatives } = data

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 rounded-xl hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la recherche
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <Card className="bg-card/50 backdrop-blur border-border/50 rounded-2xl overflow-hidden shadow-xl">
            <CardContent className="p-8 flex items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name || "Product"}
                  className="max-h-96 w-auto object-contain"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center">
                  <Package className="w-32 h-32 text-muted-foreground/30" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in">
            {/* Title */}
            <div>
              {product.brands && (
                <p className="text-sm text-primary font-semibold uppercase tracking-wide mb-2">{product.brands}</p>
              )}
              <h1 className="text-4xl font-bold mb-2">{product.product_name || "Produit sans nom"}</h1>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {product.quantity && (
                <Badge variant="secondary" className="rounded-full px-4 py-2">
                  {product.quantity}
                </Badge>
              )}
              {product.categories && (
                <Badge variant="outline" className="rounded-full px-4 py-2">
                  {product.categories}
                </Badge>
              )}
            </div>

            {/* Countries */}
            {product.countries && (
              <Card className="border-border/50 bg-muted/30 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold mb-2">Pays de disponibilité</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.countries.split(',').map((country, idx) => (
                          <Badge key={idx} variant="secondary" className="rounded-full text-xs px-3 py-1">
                            🌍 {country.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.nutriscore_grade && (
                <Card className="border-border/50 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-xl ${
                          nutriscoreColors[product.nutriscore_grade.toLowerCase()] || "bg-muted"
                        } flex items-center justify-center shadow-lg`}
                      >
                        <span className="text-2xl font-bold text-white uppercase">{product.nutriscore_grade}</span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Nutri-Score</p>
                        <p className="font-semibold text-sm">Qualité nutritionnelle</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {product.ecoscore_grade && (
                <Card className="border-border/50 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-xl ${
                          ecoscoreColors[product.ecoscore_grade.toLowerCase()] || "bg-muted"
                        } flex items-center justify-center shadow-lg`}
                      >
                        <Leaf className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Éco-Score</p>
                        <p className="font-semibold text-sm">Impact environnemental</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {product.nova_group && (
                <Card className="border-border/50 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl ${novaColors[product.nova_group] || "bg-muted"} flex items-center justify-center shadow-lg`}>
                        <Package className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">NOVA</p>
                        <p className="font-semibold text-sm">Groupe {product.nova_group}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Nutritional Info */}
            {product.nutriments && (
              <Card className="border-border/50 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Informations nutritionnelles
                    <span className="text-sm text-muted-foreground font-normal">(pour 100g)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {product.nutriments.energy !== null && product.nutriments.energy !== undefined && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Énergie</p>
                          <p className="font-mono font-bold text-lg">{product.nutriments.energy} kcal</p>
                        </div>
                      </div>
                    )}
                    {product.nutriments.sugars !== null && product.nutriments.sugars !== undefined && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <Candy className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Sucres</p>
                          <p className="font-mono font-bold text-lg">{product.nutriments.sugars}g</p>
                        </div>
                      </div>
                    )}
                    {product.nutriments.fat !== null && product.nutriments.fat !== undefined && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <Droplet className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Matières grasses</p>
                          <p className="font-mono font-bold text-lg">{product.nutriments.fat}g</p>
                        </div>
                      </div>
                    )}
                    {product.nutriments.salt !== null && product.nutriments.salt !== undefined && (
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
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

            {/* Ingredients */}
            {product.ingredients_text && (
              <Card className="border-border/50 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Ingrédients
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {product.ingredients_text}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Allergens */}
            {product.allergens && (
              <Card className="border-border/50 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Allergènes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.split(',').map((allergen, idx) => (
                      <Badge key={idx} variant="outline" className="rounded-full text-sm px-3 py-1">
                        {allergen.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Labels */}
            {product.labels && (
              <Card className="border-border/50 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Labels
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.labels.split(',').map((label, idx) => (
                      <Badge key={idx} variant="secondary" className="rounded-full text-sm px-3 py-1">
                        {label.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Alternatives */}
        {alternatives && alternatives.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {alternatives.map((alt, idx) => (
                <div key={alt.code} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in">
                  <ProductCard product={alt} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
