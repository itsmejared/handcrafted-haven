import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";

export default function AccountProfileLoading() {
  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 bg-[#F5F0E8] min-h-[60vh]">
        <div className="max-w-2xl mx-auto space-y-8 animate-pulse">
          <div className="text-center space-y-3">
            <div className="h-9 bg-[#3D2B1F]/20 rounded w-48 mx-auto" />
            <div className="w-24 h-1 bg-[#7C9E87]/40 mx-auto rounded-full" />
          </div>

          <div className="bg-[#FDFAF6] rounded-2xl p-8 shadow-sm border border-[#7C9E87]/20 space-y-6">
            <div className="w-28 h-28 rounded-full bg-[#3D2B1F]/15 mx-auto" />
            <div className="space-y-4">
              <div className="h-12 bg-[#3D2B1F]/10 rounded-md w-full" />
              <div className="h-12 bg-[#3D2B1F]/10 rounded-md w-full" />
              <div className="h-24 bg-[#3D2B1F]/10 rounded-md w-full" />
              <div className="h-12 bg-[#C4622D]/20 rounded-full w-full" />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
