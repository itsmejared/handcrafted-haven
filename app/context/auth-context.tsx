"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { logoutAction } from "@/app/lib/actions";
import { useToast } from "@/app/context/toast-context";

export type AuthUser = {
  id: string;
  role: string;
  name: string;
};

interface AuthContextType {
  user: AuthUser | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const { showToast } = useToast();

  async function logout() {
    const name = user?.name;
    setUser(null);
    if (name) showToast(`Logged out. See you soon, ${name}!`);
    await logoutAction();
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
