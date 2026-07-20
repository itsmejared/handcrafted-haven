import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { hashPassword, signJwt } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const db = getDb();

    // Query user by email
    const result = await db.query(
      `SELECT id, email, password_hash, role, name, bio, profile_image_url, created_at 
       FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify password hash
    const inputHash = hashPassword(password);
    if (user.password_hash !== inputHash) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signJwt({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
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

    // Remove password_hash from return body
    const { password_hash, ...safeUser } = user;

    return NextResponse.json(safeUser, { status: 200 });
  } catch (error: any) {
    console.error("API Error during login:", error);
    return NextResponse.json(
      { error: "Internal Server Error during login." },
      { status: 500 }
    );
  }
}
