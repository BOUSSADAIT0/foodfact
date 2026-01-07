"use client"

import { useState, useMemo } from "react"
import type { Product } from "@/lib/types"
import { sortProducts, type SortField, type SortOrder } from "@/lib/dataUtils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface DataTableProps {
  products: Product[]
  pageSize?: number
}

export default function DataTable({ products, pageSize = 20 }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>("product_name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const sortedProducts = useMemo(() => {
    return sortProducts(products, sortField, sortOrder)
  }, [products, sortField, sortOrder])

  const totalPages = Math.ceil(sortedProducts.length / pageSize)
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSort(field)}
        className="h-8 px-2 hover:bg-muted"
      >
        {children}
        {isActive ? (
          sortOrder === "asc" ? (
            <ArrowUp className="w-3 h-3 ml-1" />
          ) : (
            <ArrowDown className="w-3 h-3 ml-1" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />
        )}
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3">
                    <SortButton field="product_name">Produit</SortButton>
                  </th>
                  <th className="text-left p-3">
                    <SortButton field="brands">Marque</SortButton>
                  </th>
                  <th className="text-left p-3">
                    <SortButton field="energy">Énergie (kcal)</SortButton>
                  </th>
                  <th className="text-left p-3">
                    <SortButton field="sugars">Sucres (g)</SortButton>
                  </th>
                  <th className="text-left p-3">
                    <SortButton field="fat">Graisses (g)</SortButton>
                  </th>
                  <th className="text-left p-3">
                    <SortButton field="nutriscore_grade">Nutri-Score</SortButton>
                  </th>
                  <th className="text-left p-3">
                    <SortButton field="ecoscore_grade">Éco-Score</SortButton>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.code}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-3">
                      <Link
                        href={`/product/${product.code}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {product.product_name || "Sans nom"}
                      </Link>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {product.brands || "-"}
                    </td>
                    <td className="p-3 text-sm font-mono">
                      {product.nutriments?.energy ?? "-"}
                    </td>
                    <td className="p-3 text-sm font-mono">
                      {product.nutriments?.sugars ?? "-"}
                    </td>
                    <td className="p-3 text-sm font-mono">
                      {product.nutriments?.fat ?? "-"}
                    </td>
                    <td className="p-3">
                      {product.nutriscore_grade ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-sm font-bold uppercase">
                          {product.nutriscore_grade}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {product.ecoscore_grade ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-sm font-bold uppercase">
                          {product.ecoscore_grade}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} ({sortedProducts.length} produits)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

