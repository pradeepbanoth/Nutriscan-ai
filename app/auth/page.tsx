"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const signUp = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Account created. Please check your email and verify your account before logging in."
      );
    }

    setLoading(false);
  };

  const signIn = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else if (!data.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      setMessage("Please verify your email before logging in.");
    } else {
      setMessage("Login successful.");
      window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-orange-100 rounded-[32px] shadow-2xl p-8">
        <h1 className="text-4xl font-black text-gray-900 text-center mb-3">
          PAUSTICA AI
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login or create your account
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-5 py-4 rounded-2xl border border-orange-100 outline-none focus:border-orange-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-4 rounded-2xl border border-orange-100 outline-none focus:border-orange-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={signIn}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-bold bg-orange-500 disabled:opacity-60"
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
          <p className="mt-6 text-center text-sm text-gray-600">
            {message}
          </p>
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