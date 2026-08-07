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
    <div className="bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md border-b-4 border-[#7C9E87]/40 flex flex-col">
      <div className="w-full aspect-[3/4] bg-[#E8DFD3]"></div>
      <div className="p-6 text-center flex justify-center items-center">
        <div className="h-6 w-36 bg-[#E8DFD3] rounded-md"></div>
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
    <main className="animate-pulse">
      <section className="px-6 md:px-8 py-16 bg-[#FDFAF6] min-h-screen">
        {/* Header Skeleton */}
        <div className="text-center mb-12 max-w-2xl mx-auto flex flex-col items-center">
          <div className="h-9 w-64 bg-[#E8DFD3] rounded-lg mb-4"></div>
          <div className="w-24 h-1 bg-[#7C9E87] opacity-40 rounded-full mb-6"></div>
          <div className="h-5 w-80 bg-[#E8DFD3] rounded-md"></div>
        </div>

        {/* Seller Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <SellerCardSkeleton key={i} />
          ))}
        </div>

        {/* CTA "Want to join them?" Skeleton */}
        <div className="text-center mt-16 flex flex-col items-center">
          <div className="h-7 w-48 bg-[#E8DFD3] rounded-md mb-4"></div>
          <div className="h-14 w-56 bg-[#E8DFD3] rounded-full"></div>
        </div>
      </section>
    </main>
  );
}

