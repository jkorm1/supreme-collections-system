"use client";

import { useEffect } from "react";

export function GoogleSheetsInit() {
  useEffect(() => {
    // Initialize Google Sheets by calling the API route
    fetch("/api/init-sheets")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.message);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Failed to initialize Google Sheets:", error);
      });
  }, []);

  return null; // This component doesn't render anything
}
