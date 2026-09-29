"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-[#0a0c1a] text-white select-none pointer-events-auto p-6 sm:p-8"
        >
          {/* Subtle background gradient depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(37,45,90,0.35)_0%,transparent_65%)] pointer-events-none" />

          {/* Top Corner: SOA University Branding */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 bg-white rounded-md p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
                <Image
                  src="/soa-logo.png"
                  alt="SOA University"
                  width={32}
                  height={32}
                  priority
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold tracking-wider text-gray-200">
                  SOA UNIVERSITY
                </span>
                <span className="text-[9px] text-gray-400 tracking-wide">
                  ITER Campus
                </span>
              </div>
            </div>

            <div className="text-[10px] font-medium tracking-wider text-gray-400 border border-white/10 rounded-full px-2.5 py-0.5">
              v1.0
            </div>
          </div>

          {/* Center Brand Identity */}
          <div className="flex flex-col items-center justify-center my-auto z-10">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-20 h-20 mb-4 flex items-center justify-center"
            >
              <Image
                src="/android-chrome-512x512.png"
                alt="Upasthiti"
                width={80}
                height={80}
                priority
                className="object-contain drop-shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Upasthiti
              </h1>
              <p className="text-[11px] text-gray-400 tracking-wider uppercase mt-1 font-medium">
                Smart Attendance Portal
              </p>
            </motion.div>

            {/* Clean Loading Indicator */}
            <div className="w-28 h-[2px] bg-white/10 rounded-full mt-6 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  ease: "easeInOut",
                }}
                className="h-full w-1/3 bg-blue-500 rounded-full"
              />
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="w-full text-center z-10 pb-1">
            <p className="text-[11px] text-gray-400 tracking-wide font-normal">
              Devverse
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
