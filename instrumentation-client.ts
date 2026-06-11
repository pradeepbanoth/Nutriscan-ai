import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://ac7adc91e3c4eea4f96dedbd71e56e53@o4511506139381760.ingest.us.sentry.io/4511506146983936",

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  replaysSessionSampleRate:
    process.env.NODE_ENV === "development" ? 0.0 : 0.05,

  replaysOnErrorSampleRate: 1.0,

  sendDefaultPii: false,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],
});

export const onRouterTransitionStart =
  Sentry.captureRouterTransitionStart;