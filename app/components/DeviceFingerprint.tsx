"use client";
import React, { useEffect } from "react";
import * as FingerprintJS from "@fingerprintjs/fingerprintjs";

interface DeviceFingerprintProps {
  onVisitorIdCaptured: (visitorId: string) => void;
}

const DeviceFingerprint: React.FC<DeviceFingerprintProps> = ({
  onVisitorIdCaptured,
}) => {
  useEffect(() => {
    const getVisitorId = async () => {
      try {
        // Load the FingerprintJS agent
        const fp = await FingerprintJS.load();

        // Get the visitor ID
        const result = await fp.get();

        // Pass the visitor ID to the parent component
        onVisitorIdCaptured(result.visitorId);
      } catch (error) {
        console.error("Error getting visitor ID:", error);
      }
    };

    // Ensure this runs only on the client side
    if (typeof window !== "undefined") {
      getVisitorId();
    }
  }, [onVisitorIdCaptured]);

  return null; // This component does not render anything
};

export default DeviceFingerprint;
