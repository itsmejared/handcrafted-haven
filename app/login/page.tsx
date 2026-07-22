'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    // TODO: connect to real /api/auth/login endpoint once backend is ready
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }
    console.log('Login attempt:', formData);
    router.push('/');
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5F0E8] min-h-[60vh]">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">Log In</h1>
            <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#FDFAF6] rounded-2xl p-6 md:p-8 shadow-md space-y-5">
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
              <label htmlFor="password" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Log In
            </button>

            <p className="text-center text-sm text-[#3D2B1F] opacity-75">
              Don't have an account?{' '}
              <Link href="/sellers/signup" className="text-[#C4622D] font-medium hover:underline">
                Apply to sell
              </Link>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
