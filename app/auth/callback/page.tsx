"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Preparing your PAUSTICA account...");
  const [error, setError] = useState("");
  const handledRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (handledRef.current) return;
      handledRef.current = true;

      try {
        setMessage("Verifying your session...");

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          setError("Session not found. Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/auth";
          }, 1200);
          return;
        }

        setMessage("Checking your profile...");

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("onboarded")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        setMessage("Redirecting...");

        window.location.replace(profile?.onboarded ? "/" : "/onboarding");
      } catch (err) {
        console.error("Auth callback failed:", err);
        setError("Something went wrong. Redirecting to login...");

        setTimeout(() => {
          window.location.href = "/auth";
        }, 1200);
      }
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

        <p className={error ? "text-red-500 font-bold" : "text-gray-500"}>
          {error || message}
        </p>
      </div>
    </main>
  );
}