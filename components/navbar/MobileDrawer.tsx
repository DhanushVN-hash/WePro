"use client";

import {X} from "lucide-react";
import Link from "next/link";
import React from "react";

type MobileLink = {
  href: string;
  label: string;
};

type MobileDrawerProps = {
  mobileOpen: boolean;
  closeMobileMenu: () => void;
  mobileMenuRef: React.RefObject<HTMLElement | null>;
  mobileLinks: MobileLink[];
  isActive: (href: string) => boolean;
};

export default function MobileDrawer({
  mobileOpen,
  closeMobileMenu,
  mobileMenuRef,
  mobileLinks,
  isActive,
}: MobileDrawerProps) {
  return (
    <>
      {/* Mobile Backdrop */}
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

      {/* Mobile Drawer */}
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
        {/* Drawer Header */}
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

        {/* Drawer Links */}
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

        {/* Drawer Footer */}
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