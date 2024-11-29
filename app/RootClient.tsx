"use client";

import { useEffect } from "react";

export default function RootClient() {
  useEffect(() => {
    console.log("Outside useEffect");

    if (window) {
      console.log("window object exists");
      console.log(window.innerWidth);
      window.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    }
  }, []);

  return null;
}
