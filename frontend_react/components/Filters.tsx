"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface FiltersProps {
  filters: {
    brand: string;
    minEnergy: string;
    maxEnergy: string;
    maxSugar: string;
    maxFat: string;
  };
  onChange: (key: string, value: any) => void;
}

export default function Filters({ filters, onChange }: FiltersProps) {
  return (
    <Card className="p-4">
      <CardContent className="space-y-4">
        <Input
          placeholder="Marque"
          value={filters.brand}
          onChange={(e) => onChange("brand", e.target.value)}
        />

        <Input
          placeholder="Énergie min (kcal)"
          type="number"
          value={filters.minEnergy}
          onChange={(e) => onChange("minEnergy", e.target.value)}
        />

        <Input
          placeholder="Énergie max (kcal)"
          type="number"
          value={filters.maxEnergy}
          onChange={(e) => onChange("maxEnergy", e.target.value)}
        />

        <Input
          placeholder="Sucre max"
          type="number"
          value={filters.maxSugar}
          onChange={(e) => onChange("maxSugar", e.target.value)}
        />

        <Input
          placeholder="Graisse max"
          type="number"
          value={filters.maxFat}
          onChange={(e) => onChange("maxFat", e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
