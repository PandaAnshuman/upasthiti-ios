"use client";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="text-center p-6 max-w-lg border border-gray-700 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-red-500">
          Access Restricted 🚫
        </h1>
        <p className="text-lg mb-6">
          Sorry, this website is only accessible on{" "}
          <span className="text-blue-400 font-semibold">iPhone</span> devices.
        </p>
        <p className="text-sm text-gray-400">
          Please try accessing this site using a supported device.
        </p>
      </div>
    </div>
  );
};

export default page;
