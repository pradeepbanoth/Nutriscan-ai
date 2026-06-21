import posthog from "posthog-js";

export function trackEvent(
  event: string,

  properties?: Record<string, unknown>
) {
  try {
    posthog.capture(event, properties);
  } catch (error) {
    console.log("Analytics error:", error);
  }
}