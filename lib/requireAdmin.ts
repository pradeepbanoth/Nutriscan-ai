import { supabaseAdmin } from "./supabaseAdmin";

export async function requireAdmin() {
  if (!supabaseAdmin) {
    throw new Error(
      "Admin client unavailable."
    );
  }

  return supabaseAdmin;
}