import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { hashPassword, signJwt } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role, bio, profile_image_url } = body;

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Email, password, name, and role are required." },
        { status: 400 }
      );
    }

    // Normalize roles: 'artisan' -> 'seller', 'buyer' -> 'customer'
    let normalizedRole = role.toLowerCase().trim();
    if (normalizedRole === "artisan") {
      normalizedRole = "seller";
    } else if (normalizedRole === "buyer") {
      normalizedRole = "customer";
    }

    if (normalizedRole !== "customer" && normalizedRole !== "seller") {
      return NextResponse.json(
        { error: "Role must be 'customer', 'buyer', 'seller', or 'artisan'." },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if email already exists
    const userCheck = await db.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase().trim()]);
    if (userCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash password and insert user
    const passwordHash = hashPassword(password);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, role, name, bio, profile_image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, role, name, bio, profile_image_url, created_at`,
      [
        email.toLowerCase().trim(),
        passwordHash,
        normalizedRole,
        name.trim(),
        bio ? bio.trim() : null,
        profile_image_url ? profile_image_url.trim() : null,
      ]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = signJwt({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400, // 24 hours
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("API Error during registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error during registration." },
      { status: 500 }
    );
  }
}
