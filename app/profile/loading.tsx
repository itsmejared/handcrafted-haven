export default function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-[#7C9E87]/20 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Avatar Circle Skeleton */}
            <div className="w-16 h-16 rounded-full bg-[#3D2B1F]/10 shrink-0" />

            <div className="space-y-2 flex-1">
              {/* Name Skeleton */}
              <div className="h-7 w-48 bg-[#3D2B1F]/15 rounded-lg" />
              {/* Role Badge Skeleton */}
              <div className="h-4 w-28 bg-[#7C9E87]/20 rounded-md" />
            </div>
          </div>
        </div>

        {/* Account Details (Read-Only) Skeleton */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-[#7C9E87]/20 shadow-sm space-y-4">
          {/* Section Title Skeleton */}
          <div className="h-5 w-36 bg-[#3D2B1F]/15 rounded-lg pb-3 border-b border-[#3D2B1F]/10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Box Skeleton */}
            <div className="p-4 bg-[#F5F0E8]/50 rounded-2xl flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#C4622D]/20 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="h-3 w-12 bg-[#3D2B1F]/10 rounded" />
                <div className="h-4 w-32 bg-[#3D2B1F]/15 rounded" />
              </div>
            </div>

            {/* Date Box Skeleton */}
            <div className="p-4 bg-[#F5F0E8]/50 rounded-2xl flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#C4622D]/20 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="h-3 w-24 bg-[#3D2B1F]/10 rounded" />
                <div className="h-4 w-28 bg-[#3D2B1F]/15 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form Skeleton */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-[#7C9E87]/20 shadow-sm space-y-6">
          {/* Form Title Skeleton */}
          <div className="h-5 w-48 bg-[#3D2B1F]/15 rounded-lg mb-6" />

          {/* Avatar Upload Field Skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-32 bg-[#3D2B1F]/10 rounded" />
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#F5F0E8] border-2 border-[#7C9E87]/20 shrink-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded bg-[#3D2B1F]/10" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-9 w-40 bg-[#F5F0E8] rounded-xl border border-[#7C9E87]/20" />
                <div className="h-3 w-56 bg-[#3D2B1F]/10 rounded" />
              </div>
            </div>
          </div>

          {/* Bio Textarea Skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-44 bg-[#3D2B1F]/10 rounded" />
            <div className="w-full h-28 rounded-2xl bg-[#F5F0E8]/50 border border-[#7C9E87]/20" />
          </div>

          {/* Submit Button Skeleton */}
          <div className="flex justify-end pt-4">
            <div className="h-11 w-44 bg-[#C4622D]/30 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
