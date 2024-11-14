/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
const ViewItemData = ({ itemData }) => {

  console.log('itemDatas', itemData);
  
  const dataRows = [
    { label: "ID:", value: itemData.item_id },
    { label: "Item Name:", value: itemData.item_name },
    { label: "Item Description:", value: itemData.description },
    { label: "Quantity:", value: itemData.quantity },
    { label: "Rating:", value: itemData.rating },
    { label: "Expiry Date:", value: itemData.expiry_date },
    { label: "Perishable:", value: itemData.perishable },
    { label: "Always Stock:", value: itemData.always_stock },
    { label: "Uncountable:", value: itemData.uncountable },
    { label: "Favorite:", value: itemData.favorite },
    { label: "Status:", value: itemData.status },
  ];

  const locationDataRows = [
    { label: "Location ID:", value: itemData.location.location_id },
    { label: "Building:", value: itemData.location.building },
    { label: "Room:", value: itemData.location.room },
    { label: "Storage Location:", value: itemData.location.storage_location },
    {
      label: "Location Description:",
      value: itemData.location.location_description,
    },
    { label: "Status:", value: itemData.location.status },
  ];
  const userDataRows = [
    { label: "User ID:", value: itemData.user.user_id },
    { label: "Name:", value: itemData.user.name },
    { label: "Email Address:", value: itemData.user.email_address },
    { label: "Address:", value: itemData.user.address },
    { label: "Date of Birth:", value: itemData.user.dob },
    { label: "User Status:", value: itemData.user.status },
  ];

  console.log("itemData: ", itemData.item_images);
  console.log("itemData: ", itemData.item_images.length);

  return (
    <div>
      <div className="px-6 mb-2">
        <div className="py-2">
          <span className="text-md font-semibold font-semibold">
            Item Details
          </span>
        </div>
        {dataRows.map((row, index) => (
          <div key={index} className="flex flex-row w-full py-1">
            <div className="w-[30%] text-sm">{row.label}</div>
            <div className="w-[70%] text-sm ">{row.value}</div>
          </div>
        ))}

        {itemData.item_images.length > 0 ? (
          <div className="flex gap-3 mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2">
            {itemData.item_images.map((item_image, index) => (
              <div className="flex  w-[100px] h-[100px]" key={index}>
                <Image
                  width={100}
                  height={100}
                  className="rounded-md"
                  src={item_image.item_image_url}
                  alt={`Image ${index + 1}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex py-2">
            <Image
              width={100}
              height={100}
              className="rounded-md"
              src={"/images/no_image_available.jpg"}
              alt="No image available"
            />
          </div>
        )}

        <hr className="mt-2" />
      </div>
      <div className="px-6 mb-2">
        <div className="py-2">
          <span className="text-md font-semibold">Location Information</span>
        </div>
        {locationDataRows.map((row, index) => (
          <div key={index} className="flex flex-row w-full py-1">
            <div className="w-[30%] text-sm">{row.label}</div>
            <div className="w-[70%] text-sm ">{row.value}</div>
          </div>
        ))}
        <div className="flex py-2 mb-2 w-[100px] h-[100px]">
          <Image
            width={100}
            height={100}
            className="rounded-md"
            src={itemData.location.location_image_url}
            alt="No image available"
          />
        </div>
        <hr className="mt-2" />
      </div>

      <div className="px-6 mb-2">
        <div className="py-2">
          <span className="text-md font-semibold">User Information</span>
        </div>
        <div className="flex mb-2 w-[100px] h-[100px]">
          <Image
            width={100}
            height={100}
            className="rounded-md"
            src={itemData.user.image}
            alt={`User Photo`}
          />
        </div>
        {userDataRows.map((row, index) => (
          <div key={index} className="flex flex-row w-full py-1">
            <div className="w-[30%] text-sm">{row.label}</div>
            <div className="w-[70%] text-sm ">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewItemData;
