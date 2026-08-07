import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getSellerById } from "@/app/services/sellers";
import ProfileForm from "@/app/ui/profile/profile-form";
import { Calendar, Mail, ShieldCheck } from "lucide-react";
import { updateUserProfile } from "@/app/services/user";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "seller") {
    redirect("/shop");
  }

  const user = await getSellerById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  async function handleUpdateProfile(data: {
    bio?: string | null;
    profile_image_url?: string | null;
  }) {
    "use server";
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };
    return await updateUserProfile(session.user.id, data);
  }

  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <main className="min-h-screen bg-[#F5F0E8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-[#7C9E87]/20 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Profile image */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#7C9E87]/40 bg-[#C4622D] text-white flex items-center justify-center text-2xl font-bold shrink-0">
              {user.profile_image_url ? (
                <Image
                  src={user.profile_image_url}
                  alt={user.name || "Seller avatar"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : user.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                "S"
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#3D2B1F]">{user.name}</h1>
              <p className="text-sm text-[#3D2B1F]/70 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-4 h-4 text-[#7C9E87]" />
                Seller Account
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-[#7C9E87]/20 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#3D2B1F] border-b border-[#3D2B1F]/10 pb-3">
            Account Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-[#F5F0E8]/50 rounded-2xl flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#C4622D]" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#3D2B1F]/60 font-semibold">
                  Email
                </p>
                <p className="font-medium text-[#3D2B1F]">{user.email}</p>
              </div>
            </div>

            <div className="p-4 bg-[#F5F0E8]/50 rounded-2xl flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#C4622D]" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#3D2B1F]/60 font-semibold">
                  Member Since
                </p>
                <p className="font-medium text-[#3D2B1F]">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-[#7C9E87]/20 shadow-sm">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-6">
            Edit Seller Public Profile
          </h2>
          <ProfileForm user={user} updateAction={handleUpdateProfile} />
        </div>
      </div>
    </main>
  );
}
