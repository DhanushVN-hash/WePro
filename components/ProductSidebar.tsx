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
    <aside className="w-64 flex-shrink-0 sticky top-28 self-start">
      {subcategories.length > 0 && (
        <>
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500 mb-4 pb-3 border-b border-gray-200">
            Filter by Type
          </h2>

          <nav className="max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
            <ul className="space-y-1">
              <li>
                <Link
                  href={`/products?category=${categoryId}`}
                  className={`block pl-3 py-1.5 border-l-2 text-sm transition-colors ${
                    !subcategory
                      ? "border-amber-500 text-[#101820] font-semibold bg-amber-500/5"
                      : "border-transparent text-gray-600 hover:text-[#101820] hover:border-gray-300"
                  }`}
                >
                  All Products
                </Link>
              </li>

              {subcategories.map((sub) => {
                const isActive = Number(subcategory) === sub.id;
                return (
                  <li key={sub.id}>
                    <Link
                      href={`/products?category=${categoryId}&subcategory=${sub.id}`}
                      className={`block pl-3 py-1.5 border-l-2 text-sm transition-colors ${
                        isActive
                          ? "border-amber-500 text-[#101820] font-semibold bg-amber-500/5"
                          : "border-transparent text-gray-600 hover:text-[#101820] hover:border-gray-300"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </aside>
  );
}