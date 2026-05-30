"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendResetEmail = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset link sent. Check your email.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-orange-100 rounded-[32px] shadow-2xl p-8">
        <h1 className="text-4xl font-black text-gray-900 text-center mb-3">
          Reset Password
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Enter your email and we’ll send a password reset link.
        </p>

        <input
          type="email"
          placeholder="Email address"
          className="w-full px-5 py-4 rounded-2xl border border-orange-100 outline-none focus:border-orange-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendResetEmail}
          disabled={loading}
          className="w-full mt-4 py-4 rounded-2xl text-white font-bold bg-orange-500 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
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