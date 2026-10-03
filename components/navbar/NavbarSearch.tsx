"use client";

import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Product = {
  id: string | number;
  name: string;
  slug: string;
  model?: string | null;
  image_url?: string | null;
};

type NavbarSearchProps = {
  search: string;
  setSearch: (value: string) => void;
  results: Product[];
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
  loading: boolean;
  searchError: string | null;
  clearSearch: () => void;

  inputRef?: React.RefObject<HTMLInputElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;

  variant?: "desktop" | "mobile";
};

function BoltGlyph({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />

      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export default function NavbarSearch({
  search,
  setSearch,
  results,
  searchOpen,
  setSearchOpen,
  loading,
  searchError,
  clearSearch,
  inputRef,
  containerRef,
  variant = "desktop",
}: NavbarSearchProps) {
  const router = useRouter();

  const isMobile = variant === "mobile";

  /*
   * MOBILE SEARCH
   *
   * Clicking the mobile navbar search opens
   * the dedicated /search page.
   */
  const handleMobileSearchClick = () => {
    if (isMobile) {
      router.push("/search");
    }
  };

  return (
    <div
      ref={containerRef}
      className={
        isMobile
          ? "relative w-full"
          : "relative hidden shrink-0 md:block md:w-[170px] lg:w-[180px]"
      }
    >

      {/* =====================================================
          SEARCH BOX
      ===================================================== */}

      <div
        onClick={
          isMobile
            ? handleMobileSearchClick
            : undefined
        }
        className={`
          flex
          w-full
          items-center
          rounded-md
          border
          border-white/10
          bg-neutral-800

          ${
            isMobile
              ? "h-[59px] cursor-pointer"
              : "h-11"
          }
        `}
      >

        {/* SEARCH ICON */}

        <Search
          size={isMobile ? 24 : 16}
          strokeWidth={isMobile ? 1.7 : 2}
          className={
            isMobile
              ? "ml-7 shrink-0 text-gray-200"
              : "ml-3 shrink-0 text-gray-300"
          }
        />


        {/* =================================================
            INPUT
        ================================================= */}

        <input
          ref={inputRef}
          type="text"
          value={search}
          readOnly={isMobile}
          onFocus={() => {
            if (isMobile) {
              handleMobileSearchClick();
              return;
            }

            setSearchOpen(true);
          }}
          onChange={(event) => {
            setSearch(event.target.value);
            setSearchOpen(true);
          }}
          placeholder={
            isMobile
              ? "Search"
              : "Search..."
          }
          aria-label="Search products"
          className={`
            w-full
            bg-transparent
            text-white
            outline-none
            placeholder:text-gray-400

            ${
              isMobile
                ? "cursor-pointer px-5 text-2xl"
                : "px-2 py-2 text-sm"
            }
          `}
        />


        {/* LOADING */}

        {loading && !isMobile && (
          <Loader2
            size={16}
            className="
              mr-3
              shrink-0
              animate-spin
              text-gray-400
            "
          />
        )}


        {/* CLEAR SEARCH */}

        {!loading &&
          search &&
          !isMobile && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="
                mr-3
                shrink-0
                text-gray-400
                hover:text-white
              "
            >
              <X size={16} />
            </button>
          )}

      </div>


      {/* =====================================================
          DESKTOP SEARCH RESULTS
      ===================================================== */}

      {!isMobile &&
        searchOpen &&
        search.trim().length >= 2 && (
          <div
            className="
              absolute
              right-0
              top-full
              z-[999]
              mt-2
              w-[320px]
              overflow-hidden
              rounded-lg
              border
              border-gray-200
              bg-white
              shadow-xl
            "
          >

            {loading ? (
              <div className="p-4 text-sm text-gray-500">
                Searching products...
              </div>
            ) : searchError ? (
              <div className="p-5 text-center text-sm text-gray-500">
                Something went wrong.
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-[420px] overflow-y-auto">

                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={clearSearch}
                    className="
                      flex
                      items-center
                      gap-3
                      border-b
                      border-gray-100
                      px-4
                      py-3
                      hover:bg-gray-50
                    "
                  >

                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-md
                        border
                        border-gray-100
                        bg-gray-50
                      "
                    >
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <BoltGlyph
                          className="
                            h-5
                            w-5
                            text-gray-300
                          "
                        />
                      )}
                    </div>


                    {/* DETAILS */}

                    <div className="min-w-0">

                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-gray-900
                        "
                      >
                        {product.name}
                      </p>

                      {product.model && (
                        <p className="text-xs text-gray-500">
                          Model: {product.model}
                        </p>
                      )}

                    </div>

                  </Link>
                ))}

                <Link
                  href={`/products?search=${encodeURIComponent(
                    search
                  )}`}
                  onClick={clearSearch}
                  className="
                    block
                    bg-amber-50
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-semibold
                    text-amber-600
                  "
                >
                  View all products
                </Link>

              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500">
                No products found.
              </div>
            )}

          </div>
        )}

    </div>
  );
}