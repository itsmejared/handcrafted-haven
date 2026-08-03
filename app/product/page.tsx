import { revalidatePath } from "next/cache";
import Link from "next/link";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { getProductsBySeller, deleteProduct } from "@/app/services/products";
import { ProductDetails } from "@/app/lib/types";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VendorProductsPage({
  searchParams,
}: ProductsPageProps) {
  // TODO: Replace with authenticated seller ID from session/cookies
  const mockSellerId = "41e9c845-1238-4272-9749-98b160268f91";

  // Fetch products directly on the server
  const products: ProductDetails[] = await getProductsBySeller(mockSellerId);

  // Server Action for deleting products directly
  async function handleDeleteProduct(formData: FormData) {
    "use server";

    const productId = formData.get("productId") as string;

    if (productId) {
      await deleteProduct(productId);
      revalidatePath("/products");
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F5F0E8]">
      <Header />

      <section className="flex-grow px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F]">
                Product Management
              </h1>
              <div className="w-20 h-1 bg-[#7C9E87] rounded-full mt-2"></div>
              <p className="text-sm text-[#3D2B1F]/70 mt-2">
                Manage your handcrafted catalog, prices, and stock
              </p>
            </div>

            <Link
              href="/products/new"
              className="px-6 py-3 bg-[#C4622D] text-white font-medium rounded-full hover:bg-[#3D2B1F] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              + List New Product
            </Link>
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
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-[#F5F0E8]/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.image_alt || product.title}
                                className="w-12 h-12 rounded-lg object-cover border border-[#7C9E87]/30"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-[#7C9E87]/20 flex items-center justify-center text-xs text-[#3D2B1F]">
                                No img
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-[#3D2B1F]">
                                {product.title}
                              </p>
                              <p className="text-xs text-[#3D2B1F]/50">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-[#3D2B1F]">
                          {product.category_name ||
                            `Category #${product.category_id}`}
                        </td>
                        <td className="py-4 px-4 font-medium text-[#3D2B1F]">
                          ${Number(product.price).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-[#3D2B1F]/80">
                          ⭐{" "}
                          {product.rating_average
                            ? product.rating_average.toFixed(1)
                            : "N/A"}{" "}
                          <span className="text-xs opacity-60">
                            ({product.reviews_count})
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-4">
                          <Link
                            href={`/products/${product.id}/edit`}
                            className="font-medium text-[#7C9E87] hover:text-[#3D2B1F] transition-colors"
                          >
                            Edit
                          </Link>

                          {/* Delete Form with Server Action */}
                          <form action={handleDeleteProduct} className="inline">
                            <input
                              type="hidden"
                              name="productId"
                              value={product.id}
                            />
                            <button
                              type="submit"
                              className="font-medium text-[#C4622D] hover:text-[#3D2B1F] transition-colors bg-transparent border-0 cursor-pointer"
                            >
                              Delete
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
