"use client";

import { useEffect, useState } from "react";
import { getCountryCode } from "@/lib/location";
import { ALLOWED_COUNTRY, SECRET_LINK } from "@/lib/config";

type LocationState = "pending" | "allowed" | "denied";

export default function Home() {
  const [locationState, setLocationState] = useState<LocationState>("pending");

  useEffect(() => {
    getCountryCode().then((code) => {
      setLocationState(code === ALLOWED_COUNTRY ? "allowed" : "denied");
    });
  }, []);

  return (
    <div className="outer">
      <div className="inner">
        <h1 className="heading">You are here.</h1>
        <p
          className={`message ${locationState === "pending" ? "invisible" : "visible"}`}
          aria-live="polite"
        >
          {locationState === "allowed"
            ? "You are where you are supposed to be."
            : "You are not where you are supposed to be."}
        </p>

        {locationState === "allowed" && (
          <a
            href={SECRET_LINK}
            className="secret-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Enter →
          </a>
        )}
      </div>
    </div>
  );
}
