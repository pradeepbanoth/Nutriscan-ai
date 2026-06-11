"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", data.user.id)
    .single();

  window.location.href = profile?.onboarded ? "/" : "/onboarding";

    }
  };

  checkUser();
}, []);

  const signUp = async () => {
    setLoading(true);
    setMessage("");

    if (!email.trim() || !password.trim()) {
  setMessage("Please enter both email and password.");
  setLoading(false);
  return;
}

if (password.length < 8) {
  setMessage("Password must be at least 8 characters.");
  setLoading(false);
  return;
}

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

    if (!email.trim() || !password.trim()) {
  setMessage("Please enter both email and password.");
  setLoading(false);
  return;
}

if (password.length < 8) {
  setMessage("Password must be at least 8 characters.");
  setLoading(false);
  return;
}

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

const { data: profile } = await supabase
  .from("profiles")
  .select("onboarded")
  .eq("id", data.user.id)
  .single();

window.location.href = profile?.onboarded ? "/" : "/onboarding";
    }

    setLoading(false);
  };

  const signInWithGoogle = async () => {
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
};

  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-orange-100 rounded-[32px] shadow-2xl p-8">
       <div className="flex flex-col items-center mb-4">
  <img
    src="/logo.png"
    alt="PAUSTICA"
    className="w-24 h-24 object-contain mb-3"
  />

  <h1 className="text-4xl font-black text-gray-900">
    PAUSTICA
  </h1>
</div>

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

          <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full px-5 py-4 pr-20 rounded-2xl border border-orange-100 outline-none focus:border-orange-400"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
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