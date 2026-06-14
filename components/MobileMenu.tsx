"use client";

import { useState } from "react";

type MobileMenuProps = {
  loggedIn: boolean;
  onLogout: () => void;
  onOpenProfile: () => void;
};

export default function MobileMenu({
  loggedIn,
  onLogout,
  onOpenProfile,
}: MobileMenuProps) {
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

       {loggedIn ? (
  <button
    onClick={() => {
      setOpen(false);
      onOpenProfile();
    }}
    className="w-full flex items-center justify-between px-4 py-4 rounded-2xl bg-gradient-to-r from-orange-50 to-white border border-orange-100 text-left"
  >
    <div>
      <p className="font-black text-gray-900">Health Profile</p>
      
    </div>

    <span className="text-orange-500 font-black">→</span>
  </button>
) : (
  <a
    href="/auth"
    className="block px-4 py-4 rounded-2xl font-black text-orange-600 bg-orange-50 border border-orange-100"
  >
    Login to create Health Profile
  </a>
)}

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