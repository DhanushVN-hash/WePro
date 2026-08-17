"use client";

import Link from "next/link";

interface ProductDropdownProps {
  onNavigate?: () => void;
}

const items = [
  { id: 3, name: "Pneumatic Nailers & Staplers" },
  { id: 4, name: "Fasteners" },
  { id: 5, name: "Spray Guns" },
  { id: 6, name: "Pneumatic Tools" },
  { id: 7, name: "Accessory & Others" },
];

export default function ProductDropdown({
  onNavigate,
}: ProductDropdownProps) {
  return (
    <div className="w-[290px] bg-[#666666] shadow-lg">
      <ul className="py-1">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/products?category=${item.id}`}
              onClick={onNavigate}
              className="
                block
                px-4
                py-1.5
                text-[18px]
                font-semibold
                leading-7
                text-yellow-400
                transition-colors
                duration-150
                hover:bg-[#555555]
                hover:text-yellow-300
              "
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}