"use client";
import React from "react";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { Info, Shield, LogOut, UserCog } from "lucide-react";
import { motion } from "framer-motion";

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const name = useAppSelector((state) => state.profileReducer.value.name);
  const branch = useAppSelector((state) => state.profileReducer.value.branch);
  const section = useAppSelector((state) => state.profileReducer.value.section);
  const registration_no = useAppSelector(
    (state) => state.profileReducer.value.registration_no
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6 flex flex-col items-center justify-between relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full transform rotate-45 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-yellow-400/20 to-red-400/20 rounded-full transform -rotate-45 animate-pulse"></div>

        <div className="mt-5">
          <header className="flex justify-center items-center  mb-8">
            <motion.div
              className="flex items-center gap-2 bg-white/10 rounded-full px-6 py-3 text-xl"
              whileHover={{ scale: 1.05 }}
            >
              <span>Profile</span>
              <UserCog className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </header>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-20 h-full w-full relative z-10">
        {/* Profile Picture */}
        <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-purple-400 via-pink-500 to-red-400 p-[3px] shadow-lg mb-5 animate-glow">
          <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
            <img
              src="/g3.gif"
              alt="Hello GIF"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-sm">
          <p className="text-xl font-medium text-gray-800 dark:text-gray-300">
            <span className="font-semibold">{registration_no}</span>
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {name.toUpperCase()}
          </h1>
          <p className="text-lg mt-3 font-medium text-gray-600 dark:text-gray-400">
            Section - {section} | Branch - {branch}
          </p>
        </div>

        {/* Options */}
        <div className="mt-10 w-full max-w-md px-4 space-y-6">
          {[
            { icon: <Info />, text: "About Us", href: "/about-us" },
            {
              icon: <Shield />,
              text: "Privacy Policy",
              href: "/privacy",
            },
            { icon: <LogOut />, text: "Logout", href: "/logout" },
          ].map((option, idx) => (
            <a
              href={option.href}
              key={idx}
              className="w-full bg-gradient-to-r from-white to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600 shadow-md py-3 px-5 rounded-xl flex items-center space-x-4 hover:scale-105 hover:shadow-xl transition-transform duration-300"
            >
              <div className="w-8 h-8 text-indigo-600 dark:text-indigo-400">
                {option.icon}
              </div>
              <span className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                {option.text}
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="w-full text-center p-4 text-gray-600 dark:text-gray-400">
        <h1>
          Developed By:{" "}
          <a href="" className="underline">
            Dev verse
          </a>
        </h1>
      </div>
    </div>
  );
};

export default page;
