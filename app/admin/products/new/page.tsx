"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategoryId, setSubcategoryId] = useState("");
  const [subcategories, setSubcategories] = useState<any[]>([]);

  const [name, setName] = useState("");
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
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        alert("Failed to load categories: " + error.message);
        return;
      }
      setCategories(data || []);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    // Reset subcategory whenever the category changes, so a mismatched
    // subcategory from a different category can never be submitted.
    setSubcategoryId("");

    async function loadSubcategories() {
      if (!categoryId) {
        setSubcategories([]);
        return;
      }

      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", Number(categoryId));

      if (error) {
        alert("Failed to load subcategories: " + error.message);
        return;
      }

      setSubcategories(data || []);
    }

    loadSubcategories();
  }, [categoryId]);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Product name is required";
    if (!slug.trim()) next.slug = "Slug is required";
    if (!categoryId) next.categoryId = "Category is required";
    if (image && !image.type.startsWith("image/")) next.image = "File must be an image";
    if (image && image.size > 5 * 1024 * 1024) next.image = "Image must be under 5MB";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);

    try {
      let imageUrl = "";

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

        const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from("products").insert([
        {
          name: name.trim(),
          model: model.trim(),
          slug: slugify(slug),
          description: description.trim(),
          category_id: Number(categoryId),
          subcategory_id: subcategoryId ? Number(subcategoryId) : null,
          image_url: imageUrl,
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

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            className="w-full border p-3 rounded"
            placeholder="Product Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <input
          className="w-full border p-3 rounded"
          placeholder="Model Number"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <div>
          <select
            className="w-full border border-gray-300 rounded p-3 bg-white text-black"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
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

        <select
          className="w-full border p-3 rounded bg-white text-black disabled:bg-gray-100"
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          disabled={!categoryId || subcategories.length === 0}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        <div>
          <input
            className="w-full border p-3 rounded"
            placeholder="Slug *"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={() => setSlug((s) => slugify(s))}
          />
          {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
        </div>

        <textarea
          rows={5}
          className="w-full border p-3 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h2 className="text-2xl font-bold mt-10">Specifications</h2>

        <input className="w-full border p-3 rounded" placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <input className="w-full border p-3 rounded" placeholder="Dimensions" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
        <textarea rows={4} className="w-full border p-3 rounded" placeholder="Nail Compatibility" value={nailCompatibility} onChange={(e) => setNailCompatibility(e.target.value)} />
        <input className="w-full border p-3 rounded" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        <input className="w-full border p-3 rounded" placeholder="Operating Pressure" value={operatingPressure} onChange={(e) => setOperatingPressure(e.target.value)} />
        <input className="w-full border p-3 rounded" placeholder="Air Inlet" value={airInlet} onChange={(e) => setAirInlet(e.target.value)} />
        <input className="w-full border p-3 rounded" placeholder="Customized Support" value={customizedSupport} onChange={(e) => setCustomizedSupport(e.target.value)} />

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) setImage(e.target.files[0]);
            }}
          />
          {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded font-bold transition-colors"
        >
          {submitting ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}