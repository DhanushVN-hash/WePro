"use client";

import { useEffect, useRef, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  name: string;
};

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnUrl =
    searchParams.get("return") || "/admin/products";

  const supabase = createClient();

  const initialSubcategoryId = useRef("");
  const isInitialLoad = useRef(true);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  // Basic information
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  // Category
  const [categories, setCategories] = useState<Category[]>(
    []
  );

  const [subcategories, setSubcategories] = useState<
    Subcategory[]
  >([]);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  // Pricing
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("contact");
  const [currency, setCurrency] = useState("INR");

  // Specifications
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [nailCompatibility, setNailCompatibility] =
    useState("");
  const [capacity, setCapacity] = useState("");
  const [operatingPressure, setOperatingPressure] =
    useState("");
  const [airInlet, setAirInlet] = useState("");
  const [customizedSupport, setCustomizedSupport] =
    useState("");

  // Image
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  /*
   * ==========================================================
   * LOAD PRODUCT
   * ==========================================================
   */

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        router.push(returnUrl);
        return;
      }

      setName(data.name || "");
      setModel(data.model || "");
      setSlug(data.slug || "");
      setDescription(data.description || "");

      setCategoryId(
        String(data.category_id || "")
      );

      initialSubcategoryId.current = String(
        data.subcategory_id || ""
      );

      setSubcategoryId(
        initialSubcategoryId.current
      );

      // Pricing
      setPrice(
        data.price !== null &&
          data.price !== undefined
          ? String(data.price)
          : ""
      );

      setPriceType(
        data.price_type || "contact"
      );

      setCurrency(
        data.currency || "INR"
      );

      // Specifications
      setWeight(data.weight || "");
      setDimensions(data.dimensions || "");
      setNailCompatibility(
        data.nail_compatibility || ""
      );
      setCapacity(data.capacity || "");
      setOperatingPressure(
        data.operating_pressure || ""
      );
      setAirInlet(data.air_inlet || "");
      setCustomizedSupport(
        data.customized_support || ""
      );

      // Image
      setImageUrl(data.image_url || "");

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  /*
   * ==========================================================
   * LOAD CATEGORIES
   * ==========================================================
   */

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        alert(
          "Failed to load categories: " +
            error.message
        );
        return;
      }

      setCategories(data || []);
    }

    loadCategories();
  }, []);

  /*
   * ==========================================================
   * LOAD SUBCATEGORIES
   * ==========================================================
   */

  useEffect(() => {
    async function loadSubcategories() {
      if (!categoryId) {
        setSubcategories([]);
        return;
      }

      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq(
          "category_id",
          Number(categoryId)
        )
        .order("name");

      if (error) {
        alert(
          "Failed to load subcategories: " +
            error.message
        );
        return;
      }

      setSubcategories(data || []);

      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      } else {
        setSubcategoryId("");
      }
    }

    loadSubcategories();
  }, [categoryId]);

  /*
   * ==========================================================
   * SLUG
   * ==========================================================
   */

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  /*
   * ==========================================================
   * IMAGE
   * ==========================================================
   */

  function handleImageChange(file: File | null) {
    if (!file) return;

    setImage(file);

    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);
  }

  /*
   * ==========================================================
   * VALIDATION
   * ==========================================================
   */

  function validate() {
    const next: Record<string, string> = {};

    if (!name.trim()) {
      next.name = "Product name is required";
    }

    if (!slug.trim()) {
      next.slug = "Slug is required";
    }

    if (!categoryId) {
      next.categoryId =
        "Category is required";
    }

    if (priceType !== "contact") {
      if (!price.trim()) {
        next.price =
          "Price is required";
      } else if (
        Number.isNaN(Number(price)) ||
        Number(price) < 0
      ) {
        next.price =
          "Enter a valid price";
      }
    }

    if (
      image &&
      !image.type.startsWith("image/")
    ) {
      next.image =
        "File must be an image";
    }

    if (
      image &&
      image.size > 5 * 1024 * 1024
    ) {
      next.image =
        "Image must be under 5MB";
    }

    setErrors(next);

    return (
      Object.keys(next).length === 0
    );
  }

  /*
   * ==========================================================
   * UPDATE PRODUCT
   * ==========================================================
   */

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (submitting) return;

    if (!validate()) return;

    setSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      /*
       * Upload new image if selected
       */

      if (image) {
        const safeName =
          image.name.replace(
            /[^a-zA-Z0-9.\-_]/g,
            "_"
          );

        const fileName =
          `${Date.now()}-${safeName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("product-images")
          .upload(
            fileName,
            image
          );

        if (uploadError) {
          alert(
            uploadError.message
          );
          return;
        }

        const { data } =
          supabase.storage
            .from("product-images")
            .getPublicUrl(
              fileName
            );

        finalImageUrl =
          data.publicUrl;
      }

      /*
       * Update product
       */

      const { error } =
        await supabase
          .from("products")
          .update({
            name: name.trim(),

            model: model.trim(),

            slug: slugify(slug),

            description:
              description.trim(),

            category_id:
              Number(categoryId),

            subcategory_id:
              subcategoryId
                ? Number(subcategoryId)
                : null,

            image_url:
              finalImageUrl,

            /*
             * Pricing
             */

            price:
              priceType === "contact"
                ? null
                : Number(price),

            price_type:
              priceType,

            currency:
              currency,

            /*
             * Specifications
             */

            weight,

            dimensions,

            nail_compatibility:
              nailCompatibility,

            capacity,

            operating_pressure:
              operatingPressure,

            air_inlet:
              airInlet,

            customized_support:
              customizedSupport,
          })
          .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      router.push(returnUrl);
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-500" />

          <p className="text-sm text-gray-500">
            Loading product...
          </p>

        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * STYLES
   * ==========================================================
   */

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-800";

  /*
   * ==========================================================
   * PAGE
   * ==========================================================
   */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">

          <button
            type="button"
            onClick={() =>
              router.push(returnUrl)
            }
            className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← Back to Products
          </button>

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Product Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Edit Product
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update product information,
              pricing and specifications.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        <form onSubmit={handleSubmit}>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="space-y-6">

              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    01
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Product identity and classification.
                  </p>

                </div>

                <div className="space-y-5 p-6">

                  {/* Name */}

                  <div>

                    <label className={labelClass}>
                      Product Name
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      className={inputClass}
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      placeholder="Product name"
                    />

                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.name}
                      </p>
                    )}

                  </div>

                  {/* Model / Slug */}

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className={labelClass}>
                        Model Number
                      </label>

                      <input
                        className={inputClass}
                        value={model}
                        onChange={(e) =>
                          setModel(
                            e.target.value
                          )
                        }
                        placeholder="Example: CN55"
                      />

                    </div>

                    <div>

                      <label className={labelClass}>
                        URL Slug
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </label>

                      <input
                        className={inputClass}
                        value={slug}
                        onChange={(e) =>
                          setSlug(
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          setSlug(
                            (s) =>
                              slugify(s)
                          )
                        }
                        placeholder="product-slug"
                      />

                      {errors.slug && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.slug}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* Category */}

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className={labelClass}>
                        Category
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </label>

                      <select
                        className={inputClass}
                        value={categoryId}
                        onChange={(e) =>
                          setCategoryId(
                            e.target.value
                          )
                        }
                      >

                        <option value="">
                          Select Category
                        </option>

                        {categories.map(
                          (category) => (
                            <option
                              key={
                                category.id
                              }
                              value={
                                category.id
                              }
                            >
                              {
                                category.name
                              }
                            </option>
                          )
                        )}

                      </select>

                      {errors.categoryId && (
                        <p className="mt-1 text-xs text-red-600">
                          {
                            errors.categoryId
                          }
                        </p>
                      )}

                    </div>

                    <div>

                      <label className={labelClass}>
                        Subcategory
                      </label>

                      <select
                        className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                        value={
                          subcategoryId
                        }
                        onChange={(e) =>
                          setSubcategoryId(
                            e.target.value
                          )
                        }
                        disabled={
                          !categoryId ||
                          subcategories.length ===
                            0
                        }
                      >

                        <option value="">
                          {categoryId
                            ? subcategories.length
                              ? "Select Subcategory"
                              : "No subcategories available"
                            : "Select category first"}
                        </option>

                        {subcategories.map(
                          (sub) => (
                            <option
                              key={sub.id}
                              value={sub.id}
                            >
                              {sub.name}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                  </div>

                  {/* Description */}

                  <div>

                    <label className={labelClass}>
                      Description
                    </label>

                    <textarea
                      rows={6}
                      className={`${inputClass} resize-none`}
                      value={description}
                      onChange={(e) =>
                        setDescription(
                          e.target.value
                        )
                      }
                      placeholder="Product description..."
                    />

                  </div>

                </div>

              </section>

              {/* =================================================
                  PRICING
              ================================================= */}

              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    02
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    Pricing
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Configure the price shown for this
                    product.
                  </p>

                </div>

                <div className="p-6">

                  <div className="grid gap-5 md:grid-cols-2">

                    {/* Price type */}

                    <div>

                      <label className={labelClass}>
                        Price Display
                      </label>

                      <select
                        className={inputClass}
                        value={priceType}
                        onChange={(e) =>
                          setPriceType(
                            e.target.value
                          )
                        }
                      >

                        <option value="contact">
                          Contact for Price
                        </option>

                        <option value="fixed">
                          Fixed Price
                        </option>

                        <option value="starting_from">
                          Starting From
                        </option>

                      </select>

                    </div>

                    {/* Currency */}

                    <div>

                      <label className={labelClass}>
                        Currency
                      </label>

                      <select
                        className={inputClass}
                        value={currency}
                        onChange={(e) =>
                          setCurrency(
                            e.target.value
                          )
                        }
                      >

                        <option value="INR">
                          INR - Indian Rupee
                        </option>

                        <option value="USD">
                          USD - US Dollar
                        </option>

                        <option value="EUR">
                          EUR - Euro
                        </option>

                      </select>

                    </div>

                  </div>

                  {/* Price */}

                  {priceType !== "contact" && (

                    <div className="mt-5">

                      <label className={labelClass}>
                        Price
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      </label>

                      <div className="relative">

                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                          {currency ===
                          "INR"
                            ? "₹"
                            : currency ===
                              "USD"
                            ? "$"
                            : "€"}
                        </span>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className={`${inputClass} pl-10`}
                          value={price}
                          onChange={(e) =>
                            setPrice(
                              e.target
                                .value
                            )
                          }
                          placeholder="12500"
                        />

                      </div>

                      {errors.price && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.price}
                        </p>
                      )}

                    </div>

                  )}

                  {/* Preview */}

                  <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">

                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Customer price preview
                    </p>

                    <p className="mt-2 text-xl font-bold text-gray-900">

                      {priceType ===
                      "contact"
                        ? "Contact for price"
                        : price
                        ? `${
                            priceType ===
                            "starting_from"
                              ? "From "
                              : ""
                          }${
                            currency ===
                            "INR"
                              ? "₹"
                              : currency ===
                                "USD"
                              ? "$"
                              : "€"
                          }${Number(
                            price
                          ).toLocaleString(
                            "en-IN"
                          )}`
                        : "Price not entered"}

                    </p>

                  </div>

                </div>

              </section>

              {/* =================================================
                  SPECIFICATIONS
              ================================================= */}

              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    03
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    Specifications
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Technical specifications for the product.
                  </p>

                </div>

                <div className="space-y-5 p-6">

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className={labelClass}>
                        Weight
                      </label>

                      <input
                        className={inputClass}
                        value={weight}
                        onChange={(e) =>
                          setWeight(
                            e.target.value
                          )
                        }
                        placeholder="Example: 2.5 kg"
                      />

                    </div>

                    <div>

                      <label className={labelClass}>
                        Dimensions
                      </label>

                      <input
                        className={inputClass}
                        value={dimensions}
                        onChange={(e) =>
                          setDimensions(
                            e.target.value
                          )
                        }
                        placeholder="Example: 300 × 120 × 280 mm"
                      />

                    </div>

                  </div>

                  <div>

                    <label className={labelClass}>
                      Nail Compatibility
                    </label>

                    <textarea
                      rows={4}
                      className={`${inputClass} resize-none`}
                      value={
                        nailCompatibility
                      }
                      onChange={(e) =>
                        setNailCompatibility(
                          e.target.value
                        )
                      }
                      placeholder="Compatible nail sizes and types..."
                    />

                  </div>

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className={labelClass}>
                        Capacity
                      </label>

                      <input
                        className={inputClass}
                        value={capacity}
                        onChange={(e) =>
                          setCapacity(
                            e.target.value
                          )
                        }
                        placeholder="Example: 200 nails"
                      />

                    </div>

                    <div>

                      <label className={labelClass}>
                        Operating Pressure
                      </label>

                      <input
                        className={inputClass}
                        value={
                          operatingPressure
                        }
                        onChange={(e) =>
                          setOperatingPressure(
                            e.target.value
                          )
                        }
                        placeholder="Example: 70–100 PSI"
                      />

                    </div>

                  </div>

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className={labelClass}>
                        Air Inlet
                      </label>

                      <input
                        className={inputClass}
                        value={airInlet}
                        onChange={(e) =>
                          setAirInlet(
                            e.target.value
                          )
                        }
                        placeholder="Example: 1/4 inch"
                      />

                    </div>

                    <div>

                      <label className={labelClass}>
                        Customized Support
                      </label>

                      <input
                        className={inputClass}
                        value={
                          customizedSupport
                        }
                        onChange={(e) =>
                          setCustomizedSupport(
                            e.target.value
                          )
                        }
                        placeholder="Example: Available"
                      />

                    </div>

                  </div>

                </div>

              </section>

            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div className="space-y-6">

              {/* IMAGE */}

              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-5 py-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Product Media
                  </p>

                  <h2 className="mt-1 font-bold text-gray-900">
                    Product Image
                  </h2>

                </div>

                <div className="p-5">

                  {(imagePreview ||
                    imageUrl) && (

                    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white">

                      <img
                        src={
                          imagePreview ||
                          imageUrl
                        }
                        alt={
                          name ||
                          "Product"
                        }
                        className="h-64 w-full object-contain"
                      />

                    </div>

                  )}

                  <label
                    htmlFor="product-image"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center transition hover:border-yellow-400 hover:bg-yellow-50"
                  >

                    <div className="text-3xl">
                      +
                    </div>

                    <p className="mt-2 text-sm font-semibold text-gray-700">
                      Choose new image
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      JPG, PNG or WebP · Max 5MB
                    </p>

                  </label>

                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageChange(
                        e.target
                          .files?.[0] ||
                          null
                      )
                    }
                  />

                  {errors.image && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.image}
                    </p>
                  )}

                  {image && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview("");
                      }}
                      className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Cancel new image
                    </button>
                  )}

                </div>

              </section>

              {/* SUMMARY */}

              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-5 py-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Preview
                  </p>

                  <h2 className="mt-1 font-bold text-gray-900">
                    Product Summary
                  </h2>

                </div>

                <div className="space-y-4 p-5">

                  <SummaryRow
                    label="Product"
                    value={
                      name ||
                      "Not entered"
                    }
                  />

                  <SummaryRow
                    label="Model"
                    value={
                      model || "—"
                    }
                  />

                  <SummaryRow
                    label="Category"
                    value={
                      categories.find(
                        (c) =>
                          String(
                            c.id
                          ) ===
                          categoryId
                      )?.name ||
                      "—"
                    }
                  />

                  <SummaryRow
                    label="Price"
                    value={
                      priceType ===
                      "contact"
                        ? "Contact"
                        : price
                        ? `${
                            currency ===
                            "INR"
                              ? "₹"
                              : currency ===
                                "USD"
                              ? "$"
                              : "€"
                          }${Number(
                            price
                          ).toLocaleString(
                            "en-IN"
                          )}`
                        : "Not entered"
                    }
                  />

                </div>

              </section>

              {/* SAVE */}

              <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-yellow-400 px-6 py-3.5 font-bold text-[#101820] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Updating Product..."
                    : "Update Product"}
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    router.push(
                      returnUrl
                    )
                  }
                  className="mt-2 w-full rounded-lg px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </form>

      </main>

    </div>
  );
}

/*
 * ==========================================================
 * SUMMARY ROW
 * ==========================================================
 */

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="max-w-[180px] text-right text-sm font-semibold text-gray-900">
        {value}
      </span>

    </div>
  );
}