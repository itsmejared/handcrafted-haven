import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrderById } from "@/app/services/orders";
import { ArrowLeft, Star, CheckCircle2 } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrderById(id, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <main className="w-full flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#C4622D] hover:text-[#3D2B1F] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Order History
      </Link>

      <div className="bg-[#FDFAF6] border border-[#7C9E87]/30 rounded-3xl p-6 sm:p-8 mb-8 text-center shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-[#7C9E87] mx-auto mb-3" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2B1F] mb-1">
          Thank you for your order!
        </h1>
        <p className="text-sm text-[#7C9E87] font-medium">
          Order #{order.id} &middot;{" "}
          {new Date(order.created_at).toLocaleDateString()}
        </p>

        <div className="mt-6 pt-6 border-t border-[#7C9E87]/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F5F0E8] p-4 rounded-2xl">
          <div className="text-left">
            <p className="font-bold text-[#3D2B1F] text-sm">
              Don&apos;t forget to leave a review!
            </p>
            <p className="text-xs text-[#3D2B1F]/70">
              Share your feedback to support independent crafters.
            </p>
          </div>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C4622D] text-white rounded-full text-xs font-semibold hover:bg-[#3D2B1F] transition-colors shrink-0"
          >
            <Star className="w-4 h-4 fill-current" /> Write Reviews
          </Link>
        </div>
      </div>

      <div className="bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#3D2B1F] mb-6 border-b border-[#7C9E87]/20 pb-4">
          Invoice / Summary
        </h2>
        <div className="space-y-4 mb-8">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-3 border-b border-[#7C9E87]/10 last:border-b-0"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F5F0E8] shrink-0 border border-[#7C9E87]/20">
                <Image
                  src={item.product_image || "/products/placeholder.webp"}
                  alt={item.product_title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#3D2B1F] text-sm truncate">
                  {item.product_title}
                </h3>
                {item.seller_name && (
                  <p className="text-xs text-[#7C9E87]">
                    by {item.seller_name}
                  </p>
                )}
                <p className="text-xs text-[#3D2B1F]/70 mt-0.5">
                  Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                </p>
              </div>
              <span className="font-bold text-[#C4622D] text-base">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-dashed border-[#7C9E87]/30 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-[#3D2B1F]/80">
            <span>Subtotal</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#3D2B1F]/80">
            <span>Shipping</span>
            <span className="text-[#7C9E87]">Free</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-[#3D2B1F] pt-2 border-t border-[#7C9E87]/20">
            <span>Total Paid</span>
            <span className="text-[#C4622D]">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
