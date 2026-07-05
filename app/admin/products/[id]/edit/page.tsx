"use client";
  import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const [model, setModel] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [nailCompatibility, setNailCompatibility] = useState("");
  const [capacity, setCapacity] = useState("");
  const [operatingPressure, setOperatingPressure] = useState("");
  const [airInlet, setAirInlet] = useState("");
  const [customizedSupport, setCustomizedSupport] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  // tracks whether we're still loading the product's saved subcategory,
  // so switching category later doesn't accidentally wipe it prematurely
  const initialSubcategoryId = useRef<string>("");
  const isInitialLoad = useRef(true);


const searchParams = useSearchParams();
const returnUrl =
  searchParams.get("return") || "/admin/products";

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

      if (error) {
        alert(error.message);
        router.push(returnUrl);
        return;
      }

      setName(data.name || "");
      setModel(data.model || "");
      setSlug(data.slug || "");
      setDescription(data.description || "");
      setCategoryId(String(data.category_id || ""));
      initialSubcategoryId.current = String(data.subcategory_id || "");
      setSubcategoryId(initialSubcategoryId.current);
      setWeight(data.weight || "");
      setDimensions(data.dimensions || "");
      setNailCompatibility(data.nail_compatibility || "");
      setCapacity(data.capacity || "");
      setOperatingPressure(data.operating_pressure || "");
      setAirInlet(data.air_inlet || "");
      setCustomizedSupport(data.customized_support || "");
      setImageUrl(data.image_url || "");
      setLoading(false);
    }

    if (id) loadProduct();
  }, [id, router]);

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from("categories").select("*").order("name");
      setCategories(data || []);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadSubcategories() {
      if (!categoryId) {
        setSubcategories([]);
        return;
      }

      const { data } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", Number(categoryId))
        .order("name");

      setSubcategories(data || []);

      if (isInitialLoad.current) {
        // first run after product loads: keep its existing subcategory
        isInitialLoad.current = false;
      } else {
        // user manually changed category: clear stale subcategory
        setSubcategoryId("");
      }
    }

    loadSubcategories();
  }, [categoryId]);

  function slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Product name is required";
    if (!slug.trim()) next.slug = "Slug is required";
    if (!categoryId) next.categoryId = "Category is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);

    try {


        let finalImageUrl = imageUrl;

        if (image) {
          const safeName = image.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
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

          finalImageUrl = data.publicUrl;
        }

        const { error } = await supabase
          .from("products")
          .update({
          name: name.trim(),
          model: model.trim(),
          slug: slugify(slug),
          category_id: Number(categoryId),
          subcategory_id: subcategoryId ? Number(subcategoryId) : null,
          image_url: finalImageUrl,
          description: description.trim(),
          weight,
          dimensions,
          nail_compatibility: nailCompatibility,
          capacity,
          operating_pressure: operatingPressure,
          air_inlet: airInlet,
          customized_support: customizedSupport,
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

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded"
            placeholder="Product Name *"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full border p-3 rounded"
          placeholder="Model"
        />

        <div>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={() => setSlug((s) => slugify(s))}
            className="w-full border p-3 rounded"
            placeholder="Slug *"
          />
          {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
        </div>

        <div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded bg-white text-black"
          >
            <option value="">Select Category *</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
        </div>

                  <div>
            <label className="block font-semibold mb-2">
              Product Image
            </label>

            {imageUrl && (
              <img
                src={image ? URL.createObjectURL(image) : imageUrl}
                alt={name}
                className="w-40 h-40 object-contain border rounded mb-4"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </div>

        <select
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded bg-white text-black disabled:bg-gray-100"
          disabled={!categoryId || subcategories.length === 0}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded"
          placeholder="Description"
        />

{Number(categoryId) === 3 && (
  <>
    <h2 className="text-2xl font-bold mt-10">Specifications</h2>

    <input className="w-full border p-3 rounded" placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />

    <input className="w-full border p-3 rounded" placeholder="Dimensions" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />

    <textarea
      rows={4}
      className="w-full border p-3 rounded"
      placeholder="Nail Compatibility"
      value={nailCompatibility}
      onChange={(e) => setNailCompatibility(e.target.value)}
    />

    <input className="w-full border p-3 rounded" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />

    <input className="w-full border p-3 rounded" placeholder="Operating Pressure" value={operatingPressure} onChange={(e) => setOperatingPressure(e.target.value)} />

    <input className="w-full border p-3 rounded" placeholder="Air Inlet" value={airInlet} onChange={(e) => setAirInlet(e.target.value)} />

    <input className="w-full border p-3 rounded" placeholder="Customized Support" value={customizedSupport} onChange={(e) => setCustomizedSupport(e.target.value)} />
  </>
)}

        <button
          type="submit"
          disabled={submitting}
          className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded font-bold transition-colors"
        >
          {submitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}