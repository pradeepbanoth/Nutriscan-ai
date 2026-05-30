"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/auth";
        return;
      }

      setEmail(data.user.email || "");

      const { count: scans } = await supabase
        .from("scan_history")
        .select("*", { count: "exact", head: true })
        .eq("user_id", data.user.id);

      const { count: favorites } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", data.user.id);

      setScanCount(scans || 0);
      setFavoriteCount(favorites || 0);
    };

    loadProfile();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-black text-gray-900">
            PAUSTICA<span className="text-orange-500">AI</span>
          </h1>

          <a
            href="/"
            className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-bold"
          >
            Home
          </a>
        </nav>

        <div className="bg-white border border-orange-100 rounded-[36px] shadow-2xl p-8">
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Your Profile
          </h2>

          <p className="text-gray-500 mb-8">{email}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
              <p className="text-gray-500 font-semibold mb-2">
                Total Scans
              </p>

              <h3 className="text-5xl font-black text-orange-600">
                {scanCount}
              </h3>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
              <p className="text-gray-500 font-semibold mb-2">
                Favorites
              </p>

              <h3 className="text-5xl font-black text-orange-600">
                {favoriteCount}
              </h3>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <a
              href="/"
              className="flex-1 text-center py-4 rounded-2xl bg-orange-500 text-white font-bold"
            >
              Scan More Products
            </a>

            <button
              onClick={logout}
              className="flex-1 py-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}