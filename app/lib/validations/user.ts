import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: "Email is required" })
    .pipe(z.email({ error: "Invalid email address" })),
  password: z.string().min(1, { error: "Password is required" }),
});

export const updateProfileSchema = z.object({
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .nullable(),
  profile_image_url: z
    .string()
    .refine(
      (val) => !val || val.startsWith("data:image/") || val.startsWith("http"),
      { message: "Image must be a valid URL or Base64 string" },
    )
    .optional()
    .nullable(),
  role: z.enum(["customer", "seller"], {
    message: "Invalid role specified",
  }),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long."),
    email: z
      .string()
      .trim()
      .min(1, { error: "Email is required" })
      .toLowerCase()
      .pipe(z.email({ error: "Invalid email address" })),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    role: z.enum(["customer", "seller"], {
      message: "Invalid role specified",
    }),
    bio: z.string().trim().optional().nullable(),
    profile_image_url: z.string().trim().optional().nullable(),
  })
  .transform((data) => {
    if (data.role === "customer") {
      return {
        ...data,
        bio: null,
        profile_image_url: null,
      };
    }
    return {
      ...data,
      bio: data.bio && data.bio.trim().length > 0 ? data.bio.trim() : null,
      profile_image_url:
        data.profile_image_url && data.profile_image_url.trim().length > 0
          ? data.profile_image_url.trim()
          : null,
    };
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
