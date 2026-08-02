import ProductGrid from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import ProductSidebar from "@/components/ProductSidebar";
import MobileFilters from "@/components/MobileFilters";

// Cache this page for 60s so repeat visits don't re-hit Supabase every time.
// Adjust or remove if your product data changes very frequently.
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

  // Build the products query (not awaited yet)
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

  // Fire ALL independent queries in parallel — category, subcategories, and products
  const [categoryResult, subcategoriesResult, productsResult] =
    await Promise.all([
      supabase
        .from("categories")
        .select("name")
        .eq("id", categoryId)
        .single(),

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
        {currentCategory?.name}
      </h1>

      <p className="mt-2 mb-10 text-amber-600 font-medium">
        {count ?? 0} Products
      </p>

      {/* Mobile Filters */}
      <MobileFilters
        categoryId={categoryId}
        subcategory={subcategory}
        subcategories={subcategories ?? []}
      />

      <div className="flex flex-col lg:flex-row gap-8">
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
  );
}