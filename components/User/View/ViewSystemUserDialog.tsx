import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";

const ViewSystemUserDialog = ({ isOpen, onClose, user }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[500px] sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>View System User</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="h-auto form-body mb-1 w-full scrollbar px-1">
            <div className="flex justify-center mb-3">
              <div className="flex mb-2 w-[100px] h-[100px]">
                <a href={"#"} target="_blank" rel="noopener noreferrer">
                  <Image
                    width={100}
                    height={100}
                    className="rounded-full"
                    src={user.image? user.image : "/images/no_image_available.jpg"}
                    alt="User Photo"
                  />
                </a>
              </div>
            </div>


            <div className="space-y-3">
            <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-40">Full Name:</span>
                <span className="text-gray-900 ml-3">{user.name}</span>
            </div>

            <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-40">Email:</span>
                <span className="text-gray-900 ml-3">{user.email_address}</span>
            </div>

            <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-40">Address:</span>
                <span className="text-gray-900 ml-3">{user.address}</span>
            </div>

            <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-40">Date of Birth:</span>
                <span className="text-gray-900 ml-3">{user.dob}</span>
            </div>

            <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-40">Role:</span>
                <span className="text-gray-900 ml-3">{user.user_role}</span>
            </div>

            <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-40">Account Status:</span>
                <span className="text-gray-900 ml-3">{user.status}</span>
            </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewSystemUserDialog;
