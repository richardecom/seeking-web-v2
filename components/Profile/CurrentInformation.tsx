"use client";

import React, { useEffect, useState } from "react";
import CardLayout from "./CardLayout";
import SubmitButton from "../Shared/SubmitButton";
import Image from "next/image";
import { Cake, House, Mail } from "lucide-react";
import { Card } from "../ui/card";
import { useUser } from "@/context/UserContext";
import { CreateInitials } from "@/utils/GenerateInitial";
import { TruncateText } from "@/utils/TruncateText";

const CurrentInformation = () => {
  const [userInitial, setUserInitial] = useState("");
  const { currentUser } = useUser();

  useEffect(() => {
    try {
      if (currentUser?.name) {
        const initial = CreateInitials(currentUser?.name);
        setUserInitial(initial);
      }
    } catch (error) {
      console.log("Error getting user initial.");
    }
  }, [currentUser]);

  return (
    <Card>
      <div className="flex flex-col space-y-1.5 p-3">
        <h3 className="font-semibold leading-none tracking-tight"></h3>
      </div>
      <div className="p-3 pt-0">
        <div className="">
          <div className="flex justify-center">
            <div className="relative w-[130px] h-[130px] ">
              {currentUser?.image ? (
                <Image
                  className="rounded-full cursor-pointer border-4 border-green-400"
                  src={currentUser?.image}
                  alt="User"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="flex rounded-full border justify-center h-full w-full items-center border-4 border-green-400 bg-purple-400">
                  <span className="text-5xl font-bold text-white">
                    {userInitial}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <p className="font-bold text-xl">{TruncateText(currentUser?.name, 18)}</p>
            <p className="font-normal text-sm"></p>
            <span
              className={` ml-4 inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20`}
            >
              {currentUser?.user_role}
            </span>
          </div>
          <div>
            <div className="flex  mt-3 justify-center">
              <div className=" gap-4 flex-wrap">
                <span className="flex items-center py-1">
                  <Mail />
                  <p className="font-normal text-sm ml-4">
                    {" "}
                    {TruncateText(currentUser?.email_address, 30)}
                  </p>
                </span>
                <span className="flex items-center py-1">
                  <Cake />
                  <p className="font-normal text-sm ml-4">{currentUser?.dob}</p>
                </span>
                <span className="flex items-center py-1">
                  <House />
                  <p className="font-normal text-sm ml-4">
                    {TruncateText(currentUser?.address, 30)}
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CurrentInformation;
