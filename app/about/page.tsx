import Link from 'next/link';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { Heart, Coins, Users, Sparkles } from 'lucide-react';

const incentives = [
  {
    icon: Coins,
    title: "Keep More of Every Sale",
    desc: "Our fee structure is built for independent makers, not mega-marketplaces — so more of what you earn stays with you compared to larger platforms like Etsy or Amazon Handmade.",
  },
  {
    icon: Users,
    title: "A Community, Not a Crowd",
    desc: "You're not competing against millions of mass-produced listings. Every seller here is a real artisan, and every buyer is here specifically for handmade work.",
  },
  {
    icon: Sparkles,
    title: "Built Just for Handmade",
    desc: "No algorithm burying your shop under drop-shippers. Our platform is designed from the ground up around craftsmanship, not commodity retail.",
  },
  {
    icon: Heart,
    title: "Your Story, Front and Center",
    desc: "Seller profiles are designed to showcase who you are and how you create — not just a product grid. Buyers connect with the artisan, not just the item.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="bg-[#F5F0E8] px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <span className="text-[#7C9E87] font-semibold text-sm md:text-base mb-4 tracking-widest uppercase block">
              ✦ Our Story
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3D2B1F] mb-6 leading-tight">
              Built for Artisans, <span className="text-[#C4622D]">Not Algorithms</span>
            </h1>
            <div className="w-24 h-1 bg-[#7C9E87] mb-6 rounded-full"></div>
            <p className="text-base md:text-lg text-[#3D2B1F] opacity-75 leading-relaxed mb-4">
              Handcrafted Haven connects talented artisans with people who appreciate
              the beauty of handmade products. Every piece on our platform tells a story
              of passion, craftsmanship, and care.
            </p>
            <p className="text-base md:text-lg text-[#3D2B1F] opacity-75 leading-relaxed">
              We built this platform because independent makers deserve a home that
              understands handmade work — not a corner of a marketplace built for
              mass production.
            </p>
          </div>
          <div className="relative w-full max-w-md mx-auto md:max-w-none">
            <div className="absolute top-4 left-4 w-full aspect-[4/5] bg-[#7C9E87] rounded-3xl opacity-30"></div>
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FDFAF6]">
              <img
                src="/guitar player.webp"
                alt="Artisan playing a custom electric guitar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Sell With Us */}
      <section className="px-6 md:px-8 py-16 md:py-20 bg-[#FDFAF6]">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">
            Why Sell With Us Instead
          </h2>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-6"></div>
          <p className="text-[#3D2B1F] opacity-75 text-lg">
            You have options for where to sell your work. Here's what makes Handcrafted Haven different.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {incentives.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-5 p-6 md:p-8 bg-[#F5F0E8] rounded-2xl border-b-4 border-[#7C9E87] hover:shadow-lg transition-all duration-300"
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#C4622D]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#C4622D]" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#3D2B1F] mb-2">{item.title}</h3>
                  <p className="text-[#3D2B1F] opacity-70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-16 bg-[#F5F0E8] text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3D2B1F] mb-4">
          Ready to share your craft?
        </h2>
        <p className="text-[#3D2B1F] opacity-75 text-lg mb-8 max-w-xl mx-auto">
          Join a community built specifically for makers like you.
        </p>
        <Link
          href="/sellers"
          className="inline-block px-8 py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Become a Seller
        </Link>
      </section>

      <Footer />
    </main>
  );
}
