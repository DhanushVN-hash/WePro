import ProductGrid from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import ProductSidebar from "@/components/ProductSidebar";
import MobileFilters from "@/components/MobileFilters";

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

  // Fetch category & subcategories in parallel
  const [categoryResult, subcategoriesResult] = await Promise.all([
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
  ]);

  const currentCategory = categoryResult.data;
  const subcategories = subcategoriesResult.data;

  // Products query
  let query = supabase
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
    .eq("category_id", categoryId)
    .order("id");

  if (subcategory) {
    query = query.eq("subcategory_id", Number(subcategory));
  }

  const { data: products, count } = await query;

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
          <ProductGrid products={products ?? []} />
        </div>
      </div>
    </div>
  );
}