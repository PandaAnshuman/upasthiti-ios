"use client";

import { useEffect } from "react";

export default function RootClient() {
  useEffect(() => {
    // Block right-click
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    // Block F12 key
    const handleKeyPress = (event: any) => {
      if (event.key === "F12") {
        event.preventDefault();
        alert("F12 is disabled!");
      }
      if (
        (event.ctrlKey || event.metaKey) && // For Mac (Cmd)
        event.shiftKey &&
        event.key === "I"
      ) {
        event.preventDefault();
        alert("Inspect is disabled!");
      }

      // Block Ctrl+U (View Page Source)
      if (event.ctrlKey && event.key === "U") {
        event.preventDefault();
        alert("Viewing page source is disabled!");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Check if DevTools is open
    const checkDevTools = () => {
      const width = window.outerWidth - window.innerWidth > 100;
      const height = window.outerHeight - window.innerHeight > 100;

      if (width || height) {
        alert("Developer Tools detected!");
      }
    };

    // Store the interval ID
    const intervalId = setInterval(checkDevTools, 1000);

    // Disable text selection
    document.body.style.userSelect = "none";

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(intervalId); // Use the stored intervalId to clear the interval
      document.body.style.userSelect = "auto";
    };
  }, []);

  return null;
}
