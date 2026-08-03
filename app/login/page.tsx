"use client";

import { useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authenticate } from "@/app/lib/actions";

function LoginForm() {
  const searchParams = useSearchParams();

  // NextAuth pasa por defecto "callbackUrl" cuando bloquea una ruta protegida
  const callbackUrl =
    searchParams.get("callbackUrl") || searchParams.get("redirect");

  // Conectamos la Server Action mediante React standard hook
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <main className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Banner Informativo (Si viene redirigido desde una ruta protegida) */}
        {callbackUrl && (
          <div className="p-4 rounded-2xl bg-[#7C9E87]/15 border border-[#7C9E87]/40 text-[#3D2B1F] text-xs font-medium flex items-start space-x-3 shadow-sm animate-fadeIn">
            <svg
              className="w-5 h-5 text-[#7C9E87] flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-sm mb-0.5">
                Authentication Required
              </p>
              <p className="text-[#3D2B1F]/80">
                You need to log in to access{" "}
                <span className="font-mono bg-[#FDFAF6] px-1.5 py-0.5 rounded text-[#C4622D]">
                  {callbackUrl}
                </span>
                . Once signed in, you will be redirected automatically.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2B1F] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-[#3D2B1F]/70">
            Sign in to access your Handcrafted Haven account
          </p>
          <div className="w-16 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
        </div>

        {/* Form Card */}
        <div className="bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-3xl p-8 shadow-xl backdrop-blur-sm transition-all">
          <form action={dispatch} className="space-y-6">
            {/* Campo oculto para pasar la URL de destino al Server Action */}
            {callbackUrl && (
              <input type="hidden" name="redirectTo" value={callbackUrl} />
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#3D2B1F]/80 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-white rounded-xl border border-[#7C9E87]/30 text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:border-transparent transition-all text-sm shadow-sm"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3D2B1F]/80"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-white rounded-xl border border-[#7C9E87]/30 text-[#3D2B1F] placeholder-[#3D2B1F]/40 focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:border-transparent transition-all text-sm shadow-sm"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/60 text-red-600 text-xs font-medium flex items-center space-x-2 animate-fadeIn">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 bg-[#C4622D] text-white rounded-xl text-base font-medium hover:bg-[#3D2B1F] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center space-x-2"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-xs text-[#3D2B1F]/80 pt-2">
              Don&apos;t have an account?{" "}
              <Link
                href={
                  callbackUrl
                    ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                    : "/register"
                }
                className="text-[#C4622D] font-bold hover:underline transition-all"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F0E8]" />}>
      <LoginForm />
    </Suspense>
  );
}
