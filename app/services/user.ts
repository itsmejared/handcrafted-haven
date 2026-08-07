import bcrypt from "bcryptjs";
import { getDb } from "@/app/lib/db";
import { User } from "@/app/lib/types";
import {
  loginSchema,
  RegisterInput,
  registerSchema,
} from "@/app/lib/validations/user";
import { revalidatePath } from "next/cache";

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

    const { password_hash: _password_hash, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error("Error authenticating user by credentials:", error);
    return null;
  }
}

export async function registerUser(input: RegisterInput): Promise<{
  success: boolean;
  user?: Omit<User, "password_hash">;
  error?: string;
}> {
  // 1. Validar datos con Zod
  const validation = registerSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Datos no válidos",
    };
  }

  const { email, password, name, role, bio, profile_image_url } =
    validation.data;

  try {
    const db = getDb();

    // 2. Verificar si el correo ya existe
    const existingUser = await db.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1);",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return {
        success: false,
        error: "El correo electrónico ya está registrado.",
      };
    }

    // 3. Encriptar la contraseña en el servidor
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 4. Insertar nuevo usuario
    const insertQuery = `
      INSERT INTO users (email, password_hash, name, role, bio, profile_image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, name, role, bio, profile_image_url, created_at;
    `;

    const values = [
      email.toLowerCase(),
      password_hash,
      name,
      role,
      role === "seller" ? bio || null : null,
      role === "seller" ? profile_image_url || null : null,
    ];

    const result = await db.query(insertQuery, values);
    const newUser = result.rows[0];

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    console.error("Error en registerUser:", error);
    return { success: false, error: "Error interno al crear la cuenta." };
  }
}

export async function updateUserProfile(
  id: string,
  data: {
    bio?: string | null;
    profile_image_url?: string | null;
  },
) {
  try {
    const db = getDb();
    await db.query(
      `UPDATE users 
       SET bio = $1, profile_image_url = $2
       WHERE id = $3`,
      [data.bio || null, data.profile_image_url || null, id],
    );
    revalidatePath("/profile");
    revalidatePath("/sellers");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Database error updating profile" };
  }
}
