import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const category = Number(searchParams.get("category") || 3);
  const subcategory = searchParams.get("subcategory");

  const PAGE_SIZE = 12;

  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      image_url
    `)
    .eq("category_id", category);

  if (subcategory) {
    query = query.eq("subcategory_id", Number(subcategory));
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await query
    .order("id")
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}