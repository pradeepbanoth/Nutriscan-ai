import posthog from "posthog-js";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    debug: false,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") {
        posthog.opt_out_capturing();
      }
    },
  });
}