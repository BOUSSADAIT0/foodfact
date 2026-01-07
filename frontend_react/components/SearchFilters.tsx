"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Globe, Zap, Candy, Droplet, ArrowUpDown } from "lucide-react"
import type { SearchFilters as FilterType } from "@/lib/types"

interface SearchFiltersProps {
  filters: FilterType
  onChange: (key: keyof FilterType, value: string) => void
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
  { value: "Tunisie", label: "🇹🇳 Tunisie" },
  { value: "Algérie", label: "🇩🇿 Algérie" },
  { value: "États-Unis", label: "🇺🇸 États-Unis" },
  { value: "Royaume-Uni", label: "🇬🇧 Royaume-Uni" },
]

export default function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  return (
    <div className="w-full bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-sm p-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Filtre Pays */}
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="country" className="text-sm font-medium mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Pays
          </Label>
          <select
            id="country"
            value={filters.country}
            onChange={(e) => onChange("country", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre Trier par */}
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="sortBy" className="text-sm font-medium mb-2 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-primary" />
            Trier par
          </Label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => onChange("sortBy", e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">Aucun</option>
            <option value="energy">Énergie</option>
            <option value="sugars">Sucres</option>
            <option value="fat">Matières grasses</option>
          </select>
        </div>

        {/* Filtre Ordre (si sortBy est sélectionné) */}
        {filters.sortBy && (
          <div className="flex-1 min-w-[150px]">
            <Label htmlFor="order" className="text-sm font-medium mb-2">
              Ordre
            </Label>
            <select
              id="order"
              value={filters.order}
              onChange={(e) => onChange("order", e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="asc">Croissant</option>
              <option value="desc">Décroissant</option>
            </select>
          </div>
        )}

        {/* Filtre Énergie */}
        <div className="flex-1 min-w-[200px]">
          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Énergie (kcal)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                id="minEnergy"
                type="number"
                value={filters.minEnergy}
                onChange={(e) => onChange("minEnergy", e.target.value)}
                placeholder="Min"
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
              />
            </div>
            <div>
              <Input
                id="maxEnergy"
                type="number"
                value={filters.maxEnergy}
                onChange={(e) => onChange("maxEnergy", e.target.value)}
                placeholder="Max"
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Filtre Sucres */}
        <div className="flex-1 min-w-[200px]">
          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Candy className="w-4 h-4 text-primary" />
            Sucres (g)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                id="minSugar"
                type="number"
                value={filters.minSugar}
                onChange={(e) => onChange("minSugar", e.target.value)}
                placeholder="Min"
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
              />
            </div>
            <div>
              <Input
                id="maxSugar"
                type="number"
                value={filters.maxSugar}
                onChange={(e) => onChange("maxSugar", e.target.value)}
                placeholder="Max"
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Filtre Matières grasses */}
        <div className="flex-1 min-w-[200px]">
          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-primary" />
            Graisses (g)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                id="minFat"
                type="number"
                value={filters.minFat}
                onChange={(e) => onChange("minFat", e.target.value)}
                placeholder="Min"
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
              />
            </div>
            <div>
              <Input
                id="maxFat"
                type="number"
                value={filters.maxFat}
                onChange={(e) => onChange("maxFat", e.target.value)}
                placeholder="Max"
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
