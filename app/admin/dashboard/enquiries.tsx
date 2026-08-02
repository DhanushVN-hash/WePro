import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function EnquiriesPage() {
  const supabase = await createClient();
  

  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#101820]">
            Enquiries
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer enquiries
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Product</th>
              <th className="p-4">Created</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {enquiries?.map((enquiry) => (
              <tr
                key={enquiry.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">{enquiry.id}</td>

                <td className="p-4 font-medium">
                  {enquiry.name}
                </td>

                <td className="p-4">
                  {enquiry.phone}
                </td>

                <td className="p-4">
                  {enquiry.email}
                </td>

                <td className="p-4">
                  {enquiry.product}
                </td>

                <td className="p-4">
                  {new Date(
                    enquiry.created_at
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      enquiry.status === "New"
                        ? "bg-blue-100 text-blue-700"
                        : enquiry.status === "Contacted"
                        ? "bg-yellow-100 text-yellow-700"
                        : enquiry.status === "Quotation Sent"
                        ? "bg-purple-100 text-purple-700"
                        : enquiry.status === "Follow Up"
                        ? "bg-orange-100 text-orange-700"
                        : enquiry.status === "Closed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {enquiry.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <Link
                    href={`/admin/enquiries/${enquiry.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {(!enquiries || enquiries.length === 0) && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-10 text-gray-500"
                >
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}