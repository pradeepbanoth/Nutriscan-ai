"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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

    const { error } = await supabase.from("profiles").upsert({
      id: data.user.id,
      health_goal: healthGoal,
      diet_type: dietType,
      age: age ? Number(age) : null,
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null,
      onboarded: true,
    });

    setSaving(false);

    if (error) {
      alert("Could not save profile. Please try again.");
      return;
    }

    alert("Profile updated.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const deleteAccount = async () => {
    const typed = window.prompt(
      "This permanently deletes your account and all PAUSTICA data. Type DELETE to confirm."
    );

    if (typed !== "DELETE") return;

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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff7ed] px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="font-black text-gray-900">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7ed]">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-black text-gray-900">
            PAUSTICA
          </Link>

          <Link
            href="/scan"
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-black text-white"
          >
            Scan Food
          </Link>
        </div>

        <div className="mb-12">
          <p className="text-sm font-black uppercase tracking-wider text-orange-600">
            Profile
          </p>

          <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-6xl">
            Your health dashboard
          </h1>

          <p className="mt-5 text-lg text-gray-500">{email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <StatCard label="Total scans" value={scanCount} />
          <StatCard label="Favorites" value={favoriteCount} />
        </div>

        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-black text-gray-900">
            Health preferences
          </h2>

          <p className="mt-3 text-gray-500">
            PAUSTICA uses this to personalize scores and warnings.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              placeholder="Diet type"
              className="rounded-2xl border border-gray-100 bg-orange-50/50 px-5 py-4 font-bold outline-none focus:border-orange-300 focus:bg-white"
            />

            <input
              value={healthGoal}
              onChange={(e) => setHealthGoal(e.target.value)}
              placeholder="Health goal"
              className="rounded-2xl border border-gray-100 bg-orange-50/50 px-5 py-4 font-bold outline-none focus:border-orange-300 focus:bg-white"
            />

            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              className="rounded-2xl border border-gray-100 bg-orange-50/50 px-5 py-4 font-bold outline-none focus:border-orange-300 focus:bg-white"
            />

            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Height in cm"
              className="rounded-2xl border border-gray-100 bg-orange-50/50 px-5 py-4 font-bold outline-none focus:border-orange-300 focus:bg-white"
            />

            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight in kg"
              className="rounded-2xl border border-gray-100 bg-orange-50/50 px-5 py-4 font-bold outline-none focus:border-orange-300 focus:bg-white"
            />
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="mt-6 w-full rounded-2xl bg-orange-500 py-4 font-black text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/history"
            className="rounded-2xl bg-white py-4 text-center font-black text-gray-900 shadow-sm"
          >
            View History
          </Link>

          <button
            onClick={logout}
            className="rounded-2xl border border-red-100 bg-red-50 py-4 font-black text-red-600"
          >
            Logout
          </button>

          <button
            onClick={deleteAccount}
            className="rounded-2xl bg-red-600 py-4 font-black text-white"
          >
            Delete Account
          </button>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <p className="text-sm font-black uppercase tracking-wider text-orange-600">
        {label}
      </p>

      <h2 className="mt-4 text-5xl font-black text-gray-900">{value}</h2>
    </div>
  );
}