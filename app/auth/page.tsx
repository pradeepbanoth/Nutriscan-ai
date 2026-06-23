"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  clearReferralCode,
  getReferralCode,
  saveReferralCode,
} from "@/lib/referralStorage";

const MAX_AUTH_ATTEMPTS = 5;
const AUTH_COOLDOWN_MS = 5 * 60 * 1000;

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authAttempts, setAuthAttempts] = useState(0);
  const [lastAuthAttemptAt, setLastAuthAttemptAt] = useState(0);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");

    if (ref) {
      saveReferralCode(ref);
    }

    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarded")
        .eq("id", data.user.id)
        .maybeSingle();

      window.location.replace(profile?.onboarded ? "/" : "/onboarding");
    };

    checkUser();
  }, []);

  function canAttemptAuth() {
    const now = Date.now();

    if (
      authAttempts >= MAX_AUTH_ATTEMPTS &&
      now - lastAuthAttemptAt < AUTH_COOLDOWN_MS
    ) {
      setMessage("Too many attempts. Please wait 5 minutes and try again.");
      return false;
    }

    if (now - lastAuthAttemptAt >= AUTH_COOLDOWN_MS) {
      setAuthAttempts(1);
    } else {
      setAuthAttempts((count) => count + 1);
    }

    setLastAuthAttemptAt(now);
    return true;
  }

  async function completeReferral() {
    const referralCode = getReferralCode();

    if (!referralCode) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    await fetch("/api/referrals/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ referralCode }),
    });

    clearReferralCode();
  }

  function validateForm() {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password.trim()) {
      setMessage("Please enter both email and password.");
      return false;
    }

    if (!cleanEmail.includes("@")) {
      setMessage("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return false;
    }

    return true;
  }

  async function redirectAfterAuth(userId: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", userId)
      .maybeSingle();

    window.location.replace(profile?.onboarded ? "/" : "/onboarding");
  }

  async function signUp() {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      if (!canAttemptAuth()) return;
      if (!validateForm()) return;

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "Account created. Please check your email and verify your account before logging in."
      );
    } finally {
      setLoading(false);
    }
  }

  async function signIn() {
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      if (!canAttemptAuth()) return;
      if (!validateForm()) return;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data.user?.email_confirmed_at) {
        await supabase.auth.signOut();
        setMessage("Please verify your email before logging in.");
        return;
      }

      await completeReferral();
      await redirectAfterAuth(data.user.id);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    if (loading) return;

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-orange-100 rounded-3xl shadow-sm p-8">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/logo.png"
            alt="PAUSTICA"
            width={96}
            height={96}
            className="mb-3 object-contain"
            priority
          />

          <h1 className="text-4xl font-black text-gray-900">PAUSTICA</h1>
        </div>

        <p className="text-gray-500 text-center mb-8">
          Login or create your account
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className="w-full px-5 py-4 rounded-2xl border border-orange-100 outline-none focus:border-orange-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full px-5 py-4 pr-20 rounded-2xl border border-orange-100 outline-none focus:border-orange-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-gray-800 bg-white border border-orange-100 shadow-sm hover:bg-orange-50 disabled:opacity-60"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-orange-100" />
            <span className="text-xs font-bold text-gray-400">OR</span>
            <div className="h-px flex-1 bg-orange-100" />
          </div>

          <button
            onClick={signIn}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          <button
            onClick={signUp}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-orange-600 bg-orange-50 border border-orange-100 disabled:opacity-60"
          >
            Create Account
          </button>

          <a
            href="/reset-password"
            className="block text-center text-sm font-bold text-orange-600"
          >
            Forgot Password?
          </a>
        </div>

        {message && (
          <p className="mt-6 text-center text-sm text-gray-600">{message}</p>
        )}

        <a
          href="/"
          className="block text-center mt-8 text-sm font-bold text-orange-600"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}