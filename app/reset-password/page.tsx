"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const RESET_COOLDOWN_MS = 60 * 1000;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const [lastResetAt, setLastResetAt] = useState(0);

  const sendResetEmail = async () => {
    if (loading) return;

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        setMessage("Please enter your email address.");
        setMessageType("error");
        return;
      }

      if (!isValidEmail(cleanEmail)) {
        setMessage("Please enter a valid email address.");
        setMessageType("error");
        return;
      }

      const now = Date.now();

      if (now - lastResetAt < RESET_COOLDOWN_MS) {
        setMessage("Please wait a minute before requesting another reset link.");
        setMessageType("error");
        return;
      }

      setLastResetAt(now);

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
        return;
      }

      setMessage("If an account exists, a reset link has been sent.");
      setMessageType("success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-orange-100 rounded-[32px] shadow-2xl p-8">
        <p className="text-center text-sm font-black uppercase tracking-wider text-orange-600 mb-3">
          Account Recovery
        </p>

        <h1 className="text-4xl font-black text-gray-900 text-center mb-3">
          Reset Password
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Enter your email and we’ll send a secure password reset link.
        </p>

        <input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          className="w-full px-5 py-4 rounded-2xl border border-orange-100 outline-none focus:border-orange-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendResetEmail();
          }}
        />

        <button
          onClick={sendResetEmail}
          disabled={loading || !email.trim()}
          className="w-full mt-4 py-4 rounded-2xl text-white font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p
            className={`mt-6 text-center text-sm font-bold ${
              messageType === "error" ? "text-red-600" : "text-green-700"
            }`}
          >
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