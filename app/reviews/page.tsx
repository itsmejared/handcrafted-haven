import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { Star, Search } from "lucide-react";
import {
  getUserReviewProducts,
  upsertReview,
  deleteReview,
} from "@/app/services/reviews";
import ReviewModalButton from "@/app/ui/review/review-modal-button";
import DeleteReviewButton from "@/app/ui/review/delete-review-button";
import Pagination from "@/app/ui/pagination";

interface ReviewsPageProps {
  searchParams: Promise<{
    status?: "all" | "pending" | "reviewed";
    search?: string;
    page?: string;
  }>;
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const session = await auth();
  const userId = session?.user?.id as string;

  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status || "all";
  const searchTerm = resolvedParams.search || "";
  const currentPage = Number(resolvedParams.page) || 1;
  const limit = 6;

  const { data: products, pagination } = await getUserReviewProducts(
    userId,
    statusFilter,
    searchTerm,
    currentPage,
    limit,
  );

  async function handleSaveReview(formData: FormData) {
    "use server";
    const productId = formData.get("productId") as string;
    const rating = Number(formData.get("rating"));
    const comment = (formData.get("comment") as string) || undefined;

    await upsertReview(userId, {
      userId,
      productId,
      rating,
      comment,
    });
  }

  async function handleDeleteReview(formData: FormData) {
    "use server";
    const reviewId = formData.get("reviewId") as string;
    if (reviewId) {
      await deleteReview(reviewId, userId);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2C2C2C]">Product Reviews</h1>
        <p className="text-gray-600 mt-1">
          Manage your reviews and share feedback on handcrafted items.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-xl border border-[#E8DFD3] shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: "all", label: "All Items" },
            { id: "pending", label: "Pending Review" },
            { id: "reviewed", label: "Reviewed" },
          ].map((tab) => (
            <Link
              key={tab.id}
              href={`/reviews?status=${tab.id}${
                searchTerm ? `&search=${searchTerm}` : ""
              }`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-[#7C9E87] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-[#E8DFD3]"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <form
          className="relative w-full md:w-72"
          action="/reviews"
          method="GET"
        >
          {statusFilter !== "all" && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Search product..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#E8DFD3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9E87]"
          />
        </form>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8DFD3] p-12 text-center text-gray-500">
          No products found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div
              key={item.product_id}
              className="bg-white rounded-xl border border-[#E8DFD3] p-5 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#E8DFD3]">
                    <Image
                      src={item.product_image}
                      alt={item.product_title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-[#7C9E87] font-semibold uppercase tracking-wider">
                      {item.category_name}
                    </span>
                    <h3 className="font-semibold text-[#2C2C2C] line-clamp-1">
                      {item.product_title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      By {item.seller_name}
                    </p>
                  </div>
                </div>

                {item.has_reviewed && (
                  <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8DFD3]/60 space-y-1.5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (item.rating || 0)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-semibold text-gray-700 ml-1">
                        {item.rating}/5
                      </span>
                    </div>
                    {item.comment && (
                      <p className="text-xs text-gray-600 italic line-clamp-2">
                        &quot;{item.comment}&quot;
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 mt-5 pt-4 border-t border-gray-100">
                <ReviewModalButton
                  item={item}
                  userId={userId}
                  onSaveAction={handleSaveReview}
                />

                {item.has_reviewed && item.id && (
                  <DeleteReviewButton
                    reviewId={item.id}
                    onDeleteAction={handleDeleteReview}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination totalPages={pagination.totalPages} />
        </div>
      )}
    </div>
  );
}
