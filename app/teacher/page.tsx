"use client";
import pb from "@/utils/pocketbase";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

const Page = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jwtExpirations, setJwtExpirations] = useState<any[]>([]); // Store the jwtExpirations array

  // Function to fetch tokens from the API

  const fetchTokens = async (token: string) => {
    try {
      setError(null);
      const headersList = {
        Accept: "*/*",
        // "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/take-attendance/true`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json(); // Assuming the response is JSON
      setJwtExpirations(data.jwtExpirations || []); // Store the jwtExpirations array from the response
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tokens");
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("teacher"); // Get the 'id' query parameter
    // Fetch tokens only once on component mount
    if (token) {
      fetchTokens(token);
    }
  }, []);

  let lastValidToken = ""; // Store the last valid token
  let intervalId: any; // Variable to store the interval ID

  // Function to start checking for the valid token
  function startTokenCheck() {
    intervalId = setInterval(() => {
      const currentTimestamp = Math.floor(Date.now() / 1000); // Update the current time every interval

      // Find the valid token by comparing timestamps
      const validToken = jwtExpirations.find(
        (item) => item.activeTimestamp >= currentTimestamp
      );

      if (validToken) {
        if (lastValidToken !== validToken.token) {
          setToken(validToken.token);
          console.log("Valid Token Found:", validToken.token); // Log valid token if it's different
          lastValidToken = validToken.token;
        }
      } else {
        console.log("No valid token found yet.");
      }
    }, 1000); // Check every 1 second
  }

  // Function to stop checking for the valid token
  function stopTokenCheck() {
    clearInterval(intervalId); // Stop the interval when required
    console.log("Token check stopped.");
  }

  useEffect(() => {
    if (jwtExpirations.length > 0) {
      startTokenCheck(); // Start token checking once tokens are fetched
    }
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, [jwtExpirations]); // Trigger effect when jwtExpirations changes

  return (
    <div
      className="bg-white text-center justify-center items-center flex h-screen"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h1>Dynamic QR Code</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {token ? (
        <div>
          <QRCode bgColor="white" fgColor="black" value={token} size={700} />
        </div>
      ) : (
        <p>{error ? "Error loading QR codes" : "Loading QR codes..."}</p>
      )}
    </div>
  );
};

export default Page;
