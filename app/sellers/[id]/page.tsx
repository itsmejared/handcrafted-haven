import { notFound } from "next/navigation";
import Link from "next/link";
import { getSellerById } from "@/app/services/sellers";
import { getProductsBySeller } from "@/app/services/products";
import Pagination from "@/app/ui/pagination";
import AddToCartButton from "@/app/ui/add-to-cart-button";
import Image from "next/image";

interface SellerDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SellerDetailPage({
  params,
  searchParams,
}: SellerDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const limit = 6;

  // Parallel fetch: seller profile and seller products
  const [seller, productsResult] = await Promise.all([
    getSellerById(id),
    getProductsBySeller(id, currentPage, limit),
  ]);

  if (!seller) {
    notFound();
  }

  const { data: products, pagination } = productsResult;

  return (
    <main className="min-h-screen bg-[#FDFAF6]">
      {/* Seller Hero Section */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
          <div className="w-48 md:w-56 aspect-square flex-shrink-0 rounded-2xl overflow-hidden shadow-xl border-4 border-[#FDFAF6] bg-[#E8DFD3] relative">
            {seller.profile_image_url ? (
              <Image
                src={seller.profile_image_url}
                alt={seller.name}
                className="w-full h-full object-contain"
                width={216}
                height={216}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#7C9E87] text-sm">
                No photo yet
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-2">
              {seller.name}
            </h1>
            <div className="w-24 h-1 bg-[#7C9E87] mx-auto md:mx-0 rounded-full mb-6"></div>
            <p className="text-[#3D2B1F] text-lg leading-relaxed">
              {seller.bio || "This seller has not written a bio yet."}
            </p>
          </div>
        </div>
      </section>

      {/* Seller Products Showcase */}
      <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3D2B1F] mb-2">
            Crafts by {seller.name}
          </h2>
          <div className="w-16 h-1 bg-[#C4622D] mx-auto rounded-full"></div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-[#F5F0E8] rounded-2xl max-w-2xl mx-auto">
            <p className="text-[#3D2B1F] text-lg">
              This seller has not published any products yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="block flex-1"
                  >
                    <div className="w-full aspect-square overflow-hidden bg-[#E8DFD3]">
                      <Image
                        src={product.image_url}
                        alt={product.image_alt || product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        width={272}
                        height={272}
                      />
                    </div>
                    <div className="p-5 flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-[#7C9E87] font-semibold mb-1">
                        {product.category_name}
                      </span>
                      <h3 className="text-lg font-bold text-[#3D2B1F] line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-[#C4622D] font-bold text-xl mt-2">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>

                  <div className="p-5 pt-0">
                    <AddToCartButton
                      id={product.id}
                      name={product.title}
                      price={Number(product.price)}
                      image={product.image_url}
                      seller={seller.name}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls for seller products */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination totalPages={pagination.totalPages} />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
