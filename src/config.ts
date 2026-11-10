// Values that vary per deployment come from VITE_ variables (.env.local locally, the host's
// environment variables in production). They ship in the browser bundle, so never put a
// secret here. Every one is optional.
import { formatPhone } from "./demo/format";

const env = import.meta.env;

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

const bookingUrl = clean(env.VITE_BOOKING_URL);
const signupUrl = clean(env.VITE_SIGNUP_URL);
const phone = clean(env.VITE_AGENCY_PHONE);

export type PrimaryCta =
  | { kind: "link"; href: string; label: string; short: string; external: boolean }
  | { kind: "receptionist"; label: string; short: string };

/** Main call to action: a meeting link, then a sign-up link, then a phone call, then the demo itself. */
function primaryCta(): PrimaryCta {
  if (bookingUrl) return { kind: "link", href: bookingUrl, label: "Book a 15-minute meeting", short: "Book a meeting", external: true };
  if (signupUrl) return { kind: "link", href: signupUrl, label: "Set up my receptionist", short: "Get started", external: true };
  if (phone) return { kind: "link", href: `tel:${phone}`, label: `Call ${formatPhone(phone)}`, short: "Call us", external: false };
  return { kind: "receptionist", label: "Hear your future receptionist", short: "Try it now" };
}

export const site = {
  name: "HelloRoster AI",
  serviceArea: clean(env.VITE_SERVICE_AREA) || "Los Angeles",
  /** The agency's own line, E.164. Empty hides click-to-call. */
  phone,
  primaryCta: primaryCta(),
};

export { formatPhone };
