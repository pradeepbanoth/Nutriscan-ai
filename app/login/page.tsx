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
    setError("");
    setMessage("");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0f0a] text-white flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ff87] opacity-[0.04] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#00c853] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,135,0.4)]">
              <span className="text-black font-black text-sm">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              Nutri<span className="text-[#00ff87]">Scan</span> AI
            </span>
          </a>
          <h1 className="text-3xl font-black tracking-tighter mb-2">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-white/40 text-sm">
            {mode === "login"
              ? "Sign in to access your scan history"
              : "Start scanning food for free"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-8">
          {/* Mode toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); setMessage(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "login" ? "bg-[#00ff87] text-black" : "text-white/40 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "signup" ? "bg-[#00ff87] text-black" : "text-white/40 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff87]/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                Password
              </label>
             <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
    placeholder="••••••••"
    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff87]/50 transition-all text-sm"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors text-lg"
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

          {/* Error / Success messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-[#00ff87]/10 border border-[#00ff87]/20 rounded-xl px-4 py-3 text-[#00ff87] text-sm mb-4">
              {message}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#00ff87] text-black font-bold py-3 rounded-xl hover:bg-[#69ff47] transition-all disabled:opacity-50 text-sm"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In →"
              : "Create Account →"}
          </button>
        </div>

        {/* Back to home */}
        <p className="text-center text-white/20 text-sm mt-6">
          <a href="/" className="hover:text-white/60 transition-colors">
            ← Back to home
          </a>
        </p>
      </div>
    </main>
  );
}
