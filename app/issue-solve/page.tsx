"use client";

import { QrCode } from "lucide-react";
import React, { useState } from "react";
import QRCode from "react-qr-code";

const Page = () => {
  const [regdNum, setRegdNum] = useState("");
  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = () => {
    if (regdNum.trim() !== "") {
      setShowQR(true);
    } else {
      alert("Please enter a valid registration number.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
          <QrCode className="mr-2" />
          Generate QR Code
        </h1>
        <p className=" font-bold text-gray-700 mb-4">
          Show it to Anukampa Mam to solve your issue.
        </p>
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={regdNum}
          onChange={(e) => {
            setRegdNum(e.target.value);
            setShowQR(false); // Reset QR display on input change
          }}
          className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          onClick={handleGenerateQR}
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200"
        >
          Generate QR
        </button>
        {showQR && (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Your QR Code:
            </h2>

            <div className="inline-block p-4 bg-white rounded-lg shadow-md">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={regdNum}
                viewBox={`0 0 256 256`}
              />
              <p className="mt-4 text-sm text-gray-600">
                Registration Number: {regdNum}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
