import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const AdminProfile = ({ user }) => {
  const router = useRouter();
  return (
    <div className="w-full">
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
          <span className="text-sm font-medium capitalize">{user.name}</span>
        </div>
      </div>
      <hr />
      <div className="my-2">
        <div className="px-2 py-1 text-sm">
          <span
            className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium  ring-1 ring-inset bg-gray-100 text-gray-800 ring-gray-700/30`}
          >
            {user.user_role}
          </span>
        </div>
        <div className="px-2 py-1 text-sm">
          <p>
            Email: <span> {user.email_address}</span>
          </p>
        </div>
        <div className="px-2 py-1 text-sm">
          <p>
            Address: <span className="capitalize"> {user.address}</span>
          </p>
        </div>
        <div className="px-2 py-1 text-sm">
          <p>
            Date of Birth: <span> {user.dob}</span>
          </p>
        </div>
        <div className="px-2 py-1 text-sm">
          <p>
            Status: <span className="capitalize"> {user.status}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
