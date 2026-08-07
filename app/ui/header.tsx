"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Package,
  LogOut,
  LogIn,
  UserPlus,
  Store,
  ClipboardList,
  NotebookPen,
} from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import { useAuth } from "@/app/context/auth-context";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMounted = useIsMounted();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Top accent bar */}
      <div className="h-1 bg-[#7C9E87]"></div>

      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3.5 bg-[#FDFAF6] border-b-4 border-[#7C9E87] shadow-md relative">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-[#C4622D] shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span>🧶</span>
          <span className="tracking-tight">Handcrafted Haven</span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-8 text-[#3D2B1F] font-medium mx-6">
          <Link href="/" className="hover:text-[#C4622D] transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-[#C4622D] transition-colors">
            Shop
          </Link>
          <Link
            href="/sellers"
            className="hover:text-[#C4622D] transition-colors"
          >
            Sellers
          </Link>
          <Link
            href="/about"
            className="hover:text-[#C4622D] transition-colors"
          >
            About
          </Link>
        </div>

        {/* User Actions & Cart - Desktop */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* Shopping Cart Button */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 text-[#3D2B1F] hover:text-[#C4622D] hover:bg-[#7C9E87]/10 rounded-full transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            {isMounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C4622D] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#FDFAF6] shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Logged In State */}
          {user ? (
            <div className="flex items-center gap-3 bg-[#F5F0E8] pl-3 pr-2 py-1.5 rounded-full border border-[#7C9E87]/30 shadow-sm">
              {/* User Avatar & Name Banner */}
              <div className="flex items-center gap-2 pr-1">
                <div className="w-8 h-8 rounded-full bg-[#7C9E87] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-bold text-[#3D2B1F] max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#C4622D] flex items-center gap-0.5">
                    {user.role === "seller" ? (
                      <>
                        <Store className="w-2.5 h-2.5 inline" /> Seller
                      </>
                    ) : (
                      <>
                        <User className="w-2.5 h-2.5 inline" /> Customer
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Dynamic Action Buttons based on Role */}
              <div className="flex items-center gap-1.5 border-l border-[#3D2B1F]/15 pl-2">
                {user.role === "seller" ? (
                  <>
                    <Link
                      href="/product"
                      title="My Products"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3D2B1F] hover:text-[#C4622D] hover:bg-white rounded-full transition-all"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>My Products</span>
                    </Link>
                    <Link
                      href="/profile"
                      title="My Profile"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3D2B1F] hover:text-[#C4622D] hover:bg-white rounded-full transition-all"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </Link>
                  </>
                ) : (
                  <span></span>
                )}
                <Link
                  href="/orders"
                  title="My Orders"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3D2B1F] hover:text-[#C4622D] hover:bg-white rounded-full transition-all"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>My Orders</span>
                </Link>
                <Link
                  href="/reviews"
                  title="My Reviews"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#3D2B1F] hover:text-[#C4622D] hover:bg-white rounded-full transition-all"
                >
                  <NotebookPen className="w-3.5 h-3.5" />
                  <span>My Reviews</span>
                </Link>
                {/* Sign Out Button */}
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-1.5 text-[#C4622D] hover:bg-[#C4622D] hover:text-white rounded-full transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* User Guest State */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#C4622D] border border-[#C4622D] rounded-full hover:bg-[#C4622D] hover:text-white transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log in</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#C4622D] text-white rounded-full hover:bg-[#3D2B1F] transition-all shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls (Cart + Hamburger) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative p-2 text-[#3D2B1F] hover:text-[#C4622D] rounded-full"
          >
            <ShoppingCart className="w-6 h-6" />
            {isMounted && itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#C4622D] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            className="p-2 text-[#3D2B1F] hover:text-[#C4622D] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 flex flex-col gap-3 bg-[#FDFAF6] border-b-4 border-[#7C9E87] shadow-xl px-6 py-6 lg:hidden z-50">
            {/* User Profile Card (Mobile) */}
            {user && (
              <div className="flex items-center gap-3 p-3 bg-[#F5F0E8] rounded-2xl border border-[#7C9E87]/30 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#7C9E87] text-white flex items-center justify-center font-bold text-base shadow">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#3D2B1F]">{user.name}</span>
                  <span className="text-xs font-medium text-[#C4622D] uppercase flex items-center gap-1">
                    {user.role === "seller" ? (
                      <>
                        <Store className="w-3 h-3 inline" /> Seller Account
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 inline" /> Customer Account
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* General Navigation Links */}
            <Link
              href="/"
              className="py-2 text-[#3D2B1F] font-medium hover:text-[#C4622D] border-b border-[#3D2B1F]/5"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="py-2 text-[#3D2B1F] font-medium hover:text-[#C4622D] border-b border-[#3D2B1F]/5"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/sellers"
              className="py-2 text-[#3D2B1F] font-medium hover:text-[#C4622D] border-b border-[#3D2B1F]/5"
              onClick={() => setMenuOpen(false)}
            >
              Sellers
            </Link>
            <Link
              href="/about"
              className="py-2 text-[#3D2B1F] font-medium hover:text-[#C4622D] border-b border-[#3D2B1F]/5"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>

            {/* Role-Specific Actions (Mobile) */}
            {user ? (
              <div className="flex flex-col gap-2 pt-2">
                {user.role === "seller" && (
                  <>
                    <Link
                      href="/product"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#3D2B1F] bg-[#F5F0E8] border border-[#7C9E87]/40 rounded-xl hover:bg-white transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#C4622D]" />
                      <span>My Products</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#3D2B1F] bg-[#F5F0E8] border border-[#7C9E87]/40 rounded-xl hover:bg-white transition-colors"
                    >
                      <User className="w-4 h-4 text-[#C4622D]" />
                      <span>My Profile</span>
                    </Link>
                  </>
                )}

                <>
                  <Link
                    href="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#3D2B1F] bg-[#F5F0E8] border border-[#7C9E87]/40 rounded-xl hover:bg-white transition-colors"
                  >
                    <ClipboardList className="w-4 h-4 text-[#C4622D]" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    href="/reviews"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#3D2B1F] bg-[#F5F0E8] border border-[#7C9E87]/40 rounded-xl hover:bg-white transition-colors"
                  >
                    <NotebookPen className="w-4 h-4 text-[#C4622D]" />
                    <span>My Reviews</span>
                  </Link>
                </>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  title="Sign Out"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#C4622D] bg-[#C4622D]/10 rounded-xl hover:bg-[#C4622D] hover:text-white transition-colors mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              /* Guest Actions (Mobile) */
              <div className="flex gap-3 pt-4">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#C4622D] border border-[#C4622D] rounded-xl text-center"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log in</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#C4622D] text-white rounded-xl text-center"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign up</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
