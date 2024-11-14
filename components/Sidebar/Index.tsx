/* eslint-disable @typescript-eslint/no-unused-vars */
'user client'
import React, { useEffect, useState } from "react";
import {
  Gauge,
  Box,
  UsersRound,
  MapPin,
  LayoutList,
  MessageSquareText,
  MessageCircleQuestion,
} from "lucide-react";
import ClickOutside from "@/components/ClickOutSide";
// import Link from "next/link";
import Image from "next/image";
import SidebarItem from "./SidebarItems";
import UseLocalStorage from "@/hooks/UseLocalStorage";
import { useUser } from "@/context/UserContext";
import { CreateInitials } from "@/utils/GenerateInitial";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuItems = [
  {
    icon: <Gauge className="h-5 w-5 mr-2 ml-3" aria-hidden="true" />,
    label: "Dashboard",
    route: "/dashboard",
  },
  {
    icon: <MapPin className="h-5 w-5 mr-2 ml-3" aria-hidden="true" />,
    label: "Locations",
    route: "/location",
  },
  {
    icon: <Box className="h-5 w-5 mr-2 ml-3" aria-hidden="true" />,
    label: "Items",
    route: "/items",
  },
  {
    icon: <LayoutList className="h-5 w-5 mr-2 ml-3" aria-hidden="true" />,
    label: "Categories",
    route: "/categories",
  },
  // {
  //   icon: <MessageCircleQuestion className="h-5 w-5 mr-2 ml-3" aria-hidden="true" />,
  //   label: "FAQ",
  //   route: "/faq",
  // },

  // {
  //   icon: <MessageSquareText className="h-5 w-5 mr-2 ml-3" aria-hidden="true" />,
  //   label: "Feedback",
  //   route: "/feedback",
  // },
  {
    icon: <UsersRound className="h-5 w-5 mr-2 ml-3" aria-hidden="true" />,
    label: "Users",
    route: "/users",
  },
];

export const SidebarIndex = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = UseLocalStorage("selectedMenu", "dashboard");
  const [userInitial, setUserInitial] = useState("");
  const { currentUser } = useUser();

  useEffect(() => {
    try {
      if (currentUser?.name) {
        const initial = CreateInitials(currentUser.name);
        setUserInitial(initial);
      }
    } catch (error) {
      console.log("Error getting user initial.");
    }
  }, [currentUser]);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed drop-shadow left-0 top-0 z-9999 flex h-screen w-64 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="items-center justify-center text-center gap-3 h-16 p-2 text-2xl font-bold flex text-white bg-[#800000]">
          <span>SEEKING</span>
        </div>
        <div className="sidebar-header h-24">
          <div className="block">
            <div className="flex items-center justify-center h-20">
              {/* <Image
                className="rounded-full cursor-pointer "
                width={63}
                height={63}
                src="/images/user.jpg"
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
              /> */}

              <div className="relative w-[60px] h-[60px] ">
                {currentUser?.image ? (
                  <Image
                    className="rounded-full cursor-pointer border-2 border-green-400"
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
            <div className="flex items-center justify-center h-6 m-1 mb-6 text-[#800000] font-bold">
              <h5>{currentUser?.name}</h5>
            </div>

            <ul className="mb-6 flex flex-col">
              {menuItems.map((menuItem, menuIndex) => (
                <SidebarItem
                  key={menuIndex}
                  item={menuItem}
                  pageName={pageName}
                  setPageName={setPageName}
                />
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </ClickOutside>
  );
};
