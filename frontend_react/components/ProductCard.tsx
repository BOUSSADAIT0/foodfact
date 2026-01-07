"use client"

import { useState, memo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { Zap, Candy, Droplet, Leaf, Package } from "lucide-react"

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

function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link href={`/product/${product.code}`}>
      <Card className="group hover:shadow-lg transition-shadow bg-card border-border">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-muted/30 overflow-hidden">
            {!imgError && product.image_small_url ? (
              <img
                src={product.image_small_url}
                alt={product.product_name || "Product"}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <Package className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}

            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {product.nutriscore_grade && (
                <div
                  className={`w-10 h-10 rounded-lg ${
                    nutriscoreColors[product.nutriscore_grade.toLowerCase()] || "bg-muted"
                  } flex items-center justify-center shadow-md`}
                >
                  <span className="text-lg font-bold text-white uppercase">{product.nutriscore_grade}</span>
                </div>
              )}
              {product.ecoscore_grade && (
                <div
                  className={`w-10 h-10 rounded-lg ${
                    ecoscoreColors[product.ecoscore_grade.toLowerCase()] || "bg-muted"
                  } flex items-center justify-center shadow-md`}
                >
                  <Leaf className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              {product.brands && (
                <p className="text-xs text-primary font-semibold uppercase tracking-wide">{product.brands}</p>
              )}
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {product.product_name || "Produit sans nom"}
              </h3>
            </div>

            {product.quantity && (
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                {product.quantity}
              </Badge>
            )}

            {product.nutriments && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                {product.nutriments.energy !== null && product.nutriments.energy !== undefined && (
                  <div className="text-center">
                    <Zap className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs font-mono font-bold">{product.nutriments.energy}</p>
                    <p className="text-[10px] text-muted-foreground">kcal</p>
                  </div>
                )}
                {product.nutriments.sugars !== null && product.nutriments.sugars !== undefined && (
                  <div className="text-center">
                    <Candy className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs font-mono font-bold">{product.nutriments.sugars}g</p>
                    <p className="text-[10px] text-muted-foreground">Sucres</p>
                  </div>
                )}
                {product.nutriments.fat !== null && product.nutriments.fat !== undefined && (
                  <div className="text-center">
                    <Droplet className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-xs font-mono font-bold">{product.nutriments.fat}g</p>
                    <p className="text-[10px] text-muted-foreground">Graisse</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default memo(ProductCard)
