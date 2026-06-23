import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL"
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

function createSupabaseClient() {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,

        autoRefreshToken: true,

        detectSessionInUrl: true,

        flowType: "pkce",

        storageKey: "paustica-auth",

        debug: process.env.NODE_ENV === "development",
      },

      global: {
        headers: {
          "x-client-info": "paustica-web",
        },
      },

      realtime: {
        params: {
          eventsPerSecond: 5,
        },
      },
    }
  );
}

declare global {
  
  var __pausticaSupabase:
    | SupabaseClient
    | undefined;
}

export const supabase =
  globalThis.__pausticaSupabase ??
  createSupabaseClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__pausticaSupabase =
    supabase;
}