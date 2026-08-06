import Link from "next/link";
import { getDb } from "@/app/lib/db";
import { auth } from "@/auth";
import { ShoppingBag } from "lucide-react";

interface OrderSummary {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

export default async function OrderHistoryPage() {
  const session = await auth();
    const user = session?.user;

  if (!user) {
    return (
      <main className="w-full flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[#3D2B1F] mb-6">Please log in to view your orders.</p>
        <Link href="/login" className="text-[#C4622D] hover:underline">
          Go to login
        </Link>
      </main>
    );
  }

  let orders: OrderSummary[] = [];
  try {
    const db = getDb();
    const result = await db.query(
      `SELECT id, total, status, created_at FROM orders WHERE customer_id = $1 ORDER BY created_at DESC`,
      [user.id]
    );
    orders = result.rows;
  } catch (error) {
    console.error("Database error on order history page:", error);
  }

  return (
    <main className="w-full flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-8">
        Order History
      </h1>

      {orders.length === 0 ? (
        <div className="bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-3xl p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-[#C4622D] mx-auto mb-4" />
          <p className="text-[#3D2B1F]/70 mb-6">You haven&apos;t placed any orders yet.</p>
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
                <p className="text-sm text-[#7C9E87]">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xl font-bold text-[#C4622D]">
                ${Number(order.total).toFixed(2)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
