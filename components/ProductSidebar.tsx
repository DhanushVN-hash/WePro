import Link from "next/link";

type Subcategory = {
  id: number;
  name: string;
};

type Props = {
  categoryId: number;
  subcategory?: string;
  subcategories: Subcategory[];
};

export default function ProductSidebar({
  categoryId,
  subcategory,
  subcategories,
}: Props) {
  return (
    <aside className="w-60 flex-shrink-0 sticky top-28 self-start">
      <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
        Browse by
      </h2>

      <nav className="max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
        <ul className="space-y-3">
          <li>
            <Link
              href={`/products?category=${categoryId}`}
              className={`block ${
                !subcategory
                  ? "text-amber-600 font-semibold"
                  : "text-gray-700 hover:text-amber-600"
              }`}
            >
              All Products
            </Link>
          </li>

          {subcategories.map((sub) => (
            <li key={sub.id}>
              <Link
                href={`/products?category=${categoryId}&subcategory=${sub.id}`}
                className={`block transition-colors ${
                  Number(subcategory) === sub.id
                    ? "text-amber-600 font-semibold"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                {sub.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}