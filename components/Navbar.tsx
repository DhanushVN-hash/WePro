"use client";

import { Menu, X, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductDropdown from "@/components/productDropdown";
import { supabase } from "@/lib/supabase";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  model?: string;
  image_url?: string;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#enquiry", label: "Contact" },
];

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

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const [productsOpen, setProductsOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const lastScrollY = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const productsRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
const navbarHiddenRef = useRef(false);
  

// Navbar scroll behavior
useEffect(() => {
  function handleScroll() {
    const currentScrollY = window.scrollY;

    setScrolled(currentScrollY > 24);

    if (mobileOpen) {
      setIsNavbarVisible(true);
      lastScrollY.current = currentScrollY;
      return;
    }

    const hero = document.getElementById("hero");
    const heroHeight = hero?.offsetHeight ?? 500;

    // Navbar hide/show threshold: 25% of hero height
    const threshold = heroHeight * 0.25;

    if (currentScrollY > threshold) {
      // Hide after passing 25% of the Hero
      setIsNavbarVisible(false);
    } else {
      // Show again when returning above the same 25% point
      setIsNavbarVisible(true);
    }

    lastScrollY.current = currentScrollY;
  }

  handleScroll();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [mobileOpen]);

  // Product search
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
      } catch (error) {
        if ((error as Error)?.name !== "AbortError") {
          console.error("Search failed:", error);
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

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    mobileToggleRef.current?.focus();
  }, []);

  const closeProducts = useCallback(() => {
    setProductsOpen(false);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const insideDesktopSearch =
        desktopSearchRef.current?.contains(target);

      const insideMobileSearch =
        mobileSearchRef.current?.contains(target);

      if (!insideDesktopSearch && !insideMobileSearch) {
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      if (searchOpen) {
        setSearchOpen(false);
        desktopInputRef.current?.blur();
      }

      if (productsOpen) {
        setProductsOpen(false);
      }

      if (mobileOpen) {
        closeMobileMenu();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    searchOpen,
    productsOpen,
    mobileOpen,
    closeMobileMenu,
  ]);

  // Lock body scrolling when mobile drawer is open
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

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname?.startsWith(href.replace("/#", "/"));
  };

  const mobileLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    ...NAV_LINKS.slice(1),
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`
          sticky top-0 z-[80] text-white
          transition-transform duration-300 ease-in-out
          ${
            isNavbarVisible || mobileOpen
              ? "translate-y-0"
              : "-translate-y-full"
          }
        `}
      >
        {/* Announcement bar */}
        <div className="bg-primary">
          <div
            className="
              mx-auto flex h-[28px] sm:h-[30px]
              max-w-7xl items-center justify-center
              gap-2 px-4 sm:px-6
              text-center text-[10px] sm:text-[11px]
              font-semibold uppercase tracking-[0.08em]
              text-black/85
            "
          >
            <span className="h-1 w-1 rounded-full bg-black/50" />
            <span>Trusted Industrial Fastening Solutions Since 1996</span>
            <span className="h-1 w-1 rounded-full bg-black/50" />
          </div>
        </div>

        {/* Main navbar */}
        <nav
          className={`
            bg-secondary transition-shadow duration-200
            ${scrolled ? "shadow-md" : ""}
          `}
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div
              className="
                grid h-[68px]
                grid-cols-[auto_1fr_auto]
                items-center gap-4
                sm:h-[72px] lg:gap-6
              "
            >
              {/* Logo */}
              <Link
                href="/"
                onClick={clearSearch}
                className="
                  flex w-[150px] shrink-0 flex-col
                  justify-center rounded-md
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  sm:w-[170px]
                "
              >
                <div className="text-xl font-bold leading-none text-yellow-400 sm:text-2xl">
                  WE PRO
                </div>

                <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-gray-300 sm:text-[10px]">
                  Industrial Products
                </div>
              </Link>

              {/* Desktop navigation */}
              <ul className="hidden h-full items-center justify-center gap-8 lg:flex">
                <li className="flex h-full items-center">
                  <Link
                    href="/"
                    aria-current={isActive("/") ? "page" : undefined}
                    className={`
                      rounded-sm text-[15px] font-semibold
                      transition-colors duration-150
                      hover:text-primary
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary
                      ${
                        isActive("/")
                          ? "text-primary"
                          : "text-white"
                      }
                    `}
                  >
                    Home
                  </Link>
                </li>

                <li
                  ref={productsRef}
                  className="relative flex h-full items-center"
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={productsOpen}
                    onClick={() => setProductsOpen((value) => !value)}
                    onMouseEnter={() => setProductsOpen(true)}
                    className="
                      flex items-center gap-1.5
                      rounded-sm text-[15px] font-semibold
                      transition-colors duration-150
                      hover:text-primary
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary
                    "
                  >
                    Products
                    <span className="text-[9px]">▼</span>
                  </button>

                  <div
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                    className={`
                      absolute left-1/2 top-full z-[100]
                      -translate-x-1/2 pt-3
                      transition-opacity duration-150
                      ${
                        productsOpen
                          ? "visible opacity-100"
                          : "invisible pointer-events-none opacity-0"
                      }
                    `}
                  >
                    <ProductDropdown onNavigate={closeProducts} />
                  </div>
                </li>

                {NAV_LINKS.slice(1).map((link) => (
                  <li
                    key={link.href}
                    className="flex h-full items-center"
                  >
                    <Link
                      href={link.href}
                      className="
                        rounded-sm text-[15px] font-semibold
                        transition-colors duration-150
                        hover:text-primary
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Right controls */}
              <div className="flex items-center justify-end gap-3 lg:gap-4">
                {/* Desktop search */}
                <div
                  ref={desktopSearchRef}
                  className="
                    relative hidden shrink-0
                    md:block md:w-[170px] lg:w-[180px]
                  "
                >
                  <div
                    className={`
                      flex h-11 items-center rounded-md
                      border bg-neutral-800
                      ${
                        searchOpen
                          ? "border-primary"
                          : "border-white/10"
                      }
                    `}
                  >
                    <Search
                      size={16}
                      className="ml-3 shrink-0 text-gray-300"
                    />

                    <input
                      ref={desktopInputRef}
                      type="text"
                      value={search}
                      onFocus={() => setSearchOpen(true)}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setSearchOpen(true);
                      }}
                      placeholder="Search..."
                      aria-label="Search products"
                      className="
                        w-full bg-transparent
                        px-2 py-2 text-sm text-white
                        outline-none placeholder:text-gray-400
                      "
                    />

                    {loading && (
                      <Loader2
                        size={16}
                        className="mr-3 animate-spin text-gray-400"
                      />
                    )}

                    {!loading && search && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        aria-label="Clear search"
                        className="mr-3 text-gray-400 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {searchOpen && search.trim().length >= 2 && (
                    <div
                      className="
                        absolute right-0 top-full z-[999]
                        mt-2 w-[320px] overflow-hidden
                        rounded-lg border border-gray-200
                        bg-white shadow-xl
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
                                flex items-center gap-3
                                border-b border-gray-100
                                px-4 py-3 hover:bg-gray-50
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

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
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
                            href={`/products?search=${encodeURIComponent(search)}`}
                            onClick={clearSearch}
                            className="
                              block bg-amber-50 px-4 py-3
                              text-center text-sm font-semibold
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

                {/* Get quote */}
                <Link
                  href="/#enquiry"
                  className="
                    hidden h-11 w-[120px] shrink-0
                    items-center justify-center rounded-md
                    bg-primary text-sm font-semibold text-black
                    transition-colors hover:bg-yellow-300
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-white
                    lg:flex
                  "
                >
                  Get Quote
                </Link>

                {/* Mobile hamburger */}
                <button
                  ref={mobileToggleRef}
                  type="button"
                  onClick={() => setMobileOpen((value) => !value)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-md text-white
                    hover:bg-white/10
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    lg:hidden
                  "
                >
                  {mobileOpen ? <X size={27} /> : <Menu size={27} />}
                </button>
              </div>
            </div>

            {/* Mobile search */}
            <div
              ref={mobileSearchRef}
              className="relative w-full pb-3 md:hidden"
            >
              <div
                className={`
                  flex items-center rounded-md border bg-white
                  ${
                    searchOpen
                      ? "border-primary"
                      : "border-transparent"
                  }
                `}
              >
                <Search
                  size={19}
                  className="ml-3.5 shrink-0 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setSearchOpen(true);
                  }}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="
                    w-full bg-transparent px-3 py-2.5
                    text-sm text-gray-900 outline-none
                    placeholder:text-gray-400
                  "
                />

                {loading && (
                  <Loader2
                    size={18}
                    className="mr-3 animate-spin text-gray-400"
                  />
                )}

                {!loading && search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="mr-3 text-gray-400"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE BACKDROP ================= */}
      <button
        type="button"
        aria-label="Close mobile menu"
        onClick={closeMobileMenu}
        className={`
          fixed inset-0 z-[90] bg-black/60
          transition-opacity duration-300 lg:hidden
          ${
            mobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* ================= MOBILE DRAWER ================= */}
      <aside
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`
          fixed right-0 top-0 z-[100]
          flex h-screen w-[86%] max-w-[360px]
          flex-col overflow-y-auto
          bg-secondary text-white shadow-2xl
          transition-transform duration-300 ease-out
          lg:hidden
          ${
            mobileOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* Drawer header */}
        <div
          className="
            flex shrink-0 items-center justify-between
            border-b border-white/10 px-5 py-5
          "
        >
          <div>
            <div className="text-xl font-bold text-yellow-400">
              WE PRO
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
              Industrial Products
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-md hover:bg-white/10
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
            "
          >
            <X size={27} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 px-5 py-5">
          <ul className="flex flex-col">
            {mobileLinks.map((link) => (
              <li
                key={`${link.href}-${link.label}`}
                className="border-b border-white/10"
              >
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`
                    block rounded-md px-2 py-4
                    text-base font-semibold
                    transition-colors
                    hover:bg-white/10 hover:text-primary
                    ${
                      isActive(link.href)
                        ? "text-primary"
                        : "text-white"
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="pt-6">
              <Link
                href="/#enquiry"
                onClick={closeMobileMenu}
                className="
                  block rounded-lg bg-primary
                  px-5 py-3.5 text-center
                  font-semibold text-black
                  transition-colors hover:bg-yellow-300
                "
              >
                Get Quote
              </Link>
            </li>
          </ul>
        </nav>

        {/* Drawer footer */}
        <div
          className="
            shrink-0 border-t border-white/10
            px-5 py-5 text-center text-xs text-gray-400
          "
        >
          © {new Date().getFullYear()} WE PRO
        </div>
      </aside>
    </>
  );
}