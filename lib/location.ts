/**
 * Fetches the visitor's country code via IP-based geolocation.
 * Uses api.country.is — returns only { ip, country }, no other PII.
 *
 * Returns null on any error; callers should treat null as "not in allowed country".
 */
export async function getCountryCode(): Promise<string | null> {
  try {
    const response = await fetch("https://api.country.is/", {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { ip?: string; country?: string };

    if (typeof data.country === "string" && data.country.length === 2) {
      return data.country.toUpperCase();
    }

    return null;
  } catch {
    return null;
  }
}
