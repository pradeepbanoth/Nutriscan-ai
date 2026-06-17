"use client";

import Image from "next/image";
import MobileMenu from "../MobileMenu";

type Props = {
  userEmail: string | null;
  logout: () => void;
  onOpenProfile: () => void;
  onUpgrade: () => void;
};

export default function Navbar({
  userEmail,
  logout,
  onOpenProfile,
  onUpgrade,
}: Props) {
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
        src="/logo.png"
        alt="PAUSTICA"
        width={48}
        height={48}
        className="object-contain"
      />
      
            <span className="text-xl font-black tracking-tight text-[#0f172a]">
              PAUSTICA
            </span>
          </div>
      
          <MobileMenu
        loggedIn={!!userEmail}
        onLogout={logout}
        onOpenProfile={onOpenProfile}
      />
      
          <div className="hidden md:flex items-center gap-3">
            {userEmail ? (
              <>
                <a
                  href="/dashboard"
                  className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
                >
                  Dashboard
                </a>
                <button
        onClick={onUpgrade}
        className="rounded-full px-5 py-3 text-sm font-bold text-white bg-gray-900"
      >
        Upgrade
      </button>
      
                <a
                  href="/menu"
                  className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
                >
                  Menu
                </a>
      
                <button
                  onClick={logout}
                  className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                  }}
                >
                  Logout
                </button>
      
               
              </>
            ) : (
              <>
                <a
                  href="/menu"
                  className="rounded-full px-5 py-3 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100"
                >
                  Menu
                </a>
                <button
        onClick={onUpgrade}
        className="rounded-full px-5 py-3 text-sm font-bold text-white bg-gray-900"
      >
        Upgrade
      </button>
      
                <a
                  href="/auth"
                  className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                  }}
                >
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}