"use client";

import { useAppSelector } from "@/redux/store";
import React, { useState } from "react";
import { getCookie } from "cookies-next";

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const token = useAppSelector((state) => state.profileReducer.value.token);
  const cookie = getCookie("token");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials
    if (username === "admin" && password === "password123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  function getJwtExpiry(token: string): string {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const { exp } = JSON.parse(jsonPayload);
      if (exp) {
        return new Date(exp * 1000).toLocaleString();
      }
      return "No expiry found";
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return "Invalid token";
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
            Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const reduxTokenExpiry = token ? getJwtExpiry(token) : "No token available";
  const cookieTokenExpiry = cookie
    ? getJwtExpiry(cookie as string)
    : "No token available";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Sensitive Information
        </h1>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">R Token:</span>
            <textarea
              rows={10}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              name=""
              id=""
              disabled
              value={String(token)}
            ></textarea>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">R Token Expiry:</span>{" "}
            {reduxTokenExpiry}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">C Token:</span>
            <textarea
              rows={10}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              name=""
              id=""
              disabled
              value={String(cookie)}
            ></textarea>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">C Token Expiry:</span>{" "}
            {cookieTokenExpiry}
          </p>
          <p className="text-red-500 font-semibold mt-4 text-center">
            Don't share these credentials!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
