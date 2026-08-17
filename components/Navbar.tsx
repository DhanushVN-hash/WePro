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

// NOTE: "Resources" is new — it reuses the old "About" anchor so no route
// breaks. Point it at a dedicated /resources route if you have one.
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

  const closeProducts = useCallback(() => setProductsOpen(false), []);

  return (
    <header className="sticky top-0 z-50 text-white">
      {/* Announcement bar — compact, black text on yellow */}
      <div className="bg-primary">
        <div
          className="
            mx-auto flex h-[28px] sm:h-[30px]
            max-w-7xl items-center justify-center
            gap-2
            px-4 sm:px-6
            text-center text-[10px] sm:text-[11px]
            font-semibold uppercase tracking-[0.08em]
            text-black/85
          "
        >
          <span className="h-1 w-1 shrink-0 rounded-full bg-black/50" />
          <span>Trusted Industrial Fastening Solutions Since 1996</span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-black/50" />
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`
          bg-secondary
          transition-shadow duration-200
          ${scrolled ? "shadow-md" : ""}
        `}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="grid h-[68px] grid-cols-[auto_1fr_auto] items-center gap-4 sm:h-[72px] lg:gap-6">
            {/* Logo */}
            <Link
              href="/"
              onClick={clearSearch}
              className="
                flex w-[150px] shrink-0 flex-col justify-center
                rounded-md
                sm:w-[170px]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
              "
            >
              <div className="text-xl font-bold leading-none text-yellow-400 sm:text-2xl">
                WE PRO
              </div>

              <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-gray-300 sm:text-[10px]">
                Industrial Products
              </div>
            </Link>

            {/* Desktop Navigation — centered between logo and controls */}
            <ul className="hidden h-full items-center justify-center gap-8 lg:flex">
              <li className="flex h-full items-center">
                <Link
                  href="/"
                  aria-current={isActive("/") ? "page" : undefined}
                  className={`
                    text-[15px] font-semibold
                    transition-colors duration-150
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    rounded-sm
                    ${isActive("/") ? "text-primary" : "hover:text-primary"}
                  `}
                >
                  Home
                </Link>
              </li>

              <li className="relative flex h-full items-center" ref={productsRef}>
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={productsOpen}
                  onClick={() => setProductsOpen((v) => !v)}
                  onMouseEnter={() => setProductsOpen(true)}
                  className="
                    flex items-center gap-1.5
                    text-[15px] font-semibold
                    transition-colors duration-150
                    hover:text-primary
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    rounded-sm
                  "
                >
                  Products
                  <span className="text-[9px] leading-none">▼</span>
                </button>

                {/* Hover-safe bridge + positioned mega menu */}
                <div
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                  className={`
                    absolute left-1/2 top-full z-50
                    -translate-x-1/2 pt-3
                    ${
                      productsOpen
                        ? "visible opacity-100"
                        : "invisible pointer-events-none opacity-0"
                    }
                    transition-opacity duration-150
                  `}
                >
                  <ProductDropdown onNavigate={closeProducts} />
                </div>
              </li>

              {NAV_LINKS.slice(1).map((link) => (
                <li key={link.href} className="flex h-full items-center">
                  <Link
                    href={link.href}
                    className="
                      text-[15px] font-semibold
                      transition-colors duration-150
                      hover:text-primary
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

            {/* Right: search + get quote + mobile toggle */}
            <div className="flex items-center justify-end gap-3 lg:gap-4">
              {/* Desktop Search */}
              <div
                ref={desktopSearchRef}
                className="relative z-[200] hidden shrink-0 md:block md:w-[170px] lg:w-[180px]"
              >
                <div
                  className={`
                    flex h-11 items-center
                    rounded-md
                    border
                    bg-neutral-800
                    ${searchOpen ? "border-primary" : "border-white/10"}
                  `}
                >
                  <Search size={16} className="ml-3 shrink-0 text-gray-300" />

                  <input
                    ref={desktopInputRef}
                    type="text"
                    value={search}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSearchOpen(true);
                    }}
                    placeholder="Search..."
                    aria-label="Search products"
                    className="
                      w-full
                      bg-transparent
                      px-2 py-2
                      text-sm text-white
                      outline-none
                      placeholder:text-gray-400
                    "
                  />

                  {loading && (
                    <Loader2
                      size={16}
                      className="mr-3 shrink-0 animate-spin text-gray-400"
                    />
                  )}

                  {!loading && search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="
                        mr-3
                        shrink-0
                        text-gray-400
                        hover:text-white
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary
                        rounded-full
                      "
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Desktop search accessibility */}
                <span className="sr-only" role="status" aria-live="polite">
                  {loading
                    ? "Searching products"
                    : search.trim().length >= 2
                    ? `${results.length} result${
                        results.length === 1 ? "" : "s"
                      } found`
                    : ""}
                </span>

                {/* Desktop Search Results */}
                {searchOpen && search.trim().length >= 2 && (
                  <div
                    className="
                      absolute right-0 top-full
                      z-[999] mt-2
                      w-[320px]
                      overflow-hidden
                      rounded-lg
                      border border-gray-200
                      bg-white
                      shadow-xl
                    "
                  >
                    {loading && (
                      <div className="p-3">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 px-2 py-3"
                          >
                            <div className="h-12 w-12 shrink-0 rounded-md bg-gray-100" />

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

                        <p className="mt-1 text-sm text-gray-400">
                          Try searching again in a moment
                        </p>
                      </div>
                    )}

                    {!loading && !searchError && results.length > 0 && (
                      <div className="max-h-[420px] overflow-y-auto">
                        <div
                          className="
                            border-b border-gray-100
                            bg-gray-50
                            px-4 py-2.5
                            text-[10px] font-semibold uppercase
                            tracking-[0.12em] text-gray-400
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
                              flex items-center gap-3
                              border-b border-gray-100
                              px-4 py-2.5
                              last:border-0
                              hover:bg-gray-50
                              focus-visible:outline-none
                              focus-visible:bg-gray-50
                            "
                          >
                            <div
                              className="
                                relative flex h-12 w-12 shrink-0
                                items-center justify-center
                                overflow-hidden rounded-md
                                border border-gray-100 bg-gray-50
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
                                <BoltGlyph className="h-5 w-5 text-gray-300" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-semibold leading-5 text-gray-900">
                                {product.name}
                              </h3>

                              {product.model && (
                                <p className="mt-0.5 text-xs text-gray-500">
                                  Model: {product.model}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}

                        <Link
                          href={`/products?search=${encodeURIComponent(search)}`}
                          onClick={clearSearch}
                          className="
                            block border-t border-gray-100
                            bg-amber-50/40
                            px-5 py-3
                            text-center text-sm font-semibold
                            text-amber-600
                            hover:bg-amber-50
                          "
                        >
                          View all products
                        </Link>
                      </div>
                    )}

                    {!loading && !searchError && results.length === 0 && (
                      <div className="px-5 py-8 text-center">
                        <Search size={28} className="mx-auto mb-3 text-gray-300" />

                        <p className="font-medium text-gray-700">
                          No products found
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
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
                  hidden h-11 w-[120px] shrink-0
                  items-center justify-center
                  rounded-md
                  bg-primary
                  text-sm font-semibold text-black
                  transition-colors duration-150
                  hover:bg-yellow-300
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-secondary
                  lg:flex
                "
              >
                Get Quote
              </Link>

              {/* Mobile menu button */}
              <button
                ref={mobileToggleRef}
                type="button"
                className="
                  rounded-md p-1
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  lg:hidden
                "
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* ================================
              MOBILE SEARCH
              ================================ */}
          <div ref={mobileSearchRef} className="relative w-full pb-3 md:hidden">
            <div
              className={`
                flex items-center
                rounded-md
                border
                bg-white
                ${searchOpen ? "border-primary" : "border-transparent"}
              `}
            >
              <Search size={19} className="ml-3.5 shrink-0 text-gray-400" />

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
                  bg-transparent
                  px-3 py-2.5
                  text-sm text-gray-900
                  outline-none
                  placeholder:text-gray-400
                "
              />

              {loading && (
                <Loader2
                  size={18}
                  className="mr-3 shrink-0 animate-spin text-gray-400"
                />
              )}

              {!loading && search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="
                    mr-3
                    shrink-0
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

            {/* Mobile Results */}
            {searchOpen && search.trim().length >= 2 && (
              <div
                className="
                  absolute left-0 right-0 top-[calc(100%-4px)]
                  z-[100]
                  overflow-hidden
                  rounded-lg
                  border border-gray-200
                  bg-white
                  shadow-xl
                "
              >
                {loading ? (
                  <div className="p-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 px-2 py-2.5">
                        <div className="h-11 w-11 shrink-0 rounded-md bg-gray-100" />

                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 rounded bg-gray-100" />
                          <div className="h-2.5 w-1/3 rounded bg-gray-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchError ? (
                  <div className="px-5 py-7 text-center text-sm text-gray-500">
                    Something went wrong
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-[360px] overflow-y-auto">
                    <div
                      className="
                        border-b border-gray-100
                        bg-gray-50
                        px-3.5 py-2.5
                        text-[10px] font-semibold uppercase
                        tracking-[0.12em] text-gray-400
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
                          flex items-center gap-3
                          border-b border-gray-100
                          px-3 py-2.5
                          last:border-0
                          transition-colors duration-100
                          hover:bg-gray-50
                          active:bg-gray-100
                        "
                      >
                        <div
                          className="
                            relative flex h-11 w-11 shrink-0
                            items-center justify-center
                            overflow-hidden rounded-md
                            border border-gray-100 bg-gray-50
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
                            <BoltGlyph className="h-5 w-5 text-gray-300" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold leading-5 text-gray-900">
                            {product.name}
                          </p>

                          {product.model && (
                            <p className="mt-0.5 truncate text-[11px] text-gray-500">
                              Model: {product.model}
                            </p>
                          )}
                        </div>

                        <span
                          className="shrink-0 pr-1 text-sm text-gray-300"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </Link>
                    ))}

                    <Link
                      href={`/products?search=${encodeURIComponent(search)}`}
                      onClick={() => {
                        clearSearch();
                        setMobileOpen(false);
                      }}
                      className="
                        block border-t border-gray-100
                        bg-amber-50/40
                        px-4 py-3
                        text-center text-sm font-semibold
                        text-amber-600
                        hover:bg-amber-50
                      "
                    >
                      View all products
                    </Link>
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center">
                    <Search size={26} className="mx-auto mb-3 text-gray-300" />

                    <p className="text-sm font-medium text-gray-700">
                      No products found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Try another product name
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile drawer backdrop */}
      <div
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
        className={`
          fixed inset-0 z-40
          bg-black/50
          transition-opacity duration-200
          lg:hidden
          ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      />

      {/* Mobile drawer */}
      <div
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`
          fixed right-0 top-0 z-50
          h-full w-[78%] max-w-xs
          bg-secondary
          shadow-2xl
          transition-transform duration-200 ease-out
          lg:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="font-bold text-yellow-400">WE PRO</span>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="
              rounded-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
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
            <li key={link.href + link.label} className="border-b border-white/5">
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="
                  block py-3.5
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
              onClick={() => setMobileOpen(false)}
              className="
                block rounded-lg
                bg-primary
                px-5 py-3
                text-center font-semibold text-black
                transition-colors duration-150
                hover:bg-yellow-300
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