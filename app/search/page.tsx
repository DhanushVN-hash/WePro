"use client";

import { ArrowLeft, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";

import { useProductSearch } from "@/hooks/useProductSearch";

type Product = {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  model?: string | null;
  image_url?: string | null;
};

type ProductRowProps = {
  product: Product;
  onClick: () => void;
};

const ProductRow = memo(function ProductRow({
  product,
  onClick,
}: ProductRowProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={onClick}
      className="
        group flex w-full items-center gap-4
        border-b border-gray-100 py-4
        transition-colors duration-200
        hover:bg-gray-50
        sm:gap-5 sm:py-5
      "
    >
      <div
        className="
          flex h-[72px] w-[92px] shrink-0
          items-center justify-center overflow-hidden
          sm:h-[84px] sm:w-[108px]
        "
      >
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={108}
            height={84}
            sizes="108px"
            className="
              max-h-[64px] max-w-[84px]
              object-contain
              transition-transform duration-200
              group-hover:scale-[1.03]
              sm:max-h-[74px] sm:max-w-[100px]
            "
          />
        ) : (
          <span className="text-xs text-gray-400">
            No image
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h2
          className="
            truncate text-[15px] font-medium leading-5 text-gray-900
            sm:text-base
          "
        >
          {product.name}
        </h2>

        {product.description && (
          <p
            className="
              mt-1 line-clamp-1
              text-[13px] leading-5 text-gray-400
              sm:text-sm
            "
          >
            {product.description}
          </p>
        )}

        {product.model && (
          <p className="mt-1 truncate text-xs leading-4 text-gray-400">
            {product.model}
          </p>
        )}
      </div>
    </Link>
  );
});

ProductRow.displayName = "ProductRow";

function ProductList({
  products,
  onProductClick,
}: {
  products: Product[];
  onProductClick: () => void;
}) {
  return (
    <div className="mt-5">
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div
      className="
        flex h-14 min-w-0 flex-1 items-center
        rounded-xl border border-gray-300 bg-white shadow-sm
        transition-all duration-200
        focus-within:border-yellow-500
        focus-within:shadow-[0_0_0_3px_rgba(234,179,8,0.10)]
        sm:h-16
      "
    >
      <Search
        size={22}
        strokeWidth={1.7}
        aria-hidden="true"
        className="ml-4 shrink-0 text-gray-500 sm:ml-5"
      />

<input
  autoFocus
  type="text"
  value={value}
  onChange={(event) => onChange(event.target.value)}
  placeholder="Search products"
  aria-label="Search products"
  className="
    min-w-0 flex-1
    bg-transparent
    px-3
    text-[15px] text-gray-900
    outline-none
    placeholder:text-gray-400
    sm:px-4
    sm:text-base
  "
/>

      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="
            mr-2 flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-full text-gray-400
            transition-colors duration-150
            hover:bg-gray-100 hover:text-gray-700
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-yellow-500
            active:scale-95
            sm:mr-3
          "
        >
          <X
            size={19}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="mt-8 flex items-center gap-3 text-sm text-gray-500"
      role="status"
      aria-live="polite"
    >
      <div
        className="
          h-4 w-4 animate-spin rounded-full
          border-2 border-gray-200
          border-t-gray-700
        "
        aria-hidden="true"
      />

      <span>Searching products...</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="
        mt-7 rounded-xl
        border border-gray-100
        bg-gray-50
        px-5 py-10
        text-center
      "
    >
      <Search
        size={28}
        strokeWidth={1.4}
        aria-hidden="true"
        className="mx-auto text-gray-300"
      />

      <p className="mt-3 text-sm font-medium text-gray-700">
        No products found
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-400">
        Try searching with a different product name or keyword.
      </p>
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const {
    setSearch,
    results,
    loading,
    searchError,
    clearSearch,
  } = useProductSearch();

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue, setSearch]);

  const handleClear = () => {
    setSearchValue("");
    clearSearch();
  };

  const handleBack = () => {
    router.back();
  };

  const hasSearch = searchValue.trim().length > 0;

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="px-4 pt-5 sm:px-8 sm:pt-8">
        <div
          className="
            mx-auto flex w-full max-w-6xl
            items-center gap-3
            sm:gap-4
          "
        >
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-lg text-gray-800
              transition-colors duration-200
              hover:bg-gray-100
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-yellow-500
              focus-visible:ring-offset-2
              active:scale-95
              sm:h-12 sm:w-12
            "
          >
            <ArrowLeft
              size={24}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </button>

          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onClear={handleClear}
          />
        </div>
      </section>

      <section
        className="
          mx-auto w-full max-w-6xl
          px-5 pb-16 pt-9
          sm:px-8 sm:pt-12
        "
      >
        {!hasSearch ? (
          <>
            <h1
              className="
                text-2xl font-semibold
                tracking-tight text-gray-950
                sm:text-3xl
              "
            >
              Trending Products
            </h1>

            {results.length > 0 ? (
              <ProductList
                products={results}
                onProductClick={clearSearch}
              />
            ) : (
              <p className="mt-5 text-sm leading-6 text-gray-500">
                Start typing to search for products.
              </p>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <h1
                className="
                  text-2xl font-semibold
                  tracking-tight text-gray-950
                  sm:text-3xl
                "
              >
                Search Results
              </h1>

              {!loading && results.length > 0 && (
                <span className="shrink-0 text-xs text-gray-400 sm:text-sm">
                  {results.length}{" "}
                  {results.length === 1 ? "result" : "results"}
                </span>
              )}
            </div>

            {loading && <LoadingState />}

            {!loading && searchError && (
              <div
                className="
                  mt-7 rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-4 py-4
                  text-sm text-gray-500
                "
                role="alert"
              >
                Something went wrong. Please try again.
              </div>
            )}

            {!loading &&
              !searchError &&
              results.length === 0 && <EmptyState />}

            {!loading &&
              !searchError &&
              results.length > 0 && (
                <ProductList
                  products={results}
                  onProductClick={clearSearch}
                />
              )}
          </>
        )}
      </section>
    </main>
  );
}