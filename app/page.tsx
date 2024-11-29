"use client";
import type { NextPage } from "next";
import Head from "next/head";
import { ScanQrCode, QrCode, BellRing, Info } from "lucide-react";
import TeamProfile from "./components/AboutUS/page";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setdata] = useState("");
  const [isScannerActive, setIsScannerActive] = useState(false); // State to control scanner visibility

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
        {/* Scan QR Button */}
        <button
          onClick={() => setIsScannerActive(true)} // Activate scanner on click
          className="flex w-full items-center p-5 bg-yellow-400 text-black rounded-2xl shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Scan QR</h2>
            <p className="text-base">Open It For Attendance</p>
          </div>
          <div>
            <ScanQrCode size={48} />
          </div>
        </button>

        {/* Conditional QR Scanner */}
        {isScannerActive && (
          <div className="w-full flex flex-col items-center space-y-4">
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => {
                if (result) {
                  setdata((result as any).text); // Using type cast as a workaround
                  setIsScannerActive(false); // Close scanner after scanning
                } else {
                  setdata("Not Found");
                }
              }}
            />
            <button
              onClick={() => setIsScannerActive(false)} // Deactivate scanner manually
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close Scanner
            </button>
          </div>
        )}
        <p className="text-black">{data}</p>

        {/* Show QR Button */}
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
              <p className="text-sm text-gray-600">Get Latest Events</p>
            </div>
          </button>

          <div
            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 w-44 transition-transform transform hover:scale-105 cursor-pointer"
            onClick={onOpen} // Open modal on click
          >
            <div className="mb-4 flex justify-center">
              <Info size={56} fill="#FFD700" />
            </div>
            <div className="text-center">
              <h2 className="text-lg text-black font-bold mb-2">About</h2>
              <p className="text-sm text-gray-600">Know The Creators</p>
            </div>
          </div>
        </div>
      </div>

      {/* TeamProfile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" className="bg-gray-50">
        <ModalContent>
          <ModalBody>
            <TeamProfile />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Home;
