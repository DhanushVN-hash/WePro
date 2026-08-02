import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import EnquiryForm from "@/components/enquiryForm";
import RelatedProducts from "@/components/RelatedProducts";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
const { data: product, error } = await supabase
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

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single<Product>();

  if (error || !product) {
    notFound();
  }


const hasSpecifications =
  product.weight ||
  product.dimensions ||
  product.nail_compatibility ||
  product.capacity ||
  product.operating_pressure ||
  product.air_inlet ||
  product.customized_support;

  // Spec rows kept in an array purely for cleaner rendering below —
  // no data/logic change, same fields as before.
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
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Image */}
        <div className="w-full lg:sticky lg:top-24">
          <div className="bg-white rounded-xl shadow-md ring-1 ring-black/5 p-5 sm:p-8 w-full">
            <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square">
              {product.image_url ? (
                <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                quality={70}
                sizes="(max-width:640px) 100vw,
                        (max-width:1024px) 70vw,
                        45vw"
                className="object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                  No Image Available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101820] leading-tight break-words">
            {product.name}
          </h1>

          <p className="mt-2 sm:mt-3 text-base sm:text-lg lg:text-xl text-gray-500">
            Model:{" "}
            <span className="font-medium text-gray-700">
              {product.model || "-"}
            </span>
          </p>

          {product.description && (
            <p className="mt-6 sm:mt-8 text-gray-700 leading-7 sm:leading-8 whitespace-pre-line">
              {product.description}
            </p>
          )}

          <a href="#enquiry-form" className="mt-8 sm:mt-10 w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover active:bg-yellow-700 text-black font-bold px-8 py-4 rounded-lg transition-colors shadow-sm">
              Enquire Now
            </button>
          </a>

          {hasSpecifications && (
            <div className="mt-10 sm:mt-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#101820]">
                Additional Information
              </h2>

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
            </div>
          )}
        </div>
      </div>

      <div id="enquiry-form" className="scroll-mt-20 mt-16 lg:mt-20">
        <EnquiryForm
          title="Request a Quote"
          subtitle="Please take a moment to fill out the form."
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