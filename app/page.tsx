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
import { getCookie } from "cookies-next";
import pb from "@/utils/pocketbase";

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState(""); // State for scanned data
  const [isScannerActive, setIsScannerActive] = useState(false); // State to control scanner visibility
  const [isQrVisible, setIsQrVisible] = useState(false); // State to control QR Code visibility
  const [attendanceMessage, setAttendanceMessage] = useState(""); // State for showing the attendance message
  const token = getCookie("token"); // Get the token from the cookie
  // console.log("Token:", token);
  const [visitorId, setVisitorId] = useState<string>("");

  const handleVisitorId = (id: string) => {
    setVisitorId(id);
    console.log("Captured Visitor ID:", id);
  };

  const regdNum = useAppSelector(
    (state) => state.profileReducer.value.registration_no
  );
  const name = useAppSelector((state) => state.profileReducer.value.name);
  const value = regdNum + name; // Combine values for QR Code
  console.log("QR Code Value:", value);

  // Function to handle API call for attendance
  const giveAttendance = async (scannedToken: string) => {
    try {
      const headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        jwt: scannedToken,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/give-attendance`,
        {
          method: "POST",
          headers: headersList,
          body: bodyContent,
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setAttendanceMessage(responseData.message); // Set the message from the API response
      } else {
        setAttendanceMessage("Failed to mark attendance. Try again.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setAttendanceMessage("An error occurred while marking attendance.");
    }
  };

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
                  console.log("Scan Result:", result);
                  const scannedData = result[0]?.rawValue;
                  if (scannedData) {
                    console.log("Scanned Data:", scannedData); // Log the scanned data
                    setData(scannedData); // Store the rawValue data in state
                    giveAttendance(scannedData);
                  }
                  setIsScannerActive(false); // Deactivate scanner after scanning
                }
              }}
              onError={(error) => {
                console.error("Scan Error:", error); // Handle scanner errors
              }}
              scanDelay={500} // Adds a delay between scans
            />

            <button
              onClick={() => setIsScannerActive(false)} // Close scanner manually
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close Scanner
            </button>
          </div>
        )}

        {/* Show Attendance Message */}
        {attendanceMessage && (
          <div className="w-full max-w-md p-4 bg-green-100 rounded-md shadow-md mt-4">
            <h2 className="text-lg font-semibold text-black">
              Attendance Status
            </h2>
            <p className="text-base text-gray-700 break-words">
              {attendanceMessage}
            </p>
          </div>
        )}

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
            className="bg-red-500 text-white rounded-full px-2 py-1 text-sm"
          >
            Close QR
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
      <p className="text-black">Visitor ID: {visitorId}</p>
    </div>
  );
};

export default Home;
