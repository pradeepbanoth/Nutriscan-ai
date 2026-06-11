"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [healthGoal, setHealthGoal] = useState("");
const [dietType, setDietType] = useState("");
const [age, setAge] = useState("");
const [height, setHeight] = useState("");
const [weight, setWeight] = useState("");
const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/auth";
        return;
      }

      setEmail(data.user.email || "");

      const { data: profile } = await supabase
  .from("profiles")
  .select("health_goal, diet_type, age, height, weight")
  .eq("id", data.user.id)
  .single();

if (profile) {
  setHealthGoal(profile.health_goal || "");
  setDietType(profile.diet_type || "");
  setAge(profile.age ? String(profile.age) : "");
  setHeight(profile.height ? String(profile.height) : "");
  setWeight(profile.weight ? String(profile.weight) : "");
}

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

  const saveProfile = async () => {
  setSaving(true);

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    window.location.href = "/auth";
    return;
  }

  await supabase.from("profiles").upsert({
    id: data.user.id,
    health_goal: healthGoal,
    diet_type: dietType,
    age: age ? Number(age) : null,
    height: height ? Number(height) : null,
    weight: weight ? Number(weight) : null,
    onboarded: true,
  });

  setSaving(false);
};

const deleteAccount = async () => {
  const typed = window.prompt(
    "This permanently deletes your account and all PAUSTICA data. Type DELETE to confirm."
  );

  if (typed !== "DELETE") {
    alert("Account deletion cancelled.");
    return;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/auth";
    return;
  }

  const res = await fetch("/api/account/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    alert("Failed to delete account. Please try again.");
    return;
  }

  await supabase.auth.signOut();
  alert("Your account has been permanently deleted.");
  window.location.href = "/";
};

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

          <div className="mt-8 bg-orange-50 border border-orange-100 rounded-3xl p-6">
  <h3 className="text-2xl font-black text-gray-900 mb-5">
    Health Preferences
  </h3>

  <div className="grid md:grid-cols-2 gap-4">
    <input
      value={dietType}
      onChange={(e) => setDietType(e.target.value)}
      placeholder="Diet type"
      className="px-5 py-4 rounded-2xl border border-orange-100 outline-none"
    />

    <input
      value={healthGoal}
      onChange={(e) => setHealthGoal(e.target.value)}
      placeholder="Health goal"
      className="px-5 py-4 rounded-2xl border border-orange-100 outline-none"
    />

    <input
      type="number"
      value={age}
      onChange={(e) => setAge(e.target.value)}
      placeholder="Age"
      className="px-5 py-4 rounded-2xl border border-orange-100 outline-none"
    />

    <input
      type="number"
      value={height}
      onChange={(e) => setHeight(e.target.value)}
      placeholder="Height in cm"
      className="px-5 py-4 rounded-2xl border border-orange-100 outline-none"
    />

    <input
      type="number"
      value={weight}
      onChange={(e) => setWeight(e.target.value)}
      placeholder="Weight in kg"
      className="px-5 py-4 rounded-2xl border border-orange-100 outline-none"
    />
  </div>

  <button
    onClick={saveProfile}
    disabled={saving}
    className="mt-5 w-full py-4 rounded-2xl bg-orange-500 text-white font-bold disabled:opacity-60"
  >
    {saving ? "Saving..." : "Save Health Preferences"}
  </button>
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

            <button
  onClick={deleteAccount}
  className="flex-1 py-4 rounded-2xl bg-red-600 text-white border border-red-600 font-bold"
>
  Delete Account
</button>
          </div>
        </div>
      </div>
    </main>
  );
}