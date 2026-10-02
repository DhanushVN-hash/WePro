"use client";

import Link from "next/link";
import React from "react";
import ProductDropdown from "@/components/productDropdown";

type NavLink = {
  href: string;
  label: string;
};

type DesktopNavbarProps = {
  navLinks: NavLink[];
  productsOpen: boolean;
  setProductsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productsRef: React.RefObject<HTMLLIElement | null>;
  closeProducts: () => void;
  isActive: (href: string) => boolean;
};

export default function DesktopNavbar({
  navLinks,
  productsOpen,
  setProductsOpen,
  productsRef,
  closeProducts,
  isActive,
}: DesktopNavbarProps) {
  return (
    <ul className="hidden h-full items-center justify-center gap-8 lg:flex">
      {/* Home */}
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

      {/* Products */}
      <li
        ref={productsRef}
        className="relative flex h-full items-center"
      >
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={productsOpen}
          onClick={() =>
            setProductsOpen((value) => !value)
          }
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
          <ProductDropdown
            onNavigate={closeProducts}
          />
        </div>
      </li>

      {/* About + Contact */}
      {navLinks.slice(1).map((link) => (
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
  );
}