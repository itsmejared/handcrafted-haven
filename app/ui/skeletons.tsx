import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#FDFAF6] rounded-2xl overflow-hidden shadow-sm border border-[#7C9E87]/20 animate-pulse">
      <div className="h-64 bg-[#3D2B1F]/10 w-full" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-[#3D2B1F]/15 rounded w-1/3" />
        <div className="h-6 bg-[#3D2B1F]/20 rounded w-3/4" />
        <div className="h-4 bg-[#3D2B1F]/10 rounded w-full" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-[#C4622D]/20 rounded w-1/4" />
          <div className="h-10 bg-[#7C9E87]/30 rounded-full w-28" />
        </div>
      </div>
    </div>
  );
}

export function SellerCardSkeleton() {
  return (
    <div className="bg-[#FDFAF6] rounded-2xl p-6 shadow-sm border border-[#7C9E87]/20 animate-pulse text-center space-y-4">
      <div className="w-24 h-24 rounded-full bg-[#3D2B1F]/15 mx-auto" />
      <div className="h-6 bg-[#3D2B1F]/20 rounded w-1/2 mx-auto" />
      <div className="h-4 bg-[#7C9E87]/30 rounded w-1/3 mx-auto" />
      <div className="h-12 bg-[#3D2B1F]/10 rounded w-full" />
      <div className="h-10 bg-[#C4622D]/20 rounded-full w-full" />
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-12 bg-[#F5F0E8] min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4 animate-pulse">
            <div className="h-10 bg-[#3D2B1F]/20 rounded-md w-64 mx-auto" />
            <div className="w-24 h-1 bg-[#7C9E87]/40 mx-auto rounded-full" />
            <div className="h-4 bg-[#3D2B1F]/10 rounded w-96 mx-auto max-w-full" />
          </div>

          {/* Filters Bar Skeleton */}
          <div className="bg-[#FDFAF6] p-4 md:p-6 rounded-2xl shadow-sm border border-[#7C9E87]/20 animate-pulse flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="h-12 bg-[#3D2B1F]/10 rounded-xl w-full md:w-80" />
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="h-12 bg-[#3D2B1F]/10 rounded-xl w-36" />
              <div className="h-12 bg-[#3D2B1F]/10 rounded-xl w-36" />
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export function SellersSkeleton() {
  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-12 bg-[#F5F0E8] min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4 animate-pulse">
            <div className="h-10 bg-[#3D2B1F]/20 rounded-md w-64 mx-auto" />
            <div className="w-24 h-1 bg-[#7C9E87]/40 mx-auto rounded-full" />
            <div className="h-4 bg-[#3D2B1F]/10 rounded w-96 mx-auto max-w-full" />
          </div>

          {/* Seller Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SellerCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export function PageSpinnerSkeleton() {
  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-24 bg-[#F5F0E8] min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7C9E87]/30 border-t-[#C4622D] rounded-full animate-spin mb-4" />
        <p className="text-[#3D2B1F] text-sm font-medium animate-pulse">Loading Handcrafted Haven...</p>
      </section>
      <Footer />
    </main>
  );
}
