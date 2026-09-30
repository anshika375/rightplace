/**
 * Fetches the visitor's country code from our own server-side API route.
 * The route reads Vercel's x-vercel-ip-country header (or falls back to
 * api.country.is), so the check is always based on the real client IP
 * as seen by the server — not the browser.
 *
 * Returns null on any error; callers should treat null as "not in allowed country".
 */
export async function getCountryCode(): Promise<string | null> {
  try {
    const response = await fetch("/api/geo", { cache: "no-store" });
    if (!response.ok) return null;
    const data = (await response.json()) as { country?: string | null };
    if (typeof data.country === "string" && data.country.length === 2) {
      return data.country.toUpperCase();
    }
    return null;
  } catch {
    return null;
  }
}
