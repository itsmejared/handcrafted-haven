import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { getUserByCredentials } from "@/app/services/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await getUserByCredentials(credentials);
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
});
