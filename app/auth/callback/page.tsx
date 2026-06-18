"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Preparing your PAUSTICA account...");

  useEffect(() => {
    const handleCallback = async () => {
      setMessage("Verifying your session...");

      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setMessage("Session not found. Redirecting to login...");
        window.location.href = "/auth";
        return;
      }

      setMessage("Checking your profile...");

     const { data: profile } = await supabase
  .from("profiles")
  .select("onboarded")
  .eq("id", data.user.id)
  .maybeSingle();

if (!profile) {
  window.location.href = "/onboarding";
  return;
}

      setMessage("Redirecting...");

window.location.href = profile.onboarded ? "/" : "/onboarding";
    };

    handleCallback();
  }, []);

  return (
    <main className="min-h-screen bg-[#fff7ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-orange-100 rounded-3xl shadow-sm p-8 text-center">
        <Image
  src="/logo.png"
  alt="PAUSTICA"
  width={80}
  height={80}
  className="mx-auto mb-5 object-contain"
  priority
/>

        <h1 className="text-4xl font-black text-gray-900 mb-4">
          One moment
        </h1>

        <p className="text-gray-500">{message}</p>
      </div>
    </main>
  );
}