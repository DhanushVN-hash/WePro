import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, image_url, model")
    .or(`name.ilike.%${q}%,model.ilike.%${q}%`)
    .order("name")
    .limit(8);

  if (error) {
    console.error("Product search error:", error.message);

    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}