'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'seller';
  name: string;
  bio?: string | null;
  profile_image_url?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: 'customer' | 'seller';
    bio?: string;
    profile_image_url?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  function showToast(message: string) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  }

  async function login(email: string, password: string) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }
      setUser(data);
      localStorage.setItem('currentUser', JSON.stringify(data));
      showToast(`Welcome back, ${data.name}!`);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  async function register(data: {
    email: string;
    password: string;
    name: string;
    role: 'customer' | 'seller';
    bio?: string;
    profile_image_url?: string;
  }) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || 'Registration failed.' };
      }
      setUser(result);
      localStorage.setItem('currentUser', JSON.stringify(result));
      showToast(`Welcome, ${result.name}!`);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  }

  function logout() {
    const name = user?.name;
    setUser(null);
    localStorage.removeItem('currentUser');
    if (name) showToast(`Logged out. See you soon, ${name}!`);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3D2B1F] text-[#FDFAF6] px-6 py-3 rounded-full shadow-xl z-[100] text-sm font-medium animate-fade-in"
        >
          {toastMessage}
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
