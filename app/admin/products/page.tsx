import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import DeleteProductButton from "@/components/DeleteProductButton";

const PAGE_SIZE = 20;

type SortKey = "name" | "id";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "id", label: "Newest" },
  { value: "name", label: "Name (A–Z)" },
];

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    subcategory?: string;
    sort?: SortKey;
    page?: string;
  }>;
}) {
  const supabase = await createClient();

  const { q, category, subcategory, sort, page } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const sortKey: SortKey = (["name", "price", "stock", "id"] as SortKey[]).includes(
    sort as SortKey
  )
    ? (sort as SortKey)
    : "id";

  // Fetch categories for the filter dropdown
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("id, name, category_id")
    .order("name");

  let query = supabase
    .from("products")
    .select(
      `*, 
    categories(id, name),
    subcategories(id, name)
    `,
      { count: "exact" }
    )
    .order(sortKey, { ascending: sortKey !== "id" });

  if (q?.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  if (category) {
    query = query.eq("category_id", Number(category));
  }

  if (subcategory) {
    query = query.eq("subcategory_id", Number(subcategory));
  }

  query = query.range(from, to);

  const { data: products, error, count } = await query;

  if (error) {
    console.error("Failed to load products:", error.message);
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Helper to build a query string that preserves existing filters
  const buildHref = (overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    const merged = { q, category, subcategory, sort: sortKey, page: currentPage, ...overrides };
    if (merged.subcategory) params.set("subcategory", String(merged.subcategory));

    if (merged.q) params.set("q", String(merged.q));
    if (merged.category) params.set("category", String(merged.category));
    if (merged.sort) params.set("sort", String(merged.sort));
    if (merged.page && Number(merged.page) > 1) params.set("page", String(merged.page));

    const qs = params.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-black">Product Management</h1>

        <Link
          href="/admin/products/new"
          className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-lg font-semibold transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <form className="mb-6 flex flex-wrap gap-3 items-center" action="/admin/products">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by product name..."
          className="border p-3 rounded w-full max-w-sm"
        />

        <select
          name="category"
          defaultValue={category || ""}
          className="border p-3 rounded"
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="subcategory"
          defaultValue={subcategory || ""}
          className="border p-3 rounded"
        >
          <option value="">All subcategories</option>

          {subcategories
            ?.filter(
              (sub) => !category || sub.category_id === Number(category)
            )
            .map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
        </select>

        <select name="sort" defaultValue={sortKey} className="border p-3 rounded">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-black text-white px-4 py-3 rounded font-semibold hover:bg-gray-800"
        >
          Apply
        </button>

        {(q || category) && (
          <Link
            href="/admin/products"
            className="text-sm text-gray-500 hover:underline"
          >
            Clear filters
          </Link>
        )}
      </form>

      <p className="text-sm text-gray-500 mb-4">
        Showing {products?.length ?? 0} of {totalCount} product
        {totalCount === 1 ? "" : "s"}
      </p>

      {!products?.length ? (
        <p className="text-gray-500 py-10 text-center border rounded-lg">
          {q || category
            ? "No products match your filters."
            : "No products yet — add your first one."}
        </p>
      ) : (
        <>
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Product</th>
                <th className="p-3 border">Model</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Subcategory</th>
                <th className="p-3 border">Slug</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="border p-3">
                    {product.image_url?.trim() ? (
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center text-xs text-gray-400 bg-gray-50 rounded">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="border p-3 font-medium">{product.name}</td>
                  <td className="border p-3">{product.model || "-"}</td>
                  <td className="border p-3">{product.categories?.name || "-"}</td>
                  <td className="border p-3">{product.subcategories?.name || "-"}</td>

                  <td className="border p-3 text-gray-500 text-sm">{product.slug}</td>

                  <td className="border p-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/products/${product.id}/edit?return=${encodeURIComponent(
                          buildHref({})
                        )}`}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <Link
              href={buildHref({ page: Math.max(1, currentPage - 1) })}
              aria-disabled={currentPage <= 1}
              className={`px-4 py-2 rounded border ${
                currentPage <= 1
                  ? "pointer-events-none text-gray-300"
                  : "hover:bg-gray-100"
              }`}
            >
              ← Previous
            </Link>

            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>

            <Link
              href={buildHref({ page: Math.min(totalPages, currentPage + 1) })}
              aria-disabled={currentPage >= totalPages}
              className={`px-4 py-2 rounded border ${
                currentPage >= totalPages
                  ? "pointer-events-none text-gray-300"
                  : "hover:bg-gray-100"
              }`}
            >
              Next →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}