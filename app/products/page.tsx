import ProductGrid from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import ProductSidebar from "@/components/ProductSidebar";
import MobileFilters from "@/components/MobileFilters";

export const revalidate = 60;

const PAGE_SIZE = 12;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
  }>;
}) {
  const { category, subcategory } = await searchParams;

  const categoryId = Number(category ?? 3);

  let productsQuery = supabase
    .from("products")
    .select(
      `
        id,
        name,
        slug,
        model,
        image_url,
        category_id,
        subcategory_id,
        subcategories(name)
      `,
      { count: "exact" }
    )
    .eq("category_id", categoryId);

  if (subcategory) {
    productsQuery = productsQuery.eq("subcategory_id", Number(subcategory));
  }

  const [categoryResult, subcategoriesResult, productsResult] =
    await Promise.all([
      supabase.from("categories").select("name").eq("id", categoryId).single(),

      supabase
        .from("subcategories")
        .select("id, name")
        .eq("category_id", categoryId)
        .order("name"),

      productsQuery.order("id").range(0, PAGE_SIZE - 1),
    ]);

  const currentCategory = categoryResult.data;
  const subcategories = subcategoriesResult.data;
  const { data: products, count } = productsResult;

  // Resolve the active subcategory name for the breadcrumb, if any
  const activeSubName = subcategory
    ? subcategories?.find((s) => s.id === Number(subcategory))?.name
    : undefined;

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-5 font-mono text-[11px] uppercase tracking-[0.15em] text-gray-500">
          <span>Home</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className={activeSubName ? "" : "text-[#101820] font-semibold"}>
            {currentCategory?.name}
          </span>
          {activeSubName && (
            <>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-[#101820] font-semibold">{activeSubName}</span>
            </>
          )}
        </nav>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.95] text-[#101820]">
          {currentCategory?.name}
        </h1>

        {/* Tick-rule divider */}
        <div
          className="mt-5 h-2 w-full max-w-xs"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #101820 0px, #101820 1px, transparent 1px, transparent 7px)",
          }}
          aria-hidden="true"
        />

        {/* Spec-plate count badge */}
        <div className="mt-5 mb-10">
          <span className="inline-flex items-center gap-2  text-amber-400 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-sm">
            {count ?? 0} Products Listed
          </span>
        </div>

        {/* Mobile Filters */}
        <MobileFilters
          categoryId={categoryId}
          subcategory={subcategory}
          subcategories={subcategories ?? []}
        />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <ProductSidebar
              categoryId={categoryId}
              subcategory={subcategory}
              subcategories={subcategories ?? []}
            />
          </div>

          {/* Products */}
          <div className="flex-1">
            <ProductGrid
              initialProducts={products ?? []}
              total={count ?? 0}
              categoryId={categoryId}
              subcategory={subcategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}