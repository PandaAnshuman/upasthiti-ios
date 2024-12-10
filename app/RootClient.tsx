"use client";

import { useEffect } from "react";

export default function RootClient() {
  useEffect(() => {
    // Block right-click
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    // Block F12 key
    const blockKeyCombinations = (event: KeyboardEvent) => {
      if (
        event.key === "F12" || // Block F12
        ((event.ctrlKey || event.metaKey) && event.key === "U") || // Block Ctrl+U
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "I") || // Block Ctrl+Shift+I
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "J") || // Block Ctrl+Shift+J
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "C") ||
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          event.key === "c") ||
        ((event.ctrlKey || event.metaKey) && event.key === "S") // Block Ctrl+S
      ) {
        event.preventDefault();
        
      }
    };
    window.addEventListener("keydown", blockKeyCombinations);

    // Check if DevTools is open
    // const checkDevTools = () => {
    //   const width = window.outerWidth - window.innerWidth > 100;
    //   const height = window.outerHeight - window.innerHeight > 100;

    //   if (width || height) {
    //     alert("Developer Tools detected!");
    //   }
    // };

    // Store the interval ID
    // const intervalId = setInterval(checkDevTools, 1000);

    // Disable text selection
    document.body.style.userSelect = "none";

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", blockKeyCombinations);
      // clearInterval(intervalId); // Use the stored intervalId to clear the interval
      document.body.style.userSelect = "auto";
    };
  }, []);

  return null;
}
