"use client";

import { useRouter } from "next/navigation";

type Props = {
  categoryId: number;
  subcategory?: string;
  subcategories: {
    id: number;
    name: string;
  }[];
};

export default function MobileFilters({
  categoryId,
  subcategory,
  subcategories,
}: Props) {
  const router = useRouter();

  return (
    <div className="lg:hidden mb-6 space-y-4">

      <select
        value={categoryId}
        onChange={(e) =>
          router.push(`/products?category=${e.target.value}`)
        }
        className="w-full border rounded-lg p-3"
      >
        <option value={3}>Pneumatic Nailers</option>
        <option value={4}>Fasteners</option>
        <option value={5}>Spray Guns</option>
        <option value={6}>Pneumatic Tools</option>
        <option value={7}>Accessory & Others</option>
      </select>

      <select
        value={subcategory ?? ""}
        onChange={(e) =>
          router.push(
            e.target.value
              ? `/products?category=${categoryId}&subcategory=${e.target.value}`
              : `/products?category=${categoryId}`
          )
        }
        className="w-full border rounded-lg p-3"
      >
        <option value="">All Products</option>

        {subcategories.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>
    </div>
  );
}