import Link from "next/link";
import { getSellers } from "@/app/services/sellers";
import Pagination from "@/app/ui/pagination";

interface SellersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SellersPage({ searchParams }: SellersPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const limit = 9;
  const { sellers, pagination } = await getSellers({
    page: currentPage,
    limit,
  });

  return (
    <main>
      <section className="px-6 md:px-8 py-16 bg-[#FDFAF6] min-h-screen">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">
            Meet Our Sellers
          </h1>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-6"></div>
          <p className="text-[#3D2B1F] opacity-75 text-lg">
            Get to know the artisans behind every handcrafted piece.
          </p>
        </div>

        {sellers.length === 0 ? (
          <p className="text-center text-[#3D2B1F] opacity-70 py-12">
            No sellers yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {sellers.map((seller) => (
              <Link
                key={seller.id}
                href={`/sellers/${seller.id}`}
                className="bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-b-4 border-[#7C9E87]"
              >
                <div className="w-full aspect-square overflow-hidden bg-[#E8DFD3]">
                  {seller.profile_image_url ? (
                    <img
                      src={seller.profile_image_url}
                      alt={seller.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#7C9E87] text-sm">
                      No photo yet
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-semibold text-[#3D2B1F] line-clamp-1">
                    {seller.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination component */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination totalPages={pagination.totalPages} />
          </div>
        )}

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-[#3D2B1F] mb-4">
            Want to join them?
          </h2>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Register as a Seller
          </Link>
        </div>
      </section>
    </main>
  );
}