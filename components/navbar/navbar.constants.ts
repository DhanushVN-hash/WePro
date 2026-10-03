export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#enquiry" },
];

export const MOBILE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  ...NAV_LINKS.slice(1),
];