"use client"

import { useMemo } from "react"
import type { Product } from "@/lib/types"
import { calculateStats, type ProductStats as Stats } from "@/lib/dataUtils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Award, Globe, Tag } from "lucide-react"

interface ProductStatsProps {
  products: Product[]
}

export default function ProductStats({ products }: ProductStatsProps) {
  const stats = useMemo(() => calculateStats(products), [products])

  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Statistiques des produits</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Énergie moyenne</p>
              <p className="text-2xl font-bold">{Math.round(stats.avgEnergy)}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Sucres moyens</p>
              <p className="text-2xl font-bold">{stats.avgSugar.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">g/100g</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Graisses moyennes</p>
              <p className="text-2xl font-bold">{stats.avgFat.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">g/100g</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Plage d'énergie</p>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold">{stats.minEnergy}</span>
                <span className="text-muted-foreground">-</span>
                <span className="font-mono font-bold">{stats.maxEnergy}</span>
                <TrendingUp className="w-4 h-4 text-primary ml-auto" />
                <span className="text-xs text-muted-foreground">kcal</span>
              </div>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Plage de sucres</p>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold">{stats.minSugar.toFixed(1)}</span>
                <span className="text-muted-foreground">-</span>
                <span className="font-mono font-bold">{stats.maxSugar.toFixed(1)}</span>
                <TrendingUp className="w-4 h-4 text-primary ml-auto" />
                <span className="text-xs text-muted-foreground">g</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.keys(stats.nutriscoreDistribution).length > 0 && (
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Distribution Nutri-Score</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.nutriscoreDistribution)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([grade, count]) => (
                  <Badge key={grade} variant="secondary" className="px-3 py-1">
                    {grade.toUpperCase()}: {count}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.topBrands.length > 0 && (
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Top Marques</h3>
            </div>
            <div className="space-y-2">
              {stats.topBrands.map(({ brand, count }, idx) => (
                <div key={brand} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <span className="text-sm font-medium">{idx + 1}. {brand}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.topCountries.length > 0 && (
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Top Pays</h3>
            </div>
            <div className="space-y-2">
              {stats.topCountries.map(({ country, count }, idx) => (
                <div key={country} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <span className="text-sm font-medium">🌍 {idx + 1}. {country}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

