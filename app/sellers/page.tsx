import Link from 'next/link';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { sellers } from '@/app/lib/data';

export default function SellersPage() {
  return (
    <main>
      <Header />
      <section className="px-6 md:px-8 py-16 bg-[#FDFAF6]">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">Meet Our Sellers</h1>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-6"></div>
          <p className="text-[#3D2B1F] opacity-75 text-lg">
            Get to know the artisans behind every handcrafted piece.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              href={`/sellers/${seller.id}`}
              className="bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-b-4 border-[#7C9E87]"
            >
              <div className="w-full aspect-[3/4] overflow-hidden">
                <img
                  src={seller.image}
                  alt={seller.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-[#3D2B1F] mb-1">{seller.name}</h3>
                <p className="text-[#C4622D] text-sm font-medium">{seller.craft}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-[#3D2B1F] mb-4">Want to join them?</h2>
          <Link
            href="/sellers/signup"
            className="inline-block px-8 py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Apply Now
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
