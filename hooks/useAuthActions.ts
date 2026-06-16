"use client";

import { supabase } from "@/app/lib/supabase";

export function useAuthActions() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return { logout };
}