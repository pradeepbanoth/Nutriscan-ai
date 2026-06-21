"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updatePassword = async () => {
    setLoading(true);
    setMessage("");

    function validatePassword(password: string) {
  const hasUppercase = /[A-Z]/.test(password);

  const hasLowercase = /[a-z]/.test(password);

  const hasNumber = /\d/.test(password);

  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= 12 &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial
  );
}

    if (!validatePassword(password)) {
  setMessage(
    "Use at least 12 characters, including uppercase, lowercase, number and special character."
  );

  setLoading(false);

  return;
}


if (password.toLowerCase().includes("password")) {
  setMessage("Choose a stronger password.");

  setLoading(false);

  return;
}

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-orange-100 rounded-[32px] shadow-2xl p-8">
        <h1 className="text-4xl font-black text-gray-900 text-center mb-3">
          New Password
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Enter your new password below.
        </p>

       <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="New password"
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
          onClick={updatePassword}
          disabled={loading}
          className="w-full mt-4 py-4 rounded-2xl text-white font-bold bg-orange-500 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className="mt-6 text-center text-sm text-gray-600">
            {message}
          </p>
        )}

        <a
          href="/auth"
          className="block text-center mt-8 text-sm font-bold text-orange-600"
        >
          Back to Login
        </a>
      </div>
    </main>
  );
}