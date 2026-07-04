"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  id,
}: {
  id: number;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product deleted successfully!");

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 font-semibold"
    >
      Delete
    </button>
  );
}