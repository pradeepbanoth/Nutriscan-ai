"use client";

import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

function getPasswordChecks(password: string) {
  return {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noPasswordWord: !password.toLowerCase().includes("password"),
  };
}

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const checks = useMemo(() => getPasswordChecks(password), [password]);
  const isStrongPassword = Object.values(checks).every(Boolean);

  const updatePassword = async () => {
    if (loading) return;

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      if (!isStrongPassword) {
        setMessage("Please choose a stronger password before continuing.");
        setMessageType("error");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
        return;
      }

      setMessage("Password updated successfully. Redirecting...");
      setMessageType("success");

      setTimeout(() => {
        window.location.href = "/auth";
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-orange-100 rounded-[32px] shadow-2xl p-8">
        <p className="text-center text-sm font-black uppercase tracking-wider text-orange-600 mb-3">
          Secure Account
        </p>

        <h1 className="text-4xl font-black text-gray-900 text-center mb-3">
          New Password
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Create a strong password to protect your PAUSTICA account.
        </p>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            autoComplete="new-password"
            className="w-full px-5 py-4 pr-20 rounded-2xl border border-orange-100 outline-none focus:border-orange-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") updatePassword();
            }}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-orange-50 p-4 space-y-2 text-sm font-bold">
          <PasswordCheck passed={checks.length} label="At least 12 characters" />
          <PasswordCheck passed={checks.uppercase} label="One uppercase letter" />
          <PasswordCheck passed={checks.lowercase} label="One lowercase letter" />
          <PasswordCheck passed={checks.number} label="One number" />
          <PasswordCheck passed={checks.special} label="One special character" />
          <PasswordCheck passed={checks.noPasswordWord} label="Does not contain “password”" />
        </div>

        <button
          onClick={updatePassword}
          disabled={loading || !isStrongPassword}
          className="w-full mt-5 py-4 rounded-2xl text-white font-bold bg-orange-500 hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
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

function PasswordCheck({
  passed,
  label,
}: {
  passed: boolean;
  label: string;
}) {
  return (
    <p className={passed ? "text-green-700" : "text-gray-400"}>
      {passed ? "✓" : "•"} {label}
    </p>
  );
}