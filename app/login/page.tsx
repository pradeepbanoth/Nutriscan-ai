"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit() {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError(""); setMessage(""); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("✅ Account created! Check your email to confirm, then log in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/scan";
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fff7ed" }}>
      {/* Background blob */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "#f97316" }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: "#ea580c" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
              <span className="text-white font-black text-lg">N</span>
            </div>
            <span className="font-black text-gray-900 text-2xl tracking-tight">
              NutriScan <span style={{ color: "#f97316" }}>AI</span>
            </span>
          </a>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === "login" ? "Sign in to access your scan history" : "Start scanning food for free"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border shadow-sm p-8" style={{ borderColor: "#fed7aa" }}>
          {/* Orange top strip */}
          <div className="h-1 rounded-full mb-6" style={{ background: "linear-gradient(90deg, #f97316, #ea580c)" }} />

          {/* Mode toggle */}
          <div className="flex rounded-2xl p-1 mb-6" style={{ background: "#fff7ed" }}>
            <button
              onClick={() => { setMode("login"); setError(""); setMessage(""); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={mode === "login" ? { background: "#f97316", color: "#fff" } : { color: "#9ca3af" }}
            >Sign In</button>
            <button
              onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={mode === "signup" ? { background: "#f97316", color: "#fff" } : { color: "#9ca3af" }}
            >Sign Up</button>
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 border"
                style={{ background: "#fff7ed", borderColor: "#fed7aa" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full rounded-2xl px-4 py-3 pr-12 text-gray-900 text-sm focus:outline-none border"
                  style={{ background: "#fff7ed", borderColor: "#fed7aa" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="rounded-2xl px-4 py-3 text-sm mb-4" style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-2xl px-4 py-3 text-sm mb-4" style={{ background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa" }}>
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit} disabled={loading}
            className="w-full font-bold py-3.5 rounded-2xl text-white text-sm shadow-sm transition-all disabled:opacity-50"
            style={{ background: "#f97316" }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          <a href="/" className="hover:text-gray-700 transition-colors">← Back to home</a>
        </p>
      </div>
    </main>
  );
}
