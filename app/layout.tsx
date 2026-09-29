import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";
import "./globals.css";
import RootClient from "./RootClient";
import SplashScreen from "./components/SplashScreen";
import { ReduxProvider } from "@/redux/features/providers";
import type { Metadata, Viewport } from "next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#0a0a29",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Upasthiti",
  description: "Smart Attendance System by Devverse",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Upasthiti",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      suppressHydrationWarning
      suppressContentEditableWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <SplashScreen />
        <RootClient />
        <ReduxProvider>{children}</ReduxProvider>

        <ToastContainer />
      </body>
    </html>
  );
}
