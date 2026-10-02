"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";

import NavbarSearch from "./NavbarSearch";

type MobileNavbarProps = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  clearSearch: () => void;

  search: string;
  setSearch: (value: string) => void;
  results: any[];

  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;

  loading: boolean;
  searchError: string | null;

  mobileSearchRef:
    React.RefObject<HTMLDivElement | null>;

  mobileToggleRef:
    React.RefObject<HTMLButtonElement | null>;
};

export default function MobileNavbar({
  mobileOpen,
  setMobileOpen,
  clearSearch,

  search,
  setSearch,
  results,

  searchOpen,
  setSearchOpen,

  loading,
  searchError,

  mobileSearchRef,
  mobileToggleRef,
}: MobileNavbarProps) {
  return (
    <div className="w-full">

      {/* =====================================================
          ROW 1 — CENTERED LOGO
      ===================================================== */}

      <div
        className="
          flex
          w-full
          items-center
          justify-center
          py-5
        "
      >
        <Link
          href="/"
          onClick={clearSearch}
          aria-label="WE PRO home"
          className="
            flex
            flex-col
            items-center
            justify-center
          "
        >
          {/* YOUR EXISTING LOGO */}
          <span
            className="
              text-2xl
              font-bold
              leading-none
              text-yellow-400
            "
          >
            WE PRO
          </span>

          <span
            className="
              mt-1
              text-[1px]
              uppercase
              tracking-[0.16em]
              text-gray-300
            "
          >
            Industrial Products
          </span>
        </Link>
      </div>


      {/* =====================================================
          ROW 2 — SEARCH + HAMBURGER
      ===================================================== */}

<div
className="
  flex
  w-full
  items-center
  gap-8
  pb-4
  relative
  top-0
"
>

        {/* SEARCH — WIDE */}

        <div
          ref={mobileSearchRef}
          className="min-w-0 flex-1"
        >
          <NavbarSearch
            search={search}
            setSearch={setSearch}
            results={results}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            loading={loading}
            searchError={searchError}
            clearSearch={clearSearch}
            variant="mobile"
          />
        </div>


        {/* HAMBURGER — ICON ONLY */}

        <button
          ref={mobileToggleRef}
          type="button"
          onClick={() =>
            setMobileOpen((value) => !value)
          }
          aria-label={
            mobileOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileOpen}
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            bg-transparent
            p-0
            text-white
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary
          "
        >
          {mobileOpen ? (
            <X
              size={34}
              strokeWidth={2}
            />
          ) : (
            <Menu
              size={34}
              strokeWidth={2}
            />
          )}
        </button>

      </div>

    </div>
  );
}