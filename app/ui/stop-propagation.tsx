"use client";

export default function StopPropagation({ children }: { children: React.ReactNode }) {
  return <div onClick={(e) => e.stopPropagation()}>{children}</div>;
}
