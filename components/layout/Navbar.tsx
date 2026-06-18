"use client";

import Image from "next/image";
import Link from "next/link";
import MobileMenu from "../MobileMenu";

type Props = {
  userEmail: string | null;
  logout: () => void;
  onOpenProfile: () => void;
  onUpgrade: () => void;
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Scan", href: "/scan" },
  { label: "Search", href: "/search" },
  { label: "Compare", href: "/compare" },
  { label: "Discover", href: "/discover" },
];

export default function Navbar({
  userEmail,
  logout,
  onOpenProfile,
  onUpgrade,
}: Props) {
  return (
    <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="PAUSTICA"
            width={44}
            height={44}
            className="object-contain"
            priority
          />

          <span className="text-xl font-black tracking-tight text-gray-900">
            PAUSTICA
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onUpgrade}
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-black text-white hover:bg-black transition"
          >
            Premium
          </button>

          {userEmail ? (
            <>
              <button
                onClick={onOpenProfile}
                className="rounded-full border border-orange-100 bg-orange-50 px-5 py-2.5 text-sm font-black text-orange-600 hover:bg-orange-100 transition"
              >
                Profile
              </button>

              <button
                onClick={logout}
                className="rounded-full px-5 py-2.5 text-sm font-black text-gray-500 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-full px-5 py-2.5 text-sm font-black text-white transition"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
              }}
            >
              Login
            </Link>
          )}
        </div>

        <div className="lg:hidden">
          <MobileMenu
            loggedIn={!!userEmail}
            onLogout={logout}
            onOpenProfile={onOpenProfile}
          />
        </div>
      </div>
    </nav>
  );
}