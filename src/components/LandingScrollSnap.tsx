"use client";

import { useEffect } from "react";

export function LandingScrollSnap() {
  useEffect(() => {
    document.body.classList.add("is-landing");
    return () => {
      document.body.classList.remove("is-landing");
    };
  }, []);

  return null;
}
