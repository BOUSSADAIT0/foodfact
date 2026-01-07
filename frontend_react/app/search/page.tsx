"use client"

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import { API_URL } from "@/lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/search?q=${query}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Recherche OpenFoodFacts</h1>

      {/* Correction ici */}
      <SearchBar value={query} onChange={setQuery} />

      <button
        onClick={search}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Rechercher
      </button>

      {loading && <p>Chargement...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <ProductCard
            key={p.code}
            code={p.code}
            name={p.product_name}
            brand={p.brands}
            nutriments={p.nutriments}
          />
        ))}
      </div>
    </main>
  )
}
