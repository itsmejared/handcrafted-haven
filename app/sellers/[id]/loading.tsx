import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { ProductCardSkeleton } from "@/app/ui/skeletons";

export default function SellerDetailLoading() {
  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 bg-[#F5F0E8] min-h-screen">
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
          {/* Banner & Avatar Skeleton */}
          <div className="bg-[#FDFAF6] rounded-2xl p-8 shadow-sm border border-[#7C9E87]/20 flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-[#3D2B1F]/15 flex-shrink-0" />
            <div className="space-y-3 w-full text-center md:text-left">
              <div className="h-8 bg-[#3D2B1F]/20 rounded w-1/2 mx-auto md:mx-0" />
              <div className="h-4 bg-[#7C9E87]/30 rounded w-1/4 mx-auto md:mx-0" />
              <div className="h-12 bg-[#3D2B1F]/10 rounded w-full" />
            </div>
          </div>

          {/* Products Header Skeleton */}
          <div className="h-8 bg-[#3D2B1F]/20 rounded w-48" />

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
