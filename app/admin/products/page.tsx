import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import DeleteProductButton from "@/components/DeleteProductButton";

const PAGE_SIZE = 20;

type SortKey = "name" | "price" | "id";

const SORT_OPTIONS: {
  value: SortKey;
  label: string;
}[] = [
  { value: "id", label: "Newest" },
  { value: "name", label: "Name (A–Z)" },
  { value: "price", label: "Price (Low–High)" },
];

type Product = {
  id: number;
  name: string;
  model: string | null;
  slug: string;
  image_url: string | null;
  price: number | null;
  price_type: string | null;
  currency: string | null;
  categories?: {
    id: number;
    name: string;
  } | null;
  subcategories?: {
    id: number;
    name: string;
  } | null;
};

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

  const {
    q,
    category,
    subcategory,
    sort,
    page,
  } = await searchParams;

  const currentPage = Math.max(
    1,
    Number(page) || 1
  );

  const from =
    (currentPage - 1) * PAGE_SIZE;

  const to =
    from + PAGE_SIZE - 1;

  const sortKey: SortKey = (
    ["name", "price", "id"] as SortKey[]
  ).includes(sort as SortKey)
    ? (sort as SortKey)
    : "id";

  /*
   * ==========================================================
   * CATEGORIES
   * ==========================================================
   */

  const { data: categories } =
    await supabase
      .from("categories")
      .select("id, name")
      .order("name", {
        ascending: true,
      });

  /*
   * ==========================================================
   * SUBCATEGORIES
   * ==========================================================
   */

  const { data: subcategories } =
    await supabase
      .from("subcategories")
      .select(
        "id, name, category_id"
      )
      .order("name");

  /*
   * ==========================================================
   * PRODUCTS
   * ==========================================================
   */

  let query = supabase
    .from("products")
    .select(
      `
        *,
        categories(id, name),
        subcategories(id, name)
      `,
      {
        count: "exact",
      }
    );

  /*
   * Search
   */

  if (q?.trim()) {
    query = query.ilike(
      "name",
      `%${q.trim()}%`
    );
  }

  /*
   * Category
   */

  if (category) {
    query = query.eq(
      "category_id",
      Number(category)
    );
  }

  /*
   * Subcategory
   */

  if (subcategory) {
    query = query.eq(
      "subcategory_id",
      Number(subcategory)
    );
  }

  /*
   * Sort
   */

  query = query.order(
    sortKey,
    {
      ascending:
        sortKey !== "id",
    }
  );

  /*
   * Pagination
   */

  query = query.range(
    from,
    to
  );

  const {
    data,
    error,
    count,
  } = await query;

  if (error) {
    console.error(
      "Failed to load products:",
      error.message
    );
  }

  const products =
    (data as Product[]) || [];

  const totalCount =
    count ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalCount / PAGE_SIZE
    )
  );

  /*
   * ==========================================================
   * URL BUILDER
   * ==========================================================
   */

  const buildHref = (
    overrides: Record<
      string,
      string | number | undefined
    >
  ) => {
    const params =
      new URLSearchParams();

    const merged = {
      q,
      category,
      subcategory,
      sort: sortKey,
      page: currentPage,
      ...overrides,
    };

    if (merged.q) {
      params.set(
        "q",
        String(merged.q)
      );
    }

    if (merged.category) {
      params.set(
        "category",
        String(
          merged.category
        )
      );
    }

    if (merged.subcategory) {
      params.set(
        "subcategory",
        String(
          merged.subcategory
        )
      );
    }

    if (merged.sort) {
      params.set(
        "sort",
        String(merged.sort)
      );
    }

    if (
      merged.page &&
      Number(merged.page) > 1
    ) {
      params.set(
        "page",
        String(merged.page)
      );
    }

    const queryString =
      params.toString();

    return queryString
      ? `/admin/products?${queryString}`
      : "/admin/products";
  };

  const hasFilters =
    Boolean(
      q ||
        category ||
        subcategory
    );

  /*
   * ==========================================================
   * PAGE
   * ==========================================================
   */

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-7 lg:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Catalogue
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight text-[#101820] sm:text-4xl">
                Products
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                Manage your industrial product
                catalogue, pricing and product
                information.
              </p>

            </div>

            <Link
              href="/admin/products/new"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-5 text-sm font-bold text-[#101820] shadow-sm transition hover:bg-yellow-300"
            >
              <span className="mr-2 text-lg">
                +
              </span>

              Add Product
            </Link>

          </div>

        </div>

      </div>

      {/* ======================================================
          MAIN
          ====================================================== */}

      <main className="mx-auto max-w-[1600px] px-5 py-7 sm:px-7 lg:px-8">

        {/* ====================================================
            SUMMARY CARDS
            ==================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <SummaryCard
            label="Total Products"
            value={totalCount}
            description="Products in catalogue"
          />

          <SummaryCard
            label="Showing"
            value={products.length}
            description={`Products on page ${currentPage}`}
          />

          <SummaryCard
            label="Page"
            value={`${currentPage}/${totalPages}`}
            description="Catalogue pagination"
          />

        </div>

        {/* ====================================================
            FILTER CARD
            ==================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <form
            action="/admin/products"
            className="space-y-4"
          >

            {/* Search */}

            <div className="relative">

              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </div>

              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search products by name..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
              />

            </div>

            {/* Filters */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <select
                name="category"
                defaultValue={
                  category || ""
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >

                <option value="">
                  All Categories
                </option>

                {categories?.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

              <select
                name="subcategory"
                defaultValue={
                  subcategory || ""
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >

                <option value="">
                  All Subcategories
                </option>

                {subcategories
                  ?.filter(
                    (item) =>
                      !category ||
                      item.category_id ===
                        Number(category)
                  )
                  .map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    )
                  )}

              </select>

              <select
                name="sort"
                defaultValue={sortKey}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >

                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}

              </select>

              <div className="flex gap-2">

                <button
                  type="submit"
                  className="h-11 flex-1 rounded-xl bg-[#101820] px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Apply Filters
                </button>

                {hasFilters && (
                  <Link
                    href="/admin/products"
                    className="flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Clear
                  </Link>
                )}

              </div>

            </div>

          </form>

        </section>

        {/* ====================================================
            PRODUCT TABLE
            ==================================================== */}

        {!products.length ? (

          <EmptyState
            hasFilters={hasFilters}
          />

        ) : (

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Table header */}

            <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="font-bold text-[#101820]">
                  Product Catalogue
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {totalCount.toLocaleString(
                    "en-IN"
                  )}{" "}
                  total products
                </p>

              </div>

              {hasFilters && (
                <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  Filtered results
                </span>
              )}

            </div>

            {/* Scrollable table */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50 text-left">

                    <th className="w-[90px] px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Image
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Product
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Model
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Price
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Slug
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        returnHref={buildHref(
                          {}
                        )}
                      />
                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* ==================================================
                PAGINATION
                ================================================== */}

            <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-700">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">

                <Link
                  href={buildHref({
                    page: Math.max(
                      1,
                      currentPage - 1
                    ),
                  })}
                  aria-disabled={
                    currentPage <= 1
                  }
                  className={`inline-flex h-10 items-center rounded-lg border px-4 text-sm font-semibold transition ${
                    currentPage <= 1
                      ? "pointer-events-none border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  ← Previous
                </Link>

                <span className="hidden h-10 items-center rounded-lg bg-slate-100 px-4 text-sm font-bold text-slate-700 sm:flex">
                  {currentPage}
                </span>

                <Link
                  href={buildHref({
                    page: Math.min(
                      totalPages,
                      currentPage + 1
                    ),
                  })}
                  aria-disabled={
                    currentPage >=
                    totalPages
                  }
                  className={`inline-flex h-10 items-center rounded-lg border px-4 text-sm font-semibold transition ${
                    currentPage >=
                    totalPages
                      ? "pointer-events-none border-slate-100 text-slate-300"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Next →
                </Link>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

/*
 * ==========================================================
 * PRODUCT ROW
 * ==========================================================
 */

function ProductRow({
  product,
  returnHref,
}: {
  product: Product;
  returnHref: string;
}) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">

      {/* IMAGE */}

      <td className="px-5 py-4">

        {product.image_url?.trim() ? (

          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white">

            <Image
              src={product.image_url}
              alt={
                product.name ||
                "Product"
              }
              fill
              className="object-contain p-1"
              sizes="64px"
            />

          </div>

        ) : (

          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-400">
            No Image
          </div>

        )}

      </td>

      {/* PRODUCT */}

      <td className="px-5 py-4">

        <div className="max-w-[260px]">

          <p className="truncate text-sm font-bold text-[#101820]">
            {product.name}
          </p>

        <p className="mt-1 text-xs text-slate-400">
          ID: {String(product.id)}
        </p>

        </div>

      </td>

      {/* MODEL */}

      <td className="px-5 py-4">

        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-600">
          {product.model ||
            "—"}
        </span>

      </td>

      {/* CATEGORY */}

      <td className="px-5 py-4">

        <div className="max-w-[180px]">

          <p className="truncate text-sm font-medium text-slate-700">
            {product.categories
              ?.name ||
              "—"}
          </p>

          {product.subcategories
            ?.name && (
            <p className="mt-1 truncate text-xs text-slate-400">
              {
                product
                  .subcategories
                  .name
              }
            </p>
          )}

        </div>

      </td>

      {/* PRICE */}

      <td className="px-5 py-4">

        <PriceDisplay
          price={
            product.price
          }
          priceType={
            product.price_type
          }
          currency={
            product.currency
          }
        />

      </td>

      {/* SLUG */}

      <td className="px-5 py-4">

        <span
          title={product.slug}
          className="block max-w-[180px] truncate font-mono text-xs text-slate-400"
        >
          {product.slug}
        </span>

      </td>

      {/* ACTIONS */}

      <td className="px-5 py-4">

        <div className="flex items-center justify-end gap-2">

          <Link
            href={`/admin/products/${product.id}/edit?return=${encodeURIComponent(
              returnHref
            )}`}
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Edit
          </Link>

          <DeleteProductButton
            id={product.id}
          />

        </div>

      </td>

    </tr>
  );
}

/*
 * ==========================================================
 * PRICE DISPLAY
 * ==========================================================
 */

function PriceDisplay({
  price,
  priceType,
  currency,
}: {
  price: number | null;
  priceType: string | null;
  currency: string | null;
}) {
  if (
    priceType ===
      "contact" ||
    price === null ||
    price === undefined
  ) {
    return (
      <div>
        <p className="text-sm font-semibold text-slate-600">
          Contact for price
        </p>

        <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Quote required
        </p>
      </div>
    );
  }

  const symbol =
    currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "€"
      : "₹";

  const formatted =
    price.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    );

  return (
    <div>

      <p className="text-sm font-bold text-[#101820]">
        {priceType ===
          "starting_from" &&
          "From "}

        {symbol}
        {formatted}
      </p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-green-600">
        {priceType ===
        "starting_from"
          ? "Starting price"
          : "Fixed price"}
      </p>

    </div>
  );
}

/*
 * ==========================================================
 * SUMMARY CARD
 * ==========================================================
 */

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black tracking-tight text-[#101820]">
        {typeof value ===
        "number"
          ? value.toLocaleString(
              "en-IN"
            )
          : value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}

/*
 * ==========================================================
 * EMPTY STATE
 * ==========================================================
 */

function EmptyState({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <PackageIcon />
      </div>

      <h2 className="mt-5 text-lg font-bold text-[#101820]">
        {hasFilters
          ? "No products found"
          : "No products yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {hasFilters
          ? "Try changing your search or filters to find the products you are looking for."
          : "Add your first product to start building your industrial catalogue."}
      </p>

      {hasFilters ? (

        <Link
          href="/admin/products"
          className="mt-6 inline-flex rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          Clear Filters
        </Link>

      ) : (

        <Link
          href="/admin/products/new"
          className="mt-6 inline-flex rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-[#101820] hover:bg-yellow-300"
        >
          + Add Product
        </Link>

      )}

    </section>
  );
}

/*
 * ==========================================================
 * ICONS
 * ==========================================================
 */

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />

      <path d="m3.3 7 8.7 5 8.7-5" />

      <path d="M12 22V12" />
    </svg>
  );
}