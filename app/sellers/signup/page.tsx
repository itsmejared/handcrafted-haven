'use client';

import { useState } from 'react';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';

export default function SellerSignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    craft: '',
    portfolio: '',
    message: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Will connect to the backend signup endpoint once available
    console.log('Seller application:', formData);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main>
        <Header />
        <section className="px-6 md:px-12 py-24 bg-[#F5F0E8] min-h-[50vh] text-center">
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">
              Thank You, {formData.name.split(' ')[0] || 'Friend'}!
            </h1>
            <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-6"></div>
            <p className="text-[#3D2B1F] opacity-75 text-lg">
              Your application has been received. We'll be in touch at {formData.email} soon.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 md:py-20 bg-[#F5F0E8]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">Apply to Sell</h1>
            <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-6"></div>
            <p className="text-[#3D2B1F] opacity-75 text-lg">
              Tell us a bit about your craft, and we'll follow up with next steps.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#FDFAF6] rounded-2xl p-6 md:p-8 shadow-md space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="craft" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                What do you make?
              </label>
              <input
                id="craft"
                name="craft"
                type="text"
                placeholder="e.g., ceramics, jewelry, woodworking"
                required
                value={formData.craft}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                Portfolio or Social Link <span className="opacity-50">(optional)</span>
              </label>
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                placeholder="https://"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                Tell us about your work <span className="opacity-50">(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
