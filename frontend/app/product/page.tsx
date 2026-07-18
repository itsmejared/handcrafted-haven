import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';

export default function ProductPage() {
  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5F0E8] min-h-[50vh]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">Product Details</h1>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-6"></div>
          <p className="text-[#3D2B1F] opacity-75 text-lg">
            Individual product pages are coming soon.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
