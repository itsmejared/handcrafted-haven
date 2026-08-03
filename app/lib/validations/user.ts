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

export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
