"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function SsoCallback() {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {

    // Clerk will finish the OAuth handshake here
    handleRedirectCallback().then(() => {
        // console.log(e);
        window.location.href = "/dashboard"; 
      })
      .catch((err) => {
        console.error("OAuth error:", err);
      });
  }, [handleRedirectCallback]);

  return <p>Finishing sign-in…</p>;
}
