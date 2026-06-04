import * as Sentry from "@sentry/nextjs";

export async function register() {
  Sentry.init({
   dsn: "https://ac7adc91e3c4eea4f96dedbd71e56e53@o4511506139381760.ingest.us.sentry.io/4511506146983936",
    tracesSampleRate: 1,
  });
}

export const onRequestError = Sentry.captureRequestError;