import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserOrders } from "@/app/services/orders";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

interface OrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function OrderHistoryPage({
  searchParams,
}: OrdersPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const pageSize = 5;

  const { orders, totalPages } = await getUserOrders(
    session.user.id,
    currentPage,
    pageSize,
  );

  return (
    <main className="w-full flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-[#3D2B1F] mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-3xl p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-[#C4622D] mx-auto mb-4" />
          <p className="text-[#3D2B1F] text-lg font-medium mb-6">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-[#C4622D] text-white rounded-full font-medium hover:bg-[#3D2B1F] transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-bold text-[#3D2B1F]">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-xs text-[#7C9E87]">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#C4622D] text-lg">
                  ${order.total.toFixed(2)}
                </span>
                <p className="text-xs text-[#7C9E87] capitalize">
                  {order.status}
                </p>
              </div>
            </Link>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-6">
              <Link
                href={`/orders?page=${Math.max(1, currentPage - 1)}`}
                className={`inline-flex items-center gap-1 px-4 py-2 bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-full text-sm ${
                  currentPage <= 1
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-[#F5F0E8]"
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Link>
              <span className="text-sm font-medium text-[#3D2B1F]">
                Page {currentPage} of {totalPages}
              </span>
              <Link
                href={`/orders?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`inline-flex items-center gap-1 px-4 py-2 bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-full text-sm ${
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-[#F5F0E8]"
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
