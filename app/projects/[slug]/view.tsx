"use client";

import { useEffect } from "react";

export function ReportView({ slug }: { slug: string }) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch("/api/views", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });
      } catch (error) {
        console.error("Failed to track page view", error);
      }
    };

    trackView();
  }, [slug]);

  return null;
}
