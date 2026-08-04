"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 py-4 border-t border-[#7C9E87]/20">
      {hasPrevious ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-4 py-2 rounded-lg border border-[#7C9E87] text-[#2C3E35] font-medium text-sm transition-all hover:bg-[#7C9E87] hover:text-white"
        >
          Previous
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400 font-medium text-sm cursor-not-allowed bg-gray-50">
          Previous
        </span>
      )}

      <span className="text-sm font-medium text-[#2C3E35]">
        Page <strong className="text-[#7C9E87]">{currentPage}</strong> of{" "}
        <strong>{Math.max(totalPages, 1)}</strong>
      </span>

      {hasNext ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-4 py-2 rounded-lg border border-[#7C9E87] text-[#2C3E35] font-medium text-sm transition-all hover:bg-[#7C9E87] hover:text-white"
        >
          Next
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400 font-medium text-sm cursor-not-allowed bg-gray-50">
          Next
        </span>
      )}
    </div>
  );
}
