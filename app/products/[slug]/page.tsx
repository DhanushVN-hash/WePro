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
  async (currentId: string, currentName: string) => {
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
    product.id,
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
    {
      label: "Weight",
      value: product.weight,
    },
    {
      label: "Dimensions",
      value: product.dimensions,
    },
    {
      label: "Nail Compatibility",
      value: product.nail_compatibility,
      multiline: true,
    },
    {
      label: "Capacity",
      value: product.capacity,
    },
    {
      label: "Operating Pressure",
      value: product.operating_pressure,
    },
    {
      label: "Air Inlet",
      value: product.air_inlet,
    },
    {
      label: "Customized Support",
      value: product.customized_support,
    },
  ];

  return (
    <main className="bg-white">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-10 lg:pb-20">

        {/* =====================================================
            BREADCRUMB + PREVIOUS / NEXT
        ====================================================== */}
        <div className="flex items-center justify-between gap-4 mb-12">

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

            <span className="mx-2 text-gray-300">
              /
            </span>

            <span>
              {product.name}
            </span>
          </nav>

          <div className="flex items-center gap-3 text-sm sm:text-[15px] shrink-0">

            {prev ? (
              <Link
                href={`/products/${prev.slug}`}
                className="flex items-center gap-1 text-gray-500 hover:text-[#101820] transition-colors"
              >
                <span className="text-xl leading-none">
                  ‹
                </span>
                Prev
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-300">
                <span className="text-xl leading-none">
                  ‹
                </span>
                Prev
              </span>
            )}

            <span className="text-gray-300">
              |
            </span>

            {next ? (
              <Link
                href={`/products/${next.slug}`}
                className="flex items-center gap-1 text-gray-500 hover:text-[#101820] transition-colors"
              >
                Next
                <span className="text-xl leading-none">
                  ›
                </span>
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-300">
                Next
                <span className="text-xl leading-none">
                  ›
                </span>
              </span>
            )}
          </div>
        </div>

        {/* =====================================================
            PRODUCT SECTION
        ====================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-start">

          {/* ===================================================
              LEFT - IMAGE
          ==================================================== */}
          <div className="w-full">

            <div
              className="
                relative
                w-full
                max-w-[540px]
                h-[420px]
                sm:h-[460px]
                lg:h-[500px]
                mx-auto
                flex
                items-center
                justify-center
                overflow-hidden
              "
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={500}
                  height={500}
                  priority
                  quality={80}
                  sizes="500px"
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div className="text-sm text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            {product.description && (
              <div className="mt-8 max-w-[540px] mx-auto">
                <p className="text-[15px] sm:text-base text-gray-700 leading-7 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* ===================================================
              RIGHT - PRODUCT INFORMATION
          ==================================================== */}
          <div className="w-full">

            {/* PRODUCT TITLE */}
            <h1
              className="
                text-[30px]
                sm:text-[32px]
                lg:text-[34px]
                xl:text-[36px]
                font-bold
                text-[#101820]
                leading-[1.15]
                tracking-tight
                break-words
              "
            >
              {product.name}
            </h1>

            {/* SKU */}
            {product.model && (
              <p className="mt-3 text-base sm:text-[17px] text-gray-500">
                SKU:{" "}
                <span className="font-medium text-gray-700">
                  {product.model}
                </span>
              </p>
            )}

            {/* ENQUIRE BUTTON */}
            <a
              href="#enquiry-form"
              className="inline-block mt-8 sm:mt-10"
            >
              <span
                className="
                  inline-flex
                  items-center
                  justify-center
                  bg-primary
                  hover:bg-primary-hover
                  active:bg-yellow-700
                  text-black
                  font-bold
                  px-8
                  py-4
                  rounded-lg
                  transition-colors
                  shadow-sm
                  cursor-pointer
                "
              >
                Enquire Now
              </span>
            </a>

            {/* =================================================
                ADDITIONAL INFORMATION
            ================================================== */}
            {hasSpecifications && (
              <details className="group mt-10 sm:mt-12">

                <summary
                  className="
                    flex
                    items-center
                    justify-between
                    cursor-pointer
                    list-none
                    select-none
                    text-[17px]
                    sm:text-[18px]
                    font-bold
                    text-[#101820]
                    [&::-webkit-details-marker]:hidden
                  "
                >
                  <span>
                    Additional Information
                  </span>

                  <span className="text-2xl font-normal text-gray-500 group-open:hidden">
                    +
                  </span>

                  <span className="hidden text-2xl font-normal text-gray-500 group-open:inline">
                    −
                  </span>
                </summary>

                <dl className="mt-5 rounded-lg border border-gray-200 overflow-hidden bg-white">

                  {specRows.map(
                    ({ label, value, multiline }, index) => (
                      <div
                        key={label}
                        className={`grid grid-cols-1 sm:grid-cols-3 ${
                          index !== specRows.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                      >
                        <dt className="px-4 py-3.5 bg-gray-50 sm:bg-white font-semibold text-[#101820] text-sm sm:text-base sm:border-r sm:border-gray-200">
                          {label}
                        </dt>

                        <dd
                          className={`px-4 py-3.5 sm:col-span-2 text-gray-700 text-sm sm:text-base ${
                            multiline
                              ? "whitespace-pre-line"
                              : ""
                          }`}
                        >
                          {value || "-"}
                        </dd>
                      </div>
                    )
                  )}

                </dl>
              </details>
            )}
          </div>
        </section>

        {/* =====================================================
            ENQUIRY FORM
        ====================================================== */}
        <section
          id="enquiry-form"
          className="scroll-mt-20 mt-16 lg:mt-20"
        >
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
        <section className="mt-16 lg:mt-20">
          <RelatedProducts
            currentSlug={product.slug}
          />
        </section>

      </div>
    </main>
  );
}