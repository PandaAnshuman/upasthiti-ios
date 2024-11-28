import type { NextPage } from "next";
import Head from "next/head";
import DeviceFingerprint from "./components/DeviceFingerprint";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Device Fingerprint Detection</title>
        <meta
          name="description"
          content="Detect device details using Fingerprintjs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <DeviceFingerprint />
      </div>
    </div>
  );
};

export default Home;
