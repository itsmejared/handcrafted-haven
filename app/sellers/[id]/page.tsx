import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { sellers } from '@/app/lib/data';

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller = sellers.find((s) => s.id === id);

  if (!seller) {
    notFound();
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 md:py-20 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl border-4 border-[#FDFAF6] mx-auto mb-6">
            <img
              src={seller.image}
              alt={seller.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-2">{seller.name}</h1>
          <p className="text-[#C4622D] font-semibold mb-6">{seller.craft}</p>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-6"></div>
          <p className="text-[#3D2B1F] opacity-75 text-lg leading-relaxed mb-8">
            {seller.bio}
          </p>
          <Link
            href={`/sellers/${seller.id}/edit`}
            className="inline-block px-6 py-3 border-2 border-[#C4622D] text-[#C4622D] rounded-full font-medium hover:bg-[#C4622D] hover:text-white transition-all duration-300"
          >
            Edit Profile
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
