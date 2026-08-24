"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Package,
  Tag,
  FileText,
  Settings2,
  IndianRupee,
  Loader2,
  Save,
} from "lucide-react";

type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  name: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  // Pricing
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("contact");
  const [currency, setCurrency] = useState("INR");

  // Specifications
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [nailCompatibility, setNailCompatibility] = useState("");
  const [capacity, setCapacity] = useState("");
  const [operatingPressure, setOperatingPressure] = useState("");
  const [airInlet, setAirInlet] = useState("");
  const [customizedSupport, setCustomizedSupport] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /*
   * ---------------------------------------------------------
   * LOAD CATEGORIES
   * ---------------------------------------------------------
   */

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        alert("Failed to load categories: " + error.message);
        return;
      }

      setCategories(data || []);
    }

    loadCategories();
  }, []);

  /*
   * ---------------------------------------------------------
   * LOAD SUBCATEGORIES
   * ---------------------------------------------------------
   */

  useEffect(() => {
    setSubcategoryId("");

    async function loadSubcategories() {
      if (!categoryId) {
        setSubcategories([]);
        return;
      }

      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", Number(categoryId))
        .order("name");

      if (error) {
        alert("Failed to load subcategories: " + error.message);
        return;
      }

      setSubcategories(data || []);
    }

    loadSubcategories();
  }, [categoryId]);

  /*
   * ---------------------------------------------------------
   * SLUG
   * ---------------------------------------------------------
   */

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  /*
   * ---------------------------------------------------------
   * IMAGE
   * ---------------------------------------------------------
   */

  function handleImageChange(file: File | null) {
    if (!file) return;

    setImage(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(URL.createObjectURL(file));
  }

  /*
   * ---------------------------------------------------------
   * VALIDATION
   * ---------------------------------------------------------
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
      next.categoryId = "Category is required";
    }

    if (priceType !== "contact") {
      if (!price.trim()) {
        next.price = "Price is required";
      } else if (Number.isNaN(Number(price)) || Number(price) < 0) {
        next.price = "Enter a valid price";
      }
    }

    if (image && !image.type.startsWith("image/")) {
      next.image = "File must be an image";
    }

    if (image && image.size > 5 * 1024 * 1024) {
      next.image = "Image must be under 5MB";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (submitting) return;

    if (!validate()) return;

    setSubmitting(true);

    try {
      let imageUrl = "";

      /*
       * Upload image
       */

      if (image) {
        const safeName = image.name.replace(
          /[^a-zA-Z0-9.\-_]/g,
          "_"
        );

        const fileName = `${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, image);

        if (uploadError) {
          alert(uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      /*
       * Insert product
       */

      const { error } = await supabase.from("products").insert([
        {
          name: name.trim(),
          model: model.trim(),
          slug: slugify(slug),

          description: description.trim(),

          category_id: Number(categoryId),

          subcategory_id: subcategoryId
            ? Number(subcategoryId)
            : null,

          image_url: imageUrl,

          /*
           * Pricing
           */

          price:
            priceType === "contact"
              ? null
              : Number(price),

          price_type: priceType,

          currency,

          /*
           * Specifications
           */

          weight,
          dimensions,
          nail_compatibility: nailCompatibility,
          capacity,
          operating_pressure: operatingPressure,
          air_inlet: airInlet,
          customized_support: customizedSupport,
        },
      ]);

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/admin/products");
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * SMALL UI HELPERS
   * ---------------------------------------------------------
   */

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-800";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="
              mb-4
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-gray-500
              transition
              hover:text-gray-900
            "
          >
            <ArrowLeft size={17} />
            Back to Products
          </button>

          <div className="flex items-center justify-between gap-4">

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Add Product
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Add a new product to your industrial catalogue.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        <form onSubmit={handleSubmit}>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="space-y-6">

              {/* ---------------------------------------------
                  BASIC INFORMATION
              --------------------------------------------- */}

              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                      <Package
                        size={18}
                        className="text-gray-700"
                      />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Basic Information
                      </h2>

                      <p className="text-xs text-gray-500">
                        Product identity and classification
                      </p>
                    </div>

                  </div>

                </div>

                <div className="space-y-5 p-6">

                  {/* Product name */}

                  <div>

                    <label className={labelClass}>
                      Product Name
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      className={inputClass}
                      placeholder="Example: Pneumatic Coil Nailer"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);

                        if (!slug) {
                          setSlug(slugify(e.target.value));
                        }
                      }}
                    />

                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.name}
                      </p>
                    )}

                  </div>

                  {/* Model + slug */}

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>

                      <label className={labelClass}>
                        Model Number
                      </label>

                      <input
                        className={inputClass}
                        placeholder="Example: CN55"
                        value={model}
                        onChange={(e) =>
                          setModel(e.target.value)
                        }
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
                        placeholder="pneumatic-coil-nailer-cn55"
                        value={slug}
                        onChange={(e) =>
                          setSlug(e.target.value)
                        }
                        onBlur={() =>
                          setSlug((s) => slugify(s))
                        }
                      />

                      {errors.slug && (
                        <p className="mt-1.5 text-xs text-red-600">
                          {errors.slug}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* Category */}

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
                        setCategoryId(e.target.value)
                      }
                    >
                      <option value="">
                        Select Category
                      </option>

                      {categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>

                    {errors.categoryId && (
                      <p className="mt-1.5 text-xs text-red-600">
                        {errors.categoryId}
                      </p>
                    )}

                  </div>

                  {/* Subcategory */}

                  <div>

                    <label className={labelClass}>
                      Subcategory
                    </label>

                    <select
                      className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                      value={subcategoryId}
                      onChange={(e) =>
                        setSubcategoryId(e.target.value)
                      }
                      disabled={
                        !categoryId ||
                        subcategories.length === 0
                      }
                    >

                      <option value="">
                        {categoryId
                          ? subcategories.length > 0
                            ? "Select Subcategory"
                            : "No subcategories available"
                          : "Select category first"}
                      </option>

                      {subcategories.map((sub) => (
                        <option
                          key={sub.id}
                          value={sub.id}
                        >
                          {sub.name}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* Description */}

                  <div>

                    <label className={labelClass}>
                      Description
                    </label>

                    <textarea
                      rows={6}
                      className={`${inputClass} resize-none`}
                      placeholder="Describe the product, its main applications and key benefits..."
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                    />

                    <p className="mt-1.5 text-xs text-gray-400">
                      Keep the description clear and useful for
                      customers.
                    </p>

                  </div>

                </div>

              </section>

              {/* =================================================
                  PRICING
              ================================================= */}

              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50">

                      <IndianRupee
                        size={18}
                        className="text-yellow-600"
                      />

                    </div>

                    <div>

                      <h2 className="font-semibold text-gray-900">
                        Pricing
                      </h2>

                      <p className="text-xs text-gray-500">
                        Configure how the product price is
                        displayed.
                      </p>

                    </div>

                  </div>

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
                          setPriceType(e.target.value)
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
                          setCurrency(e.target.value)
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

                        <span className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-sm
                          font-semibold
                          text-gray-500
                        ">
                          {currency === "INR"
                            ? "₹"
                            : currency === "USD"
                            ? "$"
                            : "€"}
                        </span>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className={`${inputClass} pl-10`}
                          placeholder="12500"
                          value={price}
                          onChange={(e) =>
                            setPrice(e.target.value)
                          }
                        />

                      </div>

                      {errors.price && (
                        <p className="mt-1.5 text-xs text-red-600">
                          {errors.price}
                        </p>
                      )}

                    </div>

                  )}

                  {/* Preview */}

                  <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Customer will see
                    </p>

                    <p className="mt-2 text-lg font-bold text-gray-900">

                      {priceType === "contact"
                        ? "Contact for price"
                        : price
                        ? `${priceType === "starting_from" ? "From " : ""}${
                            currency === "INR"
                              ? "₹"
                              : currency === "USD"
                              ? "$"
                              : "€"
                          }${Number(price).toLocaleString("en-IN")}`
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

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">

                      <Settings2
                        size={18}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <h2 className="font-semibold text-gray-900">
                        Specifications
                      </h2>

                      <p className="text-xs text-gray-500">
                        Technical product specifications
                      </p>

                    </div>

                  </div>

                </div>

                <div className="space-y-5 p-6">

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>
                      <label className={labelClass}>
                        Weight
                      </label>

                      <input
                        className={inputClass}
                        placeholder="Example: 2.5 kg"
                        value={weight}
                        onChange={(e) =>
                          setWeight(e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Dimensions
                      </label>

                      <input
                        className={inputClass}
                        placeholder="Example: 300 × 120 × 280 mm"
                        value={dimensions}
                        onChange={(e) =>
                          setDimensions(e.target.value)
                        }
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
                      placeholder="Compatible nail sizes and types..."
                      value={nailCompatibility}
                      onChange={(e) =>
                        setNailCompatibility(e.target.value)
                      }
                    />

                  </div>

                  <div className="grid gap-5 md:grid-cols-2">

                    <div>
                      <label className={labelClass}>
                        Capacity
                      </label>

                      <input
                        className={inputClass}
                        placeholder="Example: 200 nails"
                        value={capacity}
                        onChange={(e) =>
                          setCapacity(e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Operating Pressure
                      </label>

                      <input
                        className={inputClass}
                        placeholder="Example: 70–100 PSI"
                        value={operatingPressure}
                        onChange={(e) =>
                          setOperatingPressure(e.target.value)
                        }
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
                        placeholder="Example: 1/4 inch"
                        value={airInlet}
                        onChange={(e) =>
                          setAirInlet(e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Customized Support
                      </label>

                      <input
                        className={inputClass}
                        placeholder="Example: Available"
                        value={customizedSupport}
                        onChange={(e) =>
                          setCustomizedSupport(e.target.value)
                        }
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

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">

                      <ImagePlus
                        size={18}
                        className="text-purple-600"
                      />

                    </div>

                    <div>

                      <h2 className="font-semibold text-gray-900">
                        Product Image
                      </h2>

                      <p className="text-xs text-gray-500">
                        JPG, PNG or WebP
                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-5">

                  <label
                    htmlFor="product-image"
                    className="
                      group
                      flex
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-xl
                      border-2
                      border-dashed
                      border-gray-200
                      bg-gray-50
                      transition
                      hover:border-primary
                      hover:bg-gray-100
                    "
                  >

                    {imagePreview ? (

                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="
                          h-64
                          w-full
                          object-contain
                          bg-white
                        "
                      />

                    ) : (

                      <div className="flex h-64 w-full flex-col items-center justify-center">

                        <ImagePlus
                          size={36}
                          className="text-gray-300"
                        />

                        <p className="mt-3 text-sm font-medium text-gray-600">
                          Click to upload image
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Maximum size 5MB
                        </p>

                      </div>

                    )}

                  </label>

                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageChange(
                        e.target.files?.[0] || null
                      )
                    }
                  />

                  {errors.image && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.image}
                    </p>
                  )}

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview("");
                      }}
                      className="
                        mt-3
                        text-xs
                        font-medium
                        text-red-600
                        hover:text-red-700
                      "
                    >
                      Remove image
                    </button>
                  )}

                </div>

              </section>

              {/* SUMMARY */}

              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">

                      <FileText
                        size={18}
                        className="text-green-600"
                      />

                    </div>

                    <div>

                      <h2 className="font-semibold text-gray-900">
                        Product Summary
                      </h2>

                      <p className="text-xs text-gray-500">
                        Quick overview
                      </p>

                    </div>

                  </div>

                </div>

                <div className="space-y-4 p-5">

                  <div className="flex items-start justify-between gap-4">

                    <span className="text-sm text-gray-500">
                      Name
                    </span>

                    <span className="text-right text-sm font-semibold text-gray-900">
                      {name || "Not entered"}
                    </span>

                  </div>

                  <div className="flex items-start justify-between gap-4">

                    <span className="text-sm text-gray-500">
                      Model
                    </span>

                    <span className="text-right text-sm font-semibold text-gray-900">
                      {model || "—"}
                    </span>

                  </div>

                  <div className="flex items-start justify-between gap-4">

                    <span className="text-sm text-gray-500">
                      Price
                    </span>

                    <span className="text-right text-sm font-semibold text-gray-900">
                      {priceType === "contact"
                        ? "Contact"
                        : price
                        ? `${currency} ${Number(
                            price
                          ).toLocaleString("en-IN")}`
                        : "Not entered"}
                    </span>

                  </div>

                </div>

              </section>

              {/* SAVE */}

              <div className="sticky top-24">

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-primary
                    px-6
                    py-3.5
                    font-bold
                    text-black
                    shadow-sm
                    transition
                    hover:bg-yellow-400
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {submitting ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Saving Product...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Product
                    </>
                  )}

                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    router.push("/admin/products")
                  }
                  className="
                    mt-2
                    w-full
                    rounded-lg
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-gray-600
                    transition
                    hover:bg-gray-100
                  "
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