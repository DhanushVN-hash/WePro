"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SpecificationManager({
  productId,
}: {
  productId: number;
}) {
  const [specName, setSpecName] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [specs, setSpecs] = useState<any[]>([]);

  async function loadSpecifications() {
    const { data } = await supabase
      .from("product_specifications")
      .select("*")
      .eq("product_id", productId);

    setSpecs(data || []);
  }

  useEffect(() => {
    loadSpecifications();
  }, []);

  async function addSpecification() {
    if (!specName || !specValue) return;

    const { error } = await supabase
      .from("product_specifications")
      .insert({
        product_id: productId,
        spec_name: specName,
        spec_value: specValue,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setSpecName("");
    setSpecValue("");

    loadSpecifications();
  }

  async function deleteSpecification(id: number) {
    await supabase
      .from("product_specifications")
      .delete()
      .eq("id", id);

    loadSpecifications();
  }

  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-4">
        Specifications
      </h2>

      <div className="flex gap-3 mb-6">

        <input
          className="border p-3 rounded w-full"
          placeholder="Specification Name"
          value={specName}
          onChange={(e) => setSpecName(e.target.value)}
        />

        <input
          className="border p-3 rounded w-full"
          placeholder="Value"
          value={specValue}
          onChange={(e) => setSpecValue(e.target.value)}
        />

        <button
          onClick={addSpecification}
          className="bg-blue-600 text-white px-6 rounded"
        >
          Add
        </button>

      </div>

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-100">

            <th className="border p-3">
              Specification
            </th>

            <th className="border p-3">
              Value
            </th>

            <th className="border p-3">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {specs.map((spec) => (

            <tr key={spec.id}>

              <td className="border p-3">
                {spec.spec_name}
              </td>

              <td className="border p-3">
                {spec.spec_value}
              </td>

              <td className="border p-3">

                <button
                  onClick={() =>
                    deleteSpecification(spec.id)
                  }
                  className="text-red-600"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}