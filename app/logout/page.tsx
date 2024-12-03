"use client";
import React from "react";
import { useEffect } from "react";
import { resetProfile } from "@/redux/features/profile-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import pb from "@/utils/pocketbase";
import { deleteCookie } from "cookies-next";

const page = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    pb.authStore.clear();
    deleteCookie("token");
    dispatch(resetProfile());
    window.location.href = "/auth";
  }, []);
  return <div></div>;
};

export default page;
