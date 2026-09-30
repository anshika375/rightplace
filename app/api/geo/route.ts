import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  // Vercel automatically sets this header — most reliable, no extra fetch needed.
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return NextResponse.json({ country: vercelCountry.toUpperCase() });
  }

  // Fallback: read the forwarded IP and ask api.country.is
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;

  try {
    const url = ip
      ? `https://api.country.is/${ip}`
      : "https://api.country.is/";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ country: null });
    const data = (await res.json()) as { country?: string };
    return NextResponse.json({ country: data.country?.toUpperCase() ?? null });
  } catch {
    return NextResponse.json({ country: null });
  }
}
