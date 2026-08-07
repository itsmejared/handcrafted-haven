"use server";

import { revalidatePath } from "next/cache";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { registerUser } from "@/app/services/user";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || undefined;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectTo || "/shop",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    revalidatePath("/", "layout");
    throw error;
  }
}

export async function registerUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = (formData.get("role") as "customer" | "seller") || "customer";
  const bio = (formData.get("bio") as string) || null;
  const profile_image_url =
    (formData.get("profile_image_url") as string) || null;

  const registerResult = await registerUser({
    email,
    password,
    name,
    role,
    bio,
    profile_image_url,
  });

  if (!registerResult.success) {
    return { success: false, error: registerResult.error };
  }

  try {
    const redirectTo = role === "seller" ? "/profile" : "/shop";

    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error:
          "Cuenta creada con éxito, pero falló el inicio de sesión automático.",
      };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
