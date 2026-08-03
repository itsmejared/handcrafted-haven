"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@/app/lib/types";
import { useToast } from "@/app/context/toast-context";
import { Upload, Camera, Loader2, Save } from "lucide-react";

interface ProfileFormProps {
  user: User;
  updateAction: (data: {
    bio?: string | null;
    profile_image_url?: string | null;
  }) => Promise<{ success: boolean; error?: string }>;
}

export default function ProfileForm({ user, updateAction }: ProfileFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [bio, setBio] = useState(user.bio || "");
  const [profileImage, setProfileImage] = useState(
    user.profile_image_url || "",
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profile_image_url || null,
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image size must be less than 2MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateAction({
        bio: bio.trim(),
        profile_image_url: profileImage,
      });

      if (result.success) {
        showToast("Profile updated successfully!", "success");
        router.refresh();
      } else {
        showToast(result.error || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#3D2B1F]/70 mb-2">
          Profile Image / Avatar
        </label>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#7C9E87]/40 bg-[#F5F0E8] flex items-center justify-center shrink-0 shadow-inner">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt={user.name || "Seller avatar"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Camera className="w-8 h-8 text-[#3D2B1F]/40" />
            )}
          </div>

          <div className="space-y-2 flex-1">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F0E8] border border-[#7C9E87]/30 text-[#3D2B1F] text-xs font-bold rounded-xl cursor-pointer hover:bg-[#7C9E87]/20 transition-all">
              <Upload className="w-4 h-4 text-[#C4622D]" />
              <span>Choose Image (Base64)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-[#3D2B1F]/60">
              Upload a PNG, JPG, or WebP photo (max 2MB).
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="bio"
          className="block text-xs font-semibold uppercase tracking-wider text-[#3D2B1F]/70 mb-2"
        >
          Artisan Bio & Store Description
        </label>
        <textarea
          id="bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell your customers about your craft, inspiration, and handmade story..."
          className="w-full px-4 py-3 rounded-2xl bg-[#F5F0E8]/50 border border-[#7C9E87]/30 text-[#3D2B1F] text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:border-transparent transition-all placeholder:text-[#3D2B1F]/40 resize-none"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4622D] text-white text-sm font-bold rounded-full hover:bg-[#3D2B1F] disabled:opacity-50 transition-all shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
