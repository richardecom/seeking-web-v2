/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";

const ViewLocationData = ({ locationData }) => {
  const dataRows = [
    { label: "ID:", value: locationData.location_id },
    { label: "Building:", value: locationData.building },
    { label: "Room:", value: locationData.room },
    { label: "Storage Location:", value: locationData.storage_location },
    {
      label: "Location Description:",
      value: locationData.location_description,
    },
    { label: "Status:", value: locationData.status },
  ];
  const userDataRows = [
    { label: "User ID:", value: locationData.user.user_id },
    { label: "Name:", value: locationData.user.name },
    { label: "Email Address:", value: locationData.user.email_address },
    { label: "Address:", value: locationData.user.address },
    { label: "Date of Birth:", value: locationData.user.dob },
    { label: "User Status:", value: locationData.user.status },
  ];

  return (
    // <div>
    //    <Card>
    //     <CardContent className='p-2'>
    //         {dataRows.map((row, index) => (
    //         <div key={index} className="flex flex-row w-full py-1">
    //             <div className="w-[30%] text-sm">{row.label}</div>
    //             <div className="w-[70%] text-sm ">{row.value}</div>
    //         </div>
    //         ))}
    //         <div className='flex py-2'>
    //             <Image
    //                 width={100}
    //                 height={100}
    //                 className="rounded-md"
    //                 src={
    //                     locationData.location_image_url
    //                       ? locationData.location_image_url
    //                       : "/images/no_image_available.jpg"
    //                 }
    //                 alt=""
    //             />
    //         </div>
    //         <div className="flex flex-row w-full py-1">
    //             <div className="w-full font-medium mt-3">User Details</div>
    //         </div>
    //         <div className="flex mb-2 w-[100px] h-[100px]">
    //             <Image
    //                 width={100}
    //                 height={100}
    //                 className="rounded-md"
    //                 src={locationData.user.image}
    //                 alt={`User Photo`}
    //             />
    //             </div>
    //         {userDataRows.map((row, index) => (
    //         <div key={index} className="flex flex-row w-full py-1">
    //             <div className="w-[30%] text-sm">{row.label}</div>
    //             <div className="w-[70%] text-sm">{row.value}</div>
    //         </div>
    //         ))}
    //     </CardContent>
    //     </Card>
    // </div>

    <div>
      <div className="px-6 mb-2">
        <div className="py-2">
          <span className="text-md font-semibold font-semibold">
            Location Details
          </span>
        </div>
        {dataRows.map((row, index) => (
          <div key={index} className="flex flex-row w-full py-1">
            <div className="w-[30%] text-sm">{row.label}</div>
            <div className="w-[70%] text-sm ">{row.value}</div>
          </div>
        ))}

        <div className="flex py-2">
          <Image
            width={100}
            height={100}
            className="rounded-md"
            src={
              locationData?.location_image_url
                ? locationData?.location_image_url
                : "/images/no_image_available.jpg"
            }
            alt="location_image_url"
          />
        </div>

        <div className="flex flex-row w-full py-1">
          <div className="w-full font-medium mt-3">User Details</div>
        </div>
        <div className="flex mb-2 w-[100px] h-[100px]">
          <Image
            width={100}
            height={100}
            className="rounded-md"
            src={
              locationData?.user.image
                ? locationData?.user.image
                : "/images/no_image_available.jpg"
            }
            alt='User Photo'
          />
        </div>
        {userDataRows.map((row, index) => (
          <div key={index} className="flex flex-row w-full py-1">
            <div className="w-[30%] text-sm">{row.label}</div>
            <div className="w-[70%] text-sm">{row.value}</div>
          </div>
        ))}

       
      </div>
      
    </div>
  );
};

export default ViewLocationData;
