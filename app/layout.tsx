import type { Metadata } from "next";
import { auth } from "@/auth";

import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { CartProvider } from "@/app/context/cart-context";
import { AuthProvider, AuthUser } from "@/app/context/auth-context";
import { ToastProvider } from "@/app/context/toast-context";

import { geistSans, geistMono } from "@/app/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "Handcrafted Haven App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const initialUser = (session?.user as AuthUser) || null;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ToastProvider>
          <AuthProvider
            key={initialUser?.id || "guest"}
            initialUser={initialUser}
          >
            <CartProvider>
              <Header />
              {children}
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
