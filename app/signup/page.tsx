"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUserAction } from "@/app/lib/actions";
import { User, Store, Image as ImageIcon, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (role === "seller" && profileImage) {
      formData.set("profile_image_url", profileImage);
    }

    try {
      const result = await registerUserAction(formData);
      if (result && !result.success) {
        setError(result.error || "Ocurrió un error inesperado.");
        setLoading(false);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#7C9E87]/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#3D2B1F]">
            Join Handcrafted Haven
          </h1>
          <p className="text-sm text-[#3D2B1F]/70 mt-2">
            Create an account to shop unique items or showcase your
            craftsmanship.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#3D2B1F] uppercase tracking-wider mb-2">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                  role === "customer"
                    ? "bg-[#C4622D] text-white border-[#C4622D] shadow-md"
                    : "bg-white text-[#3D2B1F] border-gray-200 hover:border-[#7C9E87]"
                }`}
              >
                <User className="w-4 h-4" /> Shop Items
              </button>
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                  role === "seller"
                    ? "bg-[#C4622D] text-white border-[#C4622D] shadow-md"
                    : "bg-white text-[#3D2B1F] border-gray-200 hover:border-[#7C9E87]"
                }`}
              >
                <Store className="w-4 h-4" /> Sell Crafts
              </button>
            </div>
            <input type="hidden" name="role" value={role} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Jane Doe"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C4622D] text-sm text-[#3D2B1F]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="jane@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C4622D] text-sm text-[#3D2B1F]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C4622D] text-sm text-[#3D2B1F] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3D2B1F]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Additional fields Seller */}
          {role === "seller" && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1">
                  Artisan Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Tell buyers about your craft and history..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C4622D] text-sm text-[#3D2B1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2B1F] uppercase tracking-wider mb-1">
                  Profile / Workshop Picture
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-[#F5F0E8] text-[#3D2B1F] text-xs font-medium rounded-xl cursor-pointer hover:bg-[#7C9E87]/20 border border-[#7C9E87]/30 transition-all">
                    <ImageIcon className="w-4 h-4 text-[#C4622D]" /> Choose
                    Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {profileImage && (
                    <span className="text-xs text-[#7C9E87] font-medium">
                      ✓ Image loaded
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#C4622D] text-white rounded-xl font-medium text-sm hover:bg-[#3D2B1F] transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-[#3D2B1F]/70 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#C4622D] font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
