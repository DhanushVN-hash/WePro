"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
};

export default function ProductGrid({
  initialProducts,
  total,
  categoryId,
  subcategory,
}: {
  initialProducts: Product[];
  total: number;
  categoryId: number;
  subcategory?: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  async function loadMore() {
    setLoading(true);

    const res = await fetch(
      `/api/products?page=${page}&category=${categoryId}${
        subcategory ? `&subcategory=${subcategory}` : ""
      }`
    );

    const newProducts: Product[] = await res.json();

    if (newProducts.length === 0) {
      setLoading(false);
      return;
    }

    setProducts((prev) => [...prev, ...newProducts]);
    setPage((prev) => prev + 1);
    setLoading(false);
  }

  useEffect(() => {
    setProducts(initialProducts);
    setPage(2);
  }, [initialProducts, categoryId, subcategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          products.length < total
        ) {
          loadMore();
        }
      },
      {
        rootMargin: "300px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [products.length, loading, total, categoryId, subcategory]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => {
          const isAboveTheFold = index < 8; // first 2 rows on desktop (4 cols)

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-4 transition duration-300 group-hover:shadow-lg group-hover:scale-[1.02]">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    priority={isAboveTheFold}
                    loading={isAboveTheFold ? undefined : "lazy"}
                    quality={70}
                    sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                    className="object-contain p-2 md:p-4"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <h2 className="font-bold text-[15px] text-gray-900 leading-snug">
                {product.name}
              </h2>
            </Link>
          );
        })}
      </div>

      <div ref={loaderRef} className="h-16 flex justify-center items-center">
        {loading && (
          <div className="text-gray-500 font-medium">Loading...</div>
        )}
      </div>
    </>
  );
}