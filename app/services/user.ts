import bcrypt from "bcryptjs";
import { getDb } from "@/app/lib/db";
import { User } from "@/app/lib/types";
import { loginSchema } from "@/app/lib/validations/user";

export async function getUserByCredentials(
  credentials: unknown,
): Promise<User | null> {
  const parseResult = loginSchema.safeParse(credentials);
  if (!parseResult.success) {
    return null;
  }

  const { email, password } = parseResult.data;

  try {
    const db = getDb();
    const query = `
      SELECT id, email, password_hash, role, name, bio, profile_image_url, created_at
      FROM users
      WHERE LOWER(email) = LOWER($1);
    `;
    const result = await db.query(query, [email]);
    if (result.rows.length === 0) {
      return null;
    }
    const user = result.rows[0] as User;

    if (!user.password_hash) {
      throw new Error("This user doesn't have a password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    const { password_hash, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error("Error authenticating user by credentials:", error);
    return null;
  }
}
