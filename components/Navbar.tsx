"use client";

import { Menu, X, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import ProductDropdown from "@/components/productDropdown";
import { supabase } from "@/lib/supabase";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  model?: string;
  image_url?: string;
}

// Simple placeholder used when a product has no image.
function BoltGlyph({ className = "" }: { className?: string }) {
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
        r="3.25"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#enquiry", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [productsOpen, setProductsOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const productsRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Header changes slightly after scrolling.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Search: debounced and cancels stale requests.
  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      setSearchError(false);
      abortRef.current?.abort();
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setSearchError(false);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, model, image_url")
          .ilike("name", `%${query}%`)
          .order("name")
          .limit(8)
          .abortSignal(controller.signal);

        if (controller.signal.aborted) return;

        if (error) {
          console.error("Search error:", error.message);
          setResults([]);
          setSearchError(true);
        } else {
          setResults(data || []);
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          console.error("Search failed:", err);
          setResults([]);
          setSearchError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const clearSearch = useCallback(() => {
    abortRef.current?.abort();
    setSearch("");
    setResults([]);
    setSearchOpen(false);
    setSearchError(false);
  }, []);

  // Close search/product dropdown when clicking outside.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const clickedInsideDesktopSearch =
        desktopSearchRef.current?.contains(target);

      const clickedInsideMobileSearch =
        mobileSearchRef.current?.contains(target);

      if (!clickedInsideDesktopSearch && !clickedInsideMobileSearch) {
        setSearchOpen(false);
      }

      if (
        productsRef.current &&
        !productsRef.current.contains(target)
      ) {
        setProductsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard controls.
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          desktopInputRef.current?.blur();
        }

        if (productsOpen) {
          setProductsOpen(false);
        }

        if (mobileOpen) {
          setMobileOpen(false);
          mobileToggleRef.current?.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [searchOpen, productsOpen, mobileOpen]);

  // Lock body scrolling while mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const menuNode = mobileMenuRef.current;

    const focusable = menuNode?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );

    focusable?.[0]?.focus();

    function handleTab(event: KeyboardEvent) {
      if (
        event.key !== "Tab" ||
        !focusable ||
        focusable.length === 0
      ) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleTab);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleTab);
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname?.startsWith(href.replace("/#", "/"));

  return (
    <header
      className={`
        sticky top-0 z-50 text-white
        ${
          scrolled
            ? "bg-secondary shadow-md"
            : "bg-secondary"
        }
      `}
    >
      {/* Announcement */}
      <div className="border-b border-white/10 bg-primary">
<div
  className="
    max-w-7xl mx-auto
    px-4 sm:px-6
    py-1.5
    flex items-center justify-center
    gap-2
    text-[9px] sm:text-[10px] md:text-[11px]
    font-medium
    tracking-[0.12em]
    uppercase
    text-gray-300
    text-center
  "
>
          <span className="h-1 w-1 rounded-full bg-gray-300 " />

          <span>
            Trusted Industrial Fastening Solutions Since 1996
          </span>

          <span className="h-1 w-1 rounded-full bg-gray-300 shrink-0" />
        </div>
      </div>

      {/* Main Navbar */}
            <nav className="max-w-6xl mx-auto px-4 sm:px-6">

        <div
        className={`
          flex items-center justify-between
          gap-5
          transition-[padding] duration-200
          ${scrolled ? "py-2" : "py-2.5"}
        `}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={clearSearch}
            className="
              shrink-0
              rounded-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
            "
          >
            <div
              className="
                font-bold
                text-yellow-400
                leading-none
                text-xl sm:text-2xl md:text-3xl
              "
            >
              WE PRO
            </div>

            <div
              className="
                text-[9px] sm:text-[10px] md:text-xs
                tracking-[0.16em]
                text-gray-300
                mt-1
                uppercase
              "
            >
              Industrial Products
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-6 font-medium items-center">
            <li>
              <Link
                href="/"
                aria-current={
                  isActive("/") ? "page" : undefined
                }
                className={`
                  py-1
                  transition-colors duration-150
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  rounded-sm
                  ${
                    isActive("/")
                      ? "text-primary"
                      : "hover:text-primary"
                  }
                `}
              >
                Home
              </Link>
            </li>

            <li
              className="relative"
              ref={productsRef}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={productsOpen}
                onClick={() =>
                  setProductsOpen((v) => !v)
                }
                onMouseEnter={() =>
                  setProductsOpen(true)
                }
                className="
                  flex items-center gap-2
                  py-1
                  hover:text-primary
                  transition-colors duration-150
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  rounded-sm
                "
              >
                Products

                <span className="text-[10px]">
                  ▼
                </span>
              </button>

              <div
                onMouseEnter={() =>
                  setProductsOpen(true)
                }
                onMouseLeave={() =>
                  setProductsOpen(false)
                }
                className={`
                  absolute
                  left-0
                  top-full
                  pt-3
                  z-50
                  ${
                    productsOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible pointer-events-none"
                  }
                `}
              >
                <ProductDropdown />
              </div>
            </li>

            {NAV_LINKS.slice(1).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="
                    py-1
                    hover:text-primary
                    transition-colors duration-150
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    rounded-sm
                  "
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Search */}
          <div
            ref={desktopSearchRef}
            className="
          hidden md:block
          relative
          w-[280px] lg:w-[320px]
          shrink-0
          z-[200]
            "
          >
            <div
              className={`
                flex items-center
                bg-white
                rounded-lg
                border
                ${
                  searchOpen
                    ? "border-primary"
                    : "border-transparent"
                }
              `}
            >
              <Search
                size={18}
                className="ml-4 text-gray-400 shrink-0"
              />

              <input
                ref={desktopInputRef}
                type="text"
                value={search}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search products..."
                aria-label="Search products"
                className="
                  w-full
                  px-2
                  py-2.5
                  bg-transparent
                  text-gray-900
                  outline-none
                  placeholder:text-gray-400
                "
              />

              {loading && (
                <Loader2
                  size={18}
                  className="
                    mr-3
                    text-gray-400
                    animate-spin
                  "
                />
              )}

              {!loading && search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="
                    mr-3
                    text-gray-400
                    hover:text-gray-700
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    rounded-full
                  "
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Desktop search accessibility */}
            <span
              className="sr-only"
              role="status"
              aria-live="polite"
            >
              {loading
                ? "Searching products"
                : search.trim().length >= 2
                ? `${results.length} result${
                    results.length === 1 ? "" : "s"
                  } found`
                : ""}
            </span>

            {/* Desktop Search Results */}
            {searchOpen &&
              search.trim().length >= 2 && (
                <div
                  className="
                    absolute
                    top-full
                    left-0
                    right-0
                    mt-2
                    bg-white
                    rounded-lg
                    shadow-xl
                    border
                    border-gray-200
                    z-[999]
                    overflow-hidden
                  "
                >
                  {loading && (
                    <div className="p-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="
                            flex items-center
                            gap-3
                            px-2
                            py-3
                          "
                        >
                          <div
                            className="
                              w-12 h-12
                              rounded-md
                              bg-gray-100
                              shrink-0
                            "
                          />

                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 rounded bg-gray-100" />
                            <div className="h-2.5 w-1/3 rounded bg-gray-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loading && searchError && (
                    <div className="px-5 py-8 text-center">
                      <p className="font-medium text-gray-700">
                        Something went wrong
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Try searching again in a moment
                      </p>
                    </div>
                  )}

                  {!loading &&
                    !searchError &&
                    results.length > 0 && (
                      <div className="max-h-[420px] overflow-y-auto">
                        <div
                          className="
                            px-4
                            py-2.5
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-gray-400
                            bg-gray-50
                            border-b
                            border-gray-100
                          "
                        >
                          Products
                        </div>

                        {results.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={clearSearch}
                            className="
                              group
                              flex items-center
                              gap-3
                              px-4
                              py-2.5
                              border-b
                              border-gray-100
                              last:border-0
                              hover:bg-gray-50
                              focus-visible:outline-none
                              focus-visible:bg-gray-50
                            "
                          >
                            <div
                              className="
                                relative
                                w-12 h-12
                                bg-gray-50
                                border
                                border-gray-100
                                rounded-md
                                shrink-0
                                overflow-hidden
                                flex items-center justify-center
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
                                    w-5 h-5
                                    text-gray-300
                                  "
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3
                                className="
                                  font-semibold
                                  text-gray-900
                                  text-sm
                                  leading-5
                                  truncate
                                "
                              >
                                {product.name}
                              </h3>

                              {product.model && (
                                <p
                                  className="
                                    text-xs
                                    text-gray-500
                                    mt-0.5
                                  "
                                >
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
                            px-5
                            py-3
                            text-center
                            text-sm
                            font-semibold
                            text-amber-600
                            border-t
                            border-gray-100
                            bg-amber-50/40
                            hover:bg-amber-50
                          "
                        >
                          View all products
                        </Link>
                      </div>
                    )}

                  {!loading &&
                    !searchError &&
                    results.length === 0 && (
                      <div className="px-5 py-8 text-center">
                        <Search
                          size={28}
                          className="
                            mx-auto
                            text-gray-300
                            mb-3
                          "
                        />

                        <p className="font-medium text-gray-700">
                          No products found
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          Try another product name
                        </p>
                      </div>
                    )}
                </div>
              )}
          </div>

          {/* Get Quote */}
          <Link
            href="/#enquiry"
            className="
              hidden lg:block
              shrink-0
              bg-primary
              text-black
              px-5
              py-2.5
              rounded-lg
              font-semibold
              hover:bg-yellow-300
              transition-colors duration-150
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white
              focus-visible:ring-offset-2
              focus-visible:ring-offset-secondary
            "
          >
            Get Quote
          </Link>

          {/* Mobile menu button */}
          <button
            ref={mobileToggleRef}
            type="button"
            className="
              lg:hidden
              p-1
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              rounded-md
            "
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>
        </div>

        {/* ================================
            MOBILE SEARCH
            ================================ */}
        <div
          ref={mobileSearchRef}
          className="
            md:hidden
            relative
            pb-3
            w-full
          "
        >
          <div
            className={`
              flex items-center
              bg-white
              rounded-lg
              border
              ${
                searchOpen
                  ? "border-primary"
                  : "border-transparent"
              }
            `}
          >
            <Search
              size={19}
              className="
                ml-3.5
                text-gray-400
                shrink-0
              "
            />

            <input
              type="text"
              value={search}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search products..."
              aria-label="Search products"
              className="
                w-full
                px-3
                py-2.5
                bg-transparent
                text-gray-900
                outline-none
                placeholder:text-gray-400
                text-sm
              "
            />

            {loading && (
              <Loader2
                size={18}
                className="
                  mr-3
                  text-gray-400
                  animate-spin
                  shrink-0
                "
              />
            )}

            {!loading && search && (
              <button
                type="button"
                onClick={clearSearch}
                className="
                  mr-3
                  text-gray-400
                  hover:text-gray-700
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  rounded-full
                  shrink-0
                "
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Mobile Results */}
          {searchOpen &&
            search.trim().length >= 2 && (
              <div
                className="
                  absolute
                  top-[calc(100%-4px)]
                  left-0
                  right-0
                  bg-white
                  rounded-lg
                  shadow-xl
                  border
                  border-gray-200
                  overflow-hidden
                  z-[100]
                "
              >
                {loading ? (
                  <div className="p-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="
                          flex items-center
                          gap-3
                          px-2
                          py-2.5
                        "
                      >
                        <div
                          className="
                            w-11 h-11
                            rounded-md
                            bg-gray-100
                            shrink-0
                          "
                        />

                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 rounded bg-gray-100" />
                          <div className="h-2.5 w-1/3 rounded bg-gray-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchError ? (
                  <div
                    className="
                      px-5
                      py-7
                      text-center
                      text-sm
                      text-gray-500
                    "
                  >
                    Something went wrong
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-[360px] overflow-y-auto">
                    {/* Small section heading */}
                    <div
                      className="
                        px-3.5
                        py-2.5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-gray-400
                        bg-gray-50
                        border-b
                        border-gray-100
                      "
                    >
                      Search results
                    </div>

                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          clearSearch();
                          setMobileOpen(false);
                        }}
                        className="
                          flex items-center
                          gap-3
                          px-3
                          py-2.5
                          border-b
                          border-gray-100
                          last:border-0
                          hover:bg-gray-50
                          active:bg-gray-100
                          transition-colors duration-100
                        "
                      >
                        {/* Product Image */}
                        <div
                          className="
                            relative
                            w-11 h-11
                            bg-gray-50
                            border
                            border-gray-100
                            rounded-md
                            overflow-hidden
                            shrink-0
                            flex items-center
                            justify-center
                          "
                        >
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              sizes="44px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <BoltGlyph
                              className="
                                w-5 h-5
                                text-gray-300
                              "
                            />
                          )}
                        </div>

                        {/* Product Information */}
                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              text-sm
                              font-semibold
                              text-gray-900
                              leading-5
                              truncate
                            "
                          >
                            {product.name}
                          </p>

                          {product.model && (
                            <p
                              className="
                                text-[11px]
                                text-gray-500
                                mt-0.5
                                truncate
                              "
                            >
                              Model: {product.model}
                            </p>
                          )}
                        </div>

                        {/* Simple arrow */}
                        <span
                          className="
                            text-gray-300
                            text-sm
                            shrink-0
                            pr-1
                          "
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </Link>
                    ))}

                    {/* View All */}
                    <Link
                      href={`/products?search=${encodeURIComponent(
                        search
                      )}`}
                      onClick={() => {
                        clearSearch();
                        setMobileOpen(false);
                      }}
                      className="
                        block
                        px-4
                        py-3
                        text-center
                        text-sm
                        font-semibold
                        text-amber-600
                        border-t
                        border-gray-100
                        bg-amber-50/40
                        hover:bg-amber-50
                      "
                    >
                      View all products
                    </Link>
                  </div>
                ) : (
                  <div
                    className="
                      px-5
                      py-8
                      text-center
                    "
                  >
                    <Search
                      size={26}
                      className="
                        mx-auto
                        text-gray-300
                        mb-3
                      "
                    />

                    <p
                      className="
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      No products found
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mt-1
                      "
                    >
                      Try another product name
                    </p>
                  </div>
                )}
              </div>
            )}
        </div>
      </nav>

      {/* Mobile drawer backdrop */}
      <div
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
        className={`
          lg:hidden
          fixed
          inset-0
          bg-black/50
          transition-opacity duration-200
          z-40
          ${
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Mobile drawer */}
      <div
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`
          lg:hidden
          fixed
          top-0
          right-0
          h-full
          w-[78%]
          max-w-xs
          bg-secondary
          z-50
          shadow-2xl
          transition-transform duration-200
          ease-out
          ${
            mobileOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <div
          className="
            flex items-center
            justify-between
            px-5
            py-4
            border-b
            border-white/10
          "
        >
          <span className="font-bold text-yellow-400">
            WE PRO
          </span>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              rounded-md
            "
          >
            <X size={26} />
          </button>
        </div>

        <ul className="flex flex-col px-5 py-4">
          {[
            { href: "/", label: "Home" },
            { href: "/products", label: "Products" },
            ...NAV_LINKS.slice(1),
          ].map((link) => (
            <li
              key={link.href + link.label}
              className="
                border-b
                border-white/5
              "
            >
              <Link
                href={link.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  block
                  py-3.5
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  rounded-sm
                "
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li className="pt-5">
            <Link
              href="/#enquiry"
              onClick={() =>
                setMobileOpen(false)
              }
              className="
                block
                text-center
                bg-primary
                text-black
                px-5
                py-3
                rounded-lg
                font-semibold
                hover:bg-yellow-300
                transition-colors duration-150
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white
              "
            >
              Get Quote
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}