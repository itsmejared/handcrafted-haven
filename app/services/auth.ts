"use server";

import { cookies } from "next/headers";
import { getDb } from "@/app/lib/db";
import { hashPassword, signJwt } from "@/app/lib/auth";

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: "customer" | "seller" | string;
  bio?: string;
  profile_image_url?: string;
}

export async function loginUser(email: string, password: string) {
  try {
    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
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
      return { success: false, error: "Invalid email or password." };
    }

    // Verify password hash
    const inputHash = hashPassword(password);
    if (user.password_hash !== inputHash) {
      return { success: false, error: "Invalid email or password." };
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

    // Clean JSON-serializable user payload
    const safeUser = {
      id: String(user.id),
      email: String(user.email),
      role: user.role,
      name: String(user.name),
      bio: user.bio ? String(user.bio) : null,
      profile_image_url: user.profile_image_url ? String(user.profile_image_url) : null,
      created_at: user.created_at ? new Date(user.created_at).toISOString() : null,
    };

    return { success: true, user: safeUser };
  } catch (error: any) {
    console.error("Error in loginUser service:", error);
    return { success: false, error: "Internal Server Error during login." };
  }
}

export async function registerUser(data: RegisterInput) {
  try {
    const { email, password, name, role, bio, profile_image_url } = data;

    if (!email || !password || !name || !role) {
      return {
        success: false,
        error: "Email, password, name, and role are required.",
      };
    }

    // Normalize roles: 'artisan' -> 'seller', 'buyer' -> 'customer'
    let normalizedRole = role.toLowerCase().trim();
    if (normalizedRole === "artisan") {
      normalizedRole = "seller";
    } else if (normalizedRole === "buyer") {
      normalizedRole = "customer";
    }

    if (normalizedRole !== "customer" && normalizedRole !== "seller") {
      return {
        success: false,
        error: "Role must be 'customer', 'buyer', 'seller', or 'artisan'.",
      };
    }

    const db = getDb();

    // Check if email already exists
    const userCheck = await db.query("SELECT id FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);
    if (userCheck.rows.length > 0) {
      return { success: false, error: "User with this email already exists." };
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

    const safeUser = {
      id: String(newUser.id),
      email: String(newUser.email),
      role: newUser.role,
      name: String(newUser.name),
      bio: newUser.bio ? String(newUser.bio) : null,
      profile_image_url: newUser.profile_image_url ? String(newUser.profile_image_url) : null,
      created_at: newUser.created_at ? new Date(newUser.created_at).toISOString() : null,
    };

    return { success: true, user: safeUser };
  } catch (error: any) {
    console.error("Error in registerUser service:", error);
    return {
      success: false,
      error: "Internal Server Error during registration.",
    };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
  } catch (error: any) {
    console.error("Error in logoutUser service:", error);
    return { success: false, error: "Logout failed." };
  }
}
