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
    <div className="bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md border-b-4 border-[#7C9E87]/30 animate-pulse">
      <div className="w-full aspect-[3/4] bg-[#E8DFD3]" />
      <div className="p-6 text-center">
        <div className="h-6 bg-[#3D2B1F]/20 rounded w-3/4 mx-auto" />
      </div>
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <main>
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
    </main>
  );
}

export function SellersSkeleton() {
  return (
    <main>
      <section className="px-6 md:px-8 py-16 bg-[#FDFAF6] min-h-screen">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header Skeleton */}
          <div className="text-center space-y-4 animate-pulse max-w-2xl mx-auto">
            <div className="h-10 bg-[#3D2B1F]/20 rounded-md w-64 mx-auto" />
            <div className="w-24 h-1 bg-[#7C9E87]/40 mx-auto rounded-full" />
            <div className="h-4 bg-[#3D2B1F]/10 rounded w-96 mx-auto max-w-full" />
          </div>

          {/* Seller Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <SellerCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function SellerDetailSkeleton() {
  return (
    <main>
      {/* Profile Header Skeleton */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-[#F5F0E8] animate-pulse">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-full max-w-sm aspect-[3/4] rounded-2xl bg-[#E8DFD3] mx-auto mb-6 shadow-xl border-4 border-[#FDFAF6]" />
          <div className="h-8 bg-[#3D2B1F]/20 rounded w-48 mx-auto mb-3" />
          <div className="w-24 h-1 bg-[#7C9E87]/40 mx-auto rounded-full mb-6" />
          <div className="space-y-2 max-w-lg mx-auto">
            <div className="h-4 bg-[#3D2B1F]/10 rounded w-full" />
            <div className="h-4 bg-[#3D2B1F]/10 rounded w-5/6 mx-auto" />
          </div>
        </div>
      </section>

      {/* Products Showcase Skeleton */}
      <section className="px-6 md:px-12 py-16 bg-[#FDFAF6] min-h-[400px]">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-8 bg-[#3D2B1F]/20 rounded w-56 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#F5F0E8] rounded-2xl aspect-square bg-[#E8DFD3]"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function PageSpinnerSkeleton() {
  return (
    <main>
      <section className="px-6 md:px-12 py-24 bg-[#F5F0E8] min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7C9E87]/30 border-t-[#C4622D] rounded-full animate-spin mb-4" />
        <p className="text-[#3D2B1F] text-sm font-medium animate-pulse">
          Loading Handcrafted Haven...
        </p>
      </section>
    </main>
  );
}
