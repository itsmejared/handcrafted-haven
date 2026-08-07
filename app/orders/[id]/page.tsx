import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/app/lib/db";
import { auth } from "@/auth";
import { CheckCircle2 } from "lucide-react";

interface OrderItem {
  id: string;
  product_id: string | null;
  product_title: string;
  product_price: number;
  seller_name: string;
  image_url: string | null;
  quantity: number;
}

export default async function OrderReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
    const user = session?.user;
  if (!user) {
    notFound();
  }

  const db = getDb();
  const orderResult = await db.query(
    `SELECT id, customer_id, total, status, created_at FROM orders WHERE id = $1`,
    [id]
  );
  const order = orderResult.rows[0];

  if (!order || order.customer_id !== user.id) {
    notFound();
  }

  const itemsResult = await db.query(
    `SELECT id, product_id, product_title, product_price, seller_name, image_url, quantity
     FROM order_items WHERE order_id = $1`,
    [id]
  );
  const items: OrderItem[] = itemsResult.rows;

  return (
    <main className="w-full flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="text-center mb-10">
        <CheckCircle2 className="w-16 h-16 text-[#7C9E87] mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-2">
          Order Confirmed!
        </h1>
        <p className="text-[#3D2B1F]/70">
          Thank you for supporting our artisans.
        </p>
      </div>

      <div className="bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-2xl p-6">
        <div className="flex justify-between text-sm text-[#3D2B1F]/70 mb-6 pb-4 border-b border-[#7C9E87]/20">
          <span>Order #{order.id.slice(0, 8)}</span>
          <span>{new Date(order.created_at).toLocaleDateString()}</span>
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-[#7C9E87]/10 last:border-b-0"
          >
            <div>
              <p className="font-bold text-[#3D2B1F]">{item.product_title}</p>
              <p className="text-sm text-[#7C9E87]">
                by {item.seller_name} &middot; Qty {item.quantity}
              </p>
            </div>
            <span className="font-semibold text-[#C4622D]">
              ${(Number(item.product_price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#7C9E87]/20">
          <span className="text-lg font-bold text-[#3D2B1F]">Total</span>
          <span className="text-2xl font-bold text-[#C4622D]">
            ${Number(order.total).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <Link
          href="/orders"
          className="px-6 py-3 border-2 border-[#C4622D] text-[#C4622D] rounded-full font-medium hover:bg-[#C4622D] hover:text-white transition-colors text-center"
        >
          View Order History
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 bg-[#C4622D] text-white rounded-full font-medium hover:bg-[#3D2B1F] transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
