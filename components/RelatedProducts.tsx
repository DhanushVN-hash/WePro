import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default async function RelatedProducts({
  currentSlug,
}: {
  currentSlug: string;
}) {
  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, image_url")
    .neq("slug", currentSlug)
    .order("id")
    .limit(4);

  if (!products?.length) return null;

  return (
    <section className="mt-10 lg:mt-20 w-full max-w-[1000px] mx-auto">

      {/* Heading */}
      <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-8 text-[#101820]">
        Related Products
      </h2>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
        {products.map((product) => {
          const imageUrl = product.image_url;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="
                group
                block
                overflow-hidden
                rounded-lg
                border
                border-gray-200
                bg-white
                transition-all
                duration-300
                active:scale-[0.98]
                lg:active:scale-100
                lg:hover:-translate-y-1
                lg:hover:shadow-md
              "
            >
              {/* Product Image */}
              <div className="relative w-full h-[130px] sm:h-[190px] bg-white overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    loading="lazy"
                    quality={70}
                    sizes="
                      (max-width:640px) 45vw,
                      (max-width:1024px) 45vw,
                      220px
                    "
                    className="
                      object-contain
                      p-3
                      sm:p-5
                      transition-transform
                      duration-300
                      lg:group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs sm:text-sm text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div className="px-2.5 py-2.5 sm:px-4 sm:py-4 border-t border-gray-100">
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-[#101820] line-clamp-2 leading-5 sm:leading-6">
                  {product.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}