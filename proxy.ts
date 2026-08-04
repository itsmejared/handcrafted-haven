import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Matches all request paths except static files, Next.js internal files, and favicon
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
