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

const getAdjacentProducts = cache(
  async (currentName: string) => {
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

    return {
      prev: prevData,
      next: nextData,
    };
  }
);

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

  const { prev, next } = await getAdjacentProducts(
    product.name
  );

  const hasSpecifications =
    product.weight ||
    product.dimensions ||
    product.nail_compatibility ||
    product.capacity ||
    product.operating_pressure ||
    product.air_inlet ||
    product.customized_support;

  const specRows: {
    label: string;
    value?: string;
    multiline?: boolean;
  }[] = [
    { label: "Weight", value: product.weight },
    { label: "Dimensions", value: product.dimensions },
    {
      label: "Nail Compatibility",
      value: product.nail_compatibility,
      multiline: true,
    },
    { label: "Capacity", value: product.capacity },
    { label: "Operating Pressure", value: product.operating_pressure },
    { label: "Air Inlet", value: product.air_inlet },
    { label: "Customized Support", value: product.customized_support },
  ];

  return (
    <main className="bg-white">
      <div className="max-w-225 mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:pt-10 pb-16 lg:pb-20">

        {/* =====================================================
            BREADCRUMB + PREVIOUS / NEXT — desktop only
        ====================================================== */}
        <div className="hidden lg:flex items-center justify-between gap-4 mb-12">

          <nav
            aria-label="Breadcrumb"
            className="text-sm sm:text-[15px] text-gray-400 truncate"
          >
            <Link
              href="/"
              className="text-[#3b82f6] hover:text-[#101820] transition-colors"
            >
              Home
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span>{product.name}</span>
          </nav>

          <div className="flex items-center gap-3 text-sm sm:text-[15px] shrink-0">
            {prev ? (
              <Link
                href={`/products/${prev.slug}`}
                className="flex items-center gap-1 text-gray-500 hover:text-[#101820] transition-colors"
              >
                <span className="text-xl leading-none">‹</span>
                Prev
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-300">
                <span className="text-xl leading-none">‹</span>
                Prev
              </span>
            )}

            <span className="text-gray-300">|</span>

            {next ? (
              <Link
                href={`/products/${next.slug}`}
                className="flex items-center gap-1 text-gray-500 hover:text-[#101820] transition-colors"
              >
                Next
                <span className="text-xl leading-none">›</span>
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-300">
                Next
                <span className="text-xl leading-none">›</span>
              </span>
            )}
          </div>
        </div>

        {/* =====================================================
            PRODUCT SECTION
            Mobile order: Name → Image → Enquire → Description → Specs
            Desktop: unchanged (image left / details right)
        ====================================================== */}
        <section
          className="
            grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]
            gap-x-12
            gap-y-5 lg:gap-y-0
            items-start
          "
        >
          {/* ============ NAME + SKU ============ */}
          <div className="order-1 lg:order-0 lg:col-start-2 lg:row-start-1">
            <h1
              className="
                text-[24px] leading-tight
                sm:text-[32px] lg:text-[34px] xl:text-[36px]
                sm:leading-[1.15]
                font-bold text-[#101820] tracking-tight wrap-break-word
              "
            >
              {product.name}
            </h1>

            {product.model && (
              <span
                className="
                  inline-block mt-2.5 lg:mt-3
                  px-2.5 py-1 lg:px-0 lg:py-0
                  bg-gray-100 lg:bg-transparent
                  rounded-full lg:rounded-none
                  text-xs sm:text-[15px] lg:text-[17px]
                  text-gray-500
                "
              >
                SKU:{" "}
                <span className="font-medium text-gray-700">
                  {product.model}
                </span>
              </span>
            )}
          </div>

          {/* ============ IMAGE ============ */}
          <div className="order-2 lg:order-0 lg:col-start-1 lg:row-start-1 lg:row-span-2 w-full -mx-4 sm:mx-0">
            <div
              className="
                relative w-full sm:max-w-135
                aspect-square sm:h-115 lg:h-125
                mx-auto flex items-center justify-center overflow-hidden
                bg-white
              "
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  priority
                  quality={80}
                  sizes="(max-width:640px) 100vw, 500px"
                  className="object-contain p-6 sm:p-0"
                />
              ) : (
                <div className="text-sm text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* ============ ENQUIRE BUTTON ============ */}
          <div className="order-3 lg:order-0 lg:col-start-2 lg:row-start-2 lg:mt-8">
            <a href="#enquiry-form" className="flex justify-center lg:block">
              <span
                className="
                  inline-flex items-center justify-center
                  bg-primary hover:bg-primary-hover active:bg-yellow-700
                  text-black font-bold
                  px-10 py-3 lg:px-8 lg:py-4
                  text-sm sm:text-base
                  rounded-lg
                  transition-colors shadow-sm cursor-pointer
                "
              >
                Enquire Now
              </span>
            </a>
          </div>

          {/* ============ DESCRIPTION ============ */}
          {product.description && (
            <div className="order-4 lg:order-0 lg:col-start-1 lg:row-start-3 w-full max-w-135 mx-auto lg:mx-0">
              <p
                className="
                  text-sm leading-6
                  sm:text-base sm:leading-7
                  text-gray-700 whitespace-pre-line
                "
              >
                {product.description}
              </p>
            </div>
          )}

          {/* ============ ADDITIONAL INFORMATION ============ */}
          {hasSpecifications && (
            <details className="order-5 lg:order-0 lg:col-start-2 lg:row-start-3 group w-full min-w-0">
              <summary
                className="
                  flex items-center justify-between cursor-pointer list-none select-none
                  bg-gray-50 lg:bg-transparent
                  rounded-xl lg:rounded-none
                  px-4 py-3.5 lg:px-0 lg:py-0
                  text-base lg:text-[18px]
                  font-bold text-[#101820]
                  [&::-webkit-details-marker]:hidden
                "
              >
                <span>Additional Information</span>
                <span className="text-2xl font-normal text-gray-500 group-open:hidden">
                  +
                </span>
                <span className="hidden text-2xl font-normal text-gray-500 group-open:inline">
                  −
                </span>
              </summary>

              <dl className="mt-3 lg:mt-5 rounded-lg border border-gray-200 overflow-hidden bg-white">
                {specRows.map(({ label, value, multiline }, index) => (
                  <div
                    key={label}
                    className={`grid grid-cols-[minmax(8rem,0.95fr)_minmax(0,1.35fr)] ${
                      index !== specRows.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <dt className="min-w-0 px-4 py-3 lg:py-3.5 bg-gray-50 sm:bg-white font-semibold text-[#101820] text-sm sm:text-base border-r border-gray-200 break-words">
                      {label}
                    </dt>
                    <dd
                      className={`min-w-0 px-4 py-3 lg:py-3.5 text-gray-700 text-sm sm:text-base break-words ${
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
        </section>

        {/* =====================================================
            ENQUIRY FORM
        ====================================================== */}
        <section id="enquiry-form" className="scroll-mt-20 mt-10 lg:mt-20">
          <EnquiryForm
            title="Request a Quote"
            subtitle="Please take a moment to fill out the form."
            productPage
            defaultProduct={product.name}
            showImage={false}
          />
        </section>

        {/* =====================================================
            RELATED PRODUCTS
        ====================================================== */}
        <section className="mt-10 lg:mt-20">
          <RelatedProducts currentSlug={product.slug} />
        </section>
      </div>
    </main>
  );
}