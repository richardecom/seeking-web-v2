/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

const ViewCategory = ({ CategoryData }) => {
  const dataRows = [
    { label: "Category ID:", value: CategoryData.category_id },
    { label: "Category Name:", value: CategoryData.category_name },
    {
      label: "Category Description:",
      value: CategoryData.category_description,
    },
    { label: "Status:", value: CategoryData.status },
  ];

  const userDataRows = [
    { label: "User ID:", value: CategoryData.user.user_id },
    { label: "Name:", value: CategoryData.user.name },
    { label: "Email Address:", value: CategoryData.user.email_address },
    { label: "Address:", value: CategoryData.user.address },
    { label: "Date of Birth:", value: CategoryData.user.dob },
    { label: "User Status:", value: CategoryData.user.status },
  ];

  return (
    <div>
      <div className="px-6 mb-2">
        <div className="py-2">
          <span className="text-md font-semibold">Category Details</span>
        </div>
        {dataRows.map((row, index) => (
          <div key={index} className="flex flex-row w-full py-1">
            <div className="w-[30%] text-sm">{row.label}</div>
            <div className="w-[70%] text-sm ">{row.value}</div>
          </div>
        ))}
        <hr className="mt-2" />
      </div>
      <div className="px-6 mb-2">
        <div className="py-2">
          <span className="text-md font-semibold">User Information</span>
        </div>
        <div className="flex mb-2 w-[100px] h-[100px]">
          <a
            href={
                CategoryData?.user.image
                ? CategoryData?.user.image
                : "/images/no_image_available.jpg"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              width={100}
              height={100}
              className="rounded-full"
              src={
                CategoryData?.user.image
                  ? CategoryData?.user.image
                  : "/images/no_image_available.jpg"
              }
              alt="User Photo"
            />
          </a>
        </div>

        {userDataRows.map((row, index) => (
          <div key={index} className="flex flex-row w-full py-1">
            <div className="w-[30%] text-sm">{row.label}</div>
            <div className="w-[70%] text-sm ">{row.value}</div>
          </div>
        ))}
        {/* <hr className='mt-2'/> */}
      </div>
    </div>
  );
};

export default ViewCategory;
