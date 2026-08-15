"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  model?: string;
  image_url?: string;
};

export default function ProductSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}`
        );

        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Search failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Search products"
        className="flex items-center justify-center hover:text-primary transition"
      >
        {open ? <X size={22} /> : <Search size={22} />}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[340px] bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b">
            <Search size={20} className="text-gray-400" />

            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full outline-none text-sm"
            />
          </div>

          {loading && (
            <div className="p-4 text-sm text-gray-500">
              Searching...
            </div>
          )}

          {!loading && query && products.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              No products found.
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="max-h-[400px] overflow-y-auto">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex gap-3 p-3 hover:bg-gray-50 transition"
                >
                  <div className="relative w-14 h-14 shrink-0 bg-gray-50 rounded-md">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-sm line-clamp-2">
                      {product.name}
                    </p>

                    {product.model && (
                      <p className="text-xs text-gray-500 mt-1">
                        Model: {product.model}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}