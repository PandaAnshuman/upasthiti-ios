"use client";
import React from "react";
import { useEffect } from "react";
import { resetProfile } from "@/redux/features/profile-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import pb from "@/utils/pocketbase";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { LoaderPinwheel } from "lucide-react";

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    console.log("Hello from logout page");
    dispatch(resetProfile());
    pb.authStore.clear();
    deleteCookie("token");
    window.location.replace("/auth");
  }, []);
  return (
    <div>
      <div className="flex items-center justify-center h-screen w-screen">
        <LoaderPinwheel className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    </div>
  );
};

export default page;
