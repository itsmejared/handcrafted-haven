'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { useAuth } from '@/app/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'seller',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUrl = searchParams.get('redirect');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
    setLoading(false);

    if (result.success) {
      // Check return URL from query param or sessionStorage
      const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin');
      const target = redirectUrl || savedRedirect || '/';
      router.push(target);
    } else {
      setError(result.error || 'Registration failed.');
    }
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5F0E8] min-h-[60vh]">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">Create an Account</h1>
            <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
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
              <label htmlFor="password" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-[#3D2B1F] mb-2">I am a...</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === 'customer'}
                    onChange={() => setFormData({ ...formData, role: 'customer' })}
                  />
                  Customer
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === 'seller'}
                    onChange={() => setFormData({ ...formData, role: 'seller' })}
                  />
                  Seller
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-[#3D2B1F] opacity-75">
              Already have an account?{' '}
              <Link
                href={redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login'}
                className="text-[#C4622D] font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
