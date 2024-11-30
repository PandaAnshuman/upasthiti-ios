"use client";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

const Page = () => {
  const [tokens, setTokens] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      setError(null); // Clear previous errors
      const headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzYxNDE3MDc0NCIsImV4cCI6MTczMzU2ODIxOCwiaWQiOiJ2Z3Y1NDg3bDVhbWp3cnoiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.XGezTvYKE5mgv2Y7zo3h9VvchA83AHoSp7KQnz5_Mko",
      };

      const response = await fetch(
        "http://127.0.0.1:8090/api/take-attendance/true",
        {
          method: "GET",
          headers: headersList,
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json(); // Assuming the response is JSON
      setTokens(data.tokens || []); // Store tokens array
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tokens");
    }
  };

  useEffect(() => {
    fetchTokens(); // Fetch tokens only once on component mount
  }, []);

  useEffect(() => {
    if (tokens.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % tokens.length);
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [tokens]);
  const extra = "WEHVGFiegfilaEFGIawfguyWQUIEYGFWuyfgaYUEFGWAYF";
  return (
    <div
      className="bg-white text-center"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <h1>Dynamic QR Code</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tokens.length > 0 ? (
        <div>
          <QRCode value={tokens[currentIndex]} size={356} />

          <p className="text-black">
            Token {currentIndex + 1} of {tokens.length}
            {tokens[currentIndex]}
          </p>
        </div>
      ) : (
        <p>{error ? "Error loading QR codes" : "Loading QR codes..."}</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev - 1 + tokens.length) % tokens.length
            )
          }
          disabled={tokens.length === 0}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % tokens.length)}
          disabled={tokens.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
