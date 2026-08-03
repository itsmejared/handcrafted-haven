"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";

export type ToastVariant = "success" | "warning" | "error";

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

interface ToastState {
  message: string;
  variant: ToastVariant;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const VARIANT_STYLES: Record<ToastVariant, { bg: string; icon: string }> = {
  success: { bg: "bg-[#7C9E87]", icon: "✓" },
  warning: { bg: "bg-[#D97706]", icon: "⚠" },
  error: { bg: "bg-[#C4622D]", icon: "✕" },
};

const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string, variant: ToastVariant = "success") {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({ message, variant });

    timerRef.current = setTimeout(() => {
      setToast(null);
    }, AUTO_DISMISS_MS);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-white text-sm font-medium animate-fade-in transition-all ${
            VARIANT_STYLES[toast.variant].bg
          }`}
        >
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold">
            {VARIANT_STYLES[toast.variant].icon}
          </span>
          <p className="leading-snug">{toast.message}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
