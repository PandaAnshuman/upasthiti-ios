"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash animation smoothly on app launch
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-between bg-gradient-to-br from-[#06061a] via-[#0d0929] to-[#180e3b] text-white select-none pointer-events-auto overflow-hidden p-6 sm:p-8"
        >
          {/* Ambient luminous particle aura glow effects */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-600/25 rounded-full blur-[110px] animate-pulse" />
          <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-yellow-500/15 rounded-full blur-[90px]" />

          {/* Top Corner: Siksha 'O' Anusandhan Logo */}
          <div className="w-full flex justify-between items-center z-20 pt-2">
            <motion.div
              initial={{ opacity: 0, y: -20, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-lg"
            >
              <img
                src="/Siksha_‘O’_Anusandhan.png"
                alt="Siksha 'O' Anusandhan Logo"
                className="h-9 w-auto object-contain drop-shadow-md rounded-md bg-white/90 p-0.5"
              />
              <div className="hidden xs:flex flex-col">
                <span className="text-[10px] font-bold tracking-wider text-gray-200 uppercase leading-none">
                  SOA University
                </span>
                <span className="text-[8px] text-yellow-400 font-medium">
                  ITER Campus
                </span>
              </div>
            </motion.div>

            {/* Top Right Live Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: "4s" }} />
              <span className="text-[11px] font-semibold text-yellow-300 uppercase tracking-wider">
                Attendance
              </span>
            </motion.div>
          </div>

          {/* Center Main Stage: Animated 512x512 App Icon & Brand */}
          <div className="relative flex flex-col items-center justify-center my-auto z-20">
            {/* Glowing Aura Ring */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-yellow-400/30 via-purple-600/40 to-blue-500/30 blur-xl"
            />

            {/* App Icon Container */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -15, y: 30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.8,
              }}
              whileHover={{ scale: 1.05 }}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-yellow-400 via-purple-500 to-indigo-500 shadow-[0_0_40px_rgba(168,85,247,0.4)] flex items-center justify-center backdrop-blur-xl"
            >
              <div className="w-full h-full bg-[#080721] rounded-[22px] flex items-center justify-center overflow-hidden border border-white/20">
                <motion.img
                  src="/android-chrome-512x512.png"
                  alt="Upasthiti App Icon"
                  className="w-full h-full object-cover p-1"
                  initial={{ filter: "brightness(0.7)" }}
                  animate={{ filter: "brightness(1.05)" }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>

            {/* Title & Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-center mt-6"
            >
              <h1 className="text-4xl font-black tracking-wider bg-gradient-to-r from-white via-yellow-100 to-yellow-400 bg-clip-text text-transparent flex items-center justify-center gap-2 drop-shadow-sm">
                Upasthiti
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" />
                </motion.span>
              </h1>
              <p className="text-xs tracking-[0.25em] uppercase text-purple-300 font-semibold mt-1.5 opacity-90">
                Smart Attendance Portal
              </p>
            </motion.div>

            {/* Futuristic Progress Loading Bar */}
            <div className="w-44 h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden p-0.5 border border-white/10 backdrop-blur-sm">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut",
                }}
                className="h-full w-1/2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.8)]"
              />
            </div>
          </div>

          {/* Bottom Footer Credits */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="w-full text-center z-20 pb-2 flex flex-col items-center gap-1"
          >
            <span className="text-[11px] tracking-wider text-gray-300 font-medium">
              Powered by <span className="text-yellow-400 font-bold">Devverse</span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
