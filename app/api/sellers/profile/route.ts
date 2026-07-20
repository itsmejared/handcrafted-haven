import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { getAuthenticatedUser } from "@/app/lib/auth";

// GET: Fetch active logged-in artisan's profile
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    if (user.role !== "seller") {
      return NextResponse.json(
        { error: "Forbidden. Profile endpoint is only for sellers." },
        { status: 403 }
      );
    }

    const db = getDb();
    const result = await db.query(
      `SELECT id, name, email, bio, profile_image_url, role, created_at 
       FROM users 
       WHERE id = $1`,
      [user.id]
    );

    const activeProfile = result.rows[0];

    if (!activeProfile) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    const mappedProfile = {
      id: activeProfile.id,
      name: activeProfile.name,
      email: activeProfile.email,
      bio: activeProfile.bio,
      profileImageUrl: activeProfile.profile_image_url,
      profile_image_url: activeProfile.profile_image_url,
      role: "artisan",
      createdAt: activeProfile.created_at,
      created_at: activeProfile.created_at
    };

    return NextResponse.json(mappedProfile, { status: 200 });
  } catch (error: any) {
    console.error("API Error fetching active seller profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error while loading the profile." },
      { status: 500 }
    );
  }
}

// PUT: Update active logged-in artisan's shop details
export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    if (user.role !== "seller") {
      return NextResponse.json(
        { error: "Forbidden. Profile update is only for sellers." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const name = body.name;
    const bio = body.bio;
    const profileImageUrl = body.profileImageUrl || body.profile_image_url;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: "Name is required to update profile." },
        { status: 400 }
      );
    }

    const db = getDb();

    // Update active profile
    const result = await db.query(
      `UPDATE users 
       SET name = $1, bio = $2, profile_image_url = $3
       WHERE id = $4
       RETURNING id, name, email, bio, profile_image_url, role, created_at`,
      [
        name.trim(),
        bio ? bio.trim() : null,
        profileImageUrl ? profileImageUrl.trim() : null,
        user.id
      ]
    );

    const updatedProfile = result.rows[0];
    const mappedUpdatedProfile = {
      id: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      bio: updatedProfile.bio,
      profileImageUrl: updatedProfile.profile_image_url,
      profile_image_url: updatedProfile.profile_image_url,
      role: "artisan",
      createdAt: updatedProfile.created_at,
      created_at: updatedProfile.created_at
    };

    return NextResponse.json(mappedUpdatedProfile, { status: 200 });
  } catch (error: any) {
    console.error("API Error updating active seller profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error while updating profile." },
      { status: 500 }
    );
  }
}
