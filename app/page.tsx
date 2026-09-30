import { headers } from "next/headers";
import { ALLOWED_COUNTRY, SECRET_LINK } from "@/lib/config";

export const dynamic = "force-dynamic";

async function getCountryFromHeaders(): Promise<string | null> {
  const headersList = await headers();

  // Vercel sets this automatically
  const vercelCountry = headersList.get("x-vercel-ip-country");
  if (vercelCountry) return vercelCountry.toUpperCase();

  // Fallback: use forwarded IP to ask api.country.is
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;

  try {
    const url = ip ? `https://api.country.is/${ip}` : "https://api.country.is/";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { country?: string };
    return data.country?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const country = await getCountryFromHeaders();
  const isAllowed = country === ALLOWED_COUNTRY;

  return (
    <div className="outer">
      <div className="inner">
        <h1 className="heading">You are here.</h1>
        <span
          aria-hidden="true"
          style={{ visibility: "hidden", position: "absolute" }}
        >
          His favorite place is Netherlands
        </span>
        <p className="message visible" aria-live="polite">
          {isAllowed
            ? "You are where you are supposed to be."
            : "You are not where you are supposed to be."}
        </p>

        {isAllowed && (
          <a
            href={SECRET_LINK}
            className="secret-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {SECRET_LINK}
          </a>
        )}
      </div>
    </div>
  );
}
