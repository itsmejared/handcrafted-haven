import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const pathname = nextUrl.pathname;

      // ------------------------------------------------------------------
      // RULE 1: Redirect authenticated users attempting to access /login
      // ------------------------------------------------------------------
      if (pathname === "/login" && isLoggedIn) {
        if (userRole === "seller") {
          return Response.redirect(new URL("/profile", nextUrl));
        }
        return Response.redirect(new URL("/shop", nextUrl));
      }

      if (pathname.startsWith("/profile")) {
        if (!isLoggedIn) {
          return Response.redirect(
            new URL(`/login?redirect=${pathname}`, nextUrl),
          );
        }
        if (userRole !== "seller") {
          return Response.redirect(new URL("/shop", nextUrl));
        }
        return true;
      }

      // ------------------------------------------------------------------
      // RULE 2: Protected Routes Verification
      // Protected: /product, /product/create, /product/:id/edit
      // Public: /product/:id (Details view)
      // ------------------------------------------------------------------
      const isProductManagement = pathname === "/product";
      const isProductCreate = pathname === "/product/create";
      const isProductEdit =
        pathname.startsWith("/product/") && pathname.endsWith("/edit");

      const isProtectedRoute =
        isProductManagement || isProductCreate || isProductEdit;

      if (isProtectedRoute) {
        if (!isLoggedIn) return false;
        if (userRole !== "seller") {
          return Response.redirect(new URL("/shop", nextUrl));
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
