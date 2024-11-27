"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useMobileUser } from "@/context/MobileUserContext";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileInformation = () => {
  const { user, loading, error } = useMobileUser();
  const router = useRouter();
  return (
    <>
    {
      !loading ? (
      <div>
        <div className="flex items-center mb-2 ">
          <div className="cursor-pointer">
            <ArrowLeft onClick={() => router.push("/users")} />
          </div>
          <Image
            width={40}
            height={40}
            className="w-[50px] h-[50px] rounded-full mx-2"
            src="/images/user.png"
            alt=""
          />
          <div>
            <span className="text-sm font-medium capitalize">{user?.name}</span>
          </div>
        </div>
        <hr />
        <div className="grid grid-cols-3 my-2">
          <div className="flex flex-col justify-center items-center h-24">
            <span>{user?.total_categories}</span>
            <span className="text-xs font-bold">Categories</span>
          </div>
          <div className="flex flex-col justify-center items-center h-24 border-r border-gray-500  border-l border-gray-500">
            <span>{user?.total_items}</span>
            <span className="text-xs font-bold">Items</span>
          </div>
          <div className="flex flex-col justify-center items-center h-24">
            <span>{user?.total_locations}</span>
            <span className="text-xs font-bold">Location</span>
          </div>
        </div>
        <hr />
        <div className="my-2">
          <div className="px-2 py-1 text-sm">
            <p>
              Email: <span> {user?.email_address}</span>
            </p>
          </div>
          <div className="px-2 py-1 text-sm">
            <p>
              Address: <span className="capitalize"> {user?.address}</span>
            </p>
          </div>
          <div className="px-2 py-1 text-sm">
            <p>
              Date of Birth: <span> {user?.dob}</span>
            </p>
          </div>
          <div className="px-2 py-1 text-sm">
            <p>
              Status: <span className="capitalize"> {user?.status}</span>
            </p>
          </div>
        </div>
        <hr />
      </div>
      ):(
        <div>
        <div className="flex items-center mb-2">
          <div className="cursor-pointer">
            <ArrowLeft onClick={() => router.push("/users")} />
          </div>
          <Skeleton className="w-[50px] h-[50px] rounded-full mx-2" />
          <div>
            <Skeleton className="text-sm font-medium capitalize w-[150px] h-[20px]" />
          </div>
        </div>
        <hr />

        <div className="grid grid-cols-3 my-2">
          <div className="flex flex-col justify-center items-center h-24">
            <Skeleton className="text-sm font-medium capitalize w-[50px] h-[15px]" />
            <Skeleton className="text-sm font-medium capitalize w-[40px] h-[15px]  mt-2" />
          </div>
          <div className="flex flex-col justify-center items-center h-24 border-gray-500 border-gray-500">
            <Skeleton className="text-sm font-medium capitalize w-[50px] h-[15px]" />
            <Skeleton className="text-sm font-medium capitalize w-[40px] h-[15px]  mt-2" />
          </div>
          <div className="flex flex-col justify-center items-center h-24">
            <Skeleton className="text-sm font-medium capitalize w-[50px] h-[15px]" />
            <Skeleton className="text-sm font-medium capitalize w-[40px] h-[15px]  mt-2" />
          </div>
        </div>
        <hr />

        <div className="my-2">
          <div className="px-2 py-1 text-sm">
            <Skeleton className="text-sm font-medium capitalize w-[100%] h-[15px]  mt-2" />
          </div>
          <div className="px-2 py-1 text-sm">
          <Skeleton className="text-sm font-medium capitalize w-[70%] h-[15px]  mt-2" />
          </div>
          <div className="px-2 py-1 text-sm">
          <Skeleton className="text-sm font-medium capitalize w-[90%] h-[15px]  mt-2" />
          </div>
          <div className="px-2 py-1 text-sm">
          <Skeleton className="text-sm font-medium capitalize w-[80%] h-[15px]  mt-2" />
          </div>
        </div>
      </div>
      )
    }
      

      
    </>
  );
};

export default ProfileInformation;
