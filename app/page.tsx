"use client";
import type { NextPage } from "next";
import Head from "next/head";
import { ScanQrCode, QrCode, BellRing, Info } from "lucide-react";
import TeamProfile from "./components/AboutUS/page";
import { useState } from "react";

const Home: NextPage = () => {
  const [isTeamProfileOpen, setIsTeamProfileOpen] = useState(false); // Modal state
  return (
    <div className="min-h-screen bg-gray-50 py-12 flex flex-col items-center justify-start">
      <Head>
        <title>Attendance App</title>
        <meta name="description" content="Attendance App UI" />
      </Head>

      <div className="w-full max-w-xl px-6 mb-8">
        <div className="text-left text-black font-semibold">
          <h1 className="text-2xl md:text-3xl lg:text-4xl">
            Welcome, <span className="text-blue-600">ANSHUMAN</span> 👋
          </h1>
        </div>
      </div>

      <div className="w-full max-w-xl space-y-4 px-6">
        <button className="flex w-full items-center p-5 bg-yellow-400 text-black rounded-2xl shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400">
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Scan QR</h2>
            <p className="text-base">Open It For Attendance</p>
          </div>
          <div>
            <ScanQrCode size={48} />
          </div>
        </button>

        <button className="flex w-full items-center p-5 bg-blue-400 text-black rounded-2xl shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Show QR</h2>
            <p className="text-base">Show it only to your faculty</p>
          </div>
          <div>
            <QrCode size={48} />
          </div>
        </button>
      </div>

      <div className="w-full max-w-xl px-6 mt-8">
        <div className="grid grid-cols-2 gap-6">
          <button className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 w-44 transition-transform transform hover:scale-105">
            <div className="mb-4 flex justify-center">
              <BellRing size={56} color="#FFD700" />
            </div>
            <div className="text-center">
              <h2 className="text-lg text-black font-bold mb-2">
                Notifications
              </h2>
              <p className="text-sm text-gray-600">Get Latest Events</p>{" "}
            </div>
          </button>

          <button
            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 w-44 transition-transform transform hover:scale-105"
            onClick={() => setIsTeamProfileOpen(true)} // Open modal on click
          >
            <div className="mb-4 flex justify-center">
              <Info size={56} fill="#FFD700" />
            </div>
            <div className="text-center">
              <h2 className="text-lg text-black font-bold mb-2">About</h2>
              <p className="text-sm text-gray-600">Know The Creators</p>{" "}
            </div>
          </button>
        </div>
      </div>

      {isTeamProfileOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div>
            {/* TeamProfile Component */}
            <TeamProfile />
            {/* Close button */}
            <div className="flex justify-end">
              <button
                className="text-red-500 text-lg font-semibold"
                onClick={() => setIsTeamProfileOpen(false)} // Close modal
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
