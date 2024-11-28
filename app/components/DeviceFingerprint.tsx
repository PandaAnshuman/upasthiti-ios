"use client";
import React, { useState, useEffect } from "react";
import * as FingerprintJS from "@fingerprintjs/fingerprintjs";

interface DeviceInfo {
  visitorId?: string;
  userAgent?: string;
  os?: string;
  osVersion?: string;
  browserName?: string;
  browserVersion?: string;
  screenResolution?: string;
  language?: string;
  timezone?: string;
  touchSupport?: boolean;
  platform?: string;
  screenWidth?: number;
  screenHeight?: number;
  colorDepth?: number;
  hardwareConcurrency?: number;
}

const DeviceFingerprint: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({});

  useEffect(() => {
    const getDeviceFingerprint = async () => {
      try {
        // Load the Fingerprintjs agent
        const fp = await FingerprintJS.load();

        // Get the visitor ID
        const result = await fp.get();

        // Gather additional device information
        const info: DeviceInfo = {
          visitorId: result.visitorId,
          userAgent: navigator.userAgent,
          os: detectOS(),
          osVersion: detectOSVersion(),
          browserName: detectBrowser(),
          browserVersion: detectBrowserVersion(),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          touchSupport:
            "ontouchstart" in window || navigator.maxTouchPoints > 0,
          platform: navigator.platform,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          colorDepth: window.screen.colorDepth,
          hardwareConcurrency: navigator.hardwareConcurrency,
        };

        setDeviceInfo(info);
      } catch (error) {
        console.error("Error getting device fingerprint:", error);
      }
    };

    // Ensure this runs only on client-side
    if (typeof window !== "undefined") {
      getDeviceFingerprint();
    }
  }, []);

  // OS Detection Helper
  const detectOS = (): string => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("win")) return "Windows";
    if (ua.includes("mac")) return "macOS";
    if (ua.includes("linux")) return "Linux";
    if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";
    if (ua.includes("android")) return "Android";
    return "Unknown";
  };

  // OS Version Detection Helper
  const detectOSVersion = (): string => {
    const ua = navigator.userAgent;

    // iOS Version Detection
    const iOSMatch = ua.match(/(iPhone|iPad); CPU (iPhone )?OS ([\d_]+)/);
    if (iOSMatch) return iOSMatch[3].replace(/_/g, ".");

    // Android Version Detection
    const androidMatch = ua.match(/Android (\d+([.]\d+)*)/);
    if (androidMatch) return androidMatch[1];

    // Windows Version Detection
    const windowsMatch = ua.match(/Windows NT ([\d.]+)/);
    if (windowsMatch) return windowsMatch[1];

    return "Unknown";
  };

  // Browser Detection Helper
  const detectBrowser = (): string => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("chrome")) return "Chrome";
    if (ua.includes("firefox")) return "Firefox";
    if (ua.includes("safari")) return "Safari";
    if (ua.includes("opera")) return "Opera";
    if (ua.includes("edge")) return "Edge";
    if (ua.includes("trident")) return "Internet Explorer";
    return "Unknown";
  };

  // Browser Version Detection Helper
  const detectBrowserVersion = (): string => {
    const ua = navigator.userAgent;
    const browserVersionMap: { [key: string]: RegExp } = {
      Chrome: /Chrome\/([0-9.]+)/,
      Firefox: /Firefox\/([0-9.]+)/,
      Safari: /Version\/([0-9.]+)/,
      Edge: /Edge\/([0-9.]+)/,
      Opera: /OPR\/([0-9.]+)/,
      "Internet Explorer": /MSIE ([0-9.]+)/,
    };

    const browser = detectBrowser();
    const match = ua.match(browserVersionMap[browser] || /([0-9.]+)/);

    return match ? match[1] : "Unknown";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Device Fingerprint Details
      </h1>
      {Object.entries(deviceInfo).map(([key, value]) => (
        <div key={key} className="mb-4 p-3 bg-gray-100 rounded">
          <span className="font-semibold text-gray-700 mr-2 capitalize">
            {key.replace(/([A-Z])/g, " $1")}:
          </span>
          <span className="text-gray-900">
            {typeof value === "boolean"
              ? value
                ? "Yes"
                : "No"
              : value || "N/A"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DeviceFingerprint;
