import {
  createClient,
  SupabaseClient,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const serviceRoleKey =process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is missing."
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is missing."
  );
}

declare global {
  var __pausticaSupabaseAdmin:
    | SupabaseClient
    | undefined;
}

function createAdminClient() {
  return createClient(
    supabaseUrl,
    serviceRoleKey,

    {
      auth: {
        autoRefreshToken: false,

        persistSession: false,

        detectSessionInUrl: false,
      },

      global: {
        headers: {
          "X-Client-Info": "PAUSTICA-admin",
        },
      },

      db: {
        schema: "public",
      },

      realtime: {
        params: {
          eventsPerSecond: 2,
        },
      },
    }
  );
}

/*
 Prevent duplicate clients during Next.js hot reload
*/

export const supabaseAdmin =
  global.__pausticaSupabaseAdmin ??
  createAdminClient();

if (process.env.NODE_ENV !== "production") {
  global.__pausticaSupabaseAdmin =
    supabaseAdmin;
}