"use client";
import type { NextPage } from "next";
import { ScanQrCode, QrCode, BellRing, Info } from "lucide-react";
import TeamProfile from "./components/About-us/page";
import { Scanner } from "@yudiel/react-qr-scanner";
import QRCode from "react-qr-code";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import DeviceFingerprint from "./components/DeviceFingerprint";
import { useAppSelector } from "@/redux/store";

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState("");
  const [isScannerActive, setIsScannerActive] = useState(false); // State to control scanner visibility
  const [isQrVisible, setIsQrVisible] = useState(false); // State to control QR Code visibility

  const [visitorId, setVisitorId] = useState<string>("");

  const handleVisitorId = (id: string) => {
    setVisitorId(id);
    console.log("Captured Visitor ID:", id);
    // You can also send this ID to your backend or use it further in the app
  };

  const regdNum = useAppSelector(
    (state) => state.profileReducer.value.registration_no
  );
  const name = useAppSelector((state) => state.profileReducer.value.name);
  const value = regdNum + name;
  console.log(value);

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex flex-col items-center justify-start">
      <div className="w-full max-w-xl px-6 mb-8">
        <div className="text-left text-black font-semibold">
          <h1 className="text-2xl md:text-3xl lg:text-4xl">
            Welcome,{" "}
            <span className="text-blue-600">
              {name.split(" ")[0].toUpperCase()}
            </span>{" "}
            👋
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
            <Scanner
              onScan={(result) => {
                if (result) {
                  console.log(result);
                  setData((result as any).text); // Using type cast as a workaround
                  setIsScannerActive(false); // Close scanner after scanning
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
        <button
          onClick={() => setIsQrVisible(true)} // Show QR Code on click
          className="flex w-full items-center p-5 bg-blue-400 text-black rounded-2xl shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Show QR</h2>
            <p className="text-base">Show it only to your faculty</p>
          </div>
          <div>
            <QrCode size={48} />
          </div>
        </button>
      </div>

      {/* Conditional QR Code Display */}
      {isQrVisible && regdNum ? (
        <>
          <QRCode
            size={256} // Base size for the QR Code
            style={{
              height: "350px",
              maxWidth: "300px", // Set maximum width for mobile devices
              width: "100%", // Use responsive width
            }}
            value={value} // QR Code value
          />
          <button
            onClick={() => setIsQrVisible(false)}
            className=" bg-red-500 text-white rounded-full px-2 py-1 text-sm"
          >
            Close Qr
          </button>
        </>
      ) : null}

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

      <DeviceFingerprint onVisitorIdCaptured={handleVisitorId} />
      <p className="text-black">Visitor ID : {visitorId}</p>
    </div>
  );
};

export default Home;
