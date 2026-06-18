"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

let posthogInitialized = false;

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (!token || posthogInitialized) return;

    posthogInitialized = true;

    posthog.init(token, {
      api_host: host,

      capture_pageview: true,
      capture_pageleave: false,
      autocapture: false,

      disable_session_recording: true,
      disable_surveys: true,

      advanced_disable_flags: true,

      persistence: "localStorage",
      person_profiles: "identified_only",

      on_request_error: () => {
        return;
      },
    });
  }, []);

  return <>{children}</>;
}