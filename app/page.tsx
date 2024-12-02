"use client";
import type { NextPage } from "next";
import {
  ScanQrCode,
  QrCode,
  Info,
  User,
  CircleX,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import TeamProfile from "./components/About-us/page";
import { Scanner } from "@yudiel/react-qr-scanner";
import QRCode from "react-qr-code";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import DeviceFingerprint from "./components/DeviceFingerprint";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/redux/features/profile-slice";
import "./globals.css";

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState(""); // State for scanned data
  const [isScannerActive, setIsScannerActive] = useState(false); // State to control scanner visibility
  const [isQrVisible, setIsQrVisible] = useState(false); // State to control QR Code visibility
  const [attendanceMessage, setAttendanceMessage] = useState(""); // State for showing the attendance message
  const token = getCookie("token"); // Get the token from the cookie
  const [isAttendanceGiving, setisAttendanceGiving] = useState(false);
  const [visitorId, setVisitorId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const todaysDate = new Date().toISOString().split("T")[0];
  const handleVisitorId = (id: string) => {
    setVisitorId(id);
    // console.log("Captured Visitor ID:", id);
  };
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const id = useAppSelector((state) => state.profileReducer.value.id);
  const name = useAppSelector((state) => state.profileReducer.value.name);
  const dateAttended = useAppSelector(
    (state) => state.profileReducer.value.dateAttended
  );
  // console.log(dateAttended);
  const giveAttendance = async (data: string) => {
    console.log("API HIT...");
    try {
      const headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        jwt: data,
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
        setAttendanceMessage(responseData.message);
        setIsScannerActive(false);
        dispatch(
          updateProfile({
            dateAttended: new Date().toISOString().split("T")[0],
          })
        );
        // console.log(currentDate);
      } else {
        setAttendanceMessage("Failed to mark attendance. Try again.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setAttendanceMessage("An error occurred while marking attendance.");
    } finally {
      setisAttendanceGiving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6 flex flex-col items-center justify-between relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full transform rotate-45 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-yellow-400/20 to-red-400/20 rounded-full transform -rotate-45 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h1 className="text-white text-sm font-semibold mb-1">
              Upasthiti-iOS
            </h1>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white text-xl font-semibold m-0">Hi,</h3>
                <h2 className="text-white text-3xl font-bold flex items-center gap-2 m-0">
                  {name.split(" ")[0].toUpperCase()}
                  <span className="wave inline-block">👋</span>
                </h2>
              </div>
              <a href="/profile" className="ml-4 flex items-center">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                  <User className="text-white" size={44} strokeWidth={1.5} />
                </div>
              </a>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Welcome back! Ready to mark your attendance?
            </p>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Scan QR and Show QR Buttons */}
        {!isQrVisible && id && (
          <div className="space-y-4">
            {!isScannerActive && (
              <button
                onClick={() => setIsScannerActive(true)}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:rotate-1 group"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h2 className="text-2xl font-bold m-0">Scan QR</h2>
                    <p className="text-sm opacity-80">Open It For Attendance</p>
                  </div>
                  <ScanQrCode className="w-10 h-10 transition-transform duration-300 group-hover:rotate-12" />
                </div>
              </button>
            )}

            {!isScannerActive && (
              <button
                onClick={() => setIsQrVisible(true)}
                className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:-rotate-1 group"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h2 className="text-2xl font-bold m-0">Show QR</h2>
                    <p className="text-sm opacity-80">
                      Show it only to your faculty
                    </p>
                  </div>
                  <QrCode className="w-10 h-10 transition-transform duration-300 group-hover:rotate-90" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* QR Scanner */}
        {isScannerActive && (
          <div className="w-full flex flex-col items-center space-y-4 relative">
            {isAttendanceGiving && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded-xl">
                <p className="text-white text-xl font-bold">Verifying...</p>
              </div>
            )}
            <div className="w-full aspect-square relative overflow-hidden rounded-xl">
              <Scanner
                formats={["qr_code"]}
                allowMultiple={true}
                paused={isAttendanceGiving}
                onScan={(result) => {
                  if (result) {
                    console.log("Scan Result:", result);
                    const scannedData = result[0]?.rawValue;
                    if (scannedData) {
                      setisAttendanceGiving(true);
                      console.log("Scanned Data:", scannedData);
                      setData(scannedData);
                      giveAttendance(scannedData);
                    }
                  }
                }}
                onError={(error) => {
                  console.error("Scan Error:", error);
                }}
                scanDelay={1000}
              />
            </div>
            <button
              onClick={() => setIsScannerActive(false)}
              className="bg-red-500 text-white rounded-full px-4 py-2 flex items-center space-x-2"
            >
              <CircleX size={24} />
              <span>{isAttendanceGiving ? "Verifying..." : "Close"}</span>
            </button>
          </div>
        )}

        {/* QR Code Display */}
        {isQrVisible && id && (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <QRCode
                size={256}
                style={{
                  height: "auto",
                  maxWidth: "100%",
                  width: "100%",
                }}
                value={id}
                viewBox={`0 0 256 256`}
              />
            </div>
            <button
              onClick={() => setIsQrVisible(false)}
              className="bg-red-500 text-white rounded-full px-4 py-2 flex items-center space-x-2"
            >
              <CircleX size={24} />
              <span>Close</span>
            </button>
          </div>
        )}

        {/* Attendance Message */}
        {attendanceMessage && (
          <div className="w-full p-4 bg-green-100 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-green-800">
              Attendance Status
            </h2>
            <p className="text-base text-green-700 break-words">
              {attendanceMessage}
            </p>
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-500 rounded-xl shadow-lg w-full max-w-md p-6 mt-5">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Quick Links
        </h3>
        <ul className="space-y-2">
          {["Today's Schedule", "Upcoming Exams", "Course Materials"].map(
            (item, index) => (
              <li key={index}>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </li>
            )
          )}
        </ul>
      </div>

      {/* About Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/about"
          className="group flex flex-col items-center justify-center p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-20 h-20 transition-all duration-300 transform hover:scale-110"
          aria-label="About Upasthiti-iOS"
        >
          <Info size={28} className="text-white group-hover:animate-pulse" />
          <span className="text-xs text-white font-semibold mt-1 opacity-100 group-hover:font-bold">
            About
          </span>
        </a>
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

      {/* Footer */}
      <div className="w-full text-center p-4 text-gray-600 dark:text-gray-400">
        <h1>
          Developed By:{" "}
          <a href="" className="underline">
            Dev verse
          </a>
        </h1>
      </div>

      <style jsx global>{`
        @keyframes wave {
          0% {
            transform: rotate(0deg);
          }
          20% {
            transform: rotate(-10deg);
          }
          40% {
            transform: rotate(10deg);
          }
          60% {
            transform: rotate(-10deg);
          }
          80% {
            transform: rotate(10deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .wave {
          animation: wave 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;

