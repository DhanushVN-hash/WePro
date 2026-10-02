"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useProductSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const query = search.trim();

    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      setSearchError(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const timeout = setTimeout(async () => {
      setLoading(true);
      setSearchError(null);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, model, image_url")
          .ilike("name", `%${query}%`)
          .order("name")
          .limit(8)
          .abortSignal(controller.signal);

        if (controller.signal.aborted) return;

        if (error) {
          console.error("Product search error:", error);
          setSearchError("Unable to search products.");
          setResults([]);
        } else {
          setResults(data ?? []);
        }
      } catch (error: any) {
        if (error?.name === "AbortError") return;

        console.error("Product search error:", error);
        setSearchError("Unable to search products.");
        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search]);

  const clearSearch = () => {
    setSearch("");
    setResults([]);
    setSearchOpen(false);
    setSearchError(null);
  };

  return {
    search,
    setSearch,
    results,
    searchOpen,
    setSearchOpen,
    loading,
    searchError,
    clearSearch,
  };
}