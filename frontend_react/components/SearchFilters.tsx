"use client"

import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { SearchFilters } from "@/lib/types"
import { Filter, RotateCcw, Globe, Tag, Zap, Candy, Droplet, ArrowUpDown } from "lucide-react"

interface SearchFiltersProps {
  filters: SearchFilters
  onChange: (key: string, value: any) => void
  onReset: () => void
}

const countries = [
  { value: "", label: "Tous les pays" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Belgique", label: "🇧🇪 Belgique" },
  { value: "Suisse", label: "🇨🇭 Suisse" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Espagne", label: "🇪🇸 Espagne" },
  { value: "Italie", label: "🇮🇹 Italie" },
  { value: "Allemagne", label: "🇩🇪 Allemagne" },
  { value: "Maroc", label: "🇲🇦 Maroc" },
]

function SearchFiltersComponent({ filters, onChange, onReset }: SearchFiltersProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Filtres Avancés</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-medium flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            Marque
          </Label>
          <Input
            id="brand"
            value={filters.brand}
            onChange={(e) => onChange("brand", e.target.value)}
            placeholder="ex: Carrefour"
            className="bg-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Pays
          </Label>
          <select
            id="country"
            value={filters.country}
            onChange={(e) => onChange("country", e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">Filtrer par pays de disponibilité</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy" className="text-sm font-medium flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-primary" />
            Trier par
          </Label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => onChange("sortBy", e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Aucun</option>
            <option value="energy">Énergie</option>
            <option value="sugars">Sucres</option>
            <option value="fat">Matières grasses</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Énergie (kcal/100g)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.minEnergy}
              onChange={(e) => onChange("minEnergy", e.target.value)}
              className="bg-background border-border"
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.maxEnergy}
              onChange={(e) => onChange("maxEnergy", e.target.value)}
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Candy className="w-4 h-4 text-primary" />
            Sucres (g/100g)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.minSugar}
              onChange={(e) => onChange("minSugar", e.target.value)}
              className="bg-background border-border"
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.maxSugar}
              onChange={(e) => onChange("maxSugar", e.target.value)}
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Droplet className="w-4 h-4 text-primary" />
            Matières grasses (g/100g)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.minFat}
              onChange={(e) => onChange("minFat", e.target.value)}
              className="bg-background border-border"
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.maxFat}
              onChange={(e) => onChange("maxFat", e.target.value)}
              className="bg-background border-border"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default memo(SearchFiltersComponent)
