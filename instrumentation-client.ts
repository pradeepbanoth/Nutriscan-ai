import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn:  "https://ac7adc91e3c4eea4f96dedbd71e56e53@o4511506139381760.ingest.us.sentry.io/4511506146983936",
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
});

export const onRouterTransitionStart =
  Sentry.captureRouterTransitionStart;