"use client";
import { resetProfile, updateProfile } from "@/redux/features/profile-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
// Modal and useDisclosure are kept as they are used for TeamProfile modal
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { deleteCookie, getCookie } from "cookies-next";
import {
  Calendar,
  CheckCircle,
  CircleX,
  Clock,
  Info,
  QrCode,
  ScanQrCode,
  User,
  Zap
} from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useDispatch } from "react-redux";
import TeamProfile from "./components/About-us/page";
import "./globals.css"; 
import { toast } from "react-toastify";
// useRouter is kept as it's used for navigation logic
import { useRouter } from "next/navigation";
import pb from "@/utils/pocketbase";
import CryptoJS from "crypto-js";
import QrTimerProgressBar from "./components/QrTimerProgressBar";

// --- Configuration Constants ---
// Use a secure key for production. This is a placeholder.
const QR_SECRET_KEY = process.env.NEXT_PUBLIC_QR_SECRET_KEY || "YOUR_STRONG_SECRET_KEY";
const QR_REFRESH_INTERVAL = 5000; // 5 seconds
// -------------------------------

const Home: NextPage = () => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState(""); // State for scanned data (retained for debugging/logic flow)
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState("");
  // token is now only used locally inside useAppSelector or via newToken
  const [isAttendanceGiving, setisAttendanceGiving] = useState(false);

  const todaysDate = new Date().toLocaleDateString();
  const [isEligible, setisEligible] = useState<Boolean>(true);
  const [isAttendaceError, setisAttendaceError] = useState<Boolean>(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  const id = useAppSelector((state) => state.profileReducer.value.id);
  const regdNo = useAppSelector((state) => state.profileReducer.value.registration_no);
  const name = useAppSelector((state) => state.profileReducer.value.name);
  const lastAttended = useAppSelector((state) => state.profileReducer.value.lastAttended);
  const newToken = useAppSelector((state) => state.profileReducer.value.token);

  const dispatch = useDispatch<AppDispatch>();

  // Dynamic QR Code States
  const [dynamicQrValue, setDynamicQrValue] = useState("");
  const [qrRefreshKey, setQrRefreshKey] = useState(0); // Key to trigger progress bar reset

  // --- Utility Functions ---

  /**
   * Generates a dynamic QR code value by encrypting the user ID and a timestamp.
   * Format: "ID|TIMESTAMP"
   * The server side must decrypt this using the same key and check the timestamp validity.
   */
  const generateDynamicQrValue = (): string => {
    if (!id) return "";
    try {
      const payload = `${id}|${Date.now()}`;
      // Use AES encryption
      const encrypted = CryptoJS.AES.encrypt(payload, QR_SECRET_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return "";
    }
  };

  const refreshQrCode = () => {
    setDynamicQrValue(generateDynamicQrValue());
    setQrRefreshKey(prev => prev + 1);
  };

  // --- Effects ---

  // Clock Update Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Eligibility Check Effect (old logic: only one scan per day)
  // useEffect(() => {
  //   if (lastAttended === todaysDate) {
  //     setisEligible(false);
  //   } else {
  //     setisEligible(true);
  //     setAttendanceMessage("");
  //     setisAttendaceError(false);
  //   }
  // }, [lastAttended, todaysDate]);

  // New logic: Check if 5 minutes have passed since last scan
  useEffect(() => {
    const lastScan = localStorage.getItem("lastAttendanceScan");
    if (lastScan) {
      const last = parseInt(lastScan, 10);
      const now = Date.now();
      if (now - last < 5 * 60 * 1000) {
        setisEligible(false);
        setAttendanceMessage("You must wait 5 minutes between scans.");
        setisAttendaceError(true);
        return;
      }
    }
    setisEligible(true);
    setAttendanceMessage("");
    setisAttendaceError(false);
  }, [lastAttended, todaysDate]);

  // Dynamic QR Code Generation and Refresh Effect
  useEffect(() => {
    if (isQrVisible) {
      refreshQrCode(); // Generate initial QR on visibility

      const intervalId = setInterval(refreshQrCode, QR_REFRESH_INTERVAL);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      setDynamicQrValue("");
    }
  }, [isQrVisible, id]); // Depend on id and isQrVisible

  // --- API Call ---

  const giveAttendance = async (scannedData: string) => {
    try {
      setisAttendanceGiving(true); // Start verification overlay
      const headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        jwt: scannedData,
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
        setisAttendaceError(false);
        // Important: Stop scanner and mark as ineligible for 5 minutes
        setIsScannerActive(false);
        setisEligible(false);
        localStorage.setItem("lastAttendanceScan", Date.now().toString()); // Store scan time
        dispatch(
          updateProfile({
            lastAttended: new Date().toLocaleDateString(),
          })
        );
      } else if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        // Logout logic
        dispatch(resetProfile());
        pb.authStore.clear();
        await deleteCookie("token");
        window.location.replace("/auth");
      } else {
        setisAttendaceError(true);
        setAttendanceMessage(responseData.message || "Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setAttendanceMessage("An unexpected error occurred while marking attendance.");
      setisAttendaceError(true);
    } finally {
      setisAttendanceGiving(false); // End verification overlay
    }
  };

  // --- JSX Render ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6 flex flex-col items-center justify-between relative overflow-hidden">
      {/* Animated background (kept for styling) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full transform rotate-45 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-yellow-400/20 to-red-400/20 rounded-full transform -rotate-45 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h1 className=" flex gap-x-2 text-white text-lg font-semibold mb-1">
              Upasthiti{" "}
              <span>
                <Zap className="w-6 h-6 text-yellow-400" />
              </span>
            </h1>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white text-xl font-semibold m-0">Hi,</h3>
                <h2 className="text-white text-2xl font-bold flex items-center gap-2 m-0">
                  {name.split(" ")[0]?.toUpperCase() || "USER"}
                  <span className="wave inline-block">👋</span>
                </h2>
                <p className="text-white/80">{regdNo}</p>
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
                {currentTime.toLocaleTimeString("en-US", { hour12: true })}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {isEligible ? (
          <>
            {/* Attendance Message */}
            {attendanceMessage && (
              <div
                className={`w-full p-4 ${isAttendaceError ? "bg-red-300" : "bg-green-100"} rounded-xl shadow-md`}
              >
                <h2
                  className={`text-lg font-semibold ${isAttendaceError ? "text-red-800 " : "text-green-800"}`}
                >
                  Attendance Status
                </h2>
                <p
                  className={`text-base ${isAttendaceError ? "text-red-700" : "text-green-700"} break-words`}
                >
                  {attendanceMessage}
                </p>
              </div>
            )}

            {/* Action Buttons: Scan QR and Show QR */}
            {!isQrVisible && !isScannerActive && id && (
              <div className="space-y-4">
                {/* Scan QR Button */}
                <button
                  onClick={() => {
                    setIsScannerActive(true);
                    setAttendanceMessage(""); // Clear message when opening scanner
                  }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:rotate-1 group"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <h2 className="text-2xl font-bold m-0">Scan QR</h2>
                      <p className="text-sm opacity-80">
                        Open It For Attendance
                      </p>
                    </div>
                    <ScanQrCode className="w-10 h-10 transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                </button>

                {/* Show QR Button */}
                <button
                  onClick={() => {
                    setIsQrVisible(true);
                    setAttendanceMessage(""); // Clear message when opening QR
                  }}
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
              </div>
            )}

            {/* QR Scanner */}
            {isScannerActive && (
              <div className="w-full flex flex-col items-center space-y-4 relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Scan the Faculty's Attendance Code
                </p>
                {isAttendanceGiving && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded-xl">
                    <p className="text-white text-xl font-bold">Verifying...</p>
                  </div>
                )}
                <div className="w-full aspect-square relative overflow-hidden rounded-xl border-4 border-blue-500">
                  <Scanner
                    formats={["qr_code"]}
                    allowMultiple={true}
                    paused={isAttendanceGiving}
                    onScan={(result) => {
                      if (result && !isAttendanceGiving) {
                        const scannedData = result[0]?.rawValue;
                        if (scannedData) {
                          setData(scannedData);
                          giveAttendance(scannedData);
                        }
                      }
                    }}
                    onError={(error) => {
                      console.error("Scan Error:", error);
                    }}
                    // Increased scanDelay slightly to prevent immediate re-scan on single read
                    scanDelay={500}
                  />
                </div>
                <button
                  onClick={() => setIsScannerActive(false)}
                  disabled={isAttendanceGiving}
                  className="bg-red-500 text-white rounded-full px-6 py-2 flex items-center space-x-2 disabled:bg-red-300 transition-colors"
                >
                  <CircleX size={24} />
                  <span>Close Scanner</span>
                </button>
              </div>
            )}

            {/* QR Code Display */}
            {isQrVisible && dynamicQrValue && id && (
              <div className="flex flex-col items-center space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Your One-Time Attendance QR
                </p>

                <div className="w-full max-w-[256px] bg-white p-2 rounded-lg shadow-inner">
                  <QRCode
                    size={256}
                    style={{
                      height: "auto",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                    value={dynamicQrValue} // Use the dynamic value
                    viewBox={`0 0 256 256`}
                  />
                </div>

                {/* Progress Bar */}
                <QrTimerProgressBar isVisible={isQrVisible} refreshKey={qrRefreshKey} expiryTimeMs={QR_REFRESH_INTERVAL} />
                {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                  **Refreshes in {QR_REFRESH_INTERVAL / 1000}s, Valid for {QR_VALIDITY_MS / 1000}s**
                </p> */}

                <button
                  onClick={() => setIsQrVisible(false)}
                  className="bg-red-500 text-white rounded-full px-6 py-2 flex items-center space-x-2 transition-colors"
                >
                  <CircleX size={24} />
                  <span>Close</span>
                </button>
              </div>
            )}

            {/* Fallback for QR not visible (only if user is logged in) */}
            {(!isQrVisible && !isScannerActive && !attendanceMessage && !id) && (
              <div className="w-full p-4 bg-yellow-100 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-yellow-800 flex items-center">
                  <Info className="mr-2 text-yellow-800" />
                  User Information Missing
                </h2>
                <p className="text-base text-yellow-700 break-words">
                  Please ensure you are logged in correctly to use the attendance features.
                </p>
              </div>
            )}

          </>
        ) : (
          /* Already Attended Message */
          <div className="w-full p-4 h-30 bg-green-100 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-green-800 flex items-center">
              <Calendar className="mr-2 text-green-800" />
              Attendance Status
            </h2>
            <p className="text-base text-green-700 break-words flex items-center">
              <CheckCircle className="mr-2 text-green-700" />
              You have already marked your attendance for today.
            </p>
          </div>
        )}
      </div>

      {/* About Button (Fixed) */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link
          href="/about-us"
          className="group flex flex-col items-center justify-center p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-20 h-20 transition-all duration-300 transform hover:scale-110"
        >
          <Info size={28} className="text-white group-hover:animate-pulse" />
          <span className="text-xs text-white font-semibold mt-1 opacity-100 group-hover:font-bold">
            About
          </span>
        </Link>
      </div>

      {/* TeamProfile Modal (Retained, though the Link is used now) */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" className="bg-gray-50">
        <ModalContent>
          <ModalBody>
            {/* The actual TeamProfile content component */}
            <TeamProfile />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Footer */}
      <div className=" w-full text-center p-4 text-gray-600 dark:text-gray-400 relative z-10">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">Devverse</span>
        </p>
      </div>

      <style jsx global>{`
        @keyframes wave {
          /* ... wave animation CSS retained ... */
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