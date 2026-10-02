"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import NavbarSearch from "./NavbarSearch";
import MobileDrawer from "./MobileDrawer";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

import { useProductSearch } from "@/hooks/useProductSearch";

import {
  NAV_LINKS,
  MOBILE_LINKS,
} from "./navbar.constants";

export default function Navbar() {
  const pathname = usePathname();

  /* =========================================================
     SEARCH PAGE
  ========================================================= */

  const isSearchPage =
    pathname === "/search";


  /* =========================================================
     STATE
  ========================================================= */

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [isNavbarVisible, setIsNavbarVisible] =
    useState(true);

  const [productsOpen, setProductsOpen] =
    useState(false);


  /* =========================================================
     PRODUCT SEARCH
  ========================================================= */

  const {
    search,
    setSearch,
    results,
    searchOpen,
    setSearchOpen,
    loading,
    searchError,
    clearSearch,
  } = useProductSearch();


  /* =========================================================
     REFS
  ========================================================= */

  const lastScrollY =
    useRef(0);

  const desktopSearchRef =
    useRef<HTMLDivElement | null>(null);

  const mobileSearchRef =
    useRef<HTMLDivElement | null>(null);

  const desktopInputRef =
    useRef<HTMLInputElement | null>(null);

  const productsRef =
    useRef<HTMLLIElement | null>(null);

  const mobileMenuRef =
    useRef<HTMLElement | null>(null);

  const mobileToggleRef =
    useRef<HTMLButtonElement | null>(null);


  /* =========================================================
     CLOSE HELPERS
  ========================================================= */

  const closeProducts = () => {
    setProductsOpen(false);
  };


  const closeMobileMenu = () => {
    setMobileOpen(false);
  };


  /* =========================================================
     NAVBAR SCROLL BEHAVIOR
  ========================================================= */

  useEffect(() => {

    /*
     * Search page does not use navbar scroll
     * behavior.
     */
    if (isSearchPage) {
      return;
    }

    function handleScroll() {

      const currentScrollY =
        window.scrollY;

      setScrolled(
        currentScrollY > 24
      );


      /*
       * Keep navbar visible while
       * mobile menu is open.
       */

      if (mobileOpen) {

        setIsNavbarVisible(true);

        lastScrollY.current =
          currentScrollY;

        return;
      }


      /*
       * Find hero section.
       */

      const hero =
        document.getElementById(
          "hero"
        );

      const heroHeight =
        hero?.offsetHeight ?? 500;


      const threshold =
        heroHeight * 0.25;


      /*
       * Always visible inside
       * first 25% of hero.
       */

      if (
        currentScrollY <= threshold
      ) {

        setIsNavbarVisible(true);

        lastScrollY.current =
          currentScrollY;

        return;
      }


      /*
       * After 25%:
       *
       * scrolling down → hide
       * scrolling up   → show
       */

      if (
        currentScrollY >
        lastScrollY.current
      ) {

        setIsNavbarVisible(false);

      } else if (
        currentScrollY <
        lastScrollY.current
      ) {

        setIsNavbarVisible(true);
      }


      lastScrollY.current =
        currentScrollY;
    }


    handleScroll();


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, [
    mobileOpen,
    isSearchPage,
  ]);


  /* =========================================================
     LOCK BODY WHEN MOBILE DRAWER IS OPEN
  ========================================================= */

  useEffect(() => {

    if (!mobileOpen) {
      return;
    }


    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    const menuNode =
      mobileMenuRef.current;


    const focusable =
      menuNode?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );


    focusable?.[0]?.focus();


    function handleTab(
      event: KeyboardEvent
    ) {

      if (
        event.key !== "Tab" ||
        !focusable ||
        focusable.length === 0
      ) {
        return;
      }


      const first =
        focusable[0];

      const last =
        focusable[
          focusable.length - 1
        ];


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


    document.addEventListener(
      "keydown",
      handleTab
    );


    return () => {

      document.body.style.overflow =
        previousOverflow;


      document.removeEventListener(
        "keydown",
        handleTab
      );

    };

  }, [mobileOpen]);


  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const isActive = (
    href: string
  ) => {

    if (href === "/") {
      return pathname === "/";
    }


    return pathname?.startsWith(
      href.replace("/#", "/")
    );
  };


  /* =========================================================
     IMPORTANT
     DO NOT RENDER NORMAL NAVBAR ON SEARCH PAGE
  ========================================================= */

  if (isSearchPage) {
    return null;
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <header
        className={`
          sticky
          top-0
          z-[80]
          text-white
          transition-transform
          duration-300
          ease-in-out

          ${
            isNavbarVisible ||
            mobileOpen
              ? "translate-y-0"
              : "-translate-y-full"
          }
        `}
      >

        {/* ===================================================
            ANNOUNCEMENT BAR
        =================================================== */}

        <div className="bg-primary">

          <div
            className="
              mx-auto
              flex
              h-[28px]
              items-center
              justify-center
              gap-2
              px-4
              text-center
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-black/85
              sm:h-[30px]
              sm:px-6
              sm:text-[11px]
            "
          >

            <span
              className="
                h-1
                w-1
                rounded-full
                bg-black/50
              "
            />

            <span>
              Trusted Industrial Fastening
              Solutions Since 1996
            </span>

            <span
              className="
                h-1
                w-1
                rounded-full
                bg-black/50
              "
            />

          </div>

        </div>


        {/* ===================================================
            MAIN NAVIGATION
        =================================================== */}

        <nav
          className={`
            bg-secondary
            transition-shadow
            duration-200

            ${
              scrolled
                ? "shadow-md"
                : ""
            }
          `}
        >

          <div
            className="
              mx-auto
              w-full
              max-w-[1240px]
              px-4
              sm:px-6
            "
          >

            {/* =================================================
                DESKTOP NAVBAR
            ================================================= */}

            <div
              className="
                hidden
                h-[72px]
                items-center
                lg:grid
                lg:grid-cols-[auto_1fr_auto]
                lg:gap-8
              "
            >

              {/* DESKTOP LOGO */}

              <Link
                href="/"
                onClick={clearSearch}
                aria-label="WE PRO home"
                className="
                  flex
                  shrink-0
                  flex-col
                  justify-center
                  rounded-md
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                "
              >

                <div
                  className="
                    text-xl
                    font-bold
                    leading-none
                    text-yellow-400
                    sm:text-2xl
                  "
                >
                  WE PRO
                </div>

                <div
                  className="
                    mt-1
                    text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-gray-300
                    sm:text-[10px]
                  "
                >
                  Industrial Products
                </div>

              </Link>


              {/* DESKTOP NAVIGATION */}

              <DesktopNavbar
                navLinks={NAV_LINKS}
                productsOpen={productsOpen}
                setProductsOpen={
                  setProductsOpen
                }
                productsRef={productsRef}
                closeProducts={
                  closeProducts
                }
                isActive={isActive}
              />


              {/* DESKTOP RIGHT SIDE */}

              <div
                className="
                  flex
                  items-center
                  justify-end
                  gap-4
                "
              >

                <NavbarSearch
                  search={search}
                  setSearch={setSearch}
                  results={results}
                  searchOpen={searchOpen}
                  setSearchOpen={
                    setSearchOpen
                  }
                  loading={loading}
                  searchError={
                    searchError
                  }
                  clearSearch={
                    clearSearch
                  }
                  inputRef={
                    desktopInputRef
                  }
                  containerRef={
                    desktopSearchRef
                  }
                  variant="desktop"
                />


                {/* GET QUOTE */}

                <Link
                  href="/#enquiry"
                  onClick={
                    clearSearch
                  }
                  className="
                    shrink-0
                    rounded-md
                    bg-primary
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-black
                    transition-colors
                    hover:bg-yellow-300
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                  "
                >
                  Get Quote
                </Link>

              </div>

            </div>


            {/* =================================================
                MOBILE NAVBAR
            ================================================= */}

            <div className="lg:hidden">

              <MobileNavbar
                mobileOpen={
                  mobileOpen
                }
                setMobileOpen={
                  setMobileOpen
                }
                clearSearch={
                  clearSearch
                }
                search={search}
                setSearch={
                  setSearch
                }
                results={results}
                searchOpen={
                  searchOpen
                }
                setSearchOpen={
                  setSearchOpen
                }
                loading={loading}
                searchError={
                  searchError
                }
                mobileSearchRef={
                  mobileSearchRef
                }
                mobileToggleRef={
                  mobileToggleRef
                }
              />

            </div>

          </div>

        </nav>

      </header>


      {/* =======================================================
          MOBILE DRAWER
      ======================================================= */}

      <MobileDrawer
        mobileOpen={
          mobileOpen
        }
        closeMobileMenu={
          closeMobileMenu
        }
        mobileMenuRef={
          mobileMenuRef
        }
        mobileLinks={
          MOBILE_LINKS
        }
        isActive={
          isActive
        }
      />

    </>
  );
}