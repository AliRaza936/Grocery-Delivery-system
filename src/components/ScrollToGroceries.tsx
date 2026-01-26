"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScrollToGroceries() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");

    if (q) {
      const section = document.getElementById("groceries-section");
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [searchParams]);

  return null;
}
