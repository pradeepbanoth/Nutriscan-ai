import posthog from "posthog-js";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
 posthog.init(
  process.env.NEXT_PUBLIC_POSTHOG_KEY!,
  {
    api_host: "https://us.i.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    debug: true,
  }
);
}

export default posthog;