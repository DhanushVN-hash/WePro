import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import EnquiryForm from "@/components/enquiryForm";
import RelatedProducts from "@/components/RelatedProducts";
import { cache } from "react";

interface Product {
  id: string;
  slug: string;
  name: string;
  model?: string;
  description?: string;
  image_url?: string;
  weight?: string;
  dimensions?: string;
  nail_compatibility?: string;
  capacity?: string;
  operating_pressure?: string;
  air_inlet?: string;
  customized_support?: string;
}

export const revalidate = 3600;

const getProduct = cache(async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      model,
      description,
      image_url,
      weight,
      dimensions,
      nail_compatibility,
      capacity,
      operating_pressure,
      air_inlet,
      customized_support
    `)
    .eq("slug", slug)
    .single<Product>();

  return { data, error };
});

// Fetches just slug + name for every product, ordered the same way the
// catalog is sorted, so we can find who comes before/after the current one.
const getAdjacentProducts = cache(async (currentId: string, currentName: string) => {
  const [{ data: prevData }, { data: nextData }] = await Promise.all([
    supabase
      .from("products")
      .select("slug, name")
      .lt("name", currentName)
      .order("name", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("products")
      .select("slug, name")
      .gt("name", currentName)
      .order("name", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return { prev: prevData, next: nextData };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: product } = await getProduct(slug);

  if (!product) return {};

  return {
    title: `${product.name} | Meite Tools`,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: product, error } = await getProduct(slug);

  if (error || !product) {
    notFound();
  }

  const { prev, next } = await getAdjacentProducts(product.id, product.name);

  const hasSpecifications =
    product.weight ||
    product.dimensions ||
    product.nail_compatibility ||
    product.capacity ||
    product.operating_pressure ||
    product.air_inlet ||
    product.customized_support;

  const specRows: { label: string; value?: string; multiline?: boolean }[] = [
    { label: "Weight", value: product.weight },
    { label: "Dimensions", value: product.dimensions },
    { label: "Nail Compatibility", value: product.nail_compatibility, multiline: true },
    { label: "Capacity", value: product.capacity },
    { label: "Operating Pressure", value: product.operating_pressure },
    { label: "Air Inlet", value: product.air_inlet },
    { label: "Customized Support", value: product.customized_support },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb + prev/next */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-[#101820] transition-colors">
            Home
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {prev ? (
            <Link
              href={`/products/${prev.slug}`}
              className="text-gray-500 hover:text-[#101820] transition-colors flex items-center gap-1"
            >
              <span aria-hidden>‹</span> Prev
            </Link>
          ) : (
            <span className="text-gray-300 flex items-center gap-1 cursor-not-allowed">
              <span aria-hidden>‹</span> Prev
            </span>
          )}

          <span className="text-gray-300">|</span>

          {next ? (
            <Link
              href={`/products/${next.slug}`}
              className="text-gray-500 hover:text-[#101820] transition-colors flex items-center gap-1"
            >
              Next <span aria-hidden>›</span>
            </Link>
          ) : (
            <span className="text-gray-300 flex items-center gap-1 cursor-not-allowed">
              Next <span aria-hidden>›</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Image + description */}
        <div className="w-full lg:sticky lg:top-24">
          <div className="bg-white rounded-xl shadow-md ring-1 ring-black/5 p-5 sm:p-8 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative w-full max-w-sm mx-auto aspect-square">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  quality={75}
                  sizes="(max-width:640px) 90vw,
                          (max-width:1024px) 45vw,
                          400px"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {product.description && (
            <p className="mt-6 text-gray-700 leading-7 sm:leading-8 whitespace-pre-line max-w-md mx-auto lg:max-w-none">
              {product.description}
            </p>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101820] leading-tight break-words">
            {product.name}
          </h1>

          {product.model && (
            <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-500">
              SKU: <span className="font-medium text-gray-700">{product.model}</span>
            </p>
          )}

          <a href="#enquiry-form" className="mt-8 sm:mt-10 w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover active:bg-yellow-700 text-black font-bold px-8 py-4 rounded-lg transition-colors shadow-sm">
              Enquire Now
            </button>
          </a>

          {hasSpecifications && (
            <details open className="group mt-10 sm:mt-12">
              <summary className="flex items-center justify-between cursor-pointer list-none text-2xl sm:text-3xl font-bold text-[#101820] mb-4 sm:mb-6 [&::-webkit-details-marker]:hidden">
                Additional Information
                <span className="text-2xl font-normal leading-none text-gray-500 group-open:hidden">
                  +
                </span>
                <span className="hidden text-2xl font-normal leading-none text-gray-500 group-open:inline">
                  –
                </span>
              </summary>

              <dl className="rounded-xl border border-gray-200 divide-y divide-gray-200 overflow-hidden bg-white shadow-sm">
                {specRows.map(({ label, value, multiline }) => (
                  <div
                    key={label}
                    className="grid grid-cols-1 sm:grid-cols-3 odd:bg-gray-50/60"
                  >
                    <dt className="px-4 py-3 sm:py-3.5 font-semibold text-[#101820] text-sm sm:text-base sm:border-r sm:border-gray-200">
                      {label}
                    </dt>
                    <dd
                      className={`px-4 py-3 sm:py-3.5 sm:col-span-2 text-gray-700 text-sm sm:text-base ${
                        multiline ? "whitespace-pre-line" : ""
                      }`}
                    >
                      {value || "-"}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
          )}
        </div>
      </div>

      <div id="enquiry-form" className="scroll-mt-20 mt-16 lg:mt-20">
        <EnquiryForm
          title="Request a Quote"
          subtitle="Please take a moment to fill out the form."
          productPage
          defaultProduct={product.name}
          showImage={false}
        />
      </div>

      <div className="mt-16 lg:mt-20">
        <RelatedProducts currentSlug={product.slug} />
      </div>
    </div>
  );
}