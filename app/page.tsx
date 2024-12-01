"use client";
import type { NextPage } from "next";
import { ScanQrCode, QrCode, Info, User, CircleX } from "lucide-react";
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
import { useState } from "react";
import DeviceFingerprint from "./components/DeviceFingerprint";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/redux/features/profile-slice";

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState(""); // State for scanned data
  const [isScannerActive, setIsScannerActive] = useState(false); // State to control scanner visibility
  const [isQrVisible, setIsQrVisible] = useState(false); // State to control QR Code visibility
  const [attendanceMessage, setAttendanceMessage] = useState(""); // State for showing the attendance message
  const token = getCookie("token"); // Get the token from the cookie
  const [isAttendanceGiving, setisAttendanceGiving] = useState(false);
  // console.log("Token:", token);
  const [visitorId, setVisitorId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const todaysDate = new Date().toISOString().split("T")[0];
  // const todaysDate = "2024-12-4";
  const handleVisitorId = (id: string) => {
    setVisitorId(id);
    console.log("Captured Visitor ID:", id);
  };

  const id = useAppSelector((state) => state.profileReducer.value.id);
  const name = useAppSelector((state) => state.profileReducer.value.name);
  const dateAttended = useAppSelector(
    (state) => state.profileReducer.value.dateAttended
  );
  console.log(dateAttended);
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
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-start">
      {/* <div className="flex w-full">
        <img width={"100%"} src={"/wave.svg"} alt="bg-svg" />
      </div> */}
      <div className="w-full max-w-xl space-y-4 px-3 mt-5">
        <div className=" bg-gradient-to-r from-blue-500 to-purple-600 flex w-full items-center justify-between p-6  mb-11 py-6 rounded-2xl ">
          <div className="text-left text-white font-semibold flex-grow">
            <p className="text-2xl">
              Hi,
              <span className="text-yellow-300 ml-2">
                {name.split(" ")[0].toUpperCase()}👋
              </span>{" "}
            </p>
          </div>
          <a href="/profile" className="ml-4 flex items-center">
            <div className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <User className="text-white" size={44} strokeWidth={1.5} />
            </div>
          </a>
        </div>
      </div>

      {!isQrVisible && id && (
        <div className="w-full max-w-xl space-y-4 px-6">
          {!isScannerActive && (
            <button
              onClick={() => setIsScannerActive(true)} // Activate scanner on click
              className="flex w-full items-center p-5 bg-yellow-400 text-black rounded-2xl shadow-black shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Scan QR</h2>
                <p className="text-base">Open It For Attendance</p>
              </div>
              <div>
                <ScanQrCode size={48} />
              </div>
            </button>
          )}

          {/* Conditional QR Scanner */}
          {isScannerActive && (
            <div className="w-full flex flex-col items-center space-y-4 relative">
              {isAttendanceGiving && (
                <div className="absolute  inset-0 flex items-center justify-center  bg-black bg-opacity-50 z-10">
                  <p className="text-white text-xl font-bold">Verifying...</p>
                </div>
              )}

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
                      console.log("Scanned Data:", scannedData); // Log the scanned data
                      setData(scannedData); // Store the rawValue data in state
                      giveAttendance(scannedData);
                    }
                  }
                }}
                onError={(error) => {
                  console.error("Scan Error:", error); // Handle scanner errors
                }}
                scanDelay={1000} // Optional: Adds a delay between scans
              />

              <button
                onClick={() => setIsScannerActive(false)} // Close scanner manually
                className="bg-red-500 text-white rounded-full"
              >
                <div className="flex flex-row gap-x-2 items-center p-2 ">
                  {isAttendanceGiving ? (
                    <p>Verifying...</p>
                  ) : (
                    <>
                      <CircleX size={30} />
                      <p>Close</p>
                    </>
                  )}
                </div>
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

          {!isScannerActive && id && (
            <button
              onClick={() => setIsQrVisible(true)} // Show QR Code on click
              className="flex w-full items-center p-5 bg-blue-400 text-black rounded-2xl shadow-black shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Show QR</h2>
                <p className="text-base">Show it only to your faculty</p>
              </div>
              <div>
                <QrCode size={48} />
              </div>
            </button>
          )}
        </div>
      )}

      {isQrVisible && id ? (
        <>
          <QRCode
            size={256} // Base size for the QR Code
            style={{
              height: "350px",
              maxWidth: "300px", // Set maximum width for mobile devices
              width: "100%", // Use responsive width
            }}
            value={id} // QR Code value
          />
          <button
            onClick={() => setIsQrVisible(false)}
            className="bg-red-500 text-white rounded-full text-sm shadow-sm shadow-black"
          >
            <div className="flex flex-row gap-x-2 items-center p-2 ">
              <CircleX size={30} />
              <p>Close</p>
            </div>
          </button>
        </>
      ) : null}

      <div className=" flex justify-center items-center mt-32 w-full">
        {/* <button
          // href="/notifcations"
          className="flex flex-col items-center p-6 bg-white rounded-2xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 w-20 h-20 transition-transform transform hover:scale-105 shadow-black shadow-md"
        >
          <div className="mb-4 flex justify-center ">
            <BellRing size={30} color="#FFD700" />
          </div>
        </button> */}
        <button
          className="flex flex-col items-center p-6 bg-white rounded-full shadow-sm shadow-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 w-20 h-20 transition-transform transform hover:scale-105"
          onClick={onOpen}
        >
          <div className="flex justify-center">
            <Info size={30} fill="#FFD700" />
          </div>
          <div className="text-center">
            <h2 className="text-sm text-black font-semibold mb-2">About</h2>
          </div>
        </button>
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
      {/* <p className="text-black">Visitor ID: {visitorId}</p> */}

      <div className="align-baseline  text-center fixed bottom-0 left-0 w-full p-4">
        <h1 className="text-black">
          Developed By : <a href="">Dev verse</a>
        </h1>
      </div>
    </div>
  );
};

export default Home;