export function SellerDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#FDFAF6] animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="px-6 md:px-12 py-16 md:py-20 bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
          {/* Profile Image Skeleton */}
          <div className="w-48 md:w-56 aspect-square flex-shrink-0 rounded-2xl bg-[#E8DFD3] border-4 border-[#FDFAF6]" />

          {/* Bio / Info Skeleton */}
          <div className="text-center md:text-left flex-1 w-full flex flex-col items-center md:items-start">
            {/* Seller Name */}
            <div className="h-9 md:h-10 bg-[#E8DFD3] rounded-md w-3/4 max-w-sm mb-3" />
            {/* Green Line */}
            <div className="w-24 h-1 bg-[#7C9E87]/40 rounded-full mb-6" />
            {/* Bio Lines */}
            <div className="space-y-2.5 w-full">
              <div className="h-4 bg-[#E8DFD3] rounded w-full" />
              <div className="h-4 bg-[#E8DFD3] rounded w-11/12" />
              <div className="h-4 bg-[#E8DFD3] rounded w-4/5" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Showcase Skeleton */}
      <section className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="h-8 bg-[#E8DFD3] rounded-md w-64 mb-3" />
          <div className="w-16 h-1 bg-[#C4622D]/40 rounded-full" />
        </div>

        {/* Product Cards Grid (6 items skeleton) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md flex flex-col justify-between"
            >
              {/* Product Card Body */}
              <div>
                {/* Product Image */}
                <div className="w-full aspect-square bg-[#E8DFD3]" />

                {/* Product Details */}
                <div className="p-5 flex flex-col space-y-3">
                  {/* Category Tag */}
                  <div className="h-3 bg-[#E8DFD3] rounded w-1/3" />
                  {/* Product Title */}
                  <div className="h-5 bg-[#E8DFD3] rounded w-4/5" />
                  {/* Price */}
                  <div className="h-6 bg-[#E8DFD3] rounded w-1/2 mt-2" />
                </div>
              </div>

              {/* Add to Cart Button Placeholder */}
              <div className="p-5 pt-0">
                <div className="h-11 bg-[#E8DFD3] rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function HomeSkeleton() {
  return (
    <main className="animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-[#F5F0E8] px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="flex flex-col items-start space-y-4">
            <div className="h-5 w-48 bg-[#E8DFD3] rounded-md"></div>
            <div className="h-12 w-full max-w-lg bg-[#E8DFD3] rounded-lg"></div>
            <div className="h-12 w-3/4 bg-[#E8DFD3] rounded-lg"></div>
            <div className="w-24 h-1 bg-[#7C9E87]/40 rounded-full my-2"></div>
            <div className="h-4 w-full bg-[#E8DFD3] rounded"></div>
            <div className="h-4 w-5/6 bg-[#E8DFD3] rounded"></div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-32 bg-[#E8DFD3] rounded-full"></div>
              <div className="h-12 w-40 bg-[#E8DFD3] rounded-full"></div>
            </div>
          </div>
          <div className="relative w-full max-w-md mx-auto md:max-w-none">
            <div className="w-full aspect-[4/5] bg-[#E8DFD3] rounded-3xl border-4 border-[#F5F0E8]"></div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-16 bg-[#FDFAF6]">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="h-8 w-52 bg-[#E8DFD3] rounded-lg mb-4"></div>
          <div className="w-24 h-1 bg-[#7C9E87]/40 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-8 bg-[#F5F0E8] rounded-2xl border-b-4 border-[#7C9E87]/30"
            >
              <div className="w-24 h-24 rounded-full bg-[#E8DFD3] mb-4"></div>
              <div className="h-6 w-32 bg-[#E8DFD3] rounded mb-2"></div>
              <div className="h-4 w-full bg-[#E8DFD3] rounded"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Newest Products Section Skeleton */}
      <section className="px-6 md:px-8 py-16 bg-[#F5F0E8]">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="h-8 w-56 bg-[#E8DFD3] rounded-lg mb-4"></div>
          <div className="w-24 h-1 bg-[#7C9E87]/40 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md border border-[#E8DFD3]"
            >
              <div className="h-48 bg-[#E8DFD3] border-b-4 border-[#7C9E87]/30"></div>
              <div className="p-6 space-y-3">
                <div className="h-5 w-3/4 bg-[#E8DFD3] rounded"></div>
                <div className="h-4 w-1/3 bg-[#E8DFD3] rounded"></div>
                <div className="h-4 w-24 bg-[#E8DFD3] rounded"></div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-6 w-16 bg-[#E8DFD3] rounded"></div>
                  <div className="h-10 w-28 bg-[#E8DFD3] rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ProductFormSkeleton() {
  return (
    <main className="min-h-screen bg-[#FDFAF6] px-6 py-12 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-[#E8DFD3] rounded-lg"></div>
        <div className="h-64 w-full bg-[#F5F0E8] rounded-2xl border border-[#E8DFD3]"></div>
      </div>
    </main>
  );
}

export function ProductDetailSkeleton() {
  return (
    <main className="animate-pulse">
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5F0E8] min-h-[70vh]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <div>
            <div className="w-full aspect-square rounded-2xl bg-[#E8DFD3] border-4 border-[#7C9E87]/40 shadow-sm" />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="h-3 bg-[#E8DFD3] rounded w-28 mb-2" />

              <div className="h-9 md:h-10 bg-[#E8DFD3] rounded-md w-4/5 mt-2 mb-3" />

              <div className="h-4 bg-[#E8DFD3] rounded w-36 mb-4" />

              <div className="flex items-center gap-2 mb-6">
                <div className="h-4 bg-[#E8DFD3] rounded w-24" />
                <div className="h-3 bg-[#E8DFD3] rounded w-16" />
              </div>

              <div className="h-8 bg-[#E8DFD3] rounded-md w-28 mb-6" />

              <div className="space-y-2.5 mb-8">
                <div className="h-4 bg-[#E8DFD3] rounded w-full" />
                <div className="h-4 bg-[#E8DFD3] rounded w-11/12" />
                <div className="h-4 bg-[#E8DFD3] rounded w-3/4" />
              </div>

              <div className="h-12 bg-[#E8DFD3] rounded-xl w-full mb-6" />

              <div className="h-20 bg-[#E8DFD3]/60 rounded-xl w-full" />
            </div>

            <div className="mt-10 pt-6 border-t border-[#7C9E87]/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#E8DFD3] border-2 border-[#7C9E87]/40 flex-shrink-0" />

                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-[#E8DFD3] rounded w-32" />
                  <div className="h-3 bg-[#E8DFD3] rounded w-20" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-3.5 bg-[#E8DFD3] rounded w-full" />
                <div className="h-3.5 bg-[#E8DFD3] rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function RegisterSkeleton() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F5F0E8]/30">
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-sm border border-[#7C9E87]/20 animate-pulse space-y-6">
        {/* Title Skeleton */}
        <div className="text-center space-y-2">
          <div className="h-8 bg-gray-200 rounded-md w-2/3 mx-auto" />
          <div className="h-4 bg-gray-200 rounded-md w-3/4 mx-auto" />
        </div>

        {/* Form Controls Skeleton */}
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded-xl w-full" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded-xl w-full" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded-xl w-full" />
          </div>

          {/* Role selector skeleton */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="h-14 bg-gray-200 rounded-xl" />
            <div className="h-14 bg-gray-200 rounded-xl" />
          </div>

          {/* Button skeleton */}
          <div className="h-14 bg-gray-200 rounded-full w-full pt-2" />
        </div>
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#3D2B1F] flex flex-col justify-between">
      <main className="max-w-6xl mx-auto px-4 py-8 w-full animate-pulse">
        {/* Title*/}
        <div className="h-8 w-48 bg-[#E8DFD3] rounded-md mb-6"></div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 mb-6 border-b border-[#E8DFD3] pb-3">
          <div className="h-10 w-28 bg-[#E8DFD3] rounded-lg"></div>
          <div className="h-10 w-32 bg-[#E8DFD3] rounded-lg"></div>
          <div className="h-10 w-28 bg-[#E8DFD3] rounded-lg"></div>
        </div>

        {/* Cards Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#F5F0E8] p-4 rounded-xl border border-[#E8DFD3] flex gap-4 items-start"
            >
              <div className="w-20 h-20 bg-[#E8DFD3] rounded-lg shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-[#E8DFD3] rounded"></div>
                <div className="h-5 w-3/4 bg-[#E8DFD3] rounded"></div>
                <div className="h-3 w-1/2 bg-[#E8DFD3] rounded"></div>
                <div className="h-12 w-full bg-[#E8DFD3]/60 rounded-lg mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
