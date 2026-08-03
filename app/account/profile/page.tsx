"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/auth-context";
import Link from "next/link";

export default function MyProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/sellers/profile");
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load profile.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          profileImageUrl: data.profile_image_url || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Something went wrong loading your profile.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/sellers/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile.");
        return;
      }
      setSaved(true);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Something went wrong saving your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <main>
        <section className="px-6 md:px-12 py-16 bg-[#F5F0E8] min-h-[50vh] text-center">
          <p className="text-[#3D2B1F] opacity-75 text-lg mb-6">
            You need to log in to view this page.
          </p>
          <Link
            href="/login"
            className="text-[#C4622D] font-medium hover:underline"
          >
            Go to Log In
          </Link>
        </section>
      </main>
    );
  }

  if (user.role !== "seller") {
    return (
      <main>
        <section className="px-6 md:px-12 py-16 bg-[#F5F0E8] min-h-[50vh] text-center">
          <p className="text-[#3D2B1F] opacity-75 text-lg">
            This page is only available to seller accounts.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="px-6 md:px-12 py-16 bg-[#F5F0E8]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">
              My Profile
            </h1>
            <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
          </div>

          {loading ? (
            <p className="text-center text-[#3D2B1F] opacity-75">
              Loading your profile...
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-[#FDFAF6] rounded-2xl p-6 md:p-8 shadow-md space-y-6"
            >
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-[#F5F0E8] mb-3 bg-[#E8DFD3]">
                  {formData.profileImageUrl ? (
                    <img
                      src={formData.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#7C9E87] text-xs text-center px-2">
                      No photo yet
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="profileImageUrl"
                  className="block text-sm font-medium text-[#3D2B1F] mb-2"
                >
                  Profile Photo URL
                </label>
                <input
                  id="profileImageUrl"
                  name="profileImageUrl"
                  type="text"
                  placeholder="https://..."
                  value={formData.profileImageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
                />
                <p className="text-xs text-[#3D2B1F] opacity-50 mt-1">
                  Paste a link to an image for now — direct photo upload
                  isn&apos;t built yet.
                </p>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#3D2B1F] mb-2"
                >
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
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-[#3D2B1F] mb-2"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={5}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {saved && (
                <p className="text-[#7C9E87] font-medium text-sm">
                  Profile updated successfully!
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
