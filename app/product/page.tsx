import Link from "next/link";
import { auth } from "@/auth";
import DeleteProductButton from "../ui/product/delete-product-button";
import Pagination from "@/app/ui/pagination";
import { Plus, Pencil } from "lucide-react";
import { getProductsBySeller, deleteProduct } from "@/app/services/products";
import Image from "next/image";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function VendorProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const limit = 6;
  const session = await auth();

  const sellerId = session!.user.id;

  // Fetch products directly on the server
  const { data: products, pagination } = await getProductsBySeller(
    sellerId,
    page,
    limit,
  );

  // Stats calculation for high-level vendor insights
  const totalProducts = products.length;
  const avgRating =
    totalProducts > 0
      ? (
          products.reduce(
            (acc, p) => acc + (Number(p.rating_average) || 0),
            0,
          ) / totalProducts
        ).toFixed(1)
      : "N/A";

  return (
    <main className="min-h-screen flex flex-col bg-[#F5F0E8]">
      <section className="flex-grow px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header & Quick Action */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F]">
                Product Management
              </h1>
              <div className="w-20 h-1 bg-[#7C9E87] rounded-full mt-2"></div>
              <p className="text-sm text-[#3D2B1F]/70 mt-2">
                Manage your handcrafted catalog, edit details, and monitor
                performance.
              </p>
            </div>

            <Link
              href="/product/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4622D] text-white font-medium rounded-full hover:bg-[#3D2B1F] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span className="hidden md:block">Create New Product</span>{" "}
              <Plus className="h-5 md:ml-4" />
            </Link>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-[#FDFAF6] p-5 rounded-xl border border-[#7C9E87]/20 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3D2B1F]/60">
                  Total Catalog Items
                </p>
                <p className="text-2xl font-bold text-[#3D2B1F] mt-1">
                  {totalProducts}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#7C9E87]/15 flex items-center justify-center text-[#7C9E87]">
                📦
              </div>
            </div>

            <div className="bg-[#FDFAF6] p-5 rounded-xl border border-[#7C9E87]/20 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3D2B1F]/60">
                  Average Rating
                </p>
                <p className="text-2xl font-bold text-[#3D2B1F] mt-1">
                  ⭐ {avgRating}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#C4622D]/15 flex items-center justify-center text-[#C4622D]">
                ✨
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#FDFAF6] rounded-2xl p-6 md:p-8 shadow-md border border-[#7C9E87]/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#7C9E87]/30 text-xs font-semibold uppercase tracking-wider text-[#3D2B1F]/70">
                    <th className="pb-4 px-4">Product</th>
                    <th className="pb-4 px-4">Category</th>
                    <th className="pb-4 px-4">Price</th>
                    <th className="pb-4 px-4">Rating</th>
                    <th className="pb-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#7C9E87]/20 text-sm">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-[#3D2B1F]/60"
                      >
                        No products listed yet. Create your first handcrafted
                        piece!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const ratingVal = Number(product.rating_average);
                      const displayRating =
                        !isNaN(ratingVal) && ratingVal > 0
                          ? ratingVal.toFixed(1)
                          : "N/A";
                      const deleteProductWithArgs = deleteProduct.bind(
                        null,
                        product.id,
                        sellerId,
                      );

                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-[#F5F0E8]/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <Image
                                src={product.image_url}
                                alt={product.image_alt || product.title}
                                className="w-12 h-12 rounded-lg object-cover border border-[#7C9E87]/30"
                                width={48}
                                height={48}
                              />
                              <div>
                                <p className="font-semibold text-[#3D2B1F]">
                                  <Link
                                    href={`/product/${product.id}`}
                                    className="hover:text-[#C4622D] hover:underline transition-colors"
                                  >
                                    {product.title}
                                  </Link>
                                </p>
                                <p className="text-xs text-[#3D2B1F]/50 font-mono">
                                  ID: {product.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-[#3D2B1F]">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-[#7C9E87]/15 text-xs font-medium text-[#3D2B1F]">
                              {product.category_name ||
                                `Category #${product.category_id}`}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-medium text-[#3D2B1F]">
                            ${Number(product.price).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-[#3D2B1F]/80">
                            <span className="inline-flex items-center gap-1">
                              ⭐ {displayRating}
                              <span className="text-xs opacity-60">
                                ({product.reviews_count || 0})
                              </span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {/* Edit Link with Icon */}
                              <Link
                                href={`/product/${product.id}/edit`}
                                title="Edit Product"
                                className="p-2 text-[#7C9E87] hover:text-[#3D2B1F] hover:bg-[#7C9E87]/20 rounded-lg transition-colors border border-[#7C9E87]/30"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              {/* Delete Form with Server Action + Confirmation */}

                              <DeleteProductButton
                                productTitle={product.title}
                                deleteAction={deleteProductWithArgs}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination totalPages={pagination.totalPages} />
        </div>
      </section>
    </main>
  );
}
