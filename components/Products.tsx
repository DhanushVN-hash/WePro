import { supabase } from "@/lib/supabase";
import ProductCarousel from "@/components/ProductCarousel";

export const revalidate = 3600;

export default async function Products() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name, image_url");

  if (error) {
    console.error("Failed to load products:", error.message);
  }

  return (
    <section className="py-20">
      <h2 className="text-5xl font-bold text-center mb-16 text-[#101820]">
        Our Products
      </h2>

      <div className="max-w-7xl mx-auto px-6">
        <ProductCarousel products={products || []} />
      </div>
    </section>
  );
}