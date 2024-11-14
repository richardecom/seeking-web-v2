import Image from "next/image";
import React from "react";

const UserProfile = ({ userImage, userName, itemName, dateCreated }) => {
  return (
    <div className="flex items-center">
      <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
        <Image
          width={74}
          height={74}
          src={userImage || "/images/user.png"}
          alt="User"
          style={{ width: "auto", height: "auto" }}
        />
      </span>
      <div className="ml-4 space-y-1">
        <p className="text-md font-medium leading-none">{itemName}</p>
        <p className="text-xs text-muted-foreground">{userName}</p>
      </div>

      <div className="ml-auto font-medium text-sm">{dateCreated}</div>
    </div>
  );
};

export default UserProfile;
