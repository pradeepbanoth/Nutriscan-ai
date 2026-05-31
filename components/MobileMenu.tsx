"use client";

import { useState } from "react";

type MobileMenuProps = {
  loggedIn: boolean;
  onLogout: () => void;
};

export default function MobileMenu({ loggedIn, onLogout }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full px-4 py-3 bg-orange-500 text-white font-black shadow-lg"
      >
        ☰
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-orange-100 rounded-3xl shadow-2xl p-4 z-50">
          <div className="space-y-2">
            <a className="block px-4 py-3 rounded-2xl font-bold text-gray-800 hover:bg-orange-50" href="/">
              Home Scanner
            </a>

            <a className="block px-4 py-3 rounded-2xl font-bold text-gray-800 hover:bg-orange-50" href="/dashboard">
              Dashboard
            </a>

            <a className="block px-4 py-3 rounded-2xl font-bold text-gray-800 hover:bg-orange-50" href="/menu">
              Menu
            </a>

            <a className="block px-4 py-3 rounded-2xl font-bold text-gray-800 hover:bg-orange-50" href="/pricing">
              Pricing
            </a>

            {loggedIn ? (
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded-2xl font-bold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            ) : (
              <a className="block px-4 py-3 rounded-2xl font-bold text-orange-600 hover:bg-orange-50" href="/auth">
                Login
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}